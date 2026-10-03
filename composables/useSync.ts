/**
 * Mesin antrean sinkron offline-first.
 *
 * - Semua tulis ke Supabase (insert/update) lewat `tulisTertunda`.
 * - Bila offline/gagal jaringan → masuk antrean localStorage `kp_sync_queue`.
 * - `sinkronkan()` memproses FIFO saat online; insert siswa menjalankan
 *   dedup dulu lalu me-remap tempId → id asli di semua item antrean.
 * - Konflik: last-write-wins (tidak ada resolusi kompleks).
 */
import {
  bacaAntrean,
  simpanAntrean,
  remapTempId,
  cocokkanSiswa,
  isNetworkError,
  simpanCache,
  bacaCache,
  MAX_ATTEMPTS,
  type SyncItem,
  type SyncTable,
  type SyncOp,
} from '~/utils/syncUtils'

// ---- state singleton (module-level) ----
const isOnline = ref(true)
const pendingCount = ref(0)
const sedangSinkron = ref(false)
const terakhirSinkron = ref(0)
let terpasang = false
const remapHandlers: Array<(tempId: string, newId: string) => void> = []

export interface HasilTulis {
  ok: boolean
  queued: boolean
  /** id baris (untuk insert yang langsung sukses) */
  id?: string | null
  error?: string
}

function muatUlang() {
  pendingCount.value = bacaAntrean().length
}

/** Daftarkan handler yang dipanggil saat tempId siswa berhasil di-remap. */
function onRemapSiswa(fn: (tempId: string, newId: string) => void) {
  remapHandlers.push(fn)
}

function pastikanTerpasang() {
  if (terpasang || typeof window === 'undefined') return
  terpasang = true
  isOnline.value = typeof navigator !== 'undefined' ? navigator.onLine : true
  muatUlang()
  window.addEventListener('online', () => {
    isOnline.value = true
    void sinkronkan()
  })
  window.addEventListener('offline', () => {
    isOnline.value = false
  })
}

