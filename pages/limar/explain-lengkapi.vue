<template>
  <div class="mb-6 flex items-center justify-between">
    <NuxtLink to="/limar/explain" class="btn-soft !px-4 !py-2 text-sm">← Menu Explain</NuxtLink>
    <span class="pill bg-violet-100 text-violet-700">Permainan 4 dari 5</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">✏️ Melengkapi Pantun</h1>
    <p class="page-sub">Pilih kata yang sesuai untuk melengkapi pantun. Klik bagian yang rumpang, lalu pilih katanya!</p>
  </div>

  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
    <div class="card p-6">
      <div class="bg-amber-50 rounded-2xl p-6 space-y-2">
        <p class="font-display text-xl font-semibold text-slate-700">Pergi ke taman memetik melati,</p>
        <p class="font-display text-xl font-semibold text-slate-700">Singgah sebentar membeli jamu.</p>
        <p class="font-display text-xl font-semibold text-slate-700">
          Jagalah kelas sepenuh
          <button @click="blankAktif = 0"
            class="inline-block min-w-[110px] rounded-xl px-3 py-0.5 font-extrabold border-b-4 transition"
            :class="[
              blankAktif === 0 ? 'border-violet-400 bg-violet-100' : 'border-amber-300 bg-white',
              hasil && jawaban[0] ? (jawaban[0] === kunci[0] ? '!border-emerald-400 !bg-emerald-100' : '!border-rose-400 !bg-rose-100') : ''
            ]">
            {{ jawaban[0] || '______' }}
          </button>,
        </p>
        <p class="font-display text-xl font-semibold text-slate-700">
          Agar nyaman menuntut
          <button @click="blankAktif = 1"
            class="inline-block min-w-[110px] rounded-xl px-3 py-0.5 font-extrabold border-b-4 transition"
            :class="[
              blankAktif === 1 ? 'border-violet-400 bg-violet-100' : 'border-amber-300 bg-white',
              hasil && jawaban[1] ? (jawaban[1] === kunci[1] ? '!border-emerald-400 !bg-emerald-100' : '!border-rose-400 !bg-rose-100') : ''
            ]">
            {{ jawaban[1] || '______' }}
          </button>.
        </p>
      </div>
      <div class="flex justify-center gap-3 mt-5">
        <button class="btn-primary" :disabled="!lengkap" @click="periksa">🔍 Periksa Jawaban</button>
        <button class="btn-soft" @click="ulangi">🔄 Ulangi</button>
      </div>
      <div v-if="hasil" class="mt-4 text-center">
        <p class="font-display text-xl font-extrabold" :class="hasil.benar ? 'text-emerald-600' : 'text-amber-600'">
          {{ hasil.pesan }}
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <div class="card p-5">
        <p class="font-display font-bold text-slate-700 mb-3">🎯 Pilihan Kata</p>
        <div class="flex flex-wrap gap-2">
          <button v-for="k in pilihan" :key="k" @click="pilihKata(k)"
            class="pill !text-base !px-5 !py-2.5 border-2 transition hover:scale-105"
            :class="jawaban.includes(k)
              ? 'bg-violet-500 text-white border-violet-500'
              : 'bg-white text-slate-700 border-violet-200'">
            {{ k }}
          </button>
        </div>
        <p class="text-xs font-bold text-slate-400 mt-3">Bagian rumpang aktif: <b class="text-violet-600">baris {{ blankAktif + 3 }}</b></p>
      </div>
      <div class="card p-5 bg-sky-50/60">
        <p class="font-display font-bold text-slate-700 mb-1">🔑 Kunci Jawaban dan Pembahasan</p>
        <p class="text-sm font-semibold text-slate-600"><b>Jawaban:</b> 1. hati, 2. ilmu.</p>
        <p class="text-sm font-semibold text-slate-600 mt-1"><b>Pembahasan:</b> Kata yang tepat harus sesuai makna dan memperhatikan rima (hati–melati, jamu–ilmu).</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const pilihan = ['hati', 'ilmu', 'pagi', 'buku']
const kunci = ['hati', 'ilmu']
const jawaban = ref<string[]>(['', ''])
const blankAktif = ref(0)
const hasil = ref<{ benar: boolean; pesan: string } | null>(null)

const lengkap = computed(() => jawaban.value.every(j => j))

function pilihKata(k: string) {
  // hapus dari posisi lain bila kata dipakai dua kali
  const lain = blankAktif.value === 0 ? 1 : 0
  if (jawaban.value[lain] === k) jawaban.value[lain] = ''
  jawaban.value[blankAktif.value] = k
  hasil.value = null
}

const sfx = useSound()

function periksa() {
  const ok = jawaban.value.every((j, i) => j === kunci[i])
  hasil.value = ok
    ? { benar: true, pesan: '🎉 Tepat sekali! Rima dan maknanya pas!' }
    : { benar: false, pesan: '💪 Belum tepat. Perhatikan rima akhir barisnya!' }
  ok ? sfx.success() : sfx.error()
}

function ulangi() {
  jawaban.value = ['', '']
  hasil.value = null
}
</script>
