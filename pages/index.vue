<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10">
    <div class="card max-w-md w-full p-8 md:p-10 text-center relative overflow-hidden">
      <div class="absolute -top-8 -left-8 text-[100px] opacity-10 select-none">📦</div>
      <div class="absolute -bottom-8 -right-8 text-[100px] opacity-10 select-none">✨</div>

      <div class="text-6xl mb-4">📦</div>
      <h1 class="font-display text-4xl font-extrabold text-slate-800">
        Selamat Datang di<br />
        <span class="text-emerald-600">Kreasi Pantun</span>
      </h1>
      <p class="mt-3 inline-block bg-amber-100 text-amber-800 font-bold text-sm rounded-full px-4 py-1.5">
        Jelajahi Ide, Rangkai Kata, Ciptakan Pantunmu!
      </p>
      <p class="text-slate-500 font-semibold mt-4 mb-6">
        Isi identitasmu dulu ya, baru kita mulai berkreasi! 🎨
      </p>

      <!-- Pemilih akun: muncul bila ada >1 akun dengan nama+kelas yang sama -->
      <div v-if="tampilPicker" class="text-left">
        <p class="font-extrabold text-slate-700">Kami menemukan {{ kandidat.length }} akun dengan nama dan kelas yang sama 🤔</p>
        <p class="text-sm font-semibold text-slate-500 mt-1 mb-4">Pilih akunmu di bawah ini ya! 👇</p>
        <div class="space-y-2.5">
          <button v-for="k in kandidat" :key="k.id" @click="pilihAkun(k)"
            class="w-full text-left card !p-4 hover:border-emerald-300 hover:bg-emerald-50/60 transition">
            <p class="font-extrabold text-slate-700">{{ k.nama_lengkap }}</p>
            <p class="text-sm font-semibold text-slate-500">Kelas {{ k.kelas || '—' }} • No. absen {{ k.no_absen || '—' }}</p>
            <p class="text-xs font-bold text-slate-400 mt-0.5">Terdaftar sejak {{ formatTanggal(k.created_at) }}</p>
          </button>
        </div>
        <button class="btn-soft w-full mt-4" @click="buatBaruDariPicker" :disabled="loading">
          {{ loading ? 'Membuat...' : '➕ Bukan salah satu di atas? Buat akun baru' }}
        </button>
        <button class="w-full mt-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition" @click="tampilPicker = false">
          ← Kembali
        </button>
        <p v-if="error" class="text-rose-500 text-sm font-bold mt-3">{{ error }}</p>
      </div>

      <form v-else @submit.prevent="masuk" class="text-left space-y-4">
        <div>
          <label class="block font-bold text-slate-700 mb-1.5">
            Nama Lengkap <span class="text-rose-500">*</span>
          </label>
          <input v-model="namaInput" class="input-cute" placeholder="Contoh: Alya Putri" maxlength="60" autocomplete="off" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">No. Absen</label>
            <input v-model="absenInput" class="input-cute" placeholder="Contoh: 7" maxlength="10" inputmode="numeric" autocomplete="off" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">Kelas</label>
            <input v-model="kelasInput" class="input-cute" placeholder="Contoh: 4A" maxlength="10" autocomplete="off" />
          </div>
        </div>
        <p v-if="error" class="text-rose-500 text-sm font-bold">{{ error }}</p>
        <button type="submit" class="btn-primary w-full !mt-6 text-lg" :disabled="loading">
          {{ loading ? tombolTeks : 'Mulai 🚀' }}
        </button>
      </form>
      <p v-if="!supabaseReady" class="text-xs text-slate-400 mt-4 font-semibold">
        Mode lokal: Supabase belum dikonfigurasi, datamu tersimpan di perangkat ini saja.
      </p>
      <NuxtLink to="/guru" class="inline-block mt-4 text-sm font-bold text-slate-400 hover:text-emerald-600 transition">
        👩‍🏫 Masuk sebagai Guru
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isNetworkError } from '~/utils/syncUtils'

definePageMeta({ layout: false })

const { namaLengkap, noAbsen, kelas, siswaId, datangKembali, guruAuthed, save } = useSession()
const supabase = useSupabase()
const supabaseReady = useSupabaseReady()

const namaInput = ref('')
const absenInput = ref('')
const kelasInput = ref('')
const error = ref('')
const loading = ref(false)
const tombolTeks = ref('Menyimpan...')

const sfx = useSound()
const sync = useSync()

