<template>
  <div class="mb-6">
    <span class="pill bg-rose-100 text-rose-700">EVALUATE — Evaluasi Karya</span>
  </div>

  <div class="text-center mb-8">
    <h1 class="page-title">🏆 Evaluasi Karya</h1>
    <p class="page-sub">Periksa, sempurnakan, refleksikan, dan simpan karya pantunmu!</p>
  </div>

  <div class="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-start">
    <!-- Checklist penilaian mandiri -->
    <div class="card p-6">
      <p class="font-display font-bold text-lg text-slate-700 mb-1">✅ Checklist Penilaian</p>
      <p class="text-sm font-semibold text-slate-500 mb-4">Nilai pantun yang kamu buat dengan jujur!</p>
      <div class="space-y-2.5">
        <label v-for="(k, i) in kriteria" :key="i"
          class="flex items-start gap-2.5 text-sm font-semibold text-slate-600 cursor-pointer bg-slate-50 rounded-xl px-3 py-2.5">
          <input type="checkbox" v-model="k.cek" class="w-5 h-5 mt-0.5 accent-rose-500 shrink-0" />
          {{ k.teks }}
        </label>
      </div>
      <div class="mt-4 text-center">
        <span class="pill text-base" :class="skorKriteria === kriteria.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
          {{ skorKriteria }} / {{ kriteria.length }} kriteria terpenuhi
        </span>
      </div>
    </div>

    <!-- Refleksi -->
    <div class="card p-6">
      <p class="font-display font-bold text-lg text-slate-700 mb-1">🪞 Refleksi Pembelajaran</p>
      <p class="text-sm font-semibold text-slate-500 mb-4">Ceritakan pengalaman belajarmu hari ini.</p>
      <div class="space-y-4">
        <div v-for="(t, i) in pertanyaanRefleksi" :key="i">
          <label class="block text-sm font-bold text-slate-700 mb-1.5">{{ i + 1 }}. {{ t }}</label>
          <textarea v-model="jawaban[i]" rows="2" class="input-cute" maxlength="300"
            placeholder="Tulis jawabanmu di sini..."></textarea>
        </div>
      </div>
      <button class="btn-warm w-full mt-4" :disabled="menyimpan" @click="simpanRefleksi">
        {{ menyimpan ? 'Menyimpan...' : tersimpan ? '✅ Refleksi Tersimpan' : '💾 Simpan Refleksi' }}
      </button>
      <p v-if="error" class="text-rose-500 text-sm font-bold mt-2">{{ error }}</p>
    </div>
  </div>

  <!-- Galeri karya -->
  <div class="max-w-5xl mx-auto mt-8">
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <p class="font-display font-bold text-lg text-slate-700">🖼️ Galeri Pantun</p>
        <button class="btn-soft !px-4 !py-1.5 text-xs" @click="muatGaleri" :disabled="memuat">
          {{ memuat ? 'Memuat...' : '🔄 Muat Ulang' }}
        </button>
      </div>
      <div v-if="!supabaseReady" class="text-center text-slate-400 font-semibold py-6">
        Galeri membutuhkan koneksi Supabase.<br />Karya tersimpan lokal tetap bisa dilihat di halaman hasil.
      </div>
      <div v-else-if="galeri.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="k in galeri" :key="k.id" class="bg-amber-50/70 rounded-2xl p-4 border border-amber-100">
          <p class="pill mb-2" :class="k.app === 'kotak' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'">
            {{ k.app === 'kotak' ? '📦 Kotak Kreasi' : '🌟 5E' }}
          </p>
          <p class="italic font-display font-semibold text-slate-700 text-sm leading-relaxed">
            {{ k.baris1 }}<br />{{ k.baris2 }}<br />{{ k.baris3 }}<br />{{ k.baris4 }}
          </p>
          <p class="text-xs font-bold text-slate-400 mt-2">— karya siswa • {{ formatTanggal(k.created_at) }}</p>
        </div>
      </div>
      <p v-else class="text-center text-slate-400 font-semibold py-6">
        {{ memuat ? 'Memuat karya...' : 'Belum ada karya tersimpan. Jadilah yang pertama! ✨' }}
      </p>
    </div>
  </div>

  <!-- Buku karyaku -->
  <div class="max-w-5xl mx-auto mt-6">
    <div class="card p-6 bg-gradient-to-br from-amber-50 to-emerald-50 text-center">
      <div class="text-5xl mb-2">📖</div>
      <p class="font-display font-bold text-lg text-slate-700">Buku Karyaku</p>
      <p class="text-sm font-semibold text-slate-500 mb-4">Kumpulan pantun terbaikmu tersimpan di sini.</p>
      <div class="flex flex-wrap justify-center gap-3">
        <NuxtLink v-if="karyaTerakhir" to="/kotak/hasil" class="btn-primary">📜 Lihat Karya Terakhir</NuxtLink>
        <NuxtLink to="/pilih" class="btn-soft">🏠 Kembali ke Menu Utama</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { kriteriaEvaluasi, pertanyaanRefleksi } from '~/data/konten'

definePageMeta({ layout: 'app', middleware: 'auth' })

const { siswaId, karyaTerakhir } = useSession()
const supabase = useSupabase()
const supabaseReady = useSupabaseReady()

const kriteria = ref(kriteriaEvaluasi.map(teks => ({ teks, cek: false })))
const skorKriteria = computed(() => kriteria.value.filter(k => k.cek).length)

const jawaban = ref<string[]>(pertanyaanRefleksi.map(() => ''))
const menyimpan = ref(false)
const tersimpan = ref(false)
const error = ref('')

const galeri = ref<any[]>([])
const memuat = ref(false)

const sfx = useSound()

async function simpanRefleksi() {
  menyimpan.value = true
  error.value = ''
  const data: Record<string, string> = {}
  pertanyaanRefleksi.forEach((t, i) => { data[`p${i + 1}`] = jawaban.value[i].trim() })
  if (supabase && !siswaId.value.startsWith('lokal-')) {
    try {
      const { error: err } = await supabase.from('refleksi').insert({
        siswa_id: siswaId.value,
        jawaban: data
      })
      if (err) throw err
    } catch (e) {
      console.error(e)
      error.value = 'Gagal menyimpan ke database.'
      menyimpan.value = false
      return
    }
  }
  menyimpan.value = false
  tersimpan.value = true
  sfx.success()
}

async function muatGaleri() {
  if (!supabase) return
  memuat.value = true
  try {
    const { data, error: err } = await supabase
      .from('karya')
      .select('id, app, baris1, baris2, baris3, baris4, created_at')
      .order('created_at', { ascending: false })
      .limit(12)
    if (err) throw err
    galeri.value = data ?? []
  } catch (e) {
    console.error(e)
  }
  memuat.value = false
}

function formatTanggal(s: string) {
  return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(muatGaleri)
</script>
