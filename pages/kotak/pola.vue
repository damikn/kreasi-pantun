<template>
  <StepBar :steps="['Fenomena', 'Pola', 'Rima', 'Susun Pantun']" :current="1" />

  <div class="text-center mb-6">
    <h1 class="page-title">🎡 Tentukan Pola</h1>
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
              :style="{ transform: `rotate(${i * 45 + 22.5}deg)` }">
              <span class="absolute top-3 left-1/2 -translate-x-1/2 font-display font-extrabold text-white text-sm md:text-base"
                style="text-shadow: 0 1px 4px rgba(0,0,0,.45)">Pola {{ s }}</span>
            </div>
          </div>
          <button @click="spin" :disabled="berputar"
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
        <p class="pill bg-amber-200 text-amber-800 mb-3">🎴 Kartu Pola Nomor {{ hasilPola.nomor }}</p>
        <h2 class="font-display text-2xl font-extrabold text-slate-800 mb-3">{{ hasilPola.nama }}</h2>
        <div class="space-y-2 text-sm font-semibold text-slate-600">
          <p><span class="text-sky-700 font-bold">Pola sampiran:</span> {{ hasilPola.deskripsiSampiran }}</p>
          <p><span class="text-emerald-700 font-bold">Pola isi:</span> {{ hasilPola.deskripsiIsi }}</p>
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
    <p class="font-display font-bold text-lg">Pola {{ hasilPola.nomor }} — {{ hasilPola.nama }}</p>
  </div>

  <div class="text-center mt-8 flex justify-center gap-3">
    <NuxtLink to="/kotak/fenomena" class="btn-soft">← Sebelumnya</NuxtLink>
    <button class="btn-primary text-lg" :disabled="!hasilPola" @click="lanjut">Selanjutnya →</button>
  </div>
</template>

<script setup lang="ts">
import { daftarPola, type Pola } from '~/data/konten'

definePageMeta({ layout: 'app', middleware: 'auth' })

const { kotakFenomena, kotakPola } = useSession()
const sfx = useSound()

// 8 segmen roda (nomor pola), seperti pada mockup
const segments = [1, 2, 3, 4, 5, 3, 2, 4]
const segColors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a78bfa', '#f472b6', '#2dd4bf']
const wheelBg = computed(() =>
  `conic-gradient(${segColors.map((c, i) => `${c} ${i * 45}deg ${(i + 1) * 45}deg`).join(', ')})`
)

const rotation = ref(0)
const berputar = ref(false)
const hasilPola = ref<Pola | null>(kotakPola.value)

if (!kotakFenomena.value) {
  await navigateTo('/kotak/fenomena')
}

function spin() {
  if (berputar.value) return
  berputar.value = true
  hasilPola.value = null
  const idx = Math.floor(Math.random() * segments.length)
  const target = (360 - (idx * 45 + 22.5) + 360) % 360
  const current = ((rotation.value % 360) + 360) % 360
  const delta = (target - current + 360) % 360
  rotation.value += 360 * 5 + delta
  // Bunyi tick berulang selama roda berputar
  const tickTimer = setInterval(() => sfx.tick(), 140)
  setTimeout(() => {
    clearInterval(tickTimer)
    berputar.value = false
    hasilPola.value = daftarPola.find(p => p.nomor === segments[idx]) ?? null
    sfx.win()
  }, 4200)
}

async function lanjut() {
  if (!hasilPola.value) return
  kotakPola.value = hasilPola.value
  await navigateTo('/kotak/rima')
}
</script>
