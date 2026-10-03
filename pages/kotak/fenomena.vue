<template>
  <StepBar :steps="['Fenomena', 'Pola', 'Rima', 'Susun Pantun']" :current="0" />

  <div class="text-center mb-6">
    <h1 class="page-title">🔍 Eksplorasi Fenomena</h1>
    <p class="page-sub">Pilih salah satu fenomena yang menarik perhatianmu!</p>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
    <button v-for="f in fenomenaKotak" :key="f.id" @click="pilih(f)"
      class="card p-4 text-center transition hover:scale-[1.03] hover:shadow-lg"
      :class="dipilih?.id === f.id ? '!border-emerald-400 !ring-4 !ring-emerald-100 !bg-emerald-50/60' : ''">
      <div class="text-4xl mb-2">{{ f.icon }}</div>
      <p class="font-bold text-sm text-slate-700 leading-snug">{{ f.nama }}</p>
    </button>
  </div>

  <div v-if="dipilih" class="card mt-6 p-5 bg-amber-50/70">
    <p class="text-sm font-bold text-amber-700 mb-1">Fenomena yang kamu pilih:</p>
    <p class="font-display font-bold text-lg text-slate-800">{{ dipilih.icon }} {{ dipilih.nama }}</p>
    <p class="text-slate-500 font-semibold text-sm mt-1">{{ dipilih.deskripsi }}</p>
  </div>

  <div class="text-center mt-8">
    <button class="btn-primary text-lg" :disabled="!dipilih" @click="lanjut">
      Selanjutnya →
    </button>
  </div>
</template>

<script setup lang="ts">
import { fenomenaKotak, type Fenomena } from '~/data/konten'

definePageMeta({ layout: 'app', middleware: 'auth' })

const { kotakFenomena } = useSession()
const dipilih = ref<Fenomena | null>(kotakFenomena.value)

function pilih(f: Fenomena) {
  dipilih.value = f
}

async function lanjut() {
  if (!dipilih.value) return
  kotakFenomena.value = dipilih.value
  await navigateTo('/kotak/pola')
}
</script>
