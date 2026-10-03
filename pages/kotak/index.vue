<template>
  <div class="text-center py-16">
    <p class="font-bold text-slate-400">Memuat Kotak Kreasi...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app', middleware: 'auth' })

// /kotak → mulai dari langkah pertama
await navigateTo('/kotak/fenomena')
</script>
