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
          {{ loading ? 'Menyimpan...' : 'Mulai 🚀' }}
        </button>
      </form>
      <p v-if="!supabaseReady" class="text-xs text-slate-400 mt-4 font-semibold">
        Mode lokal: Supabase belum dikonfigurasi, datamu tersimpan di perangkat ini saja.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { namaLengkap, noAbsen, kelas, siswaId } = useSession()
const supabase = useSupabase()
const supabaseReady = useSupabaseReady()

const namaInput = ref('')
const absenInput = ref('')
const kelasInput = ref('')
const error = ref('')
const loading = ref(false)

const sfx = useSound()

async function masuk() {
  const n = namaInput.value.trim()
  if (!n) {
    error.value = 'Masukkan nama lengkapmu terlebih dahulu, ya!'
    return
  }
  error.value = ''
  loading.value = true
  const absen = absenInput.value.trim()
  const kls = kelasInput.value.trim()
  let id = ''
  if (supabase) {
    try {
      const { data, error: err } = await supabase
        .from('siswa')
        .insert({ nama_lengkap: n, no_absen: absen || null, kelas: kls || null })
        .select('id')
        .single()
      if (err) throw err
      id = data.id
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
  sfx.success()
  await navigateTo('/pilih')
}
</script>
