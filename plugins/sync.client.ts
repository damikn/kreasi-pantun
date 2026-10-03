/**
 * Plugin client-only: daftarkan remap siswaId sesi saat sinkronisasi
 * mengganti tempId offline menjadi id asli, lalu jalankan sinkronisasi
 * awal bila sedang online dan ada antrean tertunda.
 *
 * Dijalankan setelah plugins/session.client.ts (urutan alfabetis),
 * sehingga sesi sudah dipulihkan dari localStorage.
 */
export default defineNuxtPlugin(() => {
  const sync = useSync()
  const sess = useSession()

  sync.onRemapSiswa((tempId: string, newId: string) => {
    if (sess.siswaId.value === tempId) {
      sess.siswaId.value = newId
      sess.save()
    }
  })

  if (sync.isOnline.value && sync.pendingCount.value > 0) {
    void sync.sinkronkan()
  }
})
