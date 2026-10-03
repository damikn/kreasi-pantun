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

      <form @submit.prevent="masuk" class="text-left space-y-4">
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
definePageMeta({ layout: false })

const { namaLengkap, noAbsen, kelas, siswaId, datangKembali, save } = useSession()
const supabase = useSupabase()
const supabaseReady = useSupabaseReady()

const namaInput = ref('')
const absenInput = ref('')
const kelasInput = ref('')
const error = ref('')
const loading = ref(false)
const tombolTeks = ref('Menyimpan...')

const sfx = useSound()

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
  let id = ''
  let datangKembaliLogin = false
  if (supabase) {
    try {
      // 1) Cari dulu: apakah siswa ini sudah terdaftar?
      //    Identitas = nama lengkap + kelas (perbandingan tanpa huruf besar/kecil & spasi berlebih).
      const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
      const targetNama = norm(n)
      const targetKelas = norm(kls)
      const { data: daftar, error: errCari } = await supabase
        .from('siswa')
        .select('id, nama_lengkap, no_absen, kelas, created_at')
        .order('created_at', { ascending: false })
        .limit(200)
      if (errCari) throw errCari
      const cocok = (daftar ?? []).find((s: any) =>
        norm(s.nama_lengkap ?? '') === targetNama &&
        norm(s.kelas ?? '') === targetKelas
      )
      if (cocok) {
        // Siswa terdaftar → masuk dengan akun yang sudah ada (tidak duplikat).
        id = cocok.id
        datangKembaliLogin = true
      } else {
        // 2) Belum terdaftar → buat akun baru.
        const { data, error: err } = await supabase
          .from('siswa')
          .insert({ nama_lengkap: n, no_absen: absen || null, kelas: kls || null })
          .select('id')
          .single()
        if (err) throw err
        id = data.id
      }
    } catch (e) {
      console.error(e)
      error.value = 'Gagal menyimpan ke database. Coba lagi ya!'
      loading.value = false
      return
    }
  } else {
    id = 'lokal-' + Date.now().toString(36)
  }
  namaLengkap.value = n
  noAbsen.value = absen
  kelas.value = kls
  siswaId.value = id
  datangKembali.value = datangKembaliLogin
  save()
  if (datangKembaliLogin) sfx.success()
  else sfx.pop()
  await navigateTo('/pilih')
}
</script>
