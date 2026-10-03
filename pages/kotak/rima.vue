<template>
  <StepBar :steps="stepLabels" :current="2" />

  <div class="text-center mb-6">
    <h1 class="page-title">🌳 Eksplorasi Rima</h1>
    <p class="page-sub">
      Pilih <b>1 akhiran</b> dan <b>minimal 2 kata</b> untuk tiap rima.<br />
      <span class="text-sky-700">Rima A</span> untuk baris 1 &amp; 3, <span class="text-emerald-700">Rima B</span> untuk baris 2 &amp; 4.
    </p>
  </div>

  <div class="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-start">
    <div v-for="panel in panels" :key="panel.key"
      class="card p-5" :class="panel.key === 'A' ? '!border-sky-200' : '!border-emerald-200'">
      <div class="flex items-center justify-between mb-1">
        <p class="font-display text-xl font-extrabold" :class="panel.key === 'A' ? 'text-sky-700' : 'text-emerald-700'">
          {{ panel.title }}
        </p>
        <span class="pill text-sm" :class="kataTerpilih(panel.key).length >= 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
          {{ kataTerpilih(panel.key).length }} / 2 kata
        </span>
      </div>
      <p class="text-xs font-bold text-slate-400 mb-3">Akhiran terpilih:
        <span class="pill bg-violet-100 text-violet-700 ml-1">{{ pilihan[panel.key].suffix || '—' }}</span>
      </p>

      <!-- Grid akhiran -->
      <p class="text-xs font-bold text-slate-500 mb-2">1️⃣ Pilih akhiran rima:</p>
      <div class="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1 mb-4">
        <button v-for="s in suffixAktif(panel.key)" :key="s" @click="pilihSuffix(panel.key, s)"
          class="pill !text-sm border-2 transition hover:scale-105"
          :class="pilihan[panel.key].suffix === s
            ? (panel.key === 'A' ? 'bg-sky-500 text-white border-sky-500 shadow' : 'bg-emerald-500 text-white border-emerald-500 shadow')
            : 'bg-slate-50 text-slate-600 border-slate-200'"
          :disabled="sudahDipakaiLain(panel.key, s)">
          {{ s }}
        </button>
      </div>

      <!-- Kata per kategori -->
      <div v-if="pilihan[panel.key].suffix">
        <p class="text-xs font-bold text-slate-500 mb-2">2️⃣ Pilih kata (minimal 2):</p>
        <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
          <div v-for="(label, kat) in kategoriLabel" :key="kat">
            <p class="text-xs font-bold text-slate-400 mb-1">{{ label }}</p>
            <div class="flex flex-wrap gap-1.5">
              <label v-for="k in rhymeWords[pilihan[panel.key].suffix][kat]" :key="k"
                class="flex items-center gap-1.5 bg-slate-50 border rounded-full px-3 py-1.5 text-sm font-bold text-slate-700 cursor-pointer hover:border-emerald-300"
                :class="kataTerpilih(panel.key).includes(k) ? '!border-emerald-400 !bg-emerald-50' : 'border-slate-200'">
                <input type="checkbox" :checked="kataTerpilih(panel.key).includes(k)"
                  @change="toggleKata(panel.key, k)" class="w-4 h-4 accent-emerald-500" />
                {{ k }}
              </label>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-sm font-semibold text-slate-400 italic">Pilih akhiran dulu untuk melihat kata-katanya 🌳</p>
    </div>
  </div>

  <div v-if="!akhiranBerbeda && pilihan.A.suffix && pilihan.B.suffix"
    class="card mt-6 p-4 max-w-5xl mx-auto bg-rose-50 !border-rose-200 text-center">
    <p class="font-bold text-rose-600 text-sm">⚠️ Akhiran Rima A dan Rima B harus berbeda!</p>
  </div>

  <div class="text-center mt-8 flex justify-center gap-3">
    <NuxtLink to="/kotak/pola" class="btn-soft">← Sebelumnya</NuxtLink>
    <button class="btn-primary text-lg" :disabled="!valid" @click="lanjut">Selanjutnya →</button>
  </div>
</template>

<script setup lang="ts">
import { rhymeSuffixes, rhymeWords, kategoriLabel, stepLabels } from '~/data/kotak'
import type { RimaChoice } from '~/composables/useSession'

definePageMeta({ layout: 'app', middleware: 'auth' })

const { kotakPola, kotakRima } = useSession()

if (!kotakPola.value) {
  await navigateTo('/kotak/pola')
}

const panels = [
  { key: 'A' as const, title: '🅰️ Rima A — Baris 1 & 3' },
  { key: 'B' as const, title: '🅱️ Rima B — Baris 2 & 4' },
]

type PanelKey = 'A' | 'B'
const pilihan = ref<Record<PanelKey, RimaChoice>>({
  A: { suffix: kotakRima.value.rimaA.suffix, words: [...kotakRima.value.rimaA.words] },
  B: { suffix: kotakRima.value.rimaB.suffix, words: [...kotakRima.value.rimaB.words] },
})

function kataTerpilih(k: PanelKey): string[] {
  return pilihan.value[k].words
}

/** Akhiran yang sudah dipakai panel lain tidak bisa dipilih lagi */
function sudahDipakaiLain(k: PanelKey, s: string): boolean {
  const lain = k === 'A' ? 'B' : 'A'
  return !!pilihan.value[lain].suffix && pilihan.value[lain].suffix === s
}

function suffixAktif(k: PanelKey): string[] {
  return rhymeSuffixes
}

function pilihSuffix(k: PanelKey, s: string) {
  if (sudahDipakaiLain(k, s)) return
  pilihan.value[k].suffix = s
  pilihan.value[k].words = []
}

function toggleKata(k: PanelKey, kata: string) {
  const arr = pilihan.value[k].words
  const i = arr.indexOf(kata)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(kata)
}

const akhiranBerbeda = computed(() =>
  !pilihan.value.A.suffix || !pilihan.value.B.suffix || pilihan.value.A.suffix !== pilihan.value.B.suffix
)

const valid = computed(() =>
  !!pilihan.value.A.suffix && !!pilihan.value.B.suffix &&
  akhiranBerbeda.value &&
  pilihan.value.A.words.length >= 2 && pilihan.value.B.words.length >= 2
)

async function lanjut() {
  if (!valid.value) return
  kotakRima.value = {
    rimaA: { suffix: pilihan.value.A.suffix, words: [...pilihan.value.A.words] },
    rimaB: { suffix: pilihan.value.B.suffix, words: [...pilihan.value.B.words] },
  }
  await navigateTo('/kotak/susun')
}
</script>
