<template>
  <div class="mb-6 flex items-center justify-between">
    <NuxtLink to="/limar/explain" class="btn-soft !px-4 !py-2 text-sm">← Menu Explain</NuxtLink>
    <span class="pill bg-violet-100 text-violet-700">Permainan 1 dari 5</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🧩 TTS Pantun</h1>
    <p class="page-sub">Lengkapi kotak teka-teki silang berdasarkan petunjuk yang tersedia. Klik kotak untuk memilih kata!</p>
  </div>

  <div class="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-start">
    <!-- Papan TTS -->
    <div class="card p-6">
      <div class="grid gap-1 mx-auto" :style="{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))`, maxWidth: '340px' }">
        <template v-for="r in ROWS" :key="r">
          <div v-for="c in COLS" :key="c" class="aspect-square">
            <div v-if="cell(r - 1, c - 1)" class="relative w-full h-full">
              <span v-if="cell(r - 1, c - 1)!.nomor"
                class="absolute top-0 left-0.5 text-[10px] font-extrabold text-violet-600 z-10">{{ cell(r - 1, c - 1)!.nomor }}</span>
              <input :value="isian[absKey(r - 1, c - 1)] || ''"
                @input="onInput(r - 1, c - 1, ($event.target as HTMLInputElement).value)"
                @focus="pilihSel(r - 1, c - 1)"
                maxlength="1"
                :class="kelasSel(r - 1, c - 1)"
                class="w-full h-full text-center font-display font-extrabold text-lg md:text-xl uppercase rounded-lg border-2 focus:outline-none transition" />
            </div>
            <div v-else class="w-full h-full"></div>
          </div>
        </template>
      </div>
      <div class="flex justify-center gap-3 mt-5">
        <button class="btn-primary" :disabled="!bisaPeriksa" @click="periksa">🔍 Periksa Jawaban</button>
        <button class="btn-soft" @click="ulangi">🔄 Ulangi</button>
      </div>
      <div v-if="hasil" class="mt-4 text-center">
        <p class="font-display text-xl font-extrabold" :class="hasil.benar ? 'text-emerald-600' : 'text-amber-600'">
          {{ hasil.pesan }}
        </p>
      </div>
    </div>

    <!-- Petunjuk -->
    <div class="space-y-4">
      <div class="card p-5">
        <p class="font-display font-bold text-slate-700 mb-3">📋 Petunjuk</p>
        <div class="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-extrabold text-sky-600 mb-1.5">Mendatar</p>
            <ul class="space-y-1.5 font-semibold text-slate-600">
              <li v-for="w in mendatar" :key="w.nomor"
                class="cursor-pointer rounded-lg px-2 py-1 transition"
                :class="kataAktif === w ? 'bg-sky-100' : 'hover:bg-slate-50'"
                @click="kataAktif = w">
                <b>{{ w.nomor }}.</b> {{ w.petunjuk }}
                <span v-if="kataBenar(w)" class="text-emerald-500">✓</span>
              </li>
            </ul>
          </div>
          <div>
            <p class="font-extrabold text-rose-600 mb-1.5">Menurun</p>
            <ul class="space-y-1.5 font-semibold text-slate-600">
              <li v-for="w in menurun" :key="w.nomor"
                class="cursor-pointer rounded-lg px-2 py-1 transition"
                :class="kataAktif === w ? 'bg-rose-100' : 'hover:bg-slate-50'"
                @click="kataAktif = w">
                <b>{{ w.nomor }}.</b> {{ w.petunjuk }}
                <span v-if="kataBenar(w)" class="text-emerald-500">✓</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <details class="card p-5">
        <summary class="font-display font-bold text-slate-700 cursor-pointer">🔑 Kunci Jawaban dan Pembahasan</summary>
        <ul class="text-sm font-semibold text-slate-600 mt-3 space-y-1.5">
          <li><b>1. Isi</b> — bagian pantun yang memuat pesan atau maksud.</li>
          <li><b>2. Sampiran</b> — bagian awal pantun yang mengantarkan isi.</li>
          <li><b>3. Rima</b> — kesamaan bunyi pada akhir baris pantun.</li>
          <li><b>4. Pantun</b> — salah satu bentuk puisi rakyat.</li>
        </ul>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ttsWords, type TtsWord } from '~/data/konten'

