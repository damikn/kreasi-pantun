<template>
  <div class="mb-6 flex items-center justify-between">
    <NuxtLink to="/limar/explain" class="btn-soft !px-4 !py-2 text-sm">← Menu Explain</NuxtLink>
    <span class="pill bg-violet-100 text-violet-700">Permainan 2 dari 5</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🔀 Bongkar Susun Pantun</h1>
    <p class="page-sub">Susun empat baris berikut menjadi pantun yang utuh! Klik baris di kotak kiri untuk memindahkannya ke kanan.</p>
  </div>

  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">🧩 Baris Pantun (acak)</p>
      <div class="space-y-2 min-h-[120px]">
        <button v-for="(b, i) in acak" :key="b + i" @click="pindahKeKanan(i)"
          class="w-full text-left rounded-xl px-4 py-3 font-bold text-sm transition hover:scale-[1.01]"
          :class="warnaAcak[i % warnaAcak.length]">
          <span class="opacity-60 mr-2">⋮⋮</span>{{ b }}
        </button>
        <p v-if="!acak.length" class="text-center text-slate-400 font-semibold py-6">Semua baris sudah dipindah ➡️</p>
      </div>
    </div>

    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">📜 Urutan yang Benar</p>
      <div class="space-y-2 min-h-[120px]">
        <button v-for="(b, i) in urutan" :key="b + i" @click="pindahKeKiri(i)"
          class="w-full text-left rounded-xl px-4 py-3 font-bold text-sm bg-emerald-50 border-2 border-emerald-200 transition hover:scale-[1.01]">
          <span class="pill bg-emerald-500 text-white mr-2">{{ i + 1 }}</span>{{ b }}
        </button>
        <div v-for="i in 4 - urutan.length" :key="'kosong' + i"
          class="rounded-xl px-4 py-3 border-2 border-dashed border-slate-200 text-slate-300 text-sm font-bold">
          Tarik baris ke sini
        </div>
      </div>
    </div>
  </div>

  <div class="text-center mt-6">
    <div class="flex justify-center gap-3">
      <button class="btn-primary" :disabled="urutan.length !== 4" @click="periksa">🔍 Periksa Jawaban</button>
      <button class="btn-soft" @click="ulangi">🔄 Ulangi</button>
    </div>
    <div v-if="hasil" class="max-w-2xl mx-auto mt-4">
      <div class="card p-5" :class="hasil.benar ? 'bg-emerald-50' : 'bg-amber-50'">
        <p class="font-display text-xl font-extrabold" :class="hasil.benar ? 'text-emerald-600' : 'text-amber-600'">
          {{ hasil.pesan }}
        </p>
      </div>
      <details class="card mt-3 p-5 text-left">
        <summary class="font-display font-bold text-slate-700 cursor-pointer">🔑 Kunci Jawaban dan Pembahasan</summary>
        <ol class="text-sm font-semibold text-slate-600 mt-3 space-y-1 list-decimal list-inside">
          <li v-for="(b, i) in benar" :key="i">{{ b }}</li>
        </ol>
        <p class="text-sm font-semibold text-slate-600 mt-3">
          <b>Pembahasan:</b> Baris 1–2 = Sampiran, baris 3–4 = Isi.
          Sampiran berfungsi mengantarkan isi dan menggambarkan suasana.
        </p>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { pantunContoh } from '~/data/konten'

definePageMeta({ layout: 'app', middleware: 'auth' })

const benar = pantunContoh
const warnaAcak = ['bg-rose-100 text-rose-800', 'bg-amber-100 text-amber-800', 'bg-emerald-100 text-emerald-800', 'bg-sky-100 text-sky-800']

const acak = ref<string[]>([])
const urutan = ref<string[]>([])
const hasil = ref<{ benar: boolean; pesan: string } | null>(null)

function acakBaru() {
  const arr = [...benar]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  // pastikan tidak langsung benar secara kebetulan
  if (arr.every((b, i) => b === benar[i])) return acakBaru()
  acak.value = arr
}
acakBaru()

function pindahKeKanan(i: number) {
  urutan.value.push(acak.value[i])
  acak.value.splice(i, 1)
  hasil.value = null
}

function pindahKeKiri(i: number) {
  acak.value.push(urutan.value[i])
  urutan.value.splice(i, 1)
  hasil.value = null
}

function periksa() {
  const ok = urutan.value.every((b, i) => b === benar[i])
  hasil.value = ok
    ? { benar: true, pesan: '🎉 Hebat! Susunan pantunmu benar!' }
    : { benar: false, pesan: '💪 Belum tepat. Ingat: 2 baris pertama sampiran, 2 baris terakhir isi!' }
}

function ulangi() {
  urutan.value = []
  hasil.value = null
  acakBaru()
}
</script>
