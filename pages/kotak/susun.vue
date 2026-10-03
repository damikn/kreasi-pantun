<template>
  <StepBar :steps="['Fenomena', 'Pola', 'Rima', 'Susun Pantun']" :current="3" />

  <div class="text-center mb-6">
    <h1 class="page-title">✍️ Susun Pantun</h1>
    <p class="page-sub">Gunakan semua bahan yang sudah kamu dapatkan untuk membuat pantun!</p>
  </div>

  <div class="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
    <!-- Ringkasan bahan -->
    <div class="card p-5 space-y-3">
      <p class="font-display font-bold text-slate-700">🧺 Kumpulan Bahan</p>
      <div class="bg-amber-50 rounded-2xl p-3">
        <p class="text-xs font-bold text-amber-600">FENOMENA</p>
        <p class="font-bold text-sm text-slate-700">{{ kotakFenomena?.icon }} {{ kotakFenomena?.nama }}</p>
      </div>
      <div class="bg-rose-50 rounded-2xl p-3">
        <p class="text-xs font-bold text-rose-600">POLA</p>
        <p class="font-bold text-sm text-slate-700">Pola {{ kotakPola?.nomor }} — {{ kotakPola?.nama }}</p>
        <p class="text-xs font-semibold text-slate-500 mt-1">{{ kotakPola?.deskripsiSampiran }} {{ kotakPola?.deskripsiIsi }}</p>
      </div>
      <div class="bg-emerald-50 rounded-2xl p-3">
        <p class="text-xs font-bold text-emerald-600">KATA RIMA</p>
        <p class="font-bold text-sm text-slate-700">{{ kotakRima.join(', ') }}</p>
      </div>
    </div>

    <!-- Form pantun -->
    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">✏️ Tulis pantunmu di sini!</p>
      <div class="space-y-3">
        <div v-for="i in 4" :key="i">
          <label class="text-xs font-bold" :class="i <= 2 ? 'text-sky-600' : 'text-emerald-600'">
            Baris {{ i }} {{ i <= 2 ? '(sampiran)' : '(isi)' }}
          </label>
          <input v-model="baris[i - 1]" class="input-cute !py-2.5" :placeholder="`Tulis baris ${i}...`" maxlength="120" />
        </div>
      </div>
      <p class="text-right text-xs font-bold text-slate-400 mt-2">{{ terisi }}/4 baris</p>
    </div>

    <!-- Checklist -->
    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">✅ Checklist Kesesuaian</p>
      <div class="space-y-2.5">
        <label v-for="(c, i) in checklist" :key="i"
          class="flex items-start gap-2 text-sm font-semibold text-slate-600 cursor-pointer">
          <input type="checkbox" v-model="c.cek" class="w-5 h-5 mt-0.5 accent-emerald-500 shrink-0" />
          {{ c.teks }}
        </label>
      </div>
      <button class="btn-primary w-full mt-5" :disabled="!bisaSimpan || menyimpan" @click="simpan">
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
definePageMeta({ layout: 'app', middleware: 'auth' })

const { namaLengkap, siswaId, kotakFenomena, kotakPola, kotakRima, karyaTerakhir } = useSession()
const supabase = useSupabase()

if (!kotakFenomena.value || !kotakPola.value || kotakRima.value.length < 3) {
  await navigateTo('/kotak/fenomena')
}

const baris = ref<string[]>(['', '', '', ''])
const menyimpan = ref(false)
const error = ref('')

const checklist = ref([
  { teks: 'Terdiri dari 4 baris', cek: false },
  { teks: 'Pola sampiran sesuai', cek: false },
  { teks: 'Pola isi sesuai', cek: false },
  { teks: 'Menggunakan rima yang dipilih', cek: false },
  { teks: 'Isi sesuai fenomena', cek: false },
  { teks: 'Bahasa baku dan mudah dipahami', cek: false }
])

const terisi = computed(() => baris.value.filter(b => b.trim()).length)
const bisaSimpan = computed(() => terisi.value === 4 && checklist.value.every(c => c.cek))

const sfx = useSound()

async function simpan() {
  if (!bisaSimpan.value) return
  menyimpan.value = true
  error.value = ''
  const payload = {
    siswa_id: siswaId.value.startsWith('lokal-') ? null : siswaId.value,
    app: 'kotak',
    fenomena_id: kotakFenomena.value!.id,
    pola_id: kotakPola.value!.id,
    baris1: baris.value[0].trim(),
    baris2: baris.value[1].trim(),
    baris3: baris.value[2].trim(),
    baris4: baris.value[3].trim(),
    rima_dipilih: kotakRima.value
  }
  let id = 'lokal-' + Date.now().toString(36)
  if (supabase && payload.siswa_id) {
    try {
      const { data, error: err } = await supabase.from('karya').insert(payload).select('id').single()
      if (err) throw err
      id = data.id
    } catch (e) {
      console.error(e)
      error.value = 'Gagal menyimpan ke database, tapi karyamu tetap ditampilkan.'
    }
  }
  karyaTerakhir.value = {
    id,
    nama: namaLengkap.value,
    app: 'kotak',
    fenomena: kotakFenomena.value!.nama,
    fenomenaIcon: kotakFenomena.value!.icon,
    pola: `Pola ${kotakPola.value!.nomor} — ${kotakPola.value!.nama}`,
    rima: [...kotakRima.value],
    baris: baris.value.map(b => b.trim()),
    tanggal: new Date()
  }
  sfx.success()
  await navigateTo('/kotak/hasil')
}
</script>
