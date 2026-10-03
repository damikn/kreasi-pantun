<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10">
    <div class="card max-w-md w-full p-8 md:p-10 text-center relative overflow-hidden">
      <div class="absolute -top-8 -right-8 text-[100px] opacity-10 select-none">👩‍🏫</div>

      <div class="text-6xl mb-4">👩‍🏫</div>
      <h1 class="font-display text-3xl font-extrabold text-slate-800">
        Dashboard <span class="text-emerald-600">Guru</span>
      </h1>
      <p class="text-slate-500 font-semibold mt-3 mb-6">
        Masukkan kode guru untuk melihat karya dan progres siswa.
        Kode = tanggal hari ini (DDMMYYYY).
      </p>

      <form @submit.prevent="masuk" class="text-left space-y-4">
        <div>
          <label class="block font-bold text-slate-700 mb-1.5">Kode Guru</label>
          <input v-model="kode" type="password" class="input-cute" placeholder="••••••" autocomplete="off" />
        </div>
        <p v-if="error" class="text-rose-500 text-sm font-bold">{{ error }}</p>
        <button type="submit" class="btn-primary w-full !mt-6">Masuk 🔑</button>
      </form>

      <NuxtLink to="/" class="inline-block mt-5 text-sm font-bold text-slate-400 hover:text-emerald-600 transition">
        ← Kembali ke halaman siswa
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { guruAuthed, save, logout } = useSession()
const kode = ref('')
const error = ref('')

// Kode guru = tanggal hari ini (DDMMYYYY), ganti otomatis tiap hari.
// Contoh: 3 Okt 2026 -> "03102026". Dihitung dari tanggal di perangkat.
// Env NUXT_PUBLIC_GURU_CODE (bila diisi) tetap diterima sebagai kode cadangan.
function kodeHariIni() {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}${mm}${d.getFullYear()}`
}

function masuk() {
  const config = useRuntimeConfig()
  const diterima = [kodeHariIni(), (config.public.guruCode as string) || ''].filter(Boolean)
  if (diterima.includes(kode.value.trim())) {
    // Mode saling eksklusif: login guru membersihkan sesi siswa (perangkat bersama)
    logout()
    guruAuthed.value = true
    save()
    navigateTo('/guru/dashboard')
  } else {
    error.value = 'Kode salah. Kode guru adalah tanggal hari ini (contoh: 03102026).'
  }
}
</script>
