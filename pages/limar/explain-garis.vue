<template>
  <div class="mb-6 flex items-center justify-between">
    <NuxtLink to="/limar/explain" class="btn-soft !px-4 !py-2 text-sm">← Menu Explain</NuxtLink>
    <span class="pill bg-violet-100 text-violet-700">Permainan 3 dari 5</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🔗 Tarik Garis Sampiran dan Isi</h1>
    <p class="page-sub">Hubungkan setiap baris pantun dengan kategori yang tepat: Sampiran atau Isi.</p>
  </div>

  <div class="max-w-2xl mx-auto card p-6">
    <div class="space-y-3">
      <div v-for="(b, i) in baris" :key="i"
        class="flex flex-col sm:flex-row sm:items-center gap-2 rounded-2xl p-3 border-2 transition"
        :class="hasil
          ? (jawaban[i] === kunci[i] ? 'border-emerald-300 bg-emerald-50' : 'border-rose-300 bg-rose-50')
          : 'border-slate-100 bg-slate-50'">
        <p class="flex-1 font-bold text-sm text-slate-700">{{ b }}</p>
        <div class="flex gap-2">
          <button @click="setJawaban(i, 'sampiran')"
            class="pill !py-2 !px-4 border-2 transition"
            :class="jawaban[i] === 'sampiran' ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-sky-700 border-sky-200'">
            Sampiran
          </button>
          <button @click="setJawaban(i, 'isi')"
            class="pill !py-2 !px-4 border-2 transition"
            :class="jawaban[i] === 'isi' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-emerald-700 border-emerald-200'">
            Isi
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-center gap-3 mt-5">
      <button class="btn-primary" :disabled="!lengkap" @click="periksa">🔍 Periksa Jawaban</button>
      <button class="btn-soft" @click="ulangi">🔄 Ulangi</button>
    </div>

    <div v-if="hasil" class="mt-4">
      <div class="rounded-2xl p-4 text-center" :class="hasil.benar ? 'bg-emerald-100' : 'bg-amber-100'">
        <p class="font-display text-xl font-extrabold" :class="hasil.benar ? 'text-emerald-700' : 'text-amber-700'">
          {{ hasil.pesan }}
        </p>
      </div>
      <div class="bg-sky-50 rounded-2xl p-4 mt-3 text-sm font-semibold text-slate-600">
        <p class="font-display font-bold text-slate-700 mb-1">🔑 Kunci Jawaban dan Pembahasan</p>
        <p><b>Jawaban:</b> Baris 1 dan 2 = Sampiran; Baris 3 dan 4 = Isi.</p>
        <p class="mt-1"><b>Pembahasan:</b> Sampiran berfungsi menggambarkan suasana, sedangkan isi menyampaikan pesan atau maksud pantun.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { pantunContoh } from '~/data/konten'

definePageMeta({ layout: 'app', middleware: 'auth' })

const baris = pantunContoh
const kunci = ['sampiran', 'sampiran', 'isi', 'isi']
const jawaban = ref<string[]>(['', '', '', ''])
const hasil = ref<{ benar: boolean; pesan: string } | null>(null)

const lengkap = computed(() => jawaban.value.every(j => j))

function setJawaban(i: number, v: string) {
  jawaban.value[i] = v
  hasil.value = null
}

function periksa() {
  const benarCount = jawaban.value.filter((j, i) => j === kunci[i]).length
  hasil.value = benarCount === 4
    ? { benar: true, pesan: '🎉 Sempurna! Kamu paham sampiran dan isi!' }
    : { benar: false, pesan: `💪 ${benarCount} dari 4 benar. Coba perhatikan lagi!` }
}

function ulangi() {
  jawaban.value = ['', '', '', '']
  hasil.value = null
}
</script>
