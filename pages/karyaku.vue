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
      <PantunCard v-for="k in daftar" :key="k.id"
        :baris="[k.baris1, k.baris2, k.baris3, k.baris4]"
        :judul="judulKartu(k)">
        <template #footer>
          <div class="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span class="pill" :class="k.app === 'kotak' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'">
              {{ k.app === 'kotak' ? '📦 Kotak Kreasi' : '🌟 5E' }}
            </span>
            <span v-if="k.skor !== null && k.skor !== undefined" class="pill bg-sky-100 text-sky-700">⭐ Skor {{ k.skor }}</span>
            <span v-if="namaFenomena(k.fenomena_id)" class="pill bg-violet-100 text-violet-700">{{ namaFenomena(k.fenomena_id) }}</span>
            <span class="pill bg-slate-100 text-slate-500">{{ formatTanggal(k.created_at) }}</span>
          </div>
        </template>
      </PantunCard>
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
    const [rk, rf] = await Promise.all([
      supabase.from('karya')
        .select('id, app, fenomena_id, pola_id, baris1, baris2, baris3, baris4, skor, created_at')
        .eq('siswa_id', siswaId.value)
        .order('created_at', { ascending: false }),
      supabase.from('fenomena').select('id, nama'),
    ])
    if (rk.error) throw rk.error
    daftar.value = rk.data ?? []
    const m: Record<number, string> = {}
    for (const f of (rf.data ?? [])) m[f.id] = f.nama
    fenomenaMap.value = m
  } catch (e) {
    console.error(e)
  }
  memuat.value = false
}

onMounted(muat)
</script>
