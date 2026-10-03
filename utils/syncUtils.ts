/**
 * Logika murni (framework-free) untuk antrean sinkronisasi offline.
 * Sengaja tanpa dependensi Nuxt/Vue agar bisa diuji langsung di Node.
 */

export type SyncTable = 'siswa' | 'karya' | 'peta_ide' | 'refleksi'
export type SyncOp = 'insert' | 'update'

export interface SyncItem {
  /** id unik antrean (bukan id baris database) */
  qid: string
  table: SyncTable
  op: SyncOp
  /** payload untuk insert / kolom yang diupdate */
  data: Record<string, any>
  /** kondisi update, mis. { id: '...' } */
  match?: Record<string, any>
  /**
   * Penanda id sementara untuk insert siswa saat offline.
   * Dipakai untuk remapping: semua item lain yang memakai tempId
   * sebagai siswa_id akan diganti ke id asli setelah sinkron.
   */
  tempId?: string
  createdAt: number
  attempts: number
}

export const QUEUE_KEY = 'kp_sync_queue'
export const MAX_ATTEMPTS = 5

/** Normalisasi identitas: huruf kecil + rapikan spasi. */
export function normIdentitas(s: string | null | undefined): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim()
}

export interface HasilCocok {
  kind: 'tidak-ada' | 'tunggal' | 'ganda'
  kandidat: any[]
}

/**
 * Logika dedup siswa — SAMA persis dipakai saat login online
 * dan saat sinkronisasi item insert siswa.
 */
export function cocokkanSiswa(
  daftar: any[],
  nama: string,
  kelas: string,
  noAbsen: string,
): HasilCocok {
  const targetNama = normIdentitas(nama)
  const targetKelas = normIdentitas(kelas)
  const cocokSemua = (daftar ?? []).filter(
    (s: any) =>
      normIdentitas(s.nama_lengkap) === targetNama &&
      normIdentitas(s.kelas) === targetKelas,
  )
  if (cocokSemua.length === 0) return { kind: 'tidak-ada', kandidat: [] }
  if (cocokSemua.length === 1) return { kind: 'tunggal', kandidat: cocokSemua }
  // Nama kembar sekelas → persempit dengan no. absen
  const absen = (noAbsen ?? '').toString().trim()
  if (absen) {
    const cocokAbsen = cocokSemua.filter(
      (s: any) => (s.no_absen ?? '').toString().trim() === absen,
    )
    if (cocokAbsen.length === 1) return { kind: 'tunggal', kandidat: cocokAbsen }
  }
  return { kind: 'ganda', kandidat: cocokSemua }
}

/**
 * Ganti semua referensi tempId (di data.siswa_id) menjadi id asli.
 * Mengembalikan jumlah item yang diubah.
 */
export function remapTempId(queue: SyncItem[], tempId: string, newId: string): number {
  let n = 0
  for (const it of queue) {
    if (it.data && it.data.siswa_id === tempId) {
      it.data.siswa_id = newId
      n++
    }
  }
  return n
}

/** Storage minimal agar bisa diuji di Node (default: localStorage bila ada). */
export interface StorageLike {
  getItem(k: string): string | null
  setItem(k: string, v: string): void
  removeItem(k: string): void
}

function defaultStorage(): StorageLike | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage
  } catch { /* abaikan */ }
  return null
}

export function bacaAntrean(storage?: StorageLike | null): SyncItem[] {
  const st = storage ?? defaultStorage()
  if (!st) return []
  try {
    const raw = st.getItem(QUEUE_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function simpanAntrean(queue: SyncItem[], storage?: StorageLike | null): void {
  const st = storage ?? defaultStorage()
  if (!st) return
  try {
    st.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch { /* abaikan: storage penuh */ }
}

/** Kunci cache baca: `kp_cache_<key>` */
export const cacheKey = (key: string) => `kp_cache_${key}`

export function simpanCache(key: string, data: any, storage?: StorageLike | null): void {
  const st = storage ?? defaultStorage()
  if (!st) return
  try {
    st.setItem(cacheKey(key), JSON.stringify({ at: Date.now(), data }))
  } catch { /* abaikan */ }
}

export function bacaCache<T>(key: string, storage?: StorageLike | null): T | null {
  const st = storage ?? defaultStorage()
  if (!st) return null
  try {
    const raw = st.getItem(cacheKey(key))
    if (!raw) return null
    return (JSON.parse(raw) as { data: T }).data ?? null
  } catch {
    return null
  }
}

/** true bila error tampak seperti kegagalan jaringan (offline). */
export function isNetworkError(e: any): boolean {
  const msg = String(e?.message ?? e ?? '').toLowerCase()
  return (
    /failed to fetch|networkerror|network request failed|fetch failed|load failed|timeout|timed out|aborterror|econn|enotfound|offline|tidak ada koneksi/i.test(
      msg,
    )
  )
}
