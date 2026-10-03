<template>
  <button
    data-no-sound
    type="button"
    @click="toggle"
    :aria-label="soundOn ? 'Matikan suara' : 'Nyalakan suara'"
    :title="soundOn ? 'Matikan suara' : 'Nyalakan suara'"
    class="btn-soft !px-3 !py-2 text-lg leading-none"
  >
    {{ soundOn ? '🔊' : '🔇' }}
  </button>
</template>

<script setup lang="ts">
const { soundOn, toggleSound, startBgm, pop } = useSound()

function toggle() {
  toggleSound()
  // toggleSound() mematikan BGM saat dimatikan; saat dinyalakan, mulai lagi + bunyi pop.
  if (soundOn.value) {
    startBgm()
    pop()
  }
}
</script>
