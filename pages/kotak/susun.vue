<template>
  <StepBar :steps="stepLabels" :current="3" />

  <div class="text-center mb-6">
    <h1 class="page-title">✍️ Ciptakan Pantun</h1>
    <p class="page-sub">Gunakan semua bahan yang sudah kamu dapatkan untuk membuat pantun!</p>
  </div>

  <div class="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
    <!-- Ringkasan bahan -->
    <div class="card p-5 space-y-3">
      <p class="font-display font-bold text-slate-700">🧺 Kumpulan Bahan</p>
      <div class="bg-amber-50 rounded-2xl p-3">
        <p class="text-xs font-bold text-amber-600">FENOMENA</p>
        <p class="font-bold text-sm text-slate-700">{{ kotakFenomena?.icon }} {{ kotakFenomena?.name }}</p>
      </div>
      <div class="bg-rose-50 rounded-2xl p-3">
        <p class="text-xs font-bold text-rose-600">POLA {{ kotakPola?.id }}</p>
        <p class="font-bold text-sm text-slate-700">{{ kotakPola?.nama }}</p>
        <p class="text-xs font-semibold text-slate-500 mt-1">📏 {{ kotakPola?.aturan }}</p>
      </div>
      <div class="bg-sky-50 rounded-2xl p-3">
        <p class="text-xs font-bold text-sky-600">RIMA A (baris 1 & 3)</p>
        <p class="font-bold text-sm text-slate-700">{{ kotakRima.rimaA.suffix }} → {{ kotakRima.rimaA.words.join(', ') }}</p>
      </div>
      <div class="bg-emerald-50 rounded-2xl p-3">
        <p class="text-xs font-bold text-emerald-600">RIMA B (baris 2 & 4)</p>
        <p class="font-bold text-sm text-slate-700">{{ kotakRima.rimaB.suffix }} → {{ kotakRima.rimaB.words.join(', ') }}</p>
      </div>
    </div>

    <!-- Form pantun -->
    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">✏️ Tulis pantunmu di sini!</p>
      <div class="space-y-3">
        <div v-for="i in 4" :key="i">
          <label class="text-xs font-bold" :class="i <= 2 ? 'text-sky-600' : 'text-emerald-600'">
            Baris {{ i }} {{ i <= 2 ? '(sampiran)' : '(isi)' }}
            <span class="text-slate-400 font-semibold">· {{ sukuKata[i-1] }} suku kata</span>
          </label>
          <textarea v-model="baris[i - 1]" rows="2" class="input-cute !py-2.5 resize-none"
            :placeholder="`Tulis baris ${i}...`" maxlength="160" />
        </div>
      </div>
      <p class="text-right text-xs font-bold text-slate-400 mt-2">{{ terisi }}/4 baris</p>
    </div>

    <!-- Penilaian otomatis -->
    <div class="card p-5">
      <div class="flex items-center justify-between mb-3">
        <p class="font-display font-bold text-slate-700">🤖 Penilaian Otomatis</p>
        <span class="pill text-base font-extrabold"
          :class="hasil.score >= 80 ? 'bg-emerald-100 text-emerald-700' : hasil.score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'">
          {{ hasil.score }}
        </span>
      </div>
      <div class="space-y-2.5">
        <div v-for="c in hasil.checks" :key="c.key" class="flex items-start gap-2 text-sm">
          <span class="text-lg leading-none mt-0.5">{{ c.passed ? '✅' : '⬜' }}</span>
          <div>
            <p class="font-bold" :class="c.passed ? 'text-emerald-700' : 'text-slate-600'">{{ c.label }}</p>
            <p class="text-xs font-semibold text-slate-400">{{ c.detail }}</p>
          </div>
        </div>
      </div>

      <div v-if="hasil.polaRule" class="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-3">
        <p class="text-xs font-bold text-amber-600">💡 SARAN PERBAIKAN</p>
        <p class="text-sm font-bold text-amber-800 mt-1">{{ hasil.polaRule.message }}</p>
        <p class="text-sm font-semibold text-amber-700 mt-1">→ {{ hasil.polaRule.action }}</p>
      </div>

      <button class="btn-primary w-full mt-5" :disabled="!hasil.allFilled || menyimpan" @click="simpan">
        {{ menyimpan ? 'Menyimpan...' : '💾 Simpan Karya' }}
      </button>
      <p v-if="error" class="text-rose-500 text-sm font-bold mt-2">{{ error }}</p>
      <p class="text-xs text-slate-400 font-semibold mt-3 text-center italic">
        "Setiap kata adalah langkah kecil menuju perubahan besar. Teruslah berkarya!" 💪
      </p>
    </div>
  </div>

  <div class="text-center mt-8">
    <NuxtLink to="/kotak/rima" class="btn-soft">← Sebelumnya</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { stepLabels } from '~/data/kotak'
