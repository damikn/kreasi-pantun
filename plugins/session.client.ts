/**
 * Plugin client-only: pulihkan sesi dari localStorage saat aplikasi dimulai,
 * lalu simpan otomatis setiap ada perubahan state sesi.
 *
 * Dijalankan sebelum route middleware pada pemuatan awal, sehingga
 * middleware `auth` melihat sesi yang sudah dipulihkan dan pengguna
 * tidak dilempar ke halaman login saat me-refresh.
 */
export default defineNuxtPlugin(() => {
  const s = useSession()

  // Pulihkan dulu, baru pasang watcher agar restore tidak memicu save berlebih.
  s.restore()

  watch(
    () => [
      s.namaLengkap.value,
      s.noAbsen.value,
      s.kelas.value,
      s.siswaId.value,
      s.guruAuthed.value,
      s.kotakFenomena.value,
      s.kotakPola.value,
      s.kotakRima.value,
      s.limarFenomena.value,
      s.petaGagasan.value,
      s.petaPesan.value,
      s.karyaTerakhir.value,
    ],
    () => s.save(),
    { deep: true },
  )
})
