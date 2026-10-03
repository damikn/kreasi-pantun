/**
 * SELECT ke tabel `karya` yang toleran bila kolom `skor` belum ada
 * di database (mis. database lama yang belum dimigrasi).
 *
 * Mencoba query dengan kolom skor dulu; bila gagal karena kolom
 * tidak ada, mengulang tanpa kolom skor. Error lain tetap dilempar.
 *
 * @param apply fungsi yang menerima string kolom SELECT dan
 *              mengembalikan promise { data, error } dari Supabase.
 * @returns { data, adaSkor }
 */
export async function fetchKaryaList(
  fieldsDenganSkor: string,
  fieldsTanpaSkor: string,
  apply: (fields: string) => Promise<{ data: any[] | null; error: any }>,
): Promise<{ data: any[]; adaSkor: boolean }> {
  const pertama = await apply(fieldsDenganSkor)
  if (!pertama.error) return { data: pertama.data ?? [], adaSkor: true }
  // Kolom belum ada → ulangi tanpa skor
  if (/skor/i.test(pertama.error.message ?? '')) {
    const kedua = await apply(fieldsTanpaSkor)
    if (kedua.error) throw kedua.error
    return { data: kedua.data ?? [], adaSkor: false }
  }
  throw pertama.error
}
