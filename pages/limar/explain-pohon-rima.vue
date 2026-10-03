<template>
  <div class="mb-6 flex items-center justify-between">
    <NuxtLink to="/limar/explain" class="btn-soft !px-4 !py-2 text-sm">← Menu Explain</NuxtLink>
    <span class="pill bg-violet-100 text-violet-700">Permainan 5 dari 5</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🌳 Pohon Rima</h1>
    <p class="page-sub">Temukan kata yang memiliki bunyi akhir serupa dengan kata acuan!</p>
  </div>

  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
    <div class="card p-6 text-center relative overflow-hidden">
      <div class="grid grid-cols-2 gap-4 items-center">
        <div class="bg-emerald-50 rounded-2xl p-5">
          <p class="text-xs font-bold text-emerald-600 mb-1">KATA ACUAN</p>
          <p class="font-display text-3xl font-extrabold text-emerald-700">melati</p>
          <p class="text-2xl mt-1">🔊</p>
        </div>
        <div class="text-7xl">🌳</div>
      </div>
      <p class="font-bold text-slate-500 text-sm mt-4 mb-3">Klik kata di pohon yang berima sama dengan "melati":</p>
      <div class="flex flex-wrap justify-center gap-2">
        <button v-for="k in daftarKata" :key="k"
          @click="toggle(k)"
          class="pill !text-base !px-5 !py-2.5 border-2 transition hover:scale-105"
          :class="[
            dipilih.includes(k) ? 'bg-emerald-500 text-white border-emerald-500 shadow' : 'bg-amber-50 text-slate-700 border-amber-200',
            hasil && dipilih.includes(k) ? (benarList.includes(k) ? '!bg-emerald-500 !border-emerald-500' : '!bg-rose-400 !border-rose-400') : ''
          ]">
          {{ dipilih.includes(k) ? '✓ ' : '' }}{{ k }}
        </button>
      </div>
      <div class="flex justify-center gap-3 mt-6">
        <button class="btn-primary" :disabled="!dipilih.length" @click="periksa">🔍 Periksa Jawaban</button>
        <button class="btn-soft" @click="ulangi">🔄 Ulangi</button>
      </div>
      <div v-if="hasil" class="mt-4">
        <p class="font-display text-xl font-extrabold" :class="hasil.benar ? 'text-emerald-600' : 'text-amber-600'">
          {{ hasil.pesan }}
        </p>
      </div>
    </div>

    <div class="card p-5 bg-emerald-50/60">
      <p class="font-display font-bold text-slate-700 mb-2">🔑 Kunci Jawaban dan Pembahasan</p>
      <p class="text-sm font-semibold text-slate-600"><b>Kata yang memiliki bunyi akhir serupa:</b></p>
      <ul class="text-sm font-semibold text-slate-600 list-disc list-inside mt-1">
        <li>hati, melati</li>
        <li>jamu, melati → <i>bukan</i>, bunyi akhirnya berbeda</li>
      </ul>
      <p class="text-sm font-semibold text-slate-600 mt-2"><b>Pembahasan:</b> Kata-kata tersebut memiliki bunyi akhir yang sama, yaitu <b>-ati</b>.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const daftarKata = ['hati', 'buku', 'pagi', 'melati', 'jamu', 'awan']
const benarList = ['hati', 'melati']
const dipilih = ref<string[]>([])
const hasil = ref<{ benar: boolean; pesan: string } | null>(null)

function toggle(k: string) {
  const i = dipilih.value.indexOf(k)
  if (i >= 0) dipilih.value.splice(i, 1)
  else dipilih.value.push(k)
  hasil.value = null
}

function periksa() {
  const ok = dipilih.value.length === benarList.length &&
    benarList.every(k => dipilih.value.includes(k))
  const benarCount = dipilih.value.filter(k => benarList.includes(k)).length
  hasil.value = ok
    ? { benar: true, pesan: '🎉 Hebat! Kamu menemukan semua kata berima!' }
    : { benar: false, pesan: `💪 ${benarCount} kata tepat. Cari yang berakhiran "-ati"!` }
}

function ulangi() {
  dipilih.value = []
  hasil.value = null
}
</script>
