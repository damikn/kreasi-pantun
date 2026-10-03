<template>
  <div class="mb-6">
    <span class="pill bg-emerald-100 text-emerald-700">ENGAGE — Kenali Fenomena</span>
    <span class="float-right pill bg-amber-100 text-amber-700">1 dari 2</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🔍 Amati Fenomenanya!</h1>
    <p class="page-sub">Setiap fenomena dapat menjadi inspirasi untuk menciptakan pantun. Yuk, amati contoh berikut!</p>
  </div>

  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
    <div class="card p-6 text-center">
      <div class="text-8xl mb-4">🏫🧹</div>
      <p class="font-display font-bold text-lg text-slate-700">Ruang kelas yang kotor</p>
      <p class="text-slate-500 font-semibold text-sm mt-1">Sampah berserakan di mana-mana...</p>
    </div>

    <div class="space-y-4">
      <div class="card p-5 border-l-8 !border-l-emerald-400">
        <p class="pill bg-emerald-100 text-emerald-700 mb-2">🌿 Fenomena</p>
        <p class="font-bold text-slate-800">{{ f.judul }}</p>
        <p class="text-slate-500 font-semibold text-sm">{{ f.deskripsi }}</p>
      </div>
      <div class="card p-5 border-l-8 !border-l-amber-400">
        <p class="pill bg-amber-100 text-amber-700 mb-2">💡 Pesan</p>
        <p class="font-semibold text-slate-600 text-sm">{{ f.pesan }}</p>
      </div>
      <div class="card p-5 border-l-8 !border-l-violet-400">
        <p class="pill bg-violet-100 text-violet-700 mb-2">📜 Contoh Pantun</p>
        <PantunCard :baris="f.pantun" />
      </div>
    </div>
  </div>

  <div class="text-center mt-8 flex justify-center gap-3">
    <NuxtLink to="/pilih" class="btn-soft">← Menu</NuxtLink>
    <NuxtLink to="/limar/engage-2" class="btn-primary text-lg">Lanjutkan →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { engageFenomena } from '~/data/konten'

definePageMeta({ layout: 'app', middleware: 'auth' })
const f = engageFenomena
</script>
