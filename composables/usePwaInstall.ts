/**
 * usePwaInstall — tawaran install PWA ke layar utama.
 *
 * Menangkap event `beforeinstallprompt` (Chrome/Android) agar bisa memunculkan
 * tombol install sendiri, mendeteksi status terinstall, dan memberi panduan
 * manual untuk iOS (yang tidak mendukung beforeinstallprompt).
 */
export function usePwaInstall() {
  const promptTertunda = ref<any>(null)
  const sudahTerinstall = ref(false)
  const pilihanUser = ref<string | null>(null)

  const KUNCI_TOLAK = 'kp_install_dismissed'

  /** True bila perangkat iOS (iPhone/iPad). */
  const isIOS = computed(() => {
    if (typeof navigator === 'undefined') return false
    return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  })

  /** Banner boleh tampil bila belum install, belum ditolak baru-baru ini. */
  const tampilBanner = computed(() => {
    if (sudahTerinstall.value) return false
    // Bisa install native (Android/Chrome) atau iOS (panduan manual)
    if (!promptTertunda.value && !isIOS.value) return false
    try {
      const tolak = Number(localStorage.getItem(KUNCI_TOLAK) || 0)
      // Sembunyikan 7 hari setelah ditolak
      if (tolak && Date.now() - tolak < 7 * 24 * 3600 * 1000) return false
    } catch { /* abaikan */ }
    return true
  })

  function cekTerinstall() {
    if (typeof window === 'undefined') return
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches
    const iosStandalone = (navigator as any).standalone === true
    sudahTerinstall.value = Boolean(standalone || iosStandalone)
  }

  /** Panggil install bawaan browser (Android/Chrome). */
  async function install() {
    const p = promptTertunda.value
    if (!p) return
    try {
      await p.prompt()
      const hasil = await p.userChoice
      pilihanUser.value = hasil?.outcome ?? null
    } catch { /* abaikan */ }
    promptTertunda.value = null
    cekTerinstall()
  }

  /** Tutup banner; ingat penolakan 7 hari. */
  function tutup() {
    try { localStorage.setItem(KUNCI_TOLAK, String(Date.now())) } catch { /* abaikan */ }
    promptTertunda.value = null
  }

  if (typeof window !== 'undefined') {
    cekTerinstall()
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      promptTertunda.value = e
      cekTerinstall()
    })
    window.addEventListener('appinstalled', () => {
      sudahTerinstall.value = true
      promptTertunda.value = null
    })
    window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change', cekTerinstall)
  }

  return { bisaInstall: computed(() => !!promptTertunda.value), isIOS, sudahTerinstall, tampilBanner, install, tutup }
}
