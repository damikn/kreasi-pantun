<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-amber-100">
      <div class="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <!-- Kiri: ikon user (dropdown menu) + speaker -->
        <div class="flex items-center gap-2">
          <div class="relative" ref="dropdownRef">
            <button @click="menuBuka = !menuBuka" aria-label="Menu pengguna"
              class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-display font-extrabold text-white shadow-md shadow-emerald-200 transition active:scale-95"
              :class="guruAuthed ? 'bg-gradient-to-br from-violet-400 to-violet-600' : 'bg-gradient-to-br from-emerald-400 to-emerald-600'">
              {{ inisial }}
            </button>
            <!-- Dropdown menu -->
            <Transition name="menu">
              <div v-if="menuBuka"
                class="absolute left-0 top-[calc(100%+10px)] w-60 card !rounded-2xl p-2 z-50 shadow-xl">
                <div class="px-3 py-2.5 border-b border-amber-100 mb-1">
                  <template v-if="guruAuthed">
                    <p class="font-bold text-sm text-slate-700">👩‍🏫 Mode Guru</p>
                    <p class="text-xs font-semibold text-slate-400">Dashboard pengajar</p>
                  </template>
                  <template v-else>
                    <p class="font-bold text-sm text-slate-700 truncate">👋 {{ namaLengkap || 'Tamu' }}</p>
                    <p v-if="kelas || noAbsen" class="text-xs font-semibold text-slate-400">
                      {{ [kelas ? `🏫 ${kelas}` : '', noAbsen ? `No. ${noAbsen}` : ''].filter(Boolean).join(' • ') }}
                    </p>
                  </template>
                </div>
                <template v-if="guruAuthed">
                  <NuxtLink to="/guru/dashboard" class="menu-item" @click="menuBuka = false">📊 Dashboard</NuxtLink>
                  <button class="menu-item !text-rose-600" @click="keluarGuru">🚪 Keluar</button>
                </template>
                <template v-else>
                  <NuxtLink to="/pilih" class="menu-item" @click="menuBuka = false">🏠 Menu Utama</NuxtLink>
                  <NuxtLink to="/karyaku" class="menu-item" @click="menuBuka = false">📖 Buku Karyaku</NuxtLink>
                  <button v-if="namaLengkap" class="menu-item !text-rose-600" @click="keluarSiswa">🚪 Keluar</button>
                </template>
              </div>
            </Transition>
          </div>
          <SoundToggle />
        </div>

        <!-- Kanan: nama sistem -->
        <NuxtLink :to="beranda" class="flex items-center gap-1.5 shrink-0">
          <span class="text-2xl">📦</span>
          <span class="font-display font-extrabold text-lg text-slate-800 whitespace-nowrap">
            Kreasi <span class="text-emerald-600">Pantun</span>
          </span>
        </NuxtLink>
      </div>
    </header>
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 py-6 md:py-10">
      <slot />
    </main>
    <footer class="text-center text-xs text-slate-400 font-semibold pb-6 px-4">
      Kreasi Pantun — Jelajahi Ide, Rangkai Kata, Ciptakan Pantunmu! ✨
    </footer>
  </div>
</template>

<script setup lang="ts">
const { namaLengkap, noAbsen, kelas, guruAuthed, logout, logoutGuru } = useSession()

const menuBuka = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

/** Huruf awal nama untuk ikon profil (guru: 👩‍🏫, tanpa nama: 👤). */
const inisial = computed(() => {
  if (guruAuthed.value) return '👩‍🏫'
  const n = namaLengkap.value.trim()
  return n ? n.charAt(0).toUpperCase() : '👤'
})

/** Tujuan logo: dashboard untuk guru, menu untuk siswa. */
const beranda = computed(() => (guruAuthed.value ? '/guru/dashboard' : '/pilih'))

function keluarSiswa() {
  menuBuka.value = false
  logout()
  navigateTo('/')
}

function keluarGuru() {
  menuBuka.value = false
  logoutGuru()
  navigateTo('/guru')
}

/** Tutup dropdown saat klik di luar area atau tekan Escape. */
function onDocClick(e: MouseEvent) {
  if (menuBuka.value && dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    menuBuka.value = false
  }
}
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') menuBuka.value = false
}
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.menu-enter-active, .menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.menu-enter-from, .menu-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
