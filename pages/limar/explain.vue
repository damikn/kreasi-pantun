<template>
  <div class="mb-6">
    <span class="pill bg-violet-100 text-violet-700">EXPLAIN — Eksplorasi Pengetahuan</span>
  </div>

  <div class="text-center mb-8">
    <h1 class="page-title">🎮 Eksplorasi Pengetahuan</h1>
    <p class="page-sub">Yuk, kenali bagian-bagian pantun dan temukan rahasia kata serta rimanya!</p>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
    <NuxtLink v-for="g in games" :key="g.to" :to="g.to"
      class="card p-5 text-center hover:scale-[1.04] hover:shadow-lg transition group">
      <div class="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition"
        :class="g.bg">{{ g.icon }}</div>
      <p class="font-display font-extrabold text-slate-800">{{ g.judul }}</p>
      <p class="text-xs font-semibold text-slate-500 mt-1 leading-snug">{{ g.deskripsi }}</p>
      <span class="btn-soft !px-4 !py-1.5 text-xs mt-3">Mainkan →</span>
    </NuxtLink>
  </div>

  <div class="text-center mt-10 flex justify-center gap-3">
    <NuxtLink to="/limar/explore-peta" class="btn-soft">← Kembali</NuxtLink>
    <NuxtLink to="/limar/elaborate" class="btn-primary text-lg">Lanjut ke Elaborate →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const games = [
  { to: '/limar/explain-tts', icon: '🧩', judul: 'TTS Pantun', deskripsi: 'Lengkapi teka-teki silang tentang istilah dan unsur pantun.', bg: 'bg-amber-100' },
  { to: '/limar/explain-susun', icon: '🔀', judul: 'Bongkar Susun Pantun', deskripsi: 'Susun baris pantun yang acak menjadi pantun yang utuh.', bg: 'bg-emerald-100' },
  { to: '/limar/explain-garis', icon: '🔗', judul: 'Tarik Garis Sampiran dan Isi', deskripsi: 'Hubungkan setiap baris pantun dengan kategori yang tepat.', bg: 'bg-sky-100' },
  { to: '/limar/explain-lengkapi', icon: '✏️', judul: 'Melengkapi Pantun', deskripsi: 'Pilih kata yang sesuai untuk melengkapi pantun.', bg: 'bg-rose-100' },
  { to: '/limar/explain-pohon-rima', icon: '🌳', judul: 'Pohon Rima', deskripsi: 'Temukan kata yang memiliki bunyi akhir serupa.', bg: 'bg-violet-100' }
]
</script>
