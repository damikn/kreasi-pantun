<!-- Kotak Kreasi animasi: diklik → tutup terangkat, cahaya + bintang menyembur,
     lalu emit 'terbuka' agar halaman bisa lanjut. -->
<template>
  <div class="kotak-wrap" @click="buka">
    <div class="kotak" :class="{ terbuka: sedangBuka }">
      <!-- Cahaya dari dalam kotak -->
      <div class="cahaya"></div>

      <!-- Badan kotak -->
      <div class="badan">
        <div class="pita-v"></div>
      </div>
      <!-- Tutup kotak -->
      <div class="tutup">
        <div class="pita-v"></div>
        <div class="pita-h"></div>
        <div class="pita-simpul"></div>
      </div>

      <!-- Bintang-bintang yang menyembur saat terbuka -->
      <span v-for="i in 10" :key="i" class="bintang" :style="gayaBintang(i)">✨</span>
    </div>
    <p class="petunjuk" :class="{ hilang: sedangBuka }">
      {{ sedangBuka ? 'Membuka...' : '🎁 Klik kotaknya!' }}
    </p>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ terbuka: [] }>()
const sedangBuka = ref(false)
let sudah = false

function gayaBintang(i: number) {
  const sudut = (i / 10) * 360
  return { '--sudut': `${sudut}deg` } as Record<string, string>
}

function buka() {
  if (sudah) return
  sudah = true
  sedangBuka.value = true
  setTimeout(() => emit('terbuka'), 1900)
}
</script>

<style scoped>
.kotak-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  user-select: none;
  padding: 2rem;
}
.kotak {
  position: relative;
  width: 220px;
  height: 200px;
  animation: goyang 2.2s ease-in-out infinite;
  transform-origin: bottom center;
}
@keyframes goyang {
  0%, 100% { transform: rotate(-3deg) scale(1); }
  50% { transform: rotate(3deg) scale(1.04); }
}
.kotak.terbuka { animation: none; }

/* Badan kotak */
.badan {
  position: absolute;
  bottom: 0;
  left: 15px;
  width: 190px;
  height: 130px;
  background: linear-gradient(160deg, #fbbf24 0%, #f59e0b 55%, #d97706 100%);
  border-radius: 10px 10px 14px 14px;
  box-shadow: 0 18px 35px rgba(217, 119, 6, 0.35), inset 0 -8px 18px rgba(0,0,0,0.12);
  overflow: hidden;
}
/* Tutup kotak */
.tutup {
  position: absolute;
  top: 22px;
  left: 5px;
  width: 210px;
  height: 56px;
  background: linear-gradient(160deg, #fcd34d 0%, #fbbf24 60%, #f59e0b 100%);
  border-radius: 10px;
  box-shadow: 0 8px 18px rgba(217, 119, 6, 0.3);
  transition: transform 0.9s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.9s;
  z-index: 3;
}
.kotak.terbuka .tutup {
  transform: translateY(-160px) rotate(-28deg);
  opacity: 0;
}
/* Pita */
.pita-v {
  position: absolute;
  top: 0; bottom: 0; left: 50%;
  width: 34px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, #ef4444, #dc2626);
  box-shadow: inset 0 0 8px rgba(0,0,0,0.15);
}
.pita-h {
  position: absolute;
  top: 50%; left: 0; right: 0;
  height: 22px;
  transform: translateY(-50%);
  background: linear-gradient(180deg, #ef4444, #dc2626);
}
.pita-simpul {
  position: absolute;
  top: -20px; left: 50%;
  width: 52px; height: 40px;
  transform: translateX(-50%);
  background:
    radial-gradient(circle at 25% 50%, #ef4444 0 18px, transparent 19px),
    radial-gradient(circle at 75% 50%, #ef4444 0 18px, transparent 19px),
    radial-gradient(circle at 50% 55%, #dc2626 0 14px, transparent 15px);
  transition: transform 0.7s, opacity 0.7s;
}
.kotak.terbuka .pita-simpul {
  transform: translateX(-50%) translateY(-90px) scale(0.4);
  opacity: 0;
}
/* Cahaya dari dalam */
.cahaya {
  position: absolute;
  bottom: 40px;
  left: 50%;
  width: 150px; height: 150px;
  transform: translateX(-50%) scale(0);
  background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(253,224,71,0.7) 40%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  z-index: 2;
  pointer-events: none;
}
.kotak.terbuka .cahaya {
  animation: cahaya 1.6s ease-out 0.35s forwards;
}
@keyframes cahaya {
  0% { transform: translateX(-50%) scale(0); opacity: 0; }
  40% { transform: translateX(-50%) scale(1.6); opacity: 1; }
  100% { transform: translateX(-50%) scale(2.4); opacity: 0.9; }
}
/* Bintang menyembur */
.bintang {
  position: absolute;
  bottom: 110px;
  left: 50%;
  font-size: 1.4rem;
  opacity: 0;
  z-index: 4;
  pointer-events: none;
}
.kotak.terbuka .bintang {
  animation: sembur 1.4s ease-out 0.45s forwards;
}
@keyframes sembur {
  0% { transform: translate(-50%, 0) rotate(0deg) scale(0.4); opacity: 0; }
  25% { opacity: 1; }
  100% {
    transform: translate(-50%, 0) rotate(var(--sudut)) translateY(-130px) rotate(calc(var(--sudut) * -1)) scale(1.1);
    opacity: 0;
  }
}
.petunjuk {
  font-weight: 800;
  font-size: 1.25rem;
  color: #b45309;
  animation: denyut 1.4s ease-in-out infinite;
  transition: opacity 0.4s;
}
.petunjuk.hilang { opacity: 0; animation: none; }
@keyframes denyut {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.8; }
}
</style>
