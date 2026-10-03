<template>
  <div class="text-center mb-6">
    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-3">
      <span class="text-5xl">✅</span>
    </div>
    <h1 class="page-title">Pantunmu Berhasil Disimpan!</h1>
    <p class="page-sub">Karyamu tersimpan{{ supabaseReady ? ' di database' : ' di perangkat ini' }}. Unduh sebagai gambar untuk dibagikan! 🎉</p>
  </div>

  <div class="max-w-xl mx-auto">
    <!-- Skor -->
    <div v-if="karya?.skor !== undefined" class="card p-4 mb-4 flex items-center justify-between">
      <p class="font-display font-bold text-slate-700">🤖 Skor Otomatis</p>
      <span class="font-display text-3xl font-extrabold"
        :class="karya.skor >= 80 ? 'text-emerald-600' : karya.skor >= 60 ? 'text-amber-600' : 'text-slate-500'">
        {{ karya.skor }}<span class="text-base text-slate-400">/100</span>
      </span>
    </div>

    <!-- Penilaian guru (bila sudah dinilai) -->
    <div v-if="penilaian" class="card p-4 mb-4 border-2 border-violet-100">
      <div class="flex items-center justify-between">
        <p class="font-display font-bold text-slate-700">🎓 Nilai Guru</p>
        <span class="font-display text-3xl font-extrabold text-violet-600">{{ penilaian.nilai_guru }}<span class="text-base text-slate-400">/100</span></span>
      </div>
      <p v-if="penilaian.komentar_guru" class="text-sm font-semibold text-slate-500 mt-2 whitespace-pre-wrap">💬 {{ penilaian.komentar_guru }}</p>
    </div>

    <!-- Kartu karya -->
    <div ref="kartuRef" class="rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-200"
      style="background: linear-gradient(160deg,#fffbeb 0%,#ecfdf5 60%,#eff6ff 100%)">
      <div class="px-8 pt-8 pb-6 text-center relative">
        <div class="absolute top-4 left-6 text-4xl opacity-30">🌿</div>
        <div class="absolute top-4 right-6 text-4xl opacity-30">🌸</div>
        <p class="pill bg-amber-200 text-amber-800 mb-3">📦 KOTAK KREASI</p>
        <h2 class="font-display text-3xl font-extrabold text-slate-800 mb-4">Pantun Karyaku</h2>
        <div class="bg-white/70 rounded-2xl px-6 py-5 inline-block">
          <p v-for="(b, i) in karya?.baris" :key="i"
            class="font-display text-xl font-semibold text-slate-700 italic leading-relaxed">{{ b }}</p>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-6 text-left text-sm">
          <div class="bg-white/60 rounded-xl p-3"><p class="font-bold text-slate-400 text-xs">NAMA</p><p class="font-bold text-slate-700">{{ karya?.nama || namaLengkap || '—' }}</p></div>
          <div class="bg-white/60 rounded-xl p-3"><p class="font-bold text-slate-400 text-xs">TANGGAL</p><p class="font-bold text-slate-700">{{ tanggal }}</p></div>
          <div class="bg-white/60 rounded-xl p-3"><p class="font-bold text-slate-400 text-xs">FENOMENA</p><p class="font-bold text-slate-700">{{ karya?.fenomenaIcon }} {{ karya?.fenomena }}</p></div>
          <div class="bg-white/60 rounded-xl p-3"><p class="font-bold text-slate-400 text-xs">POLA</p><p class="font-bold text-slate-700">{{ karya?.pola }}</p></div>
        </div>
        <div v-if="karya?.rimaA?.suffix" class="grid grid-cols-2 gap-2 mt-2 text-left text-sm">
          <div class="bg-sky-50 rounded-xl p-3"><p class="font-bold text-sky-500 text-xs">RIMA A (b1&3) {{ karya.rimaA.suffix }}</p><p class="font-bold text-slate-700">{{ karya.rimaA.words.join(', ') }}</p></div>
          <div class="bg-emerald-50 rounded-xl p-3"><p class="font-bold text-emerald-500 text-xs">RIMA B (b2&4) {{ karya.rimaB.suffix }}</p><p class="font-bold text-slate-700">{{ karya.rimaB.words.join(', ') }}</p></div>
        </div>
        <p v-else class="text-xs font-bold text-slate-400 mt-4">Kata rima: {{ karya?.rima?.join(', ') }}</p>
        <p class="font-display font-bold text-amber-600 mt-4 italic">"Setiap kata adalah langkah kecil menuju perubahan besar. Teruslah berkarya!"</p>
      </div>
    </div>

    <!-- Checklist validasi -->
    <div v-if="karya?.checks?.length" class="card p-5 mt-4">
      <p class="font-display font-bold text-slate-700 mb-3">📋 Hasil Penilaian</p>
      <div class="space-y-2">
        <div v-for="c in karya.checks" :key="c.key" class="flex items-start gap-2 text-sm">
          <span class="text-base leading-none">{{ c.passed ? '✅' : '❌' }}</span>
          <div>
            <p class="font-bold" :class="c.passed ? 'text-emerald-700' : 'text-slate-600'">{{ c.label }}</p>
            <p class="text-xs font-semibold text-slate-400">{{ c.detail }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-3 mt-6">
      <button class="btn-primary" @click="unduhGambar" :disabled="mengunduh">
        {{ mengunduh ? 'Membuat gambar...' : '⬇️ Unduh sebagai Gambar' }}
      </button>
      <NuxtLink to="/kotak/fenomena" class="btn-warm" @click="buatLagi">🎨 Buat Lagi</NuxtLink>
      <NuxtLink to="/pilih" class="btn-soft">🏠 Menu Utama</NuxtLink>
    </div>
  </div>

  <canvas ref="canvasRef" width="1080" height="1450" class="hidden"></canvas>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const { karyaTerakhir, resetKotak, namaLengkap } = useSession()
const supabaseReady = useSupabaseReady()
const karya = computed(() => karyaTerakhir.value)

if (!karya.value) {
  await navigateTo('/kotak/fenomena')
}

const tanggal = computed(() => {
  const d = karya.value?.tanggal ? new Date(karya.value.tanggal) : new Date()
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const mengunduh = ref(false)
const penilaian = ref<{ nilai_guru: number; komentar_guru: string | null } | null>(null)

function buatLagi() {
  resetKotak()
}

// Ambil ulang penilaian guru (bila karya ini sudah dinilai setelah disimpan)
onMounted(async () => {
  const id = karya.value?.id
  const sb = useSupabase()
  if (!sb || !id || String(id).startsWith('lokal-')) return
  try {
    const { data, error } = await sb.from('karya')
      .select('nilai_guru, komentar_guru').eq('id', id).maybeSingle()
    if (!error && data && data.nilai_guru !== null && data.nilai_guru !== undefined) {
      penilaian.value = data
    }
  } catch { /* kolom belum ada / offline → abaikan */ }
})

/** Render kartu karya ke canvas lalu unduh sebagai PNG (tanpa library tambahan). */
function unduhGambar() {
  const canvas = canvasRef.value
  if (!canvas || !karya.value) return
  mengunduh.value = true
  const ctx = canvas.getContext('2d')!
  const W = 1080, H = 1450

  // Latar
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#fffbeb'); g.addColorStop(0.6, '#ecfdf5'); g.addColorStop(1, '#eff6ff')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // Hiasan lingkaran
  const deco = (x: number, y: number, r: number, c: string) => {
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  }
  deco(120, 180, 90, 'rgba(52,211,153,.15)')
  deco(960, 240, 120, 'rgba(251,191,36,.18)')
  deco(940, 1250, 100, 'rgba(56,189,248,.15)')
  deco(140, 1280, 70, 'rgba(167,139,250,.15)')

  ctx.textAlign = 'center'
  ctx.fillStyle = '#b45309'
  ctx.font = 'bold 34px sans-serif'
  ctx.fillText('📦 KOTAK KREASI', W / 2, 110)

  ctx.fillStyle = '#1e293b'
  ctx.font = '800 64px sans-serif'
  ctx.fillText('Pantun Karyaku', W / 2, 200)

  // Skor
  if (karya.value.skor !== undefined) {
    ctx.fillStyle = karya.value.skor >= 80 ? '#059669' : karya.value.skor >= 60 ? '#d97706' : '#64748b'
    ctx.font = '800 56px sans-serif'
    ctx.fillText(`⭐ Skor: ${karya.value.skor}/100`, W / 2, 275)
  }

  // Kotak pantun
  ctx.fillStyle = 'rgba(255,255,255,.75)'
  const boxY = 320, boxH = 340
  roundRect(ctx, 90, boxY, W - 180, boxH, 36); ctx.fill()
  ctx.fillStyle = '#334155'
  ctx.font = 'italic 600 44px sans-serif'
  karya.value.baris.forEach((b: string, i: number) => {
    ctx.fillText(b, W / 2, boxY + 85 + i * 75, W - 260)
  })

  // Info
  ctx.textAlign = 'left'
  const info: [string, string][] = [
    ['NAMA', karya.value.nama],
    ['TANGGAL', tanggal.value],
    ['FENOMENA', karya.value.fenomena],
    ['POLA', karya.value.pola]
  ]
  info.forEach(([label, val], i) => {
    const y = 760 + i * 110
    ctx.fillStyle = 'rgba(255,255,255,.65)'
    roundRect(ctx, 90, y, W - 180, 92, 24); ctx.fill()
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 24px sans-serif'
    ctx.fillText(label, 130, y + 36)
    ctx.fillStyle = '#334155'; ctx.font = 'bold 32px sans-serif'
    ctx.fillText(String(val).slice(0, 42), 130, y + 72, W - 300)
  })

  ctx.textAlign = 'center'
  ctx.fillStyle = '#94a3b8'; ctx.font = '600 28px sans-serif'
  const rimaTxt = karya.value.rimaA?.suffix
    ? `Rima A ${karya.value.rimaA.suffix}: ${(karya.value.rimaA.words || []).join(', ')}  |  Rima B ${karya.value.rimaB.suffix}: ${(karya.value.rimaB.words || []).join(', ')}`
    : 'Kata rima: ' + (karya.value.rima || []).join(', ')
  ctx.fillText(rimaTxt, W / 2, 1230, W - 200)
  ctx.fillStyle = '#d97706'; ctx.font = 'italic bold 30px sans-serif'
  ctx.fillText('"Setiap kata adalah langkah kecil menuju perubahan besar."', W / 2, 1290, W - 160)
  ctx.fillText('Teruslah berkarya! ✨', W / 2, 1335)

  const a = document.createElement('a')
  a.download = `pantun-${karya.value.nama.replace(/\s+/g, '-').toLowerCase()}.png`
  a.href = canvas.toDataURL('image/png')
  a.click()
  mengunduh.value = false
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
</script>
