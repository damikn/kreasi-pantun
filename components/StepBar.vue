<template>
  <div class="flex items-center justify-center gap-1 md:gap-2 mb-8 flex-wrap">
    <template v-for="(s, i) in steps" :key="s">
      <div class="flex items-center gap-1 md:gap-2">
        <div
          class="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs md:text-sm font-bold transition"
          :class="i < current
            ? 'bg-emerald-100 text-emerald-700'
            : i === current
              ? 'text-white shadow-lg shadow-emerald-200'
              : 'bg-white text-slate-400 border border-slate-200'"
          :style="i === current ? 'background: linear-gradient(135deg,#34d399,#10b981)' : ''"
        >
          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
            :class="i < current ? 'bg-emerald-500 text-white' : i === current ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-400'">
            {{ i < current ? '✓' : i + 1 }}
          </span>
          {{ s }}
        </div>
        <div v-if="i < steps.length - 1" class="w-4 md:w-8 h-0.5 rounded bg-amber-200"></div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{ steps: string[], current: number }>()
</script>
