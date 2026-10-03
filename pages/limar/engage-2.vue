<template>
  <div class="mb-6">
    <span class="pill bg-emerald-100 text-emerald-700">ENGAGE — Kenali Fenomena</span>
    <span class="float-right pill bg-amber-100 text-amber-700">2 dari 2</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🧩 Pasangkan dengan Tepat!</h1>
    <p class="page-sub">Amati dua fenomena berikut. Cocokkan setiap fenomena dengan pesan dan pantun yang sesuai.</p>
  </div>

  <div class="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto items-start">
    <!-- Fenomena -->
    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">A. Gambar Fenomena</p>
      <div v-for="fen in game.fenomena" :key="fen.id" class="bg-amber-50 rounded-2xl p-4 mb-3 text-center">
        <div class="text-5xl mb-1">{{ fen.icon }}</div>
        <p class="font-bold text-sm text-slate-700">Fenomena {{ fen.id }}: {{ fen.label }}</p>
      </div>
    </div>

    <!-- Pesan -->
    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">B. Pilihan Pesan</p>
      <div v-for="fen in game.fenomena" :key="fen.id" class="mb-4">
        <p class="text-xs font-bold text-slate-500 mb-1.5">Pesan untuk Fenomena {{ fen.id }}:</p>
        <div class="space-y-2">
          <label v-for="p in game.pesanOptions" :key="p.id"
            class="flex items-start gap-2 bg-slate-50 border-2 rounded-xl px-3 py-2 text-sm font-semibold cursor-pointer transition"
            :class="pesanJawaban[fen.id] === p.id ? 'border-emerald-400 bg-emerald-50' : 'border-slate-100'">
            <input type="radio" :name="'pesan-' + fen.id" :value="p.id" v-model="pesanJawaban[fen.id]"
              class="mt-1 accent-emerald-500" :disabled="sudahPeriksa" />
            {{ p.teks }}
          </label>
        </div>
      </div>
    </div>

    <!-- Pantun -->
    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">C. Pilihan Pantun</p>
      <div v-for="fen in game.fenomena" :key="fen.id" class="mb-4">
        <p class="text-xs font-bold text-slate-500 mb-1.5">Pantun untuk Fenomena {{ fen.id }}:</p>
        <div class="space-y-2">
          <label v-for="t in game.pantunOptions" :key="t.id"
            class="block bg-slate-50 border-2 rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition"
            :class="pantunJawaban[fen.id] === t.id ? 'border-emerald-400 bg-emerald-50' : 'border-slate-100'">
            <span class="flex items-start gap-2">
              <input type="radio" :name="'pantun-' + fen.id" :value="t.id" v-model="pantunJawaban[fen.id]"
                class="mt-1 accent-emerald-500" :disabled="sudahPeriksa" />
              <span class="italic">{{ t.baris.join(' ') }}</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>

  <div class="text-center mt-6">
    <button v-if="!sudahPeriksa" class="btn-primary text-lg" :disabled="!lengkap" @click="periksa">
      🔍 Periksa Jawaban
    </button>
    <div v-else class="max-w-2xl mx-auto">
      <div class="card p-6" :class="semuaBenar ? 'bg-emerald-50' : 'bg-amber-50'">
        <p class="font-display text-2xl font-extrabold" :class="semuaBenar ? 'text-emerald-600' : 'text-amber-600'">
          {{ semuaBenar ? '🎉 Hebat! Semua benar!' : '💪 Belum tepat semua, cek kunci jawabannya!' }}
        </p>
        <p class="font-bold text-slate-600 mt-1">Skor: {{ skor }} / 4</p>
      </div>
      <div class="card mt-4 p-5 text-left">
        <p class="font-display font-bold text-slate-700 mb-2">🔑 Kunci Jawaban dan Pembahasan</p>
        <ul class="text-sm font-semibold text-slate-600 space-y-1.5">
          <li>✅ Fenomena A (kelas kotor) → pesan: "{{ pesanBenar('A') }}"</li>
          <li>✅ Fenomena B (membantu teman) → pesan: "{{ pesanBenar('B') }}"</li>
          <li>✅ Pantun Fenomena A: pantun tentang kebersihan kelas.</li>
          <li>✅ Pantun Fenomena B: pantun tentang menolong teman dengan tulus.</li>
        </ul>
      </div>
      <button class="btn-soft mt-4" @click="ulangi">🔄 Ulangi</button>
    </div>
  </div>

  <div class="text-center mt-8 flex justify-center gap-3">
    <NuxtLink to="/limar/engage-1" class="btn-soft">← Sebelumnya</NuxtLink>
    <NuxtLink to="/limar/explore-fenomena" class="btn-primary text-lg">Lanjutkan →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { matchingGame } from '~/data/konten'

definePageMeta({ layout: 'app', middleware: 'auth' })

const game = matchingGame
const pesanJawaban = ref<Record<string, string>>({ A: '', B: '' })
const pantunJawaban = ref<Record<string, string>>({ A: '', B: '' })
const sudahPeriksa = ref(false)
const skor = ref(0)

const lengkap = computed(() =>
  pesanJawaban.value.A && pesanJawaban.value.B && pantunJawaban.value.A && pantunJawaban.value.B
)

function pesanBenar(fenId: string) {
  return game.pesanOptions.find(p => p.cocokUntuk === fenId)?.teks ?? ''
}

const semuaBenar = computed(() => skor.value === 4)

function periksa() {
  let s = 0
  for (const fen of game.fenomena) {
    const p = game.pesanOptions.find(x => x.id === pesanJawaban.value[fen.id])
    if (p && p.cocokUntuk === fen.id) s++
    const t = game.pantunOptions.find(x => x.id === pantunJawaban.value[fen.id])
    if (t && t.cocokUntuk === fen.id) s++
  }
  skor.value = s
  sudahPeriksa.value = true
}

function ulangi() {
  pesanJawaban.value = { A: '', B: '' }
  pantunJawaban.value = { A: '', B: '' }
  sudahPeriksa.value = false
  skor.value = 0
}
</script>
