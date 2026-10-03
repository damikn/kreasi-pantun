<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-amber-100">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <NuxtLink to="/pilih" class="flex items-center gap-2">
          <span class="text-3xl">📦</span>
          <span class="font-display font-extrabold text-xl text-slate-800">
            Kreasi <span class="text-emerald-600">Pantun</span>
          </span>
        </NuxtLink>
        <div class="flex items-center gap-2">
          <span v-if="namaLengkap" class="pill bg-emerald-100 text-emerald-700">👋 {{ namaLengkap }}</span>
          <span v-if="kelas" class="pill bg-sky-100 text-sky-700 hidden sm:inline-flex">🏫 {{ kelas }}</span>
          <NuxtLink to="/pilih" class="btn-soft !px-4 !py-2 text-sm">🏠 Menu</NuxtLink>
        </div>
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
const { namaLengkap, kelas } = useSession()
</script>
