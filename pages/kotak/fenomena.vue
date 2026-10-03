<template>
  <StepBar :steps="stepLabels" :current="0" />

  <div class="text-center mb-6">
    <h1 class="page-title">🔍 Kembangkan Fenomena</h1>
    <p class="page-sub">Pilih salah satu fenomena yang menarik perhatianmu!</p>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
    <button v-for="f in kotakPhenomena" :key="f.id" @click="pilih(f)"
      class="card p-4 text-center transition hover:scale-[1.03] hover:shadow-lg"
      :class="dipilih?.id === f.id ? '!border-emerald-400 !ring-4 !ring-emerald-100 !bg-emerald-50/60' : ''">
      <div class="text-4xl mb-2">{{ f.icon }}</div>
      <p class="font-bold text-sm text-slate-700 leading-snug">{{ f.name }}</p>
    </button>
  </div>

  <div v-if="dipilih" class="card mt-6 p-5 max-w-4xl mx-auto bg-amber-50/70">
    <p class="text-sm font-bold text-amber-700 mb-1">Fenomena yang kamu pilih:</p>
    <p class="font-display font-bold text-lg text-slate-800">{{ dipilih.icon }} {{ dipilih.name }}</p>
    <p class="text-slate-600 font-semibold text-sm mt-2">{{ dipilih.description }}</p>
    <div class="mt-3 bg-white/70 rounded-2xl p-3">
      <button @click="tampilContoh = !tampilContoh" class="text-sm font-bold text-sky-700 flex items-center gap-1">
        💡 Contoh kejadian {{ tampilContoh ? '▾' : '▸' }}
      </button>
      <p v-if="tampilContoh" class="text-sm font-semibold text-slate-600 mt-2 italic">"{{ dipilih.contoh }}"</p>
    </div>
  </div>

  <div class="text-center mt-8">
    <button class="btn-primary text-lg" :disabled="!dipilih" @click="lanjut">
      Selanjutnya →
    </button>
  </div>
</template>

<script setup lang="ts">
import { kotakPhenomena, stepLabels, type KotakFenomena } from '~/data/kotak'

definePageMeta({ layout: 'app', middleware: 'auth' })

const { kotakFenomena } = useSession()
const dipilih = ref<KotakFenomena | null>(kotakFenomena.value)
const tampilContoh = ref(false)

function pilih(f: KotakFenomena) {
  dipilih.value = f
  tampilContoh.value = false
}

async function lanjut() {
  if (!dipilih.value) return
  kotakFenomena.value = dipilih.value
  await navigateTo('/kotak/pola')
}
</script>
