/**
 * Plugin client-only untuk sistem suara:
 * - Mengembalikan preferensi suara dari localStorage.
 * - SFX `click` otomatis untuk setiap klik pada button / a / [role=button],
 *   kecuali elemen bertanda `data-no-sound` (mis. tombol toggle suara
 *   yang memainkan bunyinya sendiri agar tidak double).
 * - Membuka AudioContext + memulai BGM pada interaksi pertama user
 *   (mematuhi autoplay policy browser).
 */
export default defineNuxtPlugin(() => {
  const { soundOn, click, unlockAudio } = useSound()

  try {
    const saved = localStorage.getItem('kp_sound')
    if (saved !== null) soundOn.value = saved === '1'
  } catch { /* abaikan */ }

  const onClick = (e: MouseEvent) => {
    const el = (e.target as HTMLElement | null)?.closest?.('button, a, [role="button"]') as HTMLElement | null
    if (!el) return
    if (el.hasAttribute('data-no-sound')) return
    if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return
    click()
  }
  document.addEventListener('click', onClick)

  const unlock = () => unlockAudio()
  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('keydown', unlock, { once: true })
})
