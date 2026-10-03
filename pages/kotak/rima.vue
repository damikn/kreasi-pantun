<template>
  <StepBar :steps="['Fenomena', 'Pola', 'Rima', 'Susun Pantun']" :current="2" />

  <div class="text-center mb-6">
    <h1 class="page-title">🌳 Pilih Rima</h1>
    <p class="page-sub">Pilih <b>minimal 3 kata</b> dari pohon rima untuk bahan pantunmu!</p>
  </div>

  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
    <!-- Pohon rima -->
    <div class="card p-6 text-center relative overflow-hidden">
      <div class="text-6xl mb-1">🌳</div>
      <p class="font-display font-bold text-slate-700 mb-4">Pohon Rima</p>
      <div class="flex flex-wrap justify-center gap-2">
        <button v-for="k in kataRima" :key="k.kata" @click="toggle(k.kata)"
          class="pill !text-sm !px-4 !py-2 border-2 transition hover:scale-105"
          :class="dipilih.includes(k.kata)
            ? 'bg-emerald-500 text-white border-emerald-500 shadow'
            : 'bg-amber-50 text-slate-700 border-amber-200'">
          {{ dipilih.includes(k.kata) ? '✓ ' : '' }}{{ k.kata }}
          <span class="opacity-60 text-xs">{{ k.akhiran }}</span>
        </button>
      </div>
    </div>

    <!-- Daftar per akhiran -->
    <div class="card p-6">
      <p class="font-display font-bold text-slate-700 mb-3">Kata-kata untuk rima</p>
      <div class="space-y-3 max-h-72 overflow-y-auto pr-1">
        <div v-for="a in akhiranList" :key="a">
          <p class="pill bg-violet-100 text-violet-700 mb-1.5">{{ a }}</p>
          <div class="flex flex-wrap gap-1.5">
            <label v-for="k in byAkhiran(a)" :key="k.kata"
              class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-sm font-bold text-slate-700 cursor-pointer hover:border-emerald-300">
              <input type="checkbox" :checked="dipilih.includes(k.kata)" @change="toggle(k.kata)"
                class="w-4 h-4 accent-emerald-500" />
              {{ k.kata }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card mt-6 p-4 max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
    <div>
      <p class="text-sm font-bold text-slate-500">Kata yang kamu pilih (minimal 3):</p>
      <p class="font-display font-bold text-lg text-slate-800">
        {{ dipilih.length ? dipilih.join(', ') : '—' }}
      </p>
    </div>
    <span class="pill text-base" :class="dipilih.length >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
      {{ dipilih.length }} / 3 kata
    </span>
  </div>

  <div class="text-center mt-8 flex justify-center gap-3">
    <NuxtLink to="/kotak/pola" class="btn-soft">← Sebelumnya</NuxtLink>
    <button class="btn-primary text-lg" :disabled="dipilih.length < 3" @click="lanjut">Selanjutnya →</button>
  </div>
</template>

<script setup lang="ts">
import { kataRima, akhiranList } from '~/data/konten'

definePageMeta({ layout: 'app', middleware: 'auth' })

const { kotakPola, kotakRima } = useSession()
const dipilih = ref<string[]>([...kotakRima.value])

if (!kotakPola.value) {
  await navigateTo('/kotak/pola')
}

function byAkhiran(a: string) {
  return kataRima.filter(k => k.akhiran === a)
}

function toggle(kata: string) {
  const i = dipilih.value.indexOf(kata)
  if (i >= 0) dipilih.value.splice(i, 1)
  else dipilih.value.push(kata)
}

async function lanjut() {
  if (dipilih.value.length < 3) return
  kotakRima.value = [...dipilih.value]
  await navigateTo('/kotak/susun')
}
</script>
