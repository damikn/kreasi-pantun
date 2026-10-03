/**
 * useSound — sistem suara Web Audio API murni (tanpa file audio eksternal).
 *
 * - AudioContext dibuat secara lazy dan di-resume saat interaksi pertama
 *   user (mematuhi autoplay policy browser).
 * - SFX: click, pop, tick, success, error, win, swoosh — semuanya dari
 *   oscillator (sine/triangle/square) + gain envelope, durasi 0.05–0.9 dtk.
 * - BGM: loop melodi pentatonik mayor (C–D–E–G–A) yang ceria, triangle wave
 *   volume kecil + bass sederhana, tempo ±120 BPM.
 * - Aman untuk SSR: semua akses window/AudioContext dijaga `typeof window`.
 *
 * Kalau nanti mau mengganti BGM dengan file MP3 sendiri:
 *   1. Taruh file di `public/sounds/bgm.mp3`
 *   2. Ganti isi fungsi `startBgm()`/`stopBgm()` dengan <audio> loop biasa,
 *      contoh:
 *        const el = new Audio('/sounds/bgm.mp3'); el.loop = true
 *        el.volume = 0.25; el.play()  // simpan `el` untuk stopBgm()
 */

// ---- Singleton level modul (dibagi semua pemanggil composable) ----
let ctx: AudioContext | null = null
let master: GainNode | null = null
let bgmTimer: ReturnType<typeof setInterval> | null = null
let bgmNextTime = 0
let bgmStep = 0

const isClient = () => typeof window !== 'undefined'

function ensureCtx(): AudioContext | null {
  if (!isClient()) return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 1
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

/** Nada tunggal pada waktu absolut (dipakai SFX & scheduler BGM). */
function toneAt(f: number, when: number, dur: number, type: OscillatorType, vol: number, slideTo?: number) {
  if (!ctx || !master) return
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(Math.max(30, f), when)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), when + dur)
  g.gain.setValueAtTime(0.0001, when)
  g.gain.exponentialRampToValueAtTime(vol, when + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur)
  osc.connect(g)
  g.connect(master)
  osc.start(when)
  osc.stop(when + dur + 0.05)
}

/** Nada SFX relatif terhadap "sekarang" (+ offset detik). */
function blip(f: number, dur: number, type: OscillatorType, vol: number, at = 0, slideTo?: number) {
  const ac = ensureCtx()
  if (!ac) return
  toneAt(f, ac.currentTime + at, dur, type, vol, slideTo)
}

// ---- BGM: melodi pentatonik mayor (C D E G A), 16 langkah ----
const MELODY = [
  659.25, 783.99, 880.0, 783.99,
  659.25, 587.33, 523.25, 0,
  659.25, 783.99, 880.0, 1046.5,
  880.0, 783.99, 659.25, 587.33,
]
const BASSLINE = [130.81, 130.81, 174.61, 196.0] // C3 C3 F3 G3
const STEP_DUR = 0.25 // eighth note @120 BPM

function scheduleBgm() {
  if (!ctx) return
  while (bgmNextTime < ctx.currentTime + 0.5) {
    const s = bgmStep % 16
    const mf = MELODY[s]
    if (mf > 0) toneAt(mf, bgmNextTime, 0.22, 'triangle', 0.045)
    if (s % 4 === 0) toneAt(BASSLINE[(s / 4) | 0], bgmNextTime, 0.42, 'sine', 0.06)
    bgmNextTime += STEP_DUR
    bgmStep++
  }
}

export function useSound() {
  const soundOn = useState<boolean>('kp_sound_on', () => true)

  /** true bila boleh bunyi: di client + soundOn + AudioContext tersedia */
  function ready(): boolean {
    if (!isClient() || !soundOn.value) return false
    return ensureCtx() !== null
  }

  // ---------- SFX ----------
  function click() {
    if (!ready()) return
    blip(760, 0.06, 'triangle', 0.07, 0, 520)
  }
  function pop() {
    if (!ready()) return
    blip(380, 0.09, 'sine', 0.12, 0, 720)
  }
  function tick() {
    if (!ready()) return
    blip(1350, 0.03, 'square', 0.035)
  }
  function success() {
    if (!ready()) return
    blip(523.25, 0.22, 'triangle', 0.12)
    blip(659.25, 0.22, 'triangle', 0.12, 0.09)
    blip(783.99, 0.3, 'triangle', 0.12, 0.18)
  }
  function error() {
    if (!ready()) return
    blip(220, 0.16, 'square', 0.06, 0, 165)
    blip(185, 0.2, 'square', 0.06, 0.13, 140)
  }
  function win() {
    if (!ready()) return
    const seq = [523.25, 659.25, 783.99, 1046.5]
    seq.forEach((f, i) => blip(f, 0.28, 'triangle', 0.12, i * 0.11))
    blip(1318.5, 0.45, 'triangle', 0.1, seq.length * 0.11)
  }
  function swoosh() {
    if (!ready()) return
    blip(240, 0.22, 'sine', 0.07, 0, 920)
  }
  /** Kotak kreasi dibuka: tutup terangkat + kilau magis + denting. */
  function openBox() {
    if (!ready()) return
    blip(300, 0.35, 'sine', 0.09, 0, 950)
    const seq = [880, 1046.5, 1318.5, 1568]
    seq.forEach((f, i) => blip(f, 0.28, 'triangle', 0.1, 0.3 + i * 0.1))
    blip(2093, 0.6, 'sine', 0.08, 0.3 + seq.length * 0.1)
  }

  // ---------- BGM ----------
  function startBgm() {
    if (!isClient() || bgmTimer) return
    if (!soundOn.value) return
    const ac = ensureCtx()
    if (!ac) return
    bgmNextTime = ac.currentTime + 0.1
    bgmStep = 0
    bgmTimer = setInterval(scheduleBgm, 150)
  }
  function stopBgm() {
    if (bgmTimer) {
      clearInterval(bgmTimer)
      bgmTimer = null
    }
  }

  /** Dipanggil saat interaksi pertama user: buka AudioContext + mulai BGM. */
  function unlockAudio() {
    if (!isClient()) return
    ensureCtx()
    if (soundOn.value) startBgm()
  }

  function toggleSound() {
    soundOn.value = !soundOn.value
    if (isClient()) {
      try {
        localStorage.setItem('kp_sound', soundOn.value ? '1' : '0')
      } catch { /* abaikan */ }
    }
    if (!soundOn.value) stopBgm()
  }

  return {
    soundOn,
    click, pop, tick, success, error, win, swoosh,
    startBgm, stopBgm, unlockAudio, toggleSound, openBox,
  }
}
