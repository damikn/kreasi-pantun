/**
 * Middleware: halaman aplikasi hanya bisa diakses setelah siswa login
 * (mengisi nama lengkap).
 */
export default defineNuxtRouteMiddleware(() => {
  const namaLengkap = useState<string>('siswa_nama_lengkap')
  if (!namaLengkap.value) {
    return navigateTo('/')
  }
})
