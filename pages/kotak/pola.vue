<template>
  <StepBar :steps="stepLabels" :current="1" />

  <div class="text-center mb-6">
    <h1 class="page-title">🎡 Rangkai Pola</h1>
    <p class="page-sub">Putar roda untuk mendapatkan pola yang akan kamu gunakan.</p>
  </div>

  <div class="grid md:grid-cols-2 gap-6 items-start max-w-4xl mx-auto">
    <!-- Roda spin -->
    <div class="card p-6 flex flex-col items-center">
      <div class="relative">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div class="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-rose-500 drop-shadow"></div>
        </div>
        <div class="relative w-64 h-64 md:w-80 md:h-80">
          <div class="absolute inset-0 rounded-full shadow-xl border-8 border-amber-200 overflow-hidden transition-transform duration-[4000ms]"
            :style="{ transform: `rotate(${rotation}deg)`, background: wheelBg, transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.18, 1)' }">
            <div v-for="(s, i) in segments" :key="i" class="absolute inset-0"
              :style="{ transform: `rotate(${i * segDeg + segDeg / 2}deg)` }">
              <span class="absolute top-2 left-1/2 -translate-x-1/2 font-display font-extrabold text-white text-xs md:text-sm"
                style="text-shadow: 0 1px 4px rgba(0,0,0,.45)">{{ s }}</span>
            </div>
          </div>
          <button @click="spin" :disabled="berputar" data-no-sound
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full font-display font-extrabold text-white text-lg shadow-lg border-4 border-white disabled:opacity-70"
            style="background: linear-gradient(135deg,#f59e0b,#ef4444)">
            {{ berputar ? '...' : 'SPIN' }}
          </button>
        </div>
      </div>
      <p class="text-sm font-bold text-slate-400 mt-4">Klik SPIN untuk memutar roda 🎯</p>
    </div>

    <!-- Kartu pola -->
    <div>
      <div v-if="hasilPola" class="card p-6 bg-amber-50/70">
        <p class="pill bg-amber-200 text-amber-800 mb-3">🎴 Kartu Pola Nomor {{ hasilPola.id }}</p>
        <h2 class="font-display text-2xl font-extrabold text-slate-800 mb-3">{{ hasilPola.nama }}</h2>
        <div class="space-y-2 text-sm font-semibold text-slate-600">
          <p><span class="text-sky-700 font-bold">Pola sampiran:</span> {{ hasilPola.deskripsi_sampiran }}</p>
          <p><span class="text-emerald-700 font-bold">Pola isi:</span> {{ hasilPola.deskripsi_isi }}</p>
        </div>
        <div class="mt-3 bg-violet-50 border border-violet-200 rounded-2xl p-3">
          <p class="text-xs font-bold text-violet-600">ATURAN</p>
          <p class="text-sm font-bold text-violet-800">{{ hasilPola.aturan }}</p>
        </div>
        <div class="mt-4">
          <p class="font-bold text-slate-700 text-sm mb-2">Contoh:</p>
          <PantunCard :baris="hasilPola.contoh" />
        </div>
      </div>
      <div v-else class="card p-6 text-center text-slate-400 font-semibold">
        <div class="text-5xl mb-2">🎡</div>
        <p>Putar rodanya dulu untuk melihat<br />kartu polamu di sini!</p>
      </div>
    </div>
  </div>

  <div v-if="hasilPola" class="card mt-6 p-4 max-w-4xl mx-auto bg-emerald-50/70">
    <p class="text-sm font-bold text-emerald-700">Pola yang kamu dapatkan:</p>
    <p class="font-display font-bold text-lg">Pola {{ hasilPola.id }} — {{ hasilPola.nama }}</p>
  </div>

  <div class="text-center mt-8 flex justify-center gap-3">
    <NuxtLink to="/kotak/fenomena" class="btn-soft">← Sebelumnya</NuxtLink>
    <button class="btn-primary text-lg" :disabled="!hasilPola" @click="lanjut">Selanjutnya →</button>
  </div>
</template>

<script setup lang="ts">
import { kotakPolaList, stepLabels, type KotakPola } from '~/data/kotak'

definePageMeta({ layout: 'app', middleware: 'auth' })

const { kotakFenomena, kotakPola } = useSession()
const sfx = useSound()

// 12 segmen roda, satu per pola
const segments = kotakPolaList.map(p => p.id)
const segDeg = 360 / segments.length
const segColors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a78bfa', '#f472b6', '#2dd4bf', '#f97316', '#84cc16', '#22d3ee', '#e879f9']
const wheelBg = computed(() =>
  `conic-gradient(${segColors.map((c, i) => `${c} ${i * segDeg}deg ${(i + 1) * segDeg}deg`).join(', ')})`
)

const rotation = ref(0)
const berputar = ref(false)
const hasilPola = ref<KotakPola | null>(kotakPola.value)

if (!kotakFenomena.value) {
  await navigateTo('/kotak/fenomena')
}

function spin() {
  if (berputar.value) return
  berputar.value = true
  hasilPola.value = null
  sfx.pop()
  const idx = Math.floor(Math.random() * segments.length)
  const target = (360 - (idx * segDeg + segDeg / 2) + 360) % 360
  const current = ((rotation.value % 360) + 360) % 360
  const delta = (target - current + 360) % 360
  rotation.value += 360 * 5 + delta
  // Bunyi tick berulang selama roda berputar
  const tickTimer = setInterval(() => sfx.tick(), 140)
  setTimeout(() => {
    clearInterval(tickTimer)
    berputar.value = false
    hasilPola.value = kotakPolaList.find(p => p.id === segments[idx]) ?? null
    sfx.win()
  }, 4200)
}

async function lanjut() {
  if (!hasilPola.value) return
  kotakPola.value = hasilPola.value
  await navigateTo('/kotak/rima')
}
</script>
