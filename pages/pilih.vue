<template>
  <div class="text-center mb-8">
    <div v-if="datangKembali" class="inline-block bg-emerald-100 text-emerald-700 font-bold text-sm rounded-full px-5 py-2 mb-3">
      🎉 Selamat datang kembali! Akunmu ditemukan, tidak perlu daftar lagi.
    </div>
    <h1 class="page-title">Halo, {{ namaLengkap }}! 👋</h1>
    <p v-if="kelas || noAbsen" class="page-sub">
      {{ [kelas ? `Kelas ${kelas}` : '', noAbsen ? `No. ${noAbsen}` : ''].filter(Boolean).join(' • ') }}
    </p>
    <p class="page-sub">Pilih aplikasimu dan mulai berkreasi dengan pantun!</p>
  </div>

  <!-- KOTAK KREASI disembunyikan sementara (dikomen) sesuai revisi -->
  <!--
  <div class="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
    <NuxtLink to="/kotak/fenomena" data-no-sound @click="sfx.swoosh()"
      class="card p-8 text-center hover:scale-[1.02] hover:shadow-xl transition group">
      <div class="text-7xl mb-4 group-hover:animate-bounce">📦</div>
      <h2 class="font-display text-2xl font-extrabold text-amber-600">KOTAK KREASI</h2>
      <p class="text-slate-500 font-semibold mt-2 text-sm leading-relaxed">
        4 langkah seru: pilih fenomena → putar roda pola → pilih rima → susun pantunmu!
      </p>
      <div class="flex justify-center gap-2 mt-4 flex-wrap">
        <span class="pill bg-amber-100 text-amber-700">🔍 Fenomena</span>
        <span class="pill bg-rose-100 text-rose-700">🎡 Pola</span>
        <span class="pill bg-emerald-100 text-emerald-700">🌳 Rima</span>
        <span class="pill bg-sky-100 text-sky-700">✍️ Susun</span>
      </div>
      <span class="btn-warm mt-6">Mulai Berkreasi →</span>
    </NuxtLink>

    <NuxtLink to="/limar/engage-1" data-no-sound @click="sfx.swoosh()"
      class="card p-8 text-center hover:scale-[1.02] hover:shadow-xl transition group">
      <div class="text-7xl mb-4 group-hover:animate-bounce">🌟</div>
      <h2 class="font-display text-2xl font-extrabold text-emerald-600">Kreasi Pantun 5E</h2>
      <p class="text-slate-500 font-semibold mt-2 text-sm leading-relaxed">
        Belajar bertahap: Engage → Explore → Explain → Elaborate → Evaluate, lengkap dengan permainan seru!
      </p>
      <div class="flex justify-center gap-2 mt-4 flex-wrap">
        <span class="pill bg-emerald-100 text-emerald-700">Engage</span>
        <span class="pill bg-amber-100 text-amber-700">Explore</span>
        <span class="pill bg-violet-100 text-violet-700">Explain</span>
        <span class="pill bg-sky-100 text-sky-700">Elaborate</span>
        <span class="pill bg-rose-100 text-rose-700">Evaluate</span>
      </div>
      <span class="btn-primary mt-6">Mulai Belajar →</span>
    </NuxtLink>
  </div>
  -->

  <div class="grid md:grid-cols-1 gap-6 max-w-3xl mx-auto">
    <NuxtLink to="/limar/engage-1" data-no-sound @click="sfx.swoosh()"
      class="card p-8 text-center hover:scale-[1.02] hover:shadow-xl transition group">
      <div class="text-7xl mb-4 group-hover:animate-bounce">🌟</div>
      <h2 class="font-display text-2xl font-extrabold text-emerald-600">Kreasi Pantun 5E</h2>
      <p class="text-slate-500 font-semibold mt-2 text-sm leading-relaxed">
        Belajar bertahap: Engage → Explore → Explain → Elaborate → Evaluate, lengkap dengan permainan seru!
      </p>
      <div class="flex justify-center gap-2 mt-4 flex-wrap">
        <span class="pill bg-emerald-100 text-emerald-700">Engage</span>
        <span class="pill bg-amber-100 text-amber-700">Explore</span>
        <span class="pill bg-violet-100 text-violet-700">Explain</span>
        <span class="pill bg-sky-100 text-sky-700">Elaborate</span>
        <span class="pill bg-rose-100 text-rose-700">Evaluate</span>
      </div>
      <span class="btn-primary mt-6">Mulai Belajar →</span>
    </NuxtLink>
  </div>

  <div class="max-w-3xl mx-auto mt-6 text-center">
    <NuxtLink to="/karyaku" data-no-sound @click="sfx.swoosh()"
      class="card p-5 inline-flex items-center gap-4 hover:scale-[1.02] hover:shadow-xl transition text-left w-full">
      <div class="text-5xl">📖</div>
      <div class="flex-1">
        <h2 class="font-display text-xl font-extrabold text-slate-800">Buku Karyaku</h2>
        <p class="text-slate-500 font-semibold text-sm">Lihat semua pantun yang pernah kamu buat.</p>
      </div>
      <span class="text-2xl">→</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })
const { namaLengkap, noAbsen, kelas, datangKembali, resetKotak } = useSession()
const sfx = useSound()
resetKotak()
// Banner hanya tampil sekali setelah login ulang
if (datangKembali.value) {
  setTimeout(() => { datangKembali.value = false }, 6000)
}
</script>