import { validatePantun } from '~/utils/validatePantun'

definePageMeta({ layout: 'app', middleware: 'auth' })

const { namaLengkap, siswaId, kotakFenomena, kotakPola, kotakRima, karyaTerakhir } = useSession()
const supabase = useSupabase()
const sfx = useSound()
const sync = useSync()

if (!kotakFenomena.value || !kotakPola.value || !kotakRima.value.rimaA.suffix || !kotakRima.value.rimaB.suffix) {
  await navigateTo('/kotak/fenomena')
}

const baris = ref<string[]>(['', '', '', ''])
const menyimpan = ref(false)
const error = ref('')

const hasil = computed(() => validatePantun({
  lines: baris.value,
  rima: kotakRima.value,
  pola: kotakPola.value ? { nama: kotakPola.value.nama, ruleType: kotakPola.value.ruleType } : null,
}))
const sukuKata = computed(() => hasil.value.syllables)
const terisi = computed(() => baris.value.filter(b => b.trim()).length)

async function simpan() {
  if (!hasil.value.allFilled || menyimpan.value) return
  menyimpan.value = true
  error.value = ''
  const rimaGabung = [...kotakRima.value.rimaA.words, ...kotakRima.value.rimaB.words]
  const basePayload = {
    // siswa_id boleh berupa tempId 'lokal-…' — tulisTertunda mengantrekan
    // dan me-remap ke id asli saat sinkronisasi.
    siswa_id: siswaId.value || null,
    app: 'kotak',
    fenomena_id: kotakFenomena.value!.id,
    pola_id: kotakPola.value!.id,
    baris1: baris.value[0].trim(),
    baris2: baris.value[1].trim(),
    baris3: baris.value[2].trim(),
    baris4: baris.value[3].trim(),
    rima_dipilih: rimaGabung,
  }
  let id = 'lokal-' + Date.now().toString(36)
  if (supabase) {
    // Coba simpan beserta skor; fallback tanpa skor bila kolom belum ada (DB lama).
    // Bila offline/gagal jaringan → diantrekan dan terkirim otomatis saat online.
    let res = await sync.tulisTertunda('karya', 'insert', { ...basePayload, skor: hasil.value.score })
    if (!res.ok && !res.queued && /skor/i.test(res.error ?? '')) {
      res = await sync.tulisTertunda('karya', 'insert', basePayload)
    }
    if (res.ok && res.id) {
      id = res.id
    } else if (!res.ok && !res.queued) {
      console.error(res.error)
      error.value = 'Gagal menyimpan ke database, tapi karyamu tetap ditampilkan.'
    }
  }
  karyaTerakhir.value = {
    id,
    nama: namaLengkap.value,
    app: 'kotak',
    fenomena: kotakFenomena.value!.name,
    fenomenaIcon: kotakFenomena.value!.icon,
    pola: `Pola ${kotakPola.value!.id} — ${kotakPola.value!.nama}`,
    rimaA: { ...kotakRima.value.rimaA },
    rimaB: { ...kotakRima.value.rimaB },
    rima: rimaGabung,
    baris: baris.value.map(b => b.trim()),
    skor: hasil.value.score,
    checks: hasil.value.checks,
    tanggal: new Date(),
  }
  if (hasil.value.score >= 60) sfx.success()
  else sfx.pop()
  await navigateTo('/kotak/hasil')
}
</script>