definePageMeta({ layout: 'app', middleware: 'auth' })

// Grid: baris 0-7, kolom 2-5 → tampilkan sebagai 8 baris x 4 kolom
const ROWS = 8, COLS = 4, COL_OFFSET = 2

interface Sel { jawaban: string; nomor?: number; kata: TtsWord[] }

const peta = new Map<string, Sel>()
for (const w of ttsWords) {
  for (let i = 0; i < w.kata.length; i++) {
    const r = w.baris + (w.arah === 'menurun' ? i : 0)
    const c = w.kolom + (w.arah === 'mendatar' ? i : 0)
    const k = `${r},${c}`
    const s = peta.get(k) ?? { jawaban: w.kata[i], kata: [] }
    s.kata.push(w)
    if (i === 0) s.nomor = w.nomor
    peta.set(k, s)
  }
}

const key = (r: number, ck: number) => `${r},${ck + COL_OFFSET}`
const cell = (r: number, ck: number) => peta.get(key(r, ck)) ?? null
const absKey = (r: number, ck: number) => key(r, ck)

const isian = ref<Record<string, string>>({})
const kataAktif = ref<TtsWord | null>(ttsWords[0])
const hasil = ref<{ benar: boolean; pesan: string } | null>(null)

function onInput(r: number, ck: number, v: string) {
  const huruf = v.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 1)
  isian.value[absKey(r, ck)] = huruf
  hasil.value = null
}

function pilihSel(r: number, ck: number) {
  const s = cell(r, ck)
  if (!s) return
  if (s.kata.length === 1) kataAktif.value = s.kata[0]
  else {
    // toggle arah bila sel milik dua kata
    const idx = s.kata.indexOf(kataAktif.value!)
    kataAktif.value = s.kata[(idx + 1) % s.kata.length]
  }
}

function dalamKataAktif(r: number, ck: number) {
  if (!kataAktif.value) return false
  const w = kataAktif.value
  for (let i = 0; i < w.kata.length; i++) {
    const rr = w.baris + (w.arah === 'menurun' ? i : 0)
    const cc = w.kolom + (w.arah === 'mendatar' ? i : 0)
    if (rr === r && cc === ck + COL_OFFSET) return true
  }
  return false
}

function kelasSel(r: number, ck: number) {
  const k = absKey(r, ck)
  const benar = isian.value[k] && isian.value[k] === cell(r, ck)!.jawaban
  if (hasil.value && isian.value[k]) return benar ? 'border-emerald-400 bg-emerald-50' : 'border-rose-300 bg-rose-50'
  if (dalamKataAktif(r, ck)) return 'border-violet-400 bg-violet-50'
  return 'border-slate-200 bg-white'
}

const semuaSel = computed(() => [...peta.keys()])
const bisaPeriksa = computed(() => semuaSel.value.every(k => isian.value[k]))

function kataBenar(w: TtsWord) {
  for (let i = 0; i < w.kata.length; i++) {
    const r = w.baris + (w.arah === 'menurun' ? i : 0)
    const c = w.kolom + (w.arah === 'mendatar' ? i : 0)
    if (isian.value[`${r},${c}`] !== w.kata[i]) return false
  }
  return true
}

const sfx = useSound()

function periksa() {
  const benar = ttsWords.filter(kataBenar).length
  hasil.value = benar === ttsWords.length
    ? { benar: true, pesan: `🎉 Sempurna! Semua ${ttsWords.length} kata benar!` }
    : { benar: false, pesan: `💪 ${benar} dari ${ttsWords.length} kata benar. Coba lagi!` }
  hasil.value.benar ? sfx.success() : sfx.error()
}

function ulangi() {
  isian.value = {}
  hasil.value = null
}

const mendatar = computed(() => ttsWords.filter(w => w.arah === 'mendatar').sort((a, b) => a.nomor - b.nomor))
const menurun = computed(() => ttsWords.filter(w => w.arah === 'menurun').sort((a, b) => a.nomor - b.nomor))
</script>
