<template>
  <div class="mb-6">
    <span class="pill bg-sky-100 text-sky-700">ELABORATE — Asah Kreativitas</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">✍️ Menyusun Pantun</h1>
    <p class="page-sub">Saatnya berkreasi! Susun pantunmu sendiri berdasarkan peta ide yang sudah kamu buat.</p>
  </div>

  <div class="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
    <!-- Peta ide -->
    <div class="card p-5 bg-amber-50/70">
      <p class="font-display font-bold text-slate-700 mb-2">🗺️ Peta Idemu</p>
      <p class="text-sm font-semibold text-slate-600"><b class="text-amber-700">Fenomena:</b> {{ limarFenomena?.nama ?? '—' }}</p>
      <p class="text-sm font-semibold text-slate-600 mt-1"><b class="text-amber-700">Gagasan:</b> {{ petaGagasan || '—' }}</p>
      <p class="text-sm font-semibold text-slate-600 mt-1"><b class="text-amber-700">Pesan:</b> {{ petaPesan || '—' }}</p>
      <NuxtLink to="/limar/explore-peta" class="btn-soft !px-4 !py-1.5 text-xs mt-3">✏️ Ubah Peta Ide</NuxtLink>
    </div>

    <!-- Form -->
    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-3">📝 Pantunmu</p>
      <div class="space-y-3">
        <div>
          <label class="text-xs font-bold text-sky-600">Sampiran</label>
          <input v-model="baris[0]" class="input-cute !py-2.5" placeholder="Baris 1 (sampiran)..." maxlength="120" />
          <input v-model="baris[1]" class="input-cute !py-2.5 mt-2" placeholder="Baris 2 (sampiran)..." maxlength="120" />
        </div>
        <div>
          <label class="text-xs font-bold text-emerald-600">Isi</label>
          <input v-model="baris[2]" class="input-cute !py-2.5" placeholder="Baris 3 (isi)..." maxlength="120" />
          <input v-model="baris[3]" class="input-cute !py-2.5 mt-2" placeholder="Baris 4 (isi)..." maxlength="120" />
        </div>
      </div>
      <button class="btn-primary w-full mt-4" :disabled="!bisaSimpan || menyimpan" @click="simpan">
        {{ menyimpan ? 'Menyimpan...' : '💾 Selesaikan Pantun' }}
      </button>
      <p v-if="error" class="text-rose-500 text-sm font-bold mt-2">{{ error }}</p>
      <p v-if="tersimpan" class="text-emerald-600 font-bold text-sm mt-2 text-center">🎉 Pantunmu tersimpan! Lanjut ke Evaluate ya!</p>
    </div>

    <!-- Bantuan rima -->
    <div class="card p-5">
      <p class="font-display font-bold text-slate-700 mb-2">🌳 Bantuan Rima</p>
      <p class="text-xs font-semibold text-slate-500 mb-3">Klik kata untuk menyalinnya ke baris terakhir yang kosong.</p>
      <div class="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto">
        <button v-for="k in kataRima" :key="k.kata" @click="pakaiKata(k.kata)"
          class="pill bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition">
          {{ k.kata }} <span class="opacity-50">{{ k.akhiran }}</span>
        </button>
      </div>
    </div>
  </div>

  <div class="text-center mt-8 flex justify-center gap-3">
    <NuxtLink to="/limar/explain" class="btn-soft">← Explain</NuxtLink>
    <NuxtLink to="/limar/evaluate" class="btn-primary text-lg">Lanjut ke Evaluate →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { kataRima } from '~/data/konten'

definePageMeta({ layout: 'app', middleware: 'auth' })

const { namaLengkap, siswaId, limarFenomena, petaGagasan, petaPesan, karyaTerakhir } = useSession()
const supabase = useSupabase()
const sync = useSync()

const baris = ref<string[]>(['', '', '', ''])
const menyimpan = ref(false)
const tersimpan = ref(false)
const error = ref('')

const bisaSimpan = computed(() => baris.value.every(b => b.trim()))

function pakaiKata(kata: string) {
  // tempel ke baris kosong terakhir, atau baris 4 bila semua terisi
  for (let i = 3; i >= 0; i--) {
    if (!baris.value[i].trim()) {
      baris.value[i] = (baris.value[i] ? baris.value[i] + ' ' : '') + kata
      return
    }
  }
  baris.value[3] = baris.value[3] + ' ' + kata
}

const sfx = useSound()

async function simpan() {
  if (!bisaSimpan.value) return
  menyimpan.value = true
  error.value = ''
  const payload = {
    siswa_id: siswaId.value || null,
    app: '5e',
    fenomena_id: limarFenomena.value?.id ?? null,
    pola_id: null,
    baris1: baris.value[0].trim(),
    baris2: baris.value[1].trim(),
    baris3: baris.value[2].trim(),
    baris4: baris.value[3].trim(),
    rima_dipilih: [] as string[]
  }
  let id = 'lokal-' + Date.now().toString(36)
  if (supabase) {
    // Offline → diantrekan (tempId siswa di-remap saat sinkronisasi)
    const res = await sync.tulisTertunda('karya', 'insert', payload)
    if (res.ok && res.id) {
      id = res.id
    } else if (!res.ok && !res.queued) {
      console.error(res.error)
      error.value = 'Gagal menyimpan ke database, tapi kamu bisa lanjut.'
    }
  }
  karyaTerakhir.value = {
    id,
    nama: namaLengkap.value,
    app: '5e',
    fenomena: limarFenomena.value?.nama ?? '—',
    fenomenaIcon: limarFenomena.value?.icon ?? '🌱',
    pola: 'Bebas (5E)',
    rima: [],
    baris: baris.value.map(b => b.trim()),
    tanggal: new Date()
  }
  menyimpan.value = false
  tersimpan.value = true
  sfx.success()
}
</script>
