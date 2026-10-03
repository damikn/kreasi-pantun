<template>
  <div class="card p-6 md:p-8 relative overflow-hidden">
    <div class="absolute -top-6 -right-6 text-[90px] opacity-10 select-none">🌸</div>
    <p v-if="judul" class="font-display font-bold text-amber-600 text-sm mb-3">{{ judul }}</p>
    <div class="space-y-1.5 relative">
      <p v-for="(b, i) in baris" :key="i"
        class="font-display text-lg md:text-xl font-semibold text-slate-700 leading-relaxed"
        :class="{ 'text-emerald-700': highlightIsi && i >= 2, 'text-sky-700': !highlightIsi && i < 2 }">
        {{ b }}
      </p>
    </div>
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-amber-100">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  baris: string[]
  judul?: string
  highlightIsi?: boolean
}>(), { highlightIsi: false })
</script>
