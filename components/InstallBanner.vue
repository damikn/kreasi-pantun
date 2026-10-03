<template>
  <div v-if="tampilBanner"
    class="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 shadow-md">
    <div class="max-w-5xl mx-auto flex items-center gap-3">
      <span class="text-2xl shrink-0">📲</span>
      <div class="flex-1 min-w-0">
        <p class="text-white font-extrabold text-sm leading-tight">
          Install Kreasi Pantun ke layar utama!
        </p>
        <p class="text-emerald-50 text-xs font-semibold leading-snug">
          <template v-if="bisaInstall">
            Buka lebih cepat &amp; tetap bisa dipakai tanpa internet ✨
          </template>
          <template v-else>
            Ketuk <b>Bagikan</b> ⎙ lalu pilih <b>Tambah ke Layar Utama</b> ➕
          </template>
        </p>
      </div>
      <button v-if="bisaInstall" @click="install"
        class="shrink-0 bg-white text-emerald-700 font-extrabold text-sm rounded-full px-4 py-2 shadow transition active:scale-95 hover:bg-emerald-50">
        Install
      </button>
      <button @click="tutup" aria-label="Tutup"
        class="shrink-0 w-8 h-8 rounded-full text-white/80 hover:text-white hover:bg-white/10 font-extrabold transition">
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { tampilBanner, bisaInstall, install, tutup } = usePwaInstall()
</script>