/** Id sementara untuk akun yang dibuat saat offline: 'lokal-<uuid>'. */
function idLokalBaru(): string {
  const uuid = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`
  return `lokal-${uuid}`
}

/** True bila perangkat sedang offline. */
function sedangOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine
}

// Kandidat akun yang cocok (nama+kelas sama) — untuk pemilih akun anti-kembar
const kandidat = ref<any[]>([])
const tampilPicker = ref(false)

function formatTanggal(s: string) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Terapkan sesi lalu masuk ke menu utama. */
function terapkanSesi(nama: string, absen: string, kls: string, id: string, kembali: boolean) {
  // Mode saling eksklusif: login siswa mematikan mode guru (perangkat bersama)
  guruAuthed.value = false
  namaLengkap.value = nama
  noAbsen.value = absen
  kelas.value = kls
  siswaId.value = id
  datangKembali.value = kembali
  save()
  if (kembali) sfx.success()
  else sfx.pop()
  navigateTo('/pilih')
}

/** Masuk memakai akun yang sudah ada (tidak membuat duplikat). */
function masukDenganAkun(s: any, n: string, absen: string, kls: string) {
  tampilPicker.value = false
  loading.value = false
  terapkanSesi(n, absen, kls, s.id, true)
}

/** Buat akun siswa baru: insert langsung bila online, antrekan bila gagal jaringan. */
async function buatAkunBaru(n: string, absen: string, kls: string) {
  // Generate tempId dulu agar SAMA dipakai sesi bila ternyata harus antre
  // (mis. koneksi putus tepat saat insert) — remap saat sinkron butuh ini.
  const tempId = idLokalBaru()
  const res = await sync.tulisTertunda('siswa', 'insert', {
    nama_lengkap: n,
    no_absen: absen || null,
    kelas: kls || null,
  }, undefined, tempId)
  if (!res.ok && !res.queued) throw new Error(res.error || 'Gagal menyimpan')
  tampilPicker.value = false
  loading.value = false
  // Bila queued (offline), pakai id lokal sementara; id asli di-remap saat sinkron.
  terapkanSesi(n, absen, kls, res.id ?? tempId, false)
}

/** Login offline: akun sementara + insert siswa diantrekan (dedup saat sinkron). */
function masukOffline(n: string, absen: string, kls: string) {
  const tempId = idLokalBaru()
  if (supabase) {
    sync.antrekan({
      table: 'siswa',
      op: 'insert',
      data: { nama_lengkap: n, no_absen: absen || null, kelas: kls || null },
      tempId,
    })
  }
  loading.value = false
  terapkanSesi(n, absen, kls, tempId, false)
}

async function masuk() {
  const n = namaInput.value.trim()
  if (!n) {
    error.value = 'Masukkan nama lengkapmu terlebih dahulu, ya!'
    return
  }
  // Nama harus mengandung minimal satu huruf (tolak "123", "!!!", dsb.)
  if (!/\p{L}/u.test(n)) {
    error.value = 'Nama harus mengandung huruf, ya! Contoh: Alya Putri'
    return
  }
  const absen = absenInput.value.trim()
  const kls = kelasInput.value.trim()
  // No. absen hanya boleh angka bila diisi
  if (absen && !/^\d+$/.test(absen)) {
    error.value = 'No. absen hanya boleh berisi angka, ya!'
    return
  }
  error.value = ''
  loading.value = true
  tombolTeks.value = 'Mencari datamu...'
  tampilPicker.value = false

  // Mode lokal (Supabase belum dikonfigurasi) atau offline:
  // pakai akun sementara; insert siswa diantrekan bila ada Supabase.
  if (!supabase || sedangOffline()) {
    masukOffline(n, absen, kls)
    return
  }

  try {
    // Cari kandidat: nama + kelas sama (tanpa peduli huruf besar/kecil & spasi berlebih)
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
    const targetNama = norm(n)
    const targetKelas = norm(kls)
    const { data: daftar, error: errCari } = await supabase
      .from('siswa')
      .select('id, nama_lengkap, no_absen, kelas, created_at')
      .order('created_at', { ascending: false })
      .limit(200)
    if (errCari) throw errCari
    const cocokSemua = (daftar ?? []).filter((s: any) =>
      norm(s.nama_lengkap ?? '') === targetNama &&
      norm(s.kelas ?? '') === targetKelas
    )

    if (cocokSemua.length === 0) {
      // Belum terdaftar → buat akun baru
      await buatAkunBaru(n, absen, kls)
    } else if (cocokSemua.length === 1) {
      // Tepat satu → langsung masuk dengan akun itu
      masukDenganAkun(cocokSemua[0], n, absen, kls)
    } else {
      // Lebih dari satu (nama kembar sekelas) → coba persempit dengan no. absen
      let unik: any | null = null
      if (absen) {
        const cocokAbsen = cocokSemua.filter((s: any) => (s.no_absen ?? '').toString().trim() === absen)
        if (cocokAbsen.length === 1) unik = cocokAbsen[0]
      }
      if (unik) {
        masukDenganAkun(unik, n, absen, kls)
      } else {
        // Tidak bisa ditentukan unik → tampilkan pemilih akun
        kandidat.value = cocokSemua
        tampilPicker.value = true
        loading.value = false
      }
    }
  } catch (e) {
    console.error(e)
    // Bila pencarian gagal karena jaringan putus di tengah jalan,
    // fallback ke mode offline (akun sementara + antrean).
    if (isNetworkError(e)) {
      masukOffline(n, absen, kls)
      return
    }
    error.value = 'Gagal menyimpan ke database. Coba lagi ya!'
    loading.value = false
  }
}

/** Siswa memilih salah satu akun dari pemilih akun. */
function pilihAkun(s: any) {
  masukDenganAkun(s, namaInput.value.trim(), absenInput.value.trim(), kelasInput.value.trim())
}

/** Dari pemilih akun: paksa buat akun baru (bukan salah satu kandidat). */
async function buatBaruDariPicker() {
  loading.value = true
  tombolTeks.value = 'Membuat akun...'
  try {
    await buatAkunBaru(namaInput.value.trim(), absenInput.value.trim(), kelasInput.value.trim())
  } catch (e) {
    console.error(e)
    error.value = 'Gagal membuat akun. Coba lagi ya!'
    loading.value = false
  }
}
</script>
