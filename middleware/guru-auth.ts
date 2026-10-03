/**
 * Middleware: halaman guru hanya bisa diakses setelah memasukkan kode guru.
 */
export default defineNuxtRouteMiddleware(() => {
  const guruAuthed = useState<boolean>('guru_authed')
  if (!guruAuthed.value) {
    return navigateTo('/guru')
  }
})
