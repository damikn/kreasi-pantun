<template>
  <div>
    <NuxtLink to="/guru/dashboard" class="inline-block mb-5 text-sm font-bold text-slate-400 hover:text-emerald-600 transition">
      ← Kembali ke Dashboard
    </NuxtLink>

    <div v-if="memuat" class="card p-10 text-center max-w-xl mx-auto">
      <p class="font-bold text-slate-400">Memuat karya...</p>
    </div>

    <div v-else-if="!karya" class="card p-10 text-center max-w-xl mx-auto">
      <div class="text-6xl mb-3">🔍</div>
      <p class="font-display font-bold text-lg text-slate-700">Karya tidak ditemukan</p>
      <p class="text-sm font-semibold text-slate-500 mt-1">ID karya tidak valid atau sudah dihapus.</p>
    </div>

    <div v-else class="max-w-3xl mx-auto space-y-5">
      <!-- Kepala -->
      <div class="text-center">
        <span class="pill" :class="karya.app === 'kotak' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'">
          {{ karya.app === 'kotak' ? '📦 KOTAK KREASI' : '🌟 KREASI PANTUN 5E' }}
        </span>
        <h1 class="page-title mt-2">Detail Karya 📜</h1>
      </div>

      <!-- Identitas siswa -->
      <div class="card p-5 md:p-6">
        <p class="font-display font-bold text-slate-700 mb-3">🧑‍🎓 Identitas Siswa</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><p class="text-xs font-bold text-slate-400">NAMA</p><p class="font-bold text-slate-700">{{ karya.siswa?.nama_lengkap ?? '—' }}</p></div>
          <div><p class="text-xs font-bold text-slate-400">KELAS</p><p class="font-bold text-slate-700">{{ karya.siswa?.kelas || '—' }}</p></div>
          <div><p class="text-xs font-bold text-slate-400">NO. ABSEN</p><p class="font-bold text-slate-700">{{ karya.siswa?.no_absen || '—' }}</p></div>
          <div><p class="text-xs font-bold text-slate-400">TANGGAL</p><p class="font-bold text-slate-700">{{ formatTanggal(karya.created_at) }}</p></div>
        </div>
      </div>

      <!-- Isi pantun -->
      <div class="card p-6 md:p-8 relative overflow-hidden">
        <div class="absolute -top-6 -right-6 text-[90px] opacity-10 select-none">🌸</div>
        <div class="flex flex-wrap gap-2 mb-4">
          <span v-if="karya.fenomena?.nama" class="pill bg-violet-100 text-violet-700">🔍 {{ karya.fenomena.nama }}</span>
          <span v-if="karya.pola?.nama" class="pill bg-sky-100 text-sky-700">🎡 {{ karya.pola.nama }}</span>
        </div>
        <div class="space-y-1.5 relative">
          <p v-for="(b, i) in barisPantun" :key="i"
            class="font-display text-xl md:text-2xl font-semibold text-slate-700 italic leading-relaxed">{{ b }}</p>
        </div>
        <div v-if="(karya.rima_dipilih ?? []).length" class="mt-4">
          <p class="text-xs font-bold text-slate-400 mb-1.5">KATA RIMA YANG DIPAKAI</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="w in karya.rima_dipilih" :key="w" class="pill bg-emerald-50 text-emerald-700">{{ w }}</span>
          </div>
        </div>
      </div>

      <!-- Skor -->
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="card p-5 flex items-center justify-between">
          <p class="font-display font-bold text-slate-700">🤖 Skor Otomatis</p>
          <span v-if="fitur.skor && karya.skor !== null && karya.skor !== undefined"
            class="font-display text-3xl font-extrabold" :class="skorClass(karya.skor)">{{ karya.skor }}<span class="text-base text-slate-400">/100</span></span>
          <span v-else class="font-bold text-slate-400">—</span>
        </div>
        <div class="card p-5 flex items-center justify-between">
          <p class="font-display font-bold text-slate-700">🎓 Nilai Guru</p>
          <span v-if="karya.nilai_guru !== null && karya.nilai_guru !== undefined"
            class="font-display text-3xl font-extrabold text-violet-600">{{ karya.nilai_guru }}<span class="text-base text-slate-400">/100</span></span>
          <span v-else class="font-bold text-slate-400">Belum dinilai</span>
        </div>
      </div>

      <!-- Peta ide terakhir -->
      <div v-if="peta" class="card p-5 md:p-6">
        <p class="font-display font-bold text-slate-700 mb-3">🗺️ Peta Ide Terakhir <span class="text-xs font-bold text-slate-400">({{ formatTanggal(peta.created_at) }})</span></p>
        <div class="space-y-2 text-sm">
          <div class="bg-amber-50 rounded-xl p-3"><p class="text-xs font-bold text-amber-600">FENOMENA INI TENTANG APA?</p><p class="font-semibold text-slate-700 mt-0.5">{{ peta.gagasan || '—' }}</p></div>
          <div class="bg-sky-50 rounded-xl p-3"><p class="text-xs font-bold text-sky-600">PESAN YANG INGIN DISAMPAIKAN</p><p class="font-semibold text-slate-700 mt-0.5">{{ peta.pesan || '—' }}</p></div>
        </div>
      </div>

      <!-- Refleksi terakhir -->
      <div v-if="refleksi" class="card p-5 md:p-6">
        <p class="font-display font-bold text-slate-700 mb-3">🪞 Refleksi Terakhir <span class="text-xs font-bold text-slate-400">({{ formatTanggal(refleksi.created_at) }})</span></p>
        <div class="space-y-3">
          <div v-for="(t, i) in pertanyaanRefleksi" :key="i" class="text-sm">
            <p class="font-bold text-slate-500">{{ i + 1 }}. {{ t }}</p>
            <p class="font-semibold text-slate-700 mt-0.5 bg-slate-50 rounded-xl px-3 py-2">{{ jawabanRefleksi(`p${i + 1}`) || '—' }}</p>
          </div>
        </div>
      </div>

      <!-- Penilaian guru -->
      <div class="card p-5 md:p-6 border-2 border-violet-100">
        <p class="font-display font-bold text-lg text-slate-700 mb-1">🎓 Penilaian Guru</p>
        <p class="text-sm font-semibold text-slate-400 mb-4">Beri nilai dan masukan untuk karya ini.</p>

        <div v-if="penilaianTersimpan" class="bg-violet-50 rounded-2xl p-4 mb-4 text-sm">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <p class="font-extrabold text-violet-700 text-lg">Nilai: {{ karya.nilai_guru }}/100</p>
            <p class="text-xs font-bold text-slate-400">Dinilai {{ formatTanggalWaktu(karya.dinilai_at) }}</p>
          </div>
          <p v-if="karya.komentar_guru" class="font-semibold text-slate-600 mt-2 whitespace-pre-wrap">💬 {{ karya.komentar_guru }}</p>
        </div>

        <div v-if="!fitur.penilaian" class="text-sm font-bold text-amber-600 bg-amber-50 rounded-xl p-3">
          ⚠️ Kolom penilaian belum tersedia di database. Minta admin menjalankan migrasi terbaru dulu ya.
        </div>
        <div v-else class="space-y-3">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5">NILAI (0–100)</label>
            <input v-model.number="nilaiInput" type="number" min="0" max="100" class="input-cute max-w-[160px]" placeholder="Contoh: 85" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5">KOMENTAR / MASUKAN</label>
            <textarea v-model="komentarInput" rows="3" maxlength="500" class="input-cute"
              placeholder="Tulis apresiasi atau saran perbaikan untuk siswa..."></textarea>
          </div>
          <p v-if="pesanError" class="text-rose-500 text-sm font-bold">{{ pesanError }}</p>
          <p v-if="pesanSukses" class="text-emerald-600 text-sm font-bold">{{ pesanSukses }}</p>
          <button class="btn-primary" :disabled="menyimpan" @click="simpan">
            {{ menyimpan ? 'Menyimpan...' : '💾 Simpan Penilaian' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { pertanyaanRefleksi } from '~/data/konten'
import { fetchSatuKarya } from '~/composables/useKarya'

definePageMeta({ layout: 'app', middleware: 'guru-auth' })

const route = useRoute()
const supabase = useSupabase()
const sync = useSync()
const id = route.params.id as string

const karya = ref<any | null>(null)
const peta = ref<any | null>(null)
const refleksi = ref<any | null>(null)
const memuat = ref(true)
const fitur = ref({ skor: false, penilaian: false })

const nilaiInput = ref<number | null>(null)
const komentarInput = ref('')
const menyimpan = ref(false)
const pesanError = ref('')
const pesanSukses = ref('')

const sfx = useSound()

const barisPantun = computed(() => [karya.value?.baris1, karya.value?.baris2, karya.value?.baris3, karya.value?.baris4].filter(Boolean))
const penilaianTersimpan = computed(() => karya.value?.nilai_guru !== null && karya.value?.nilai_guru !== undefined)

function formatTanggal(s: string) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
function formatTanggalWaktu(s: string) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function skorClass(s: number) {
  if (s >= 80) return 'text-emerald-600'
  if (s >= 60) return 'text-amber-600'
  return 'text-slate-500'
}
function jawabanRefleksi(kunci: string) {
  return (refleksi.value?.jawaban ?? {})[kunci] ?? ''
}

async function muat() {
  memuat.value = true
  try {
    if (!supabase) return
    const { data, fitur: f } = await fetchSatuKarya(supabase, id)
    karya.value = data
    fitur.value = f
    if (data?.nilai_guru !== null && data?.nilai_guru !== undefined) {
      nilaiInput.value = data.nilai_guru
      komentarInput.value = data.komentar_guru ?? ''
    }
    const sid = data?.siswa_id
    if (sid) {
      const rp = await supabase.from('peta_ide')
        .select('gagasan, pesan, created_at, fenomena:fenomena_id(nama)')
        .eq('siswa_id', sid).order('created_at', { ascending: false }).limit(1).maybeSingle()
      if (!rp.error) peta.value = rp.data
      const rr = await supabase.from('refleksi')
        .select('jawaban, created_at')
        .eq('siswa_id', sid).order('created_at', { ascending: false }).limit(1).maybeSingle()
      if (!rr.error) refleksi.value = rr.data
    }
  } catch (e) {
    console.error('[guru/karya]:', e)
  }
  memuat.value = false
}

async function simpan() {
  pesanError.value = ''
  pesanSukses.value = ''
  if (nilaiInput.value === null || nilaiInput.value === undefined || Number.isNaN(nilaiInput.value)) {
    pesanError.value = 'Isi nilai dulu ya (0–100).'
    return
  }
  if (nilaiInput.value < 0 || nilaiInput.value > 100) {
    pesanError.value = 'Nilai harus di antara 0 sampai 100.'
    return
  }
  if (!supabase) return
  menyimpan.value = true
  try {
    // Offline → diantrekan dan terkirim otomatis saat online (last-write-wins)
    const res = await sync.tulisTertunda('karya', 'update', {
      nilai_guru: Math.round(nilaiInput.value),
      komentar_guru: komentarInput.value?.trim() ? komentarInput.value.trim() : null,
      dinilai_at: new Date().toISOString(),
    }, { id })
    if (!res.ok && !res.queued) throw new Error(res.error)
    pesanSukses.value = res.queued
      ? 'Penilaian dicatat! ⏳ Akan terkirim otomatis saat online.'
      : 'Penilaian tersimpan! 🎉'
    sfx.success()
    // Perbarui tampilan lokal langsung (tanpa menunggu sinkron)
    if (karya.value) {
      karya.value.nilai_guru = Math.round(nilaiInput.value)
      karya.value.komentar_guru = komentarInput.value?.trim() ? komentarInput.value.trim() : null
    }
    if (!res.queued) {
      const { data } = await fetchSatuKarya(supabase, id)
      if (data) karya.value = data
    }
  } catch (e: any) {
    console.error(e)
    pesanError.value = /nilai_guru/i.test(String(e?.message ?? ''))
      ? 'Kolom penilaian belum tersedia di database. Minta admin menjalankan migrasi terbaru.'
      : 'Gagal menyimpan penilaian. Coba lagi ya!'
  }
  menyimpan.value = false
}

onMounted(muat)
</script>
