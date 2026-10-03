<template>
  <div class="text-center mb-8">
    <h1 class="page-title">📖 Buku Karyaku</h1>
    <p class="page-sub">Semua pantun yang pernah kamu buat tersimpan di sini.</p>
  </div>

  <div v-if="!supabaseReady" class="card p-6 max-w-xl mx-auto text-center">
    <p class="font-bold text-slate-500">Buku karya membutuhkan koneksi Supabase.<br />Karya terakhirmu tetap bisa dilihat di bawah ini.</p>
  </div>

  <div v-else class="max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <p class="font-display font-bold text-slate-700">
        {{ daftar.length }} karya {{ daftar.length === 1 ? 'tersimpan' : 'tersimpan' }} ✨
      </p>
      <button class="btn-soft !px-4 !py-2 text-sm" @click="muat" :disabled="memuat">
        {{ memuat ? 'Memuat...' : '🔄 Muat Ulang' }}
      </button>
    </div>

    <div v-if="memuat && !daftar.length" class="text-center text-slate-400 font-bold py-10">
      Memuat karyamu...
    </div>
    <div v-else-if="!daftar.length" class="card p-10 text-center">
      <div class="text-6xl mb-3">🪶</div>
      <p class="font-display font-bold text-lg text-slate-700">Belum ada karya tersimpan</p>
      <p class="text-sm font-semibold text-slate-500 mt-1 mb-5">Yuk buat pantun pertamamu sekarang!</p>
      <NuxtLink to="/pilih" class="btn-primary">🏠 Kembali ke Menu</NuxtLink>
    </div>
    <div v-else class="space-y-5">
      <template v-for="k in daftar" :key="k.id">
        <PantunCard
          :baris="[k.baris1, k.baris2, k.baris3, k.baris4]"
          :judul="judulKartu(k)">
          <template #footer>
            <div class="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span class="pill" :class="k.app === 'kotak' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'">
                {{ k.app === 'kotak' ? '📦 Kotak Kreasi' : '🌟 5E' }}
              </span>
              <span v-if="adaSkor && k.skor !== null && k.skor !== undefined" class="pill bg-sky-100 text-sky-700">⭐ Skor {{ k.skor }}</span>
              <span v-if="adaPenilaian && k.nilai_guru !== null && k.nilai_guru !== undefined" class="pill bg-violet-100 text-violet-700">🎓 Nilai Guru: {{ k.nilai_guru }}</span>
              <span v-if="namaFenomena(k.fenomena_id)" class="pill bg-violet-100 text-violet-700">{{ namaFenomena(k.fenomena_id) }}</span>
              <span class="pill bg-slate-100 text-slate-500">{{ formatTanggal(k.created_at) }}</span>
            </div>
          </template>
        </PantunCard>
        <div v-if="adaPenilaian && k.komentar_guru" class="card -mt-3 p-4 bg-violet-50/60 border-violet-100">
          <p class="text-xs font-extrabold text-violet-600 mb-1">💬 KOMENTAR GURU</p>
          <p class="text-sm font-semibold text-slate-600 whitespace-pre-wrap">{{ k.komentar_guru }}</p>
        </div>
      </template>
    </div>
  </div>

  <div class="text-center mt-8">
    <NuxtLink to="/pilih" class="btn-soft">🏠 Kembali ke Menu</NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const { siswaId } = useSession()
const supabase = useSupabase()
const supabaseReady = useSupabaseReady()

const daftar = ref<any[]>([])
const fenomenaMap = ref<Record<number, string>>({})
const memuat = ref(false)
// false bila kolom `skor` belum ada di database → badge skor disembunyikan
const adaSkor = ref(true)
// true bila kolom penilaian guru tersedia
const adaPenilaian = ref(false)

function judulKartu(k: any) {
  const app = k.app === 'kotak' ? 'KOTAK KREASI' : 'KREASI 5E'
  return `📜 ${app} — ${formatTanggal(k.created_at)}`
}

function namaFenomena(id: number | null) {
  if (!id) return ''
  return fenomenaMap.value[id] ?? ''
}

function formatTanggal(s: string) {
  return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function muat() {
  if (!supabase || !siswaId.value || siswaId.value.startsWith('lokal-')) return
  memuat.value = true
  try {
    const FIELDS = 'id, app, fenomena_id, pola_id, baris1, baris2, baris3, baris4, created_at'
    const { data, fitur } = await fetchKaryaList(
      [
        { fields: `${FIELDS}, skor, nilai_guru, komentar_guru`, fitur: { skor: true, penilaian: true } },
        { fields: `${FIELDS}, skor`, fitur: { skor: true, penilaian: false } },
        { fields: FIELDS, fitur: { skor: false, penilaian: false } },
      ],
      (fields) => supabase.from('karya')
        .select(fields)
        .eq('siswa_id', siswaId.value)
        .order('created_at', { ascending: false }),
    )
    daftar.value = data
    adaSkor.value = fitur.skor
    adaPenilaian.value = fitur.penilaian
  } catch (e) { console.error('[karyaku]:', e) }
  try {
    const rf = await supabase.from('fenomena').select('id, nama')
    if (rf.error) throw rf.error
    const m: Record<number, string> = {}
    for (const f of (rf.data ?? [])) m[f.id] = f.nama
    fenomenaMap.value = m
  } catch (e) { console.error('[karyaku] fenomena:', e) }
  memuat.value = false
}

onMounted(muat)
</script>
