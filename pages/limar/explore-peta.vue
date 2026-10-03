<template>
  <div class="mb-6">
    <span class="pill bg-amber-100 text-amber-700">EXPLORE — Ekspresikan Gagasan dan Pesan</span>
  </div>

  <div class="text-center mb-6">
    <h1 class="page-title">🗺️ Kembangkan Peta Idenya!</h1>
    <p class="page-sub">Jawab dua pertanyaan berikut berdasarkan fenomena pilihanmu.</p>
  </div>

  <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto items-start">
    <div class="card p-6 text-center">
      <div class="text-6xl mb-2">{{ limarFenomena?.icon }}</div>
      <p class="text-xs font-bold text-slate-400">Fenomena yang dipilih:</p>
      <p class="font-display font-bold text-lg text-slate-800">{{ limarFenomena?.nama }}</p>
    </div>

    <div class="md:col-span-2 card p-6 space-y-5">
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">
          1. Fenomena ini tentang apa?
        </label>
        <textarea v-model="gagasan" rows="3" class="input-cute" maxlength="300"
          placeholder="Tuliskan gagasamu di sini..."></textarea>
      </div>
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">
          2. Apa pesan yang ingin disampaikan?
        </label>
        <textarea v-model="pesan" rows="3" class="input-cute" maxlength="300"
          placeholder="Tuliskan pesanmu di sini..."></textarea>
      </div>
      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/limar/explore-fenomena" class="btn-soft">Kembali</NuxtLink>
        <button class="btn-warm" :disabled="!bisaSimpan || menyimpan" @click="simpan">
          {{ menyimpan ? 'Menyimpan...' : '💾 Simpan Peta Ide' }}
        </button>
        <button v-if="tersimpan" class="btn-primary" @click="lanjut">Lanjutkan →</button>
      </div>
      <p v-if="error" class="text-rose-500 text-sm font-bold">{{ error }}</p>

      <div v-if="tersimpan" class="bg-emerald-50 rounded-2xl p-4">
        <p class="font-display font-bold text-emerald-700 mb-2">📋 Ringkasan Peta Ide</p>
        <p class="text-sm font-semibold text-slate-600"><b>Fenomena:</b> {{ limarFenomena?.nama }}</p>
        <p class="text-sm font-semibold text-slate-600"><b>Gagasan:</b> {{ gagasan }}</p>
        <p class="text-sm font-semibold text-slate-600"><b>Pesan:</b> {{ pesan }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

const { siswaId, limarFenomena, petaGagasan, petaPesan } = useSession()
const supabase = useSupabase()

if (!limarFenomena.value) {
  await navigateTo('/limar/explore-fenomena')
}

const gagasan = ref(petaGagasan.value)
const pesan = ref(petaPesan.value)
const menyimpan = ref(false)
const tersimpan = ref(false)
const error = ref('')

const bisaSimpan = computed(() => gagasan.value.trim() && pesan.value.trim())

async function simpan() {
  if (!bisaSimpan.value) return
  menyimpan.value = true
  error.value = ''
  petaGagasan.value = gagasan.value.trim()
  petaPesan.value = pesan.value.trim()
  if (supabase && !siswaId.value.startsWith('lokal-')) {
    try {
      const { error: err } = await supabase.from('peta_ide').insert({
        siswa_id: siswaId.value,
        fenomena_id: limarFenomena.value!.id,
        gagasan: petaGagasan.value,
        pesan: petaPesan.value
      })
      if (err) throw err
    } catch (e) {
      console.error(e)
      error.value = 'Gagal menyimpan ke database, tapi kamu bisa lanjut.'
    }
  }
  menyimpan.value = false
  tersimpan.value = true
}

async function lanjut() {
  await navigateTo('/limar/explain')
}
</script>