/** Masukkan item mentah ke antrean. */
function antrekan(item: Omit<SyncItem, 'qid' | 'createdAt' | 'attempts'>): SyncItem {
  const penuh: SyncItem = {
    ...item,
    qid: (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
      ? crypto.randomUUID()
      : `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
    createdAt: Date.now(),
    attempts: 0,
  }
  const q = bacaAntrean()
  q.push(penuh)
  simpanAntrean(q)
  pendingCount.value = q.length
  return penuh
}

function adalahJaringan(e: any): boolean {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return true
  return isNetworkError(e)
}

/**
 * Tulis ke Supabase; bila offline/gagal jaringan → antrekan.
 * Mengembalikan { ok, queued, id?, error? }.
 */
async function tulisTertunda(
  table: SyncTable,
  op: SyncOp,
  data: Record<string, any>,
  match?: Record<string, any>,
  tempId?: string,
): Promise<HasilTulis> {
  const supabase = useSupabase()
  if (!supabase) return { ok: false, queued: false, error: 'Supabase belum dikonfigurasi' }
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    antrekan({ table, op, data, match, tempId })
    return { ok: false, queued: true }
  }
  // Siswa induk masih berupa id sementara (belum tersinkron) →
  // jangan coba tulis langsung (FK pasti gagal); antrekan saja.
  // Remap tempId → id asli terjadi saat sinkronisasi.
  const sid = (data as any)?.siswa_id
  if (typeof sid === 'string' && sid.startsWith('lokal-')) {
    antrekan({ table, op, data, match, tempId })
    return { ok: false, queued: true }
  }
  try {
    if (op === 'insert') {
      const { data: ins, error } = await supabase.from(table).insert(data).select('id').single()
      if (error) throw error
      return { ok: true, queued: false, id: ins?.id ?? null }
    }
    const { error } = await supabase.from(table).update(data).match(match ?? {})
    if (error) throw error
    return { ok: true, queued: false }
  } catch (e: any) {
    if (adalahJaringan(e)) {
      antrekan({ table, op, data, match, tempId })
      return { ok: false, queued: true }
    }
    return { ok: false, queued: false, error: String(e?.message ?? e) }
  }
}

/** Sinkronisasi insert siswa: dedup dulu, lalu remap tempId → id asli. */
async function sinkronSiswaInsert(sb: any, item: SyncItem, queue: SyncItem[]): Promise<void> {
  const d = item.data
  // Query sama seperti login online: urut terbaru dulu, batasi 200
  const { data: daftar, error } = await sb
    .from('siswa')
    .select('id, nama_lengkap, no_absen, kelas, created_at')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw error
  const hasil = cocokkanSiswa(daftar ?? [], d.nama_lengkap, d.kelas ?? '', d.no_absen ?? '')
  let finalId: string
  if (hasil.kind === 'tidak-ada') {
    const { data: ins, error: e2 } = await sb
      .from('siswa')
      .insert({ nama_lengkap: d.nama_lengkap, no_absen: d.no_absen ?? null, kelas: d.kelas ?? null })
      .select('id')
      .single()
    if (e2) throw e2
    finalId = ins.id
  } else {
    // 'tunggal' atau 'ganda' → pakai kandidat pertama (last-write-wins)
    finalId = hasil.kandidat[0].id
  }
  if (item.tempId) {
    remapTempId(queue, item.tempId, finalId)
    for (const fn of remapHandlers) {
      try { fn(item.tempId, finalId) } catch { /* abaikan */ }
    }
  }
}

async function prosesItem(sb: any, item: SyncItem, queue: SyncItem[]): Promise<void> {
  if (item.table === 'siswa' && item.op === 'insert' && item.tempId) {
    await sinkronSiswaInsert(sb, item, queue)
    return
  }
  if (item.op === 'insert') {
    const { error } = await sb.from(item.table).insert(item.data)
    if (error) throw error
    return
  }
  const { error } = await sb.from(item.table).update(item.data).match(item.match ?? {})
  if (error) throw error
}

/** Proses antrean FIFO. Berhenti saat offline/gagal jaringan. */
async function sinkronkan(): Promise<void> {
  if (sedangSinkron.value) return
  if (typeof navigator !== 'undefined' && !navigator.onLine) return
  const supabase = useSupabase()
  if (!supabase) return
  sedangSinkron.value = true
  try {
    const q = bacaAntrean()
    let guard = 0
    while (q.length > 0 && guard++ < 300) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) break
      // Pastikan insert siswa diproses SEBELUM item yang merujuk tempId-nya.
      let idx = 0
      const refTemp = q[0]?.data?.siswa_id
      if (typeof refTemp === 'string' && refTemp.startsWith('lokal-')) {
        const j = q.findIndex((it) => it.table === 'siswa' && it.op === 'insert' && it.tempId === refTemp)
        if (j > 0) {
          idx = j
        } else {
          // Tidak ada insert siswa tertunda untuk tempId ini (mis. antrean lama):
          // putuskan tautan agar tidak melanggar FK saat insert.
          console.warn('[sinkron] tempId tanpa insert siswa tertunda, siswa_id di-null-kan:', refTemp)
          q[0].data = { ...q[0].data, siswa_id: null }
        }
      }
      const item = q[idx]
      try {
        await prosesItem(supabase, item, q)
        q.splice(q.indexOf(item), 1)
        simpanAntrean(q)
      } catch (e) {
        if (adalahJaringan(e)) break // coba lagi saat online berikutnya
        item.attempts = (item.attempts || 0) + 1
        if (item.attempts >= MAX_ATTEMPTS) {
          console.warn('[sinkron] item dibuang setelah 5x gagal:', item.table, item.op, e)
          q.splice(q.indexOf(item), 1)
          simpanAntrean(q)
          continue // lanjut ke item berikutnya
        }
        simpanAntrean(q)
        break // error aplikasi: hentikan dulu, coba lagi lain waktu
      }
    }
    pendingCount.value = q.length
    terakhirSinkron.value = Date.now()
  } finally {
    sedangSinkron.value = false
  }
}

/** Item antrean untuk satu tabel (untuk digabung ke tampilan daftar). */
function itemAntreanUntuk(table: SyncTable): SyncItem[] {
  return bacaAntrean().filter((it) => it.table === table)
}

/**
 * Baca dengan cache: saat online coba jaringan dulu (lalu simpan cache);
 * saat offline/gagal → pakai cache terakhir.
 */
async function bacaCacheAtauJaringan<T>(
  key: string,
  fetcher: () => Promise<T>,
): Promise<{ data: T | null; dariCache: boolean }> {
  const online = typeof navigator === 'undefined' || navigator.onLine
  if (online) {
    try {
      const data = await fetcher()
      simpanCache(key, data)
      return { data, dariCache: false }
    } catch (e) {
      if (!adalahJaringan(e)) throw e
    }
  }
  return { data: bacaCache<T>(key), dariCache: true }
}

export function useSync() {
  pastikanTerpasang()
  return {
    isOnline,
    pendingCount,
    sedangSinkron,
    terakhirSinkron,
    tulisTertunda,
    sinkronkan,
    antrekan,
    onRemapSiswa,
    itemAntreanUntuk,
    bacaCacheAtauJaringan,
    muatUlangAntrean: muatUlang,
  }
}
