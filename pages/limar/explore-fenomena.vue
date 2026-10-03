<template>
  <div class="mb-6">
    <span class="pill bg-amber-100 text-amber-700">EXPLORE — Ekspresikan Gagasan dan Pesan</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🌱 Fenomena Ini Tentang Apa?</h1>
    <p class="page-sub">Pilih satu fenomena yang menarik perhatianmu.</p>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
    <button v-for="f in fenomena5e" :key="f.id" @click="pilih(f)"
      class="card p-5 text-center transition hover:scale-[1.03] hover:shadow-lg"
      :class="dipilih?.id === f.id ? '!border-amber-400 !ring-4 !ring-amber-100 !bg-amber-50/70' : ''">
      <div class="text-5xl mb-2">{{ f.icon }}</div>
      <p class="font-bold text-sm text-slate-700">{{ f.nama }}</p>
    </button>
  </div>

  <div v-if="dipilih" class="card mt-6 p-5 max-w-2xl mx-auto bg-amber-50/70">
    <p class="font-display font-bold text-lg text-slate-800">{{ dipilih.icon }} {{ dipilih.nama }}</p>
    <p class="text-slate-500 font-semibold text-sm mt-1">{{ dipilih.deskripsi }}</p>
  </div>

  <div class="text-center mt-8 flex justify-center gap-3">
    <NuxtLink to="/limar/engage-2" class="btn-soft">← Sebelumnya</NuxtLink>
    <button class="btn-warm text-lg" :disabled="!dipilih" @click="lanjut">Lanjutkan →</button>
  </div>
</template>

<script setup lang="ts">
import { fenomena5e, type Fenomena } from '~/data/konten'

definePageMeta({ layout: 'app', middleware: 'auth' })

const { limarFenomena } = useSession()
const dipilih = ref<Fenomena | null>(limarFenomena.value)

function pilih(f: Fenomena) {
  dipilih.value = f
}

async function lanjut() {
  if (!dipilih.value) return
  limarFenomena.value = dipilih.value
  await navigateTo('/limar/explore-peta')
}
</script>
