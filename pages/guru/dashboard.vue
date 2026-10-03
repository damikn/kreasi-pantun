<template>
  <div class="mb-8">
    <span class="pill bg-violet-100 text-violet-700">👩‍🏫 DASHBOARD GURU</span>
    <h1 class="page-title mt-2">Pantau Karya Siswa 📊</h1>
    <p class="page-sub">Lihat semua karya pantun, filter per kelas, dan pantau progres siswa.</p>
  </div>

  <div v-if="!supabaseReady" class="card p-8 text-center max-w-xl mx-auto">
    <p class="font-bold text-slate-500">Dashboard membutuhkan koneksi Supabase.</p>
  </div>

  <div v-else>
    <!-- Kartu statistik -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
      <div class="card p-4 md:p-5 text-center">
        <div class="text-3xl mb-1">🧑‍🎓</div>
        <p class="font-display text-2xl md:text-3xl font-extrabold text-slate-800">{{ stats.siswa }}</p>
        <p class="text-xs font-bold text-slate-400">SISWA</p>
      </div>
      <div class="card p-4 md:p-5 text-center">
        <div class="text-3xl mb-1">📜</div>
        <p class="font-display text-2xl md:text-3xl font-extrabold text-slate-800">{{ stats.karya }}</p>
        <p class="text-xs font-bold text-slate-400">TOTAL KARYA</p>
      </div>
      <div class="card p-4 md:p-5 text-center">
        <div class="text-3xl mb-1">📦</div>
        <p class="font-display text-2xl md:text-3xl font-extrabold text-amber-600">{{ stats.kotak }}</p>
        <p class="text-xs font-bold text-slate-400">KOTAK KREASI</p>
      </div>
      <div class="card p-4 md:p-5 text-center">
        <div class="text-3xl mb-1">🌟</div>
        <p class="font-display text-2xl md:text-3xl font-extrabold text-emerald-600">{{ stats.limaE }}</p>
        <p class="text-xs font-bold text-slate-400">KREASI 5E</p>
      </div>
      <div class="card p-4 md:p-5 text-center col-span-2 lg:col-span-1">
        <div class="text-3xl mb-1">🪞</div>
        <p class="font-display text-2xl md:text-3xl font-extrabold text-violet-600">{{ stats.refleksi }}</p>
        <p class="text-xs font-bold text-slate-400">REFLEKSI</p>
      </div>
    </div>

    <!-- Filter -->
    <div class="card p-4 md:p-5 mb-6">
      <div class="grid sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-bold text-slate-500 mb-1.5">KELAS</label>
          <select v-model="filterKelas" class="input-cute">
            <option value="">Semua kelas</option>
            <option v-for="k in daftarKelas" :key="k" :value="k">{{ k }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-500 mb-1.5">APLIKASI</label>
          <select v-model="filterApp" class="input-cute">
            <option value="">Semua</option>
            <option value="kotak">📦 Kotak Kreasi</option>
            <option value="5e">🌟 Kreasi 5E</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-500 mb-1.5">CARI NAMA</label>
          <input v-model="cariNama" class="input-cute" placeholder="Ketik nama siswa..." autocomplete="off" />
        </div>
      </div>
      <div class="flex items-center justify-between mt-4">
        <p class="text-sm font-bold text-slate-500">Menampilkan {{ karyaTampil.length }} karya</p>
        <button class="btn-soft !px-4 !py-2 text-sm" @click="muatSemua" :disabled="memuat">
          {{ memuat ? 'Memuat...' : '🔄 Muat Ulang' }}
        </button>
      </div>
    </div>

    <!-- Tabel karya -->
    <div class="card p-4 md:p-6 mb-6 overflow-hidden">
      <p class="font-display font-bold text-lg text-slate-700 mb-4">📜 Daftar Karya</p>
      <div v-if="!karyaTampil.length" class="text-center text-slate-400 font-bold py-8">
        {{ memuat ? 'Memuat...' : 'Belum ada karya yang cocok dengan filter.' }}
      </div>
      <div v-else class="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <table class="w-full text-sm min-w-[640px]">
          <thead>
            <tr class="text-left text-xs text-slate-400 border-b border-amber-100">
              <th class="pb-2 pr-3 font-bold">SISWA</th>
              <th class="pb-2 pr-3 font-bold">KELAS</th>
              <th class="pb-2 pr-3 font-bold">APP</th>
              <th class="pb-2 pr-3 font-bold">FENOMENA</th>
              <th v-if="adaSkor" class="pb-2 pr-3 font-bold">SKOR</th>
              <th class="pb-2 pr-3 font-bold">TANGGAL</th>
              <th class="pb-2 font-bold">AKSI</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="k in karyaTampil" :key="k.id" class="border-b border-amber-50 last:border-0">
              <td class="py-2.5 pr-3 font-bold text-slate-700">{{ k.siswa?.nama_lengkap ?? '—' }}</td>
              <td class="py-2.5 pr-3 font-semibold text-slate-500">{{ k.siswa?.kelas ?? '—' }}</td>
              <td class="py-2.5 pr-3">
                <span class="pill" :class="k.app === 'kotak' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'">
                  {{ k.app === 'kotak' ? '📦' : '🌟' }}
                </span>
              </td>
              <td class="py-2.5 pr-3 font-semibold text-slate-500">{{ fenomenaMap[k.fenomena_id] ?? '—' }}</td>
              <td v-if="adaSkor" class="py-2.5 pr-3 font-extrabold" :class="skorClass(k.skor)">{{ k.skor ?? '—' }}</td>
              <td class="py-2.5 pr-3 font-semibold text-slate-500 whitespace-nowrap">{{ formatTanggal(k.created_at) }}</td>
              <td class="py-2.5">
                <span class="inline-flex items-center gap-1.5">
                  <NuxtLink :to="`/guru/karya/${k.id}`" class="btn-soft !px-3 !py-1.5 text-xs whitespace-nowrap">👁️ Lihat</NuxtLink>
                  <span v-if="k.nilai_guru !== null && k.nilai_guru !== undefined" title="Sudah dinilai guru"
                    class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-extrabold">✓</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tabel siswa -->
    <div class="card p-4 md:p-6">
      <p class="font-display font-bold text-lg text-slate-700 mb-4">🧑‍🎓 Daftar Siswa</p>
      <div v-if="!siswaTampil.length" class="text-center text-slate-400 font-bold py-8">
        {{ memuat ? 'Memuat...' : 'Belum ada siswa terdaftar.' }}
      </div>
      <div v-else class="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <table class="w-full text-sm min-w-[560px]">
          <thead>
            <tr class="text-left text-xs text-slate-400 border-b border-amber-100">
              <th class="pb-2 pr-3 font-bold">NAMA</th>
              <th class="pb-2 pr-3 font-bold">KELAS</th>
              <th class="pb-2 pr-3 font-bold">NO. ABSEN</th>
              <th class="pb-2 pr-3 font-bold">JML KARYA</th>
              <th class="pb-2 font-bold">TERAKHIR AKTIF</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in siswaTampil" :key="s.id" class="border-b border-amber-50 last:border-0">
              <td class="py-2.5 pr-3 font-bold text-slate-700">{{ s.nama_lengkap }}</td>
              <td class="py-2.5 pr-3 font-semibold text-slate-500">{{ s.kelas || '—' }}</td>
              <td class="py-2.5 pr-3 font-semibold text-slate-500">{{ s.no_absen || '—' }}</td>
              <td class="py-2.5 pr-3"><span class="pill bg-sky-100 text-sky-700">{{ s.jmlKarya }} karya</span></td>
              <td class="py-2.5 font-semibold text-slate-500 whitespace-nowrap">{{ s.terakhir ? formatTanggal(s.terakhir) : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'guru-auth' })

const supabase = useSupabase()
const supabaseReady = useSupabaseReady()

const memuat = ref(false)
const daftarSiswa = ref<any[]>([])
const daftarKarya = ref<any[]>([])
const fenomenaMap = ref<Record<number, string>>({})
const jmlRefleksi = ref(0)
// false bila kolom `skor` belum ada di database → kolom skor disembunyikan
const adaSkor = ref(true)

const filterKelas = ref('')
const filterApp = ref('')
const cariNama = ref('')

const stats = computed(() => ({
  siswa: daftarSiswa.value.length,
  karya: daftarKarya.value.length,
  kotak: daftarKarya.value.filter(k => k.app === 'kotak').length,
  limaE: daftarKarya.value.filter(k => k.app === '5e').length,
  refleksi: jmlRefleksi.value,
}))

const daftarKelas = computed(() => {
  const set = new Set<string>()
  for (const s of daftarSiswa.value) if (s.kelas) set.add(s.kelas)
  return [...set].sort()
})

const karyaTampil = computed(() => {
  const q = cariNama.value.toLowerCase().trim()
  return daftarKarya.value.filter(k => {
    if (filterKelas.value && (k.siswa?.kelas ?? '') !== filterKelas.value) return false
    if (filterApp.value && k.app !== filterApp.value) return false
    if (q && !(k.siswa?.nama_lengkap ?? '').toLowerCase().includes(q)) return false
    return true
  })
})

const siswaTampil = computed(() => {
  const q = cariNama.value.toLowerCase().trim()
  return daftarSiswa.value
    .map(s => {
      const karya = daftarKarya.value.filter(k => k.siswa_id === s.id)
      const terakhir = karya.length
        ? karya.map(k => k.created_at).sort().reverse()[0]
        : null
      return { ...s, jmlKarya: karya.length, terakhir }
    })
    .filter(s => {
      if (filterKelas.value && (s.kelas ?? '') !== filterKelas.value) return false
      if (q && !(s.nama_lengkap ?? '').toLowerCase().includes(q)) return false
      return true
    })
})

function skorClass(s: number | null) {
  if (s === null || s === undefined) return 'text-slate-400'
  if (s >= 80) return 'text-emerald-600'
  if (s >= 60) return 'text-amber-600'
  return 'text-slate-500'
}

function formatTanggal(s: string) {
  return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function muatSemua() {
  if (!supabase) return
  memuat.value = true
  // Tiap query ditangani terpisah: satu kegagalan tidak boleh mengosongkan semuanya.
  try {
    const rs = await supabase
      .from('siswa')
      .select('id, nama_lengkap, no_absen, kelas, created_at')
      .order('kelas')
      .order('nama_lengkap')
    if (rs.error) throw rs.error
    daftarSiswa.value = rs.data ?? []
  } catch (e) { console.error('[dashboard] siswa:', e) }

  try {
    const FIELDS = 'id, siswa_id, app, fenomena_id, pola_id, created_at, siswa:siswa_id(nama_lengkap, kelas)'
    const { data, fitur } = await fetchKaryaList(
      [
        { fields: `${FIELDS}, skor, nilai_guru`, fitur: { skor: true, penilaian: true } },
        { fields: `${FIELDS}, skor`, fitur: { skor: true, penilaian: false } },
        { fields: FIELDS, fitur: { skor: false, penilaian: false } },
      ],
      (fields) => supabase.from('karya')
        .select(fields)
        .order('created_at', { ascending: false })
        .limit(500),
    )
    daftarKarya.value = data
    adaSkor.value = fitur.skor
  } catch (e) { console.error('[dashboard] karya:', e) }

  try {
    const rf = await supabase.from('fenomena').select('id, nama')
    if (rf.error) throw rf.error
    const m: Record<number, string> = {}
    for (const f of (rf.data ?? [])) m[f.id] = f.nama
    fenomenaMap.value = m
  } catch (e) { console.error('[dashboard] fenomena:', e) }

  try {
    const rr = await supabase.from('refleksi').select('id', { count: 'exact', head: true })
    if (rr.error) throw rr.error
    jmlRefleksi.value = rr.count ?? 0
  } catch (e) { console.error('[dashboard] refleksi:', e) }

  memuat.value = false
}

onMounted(muatSemua)
</script>
