/**
 * Util SELECT ke tabel `karya` yang toleran bila kolom belum ada
 * di database (mis. database lama yang belum dimigrasi).
 *
 * Tiap varian dicoba berurutan (dari paling lengkap ke paling minimal);
 * bila gagal karena kolom tidak ada, mundur ke varian berikutnya.
 * Error lain langsung dilempar.
 */

export interface KaryaFitur {
  /** kolom `skor` tersedia */
  skor: boolean
  /** kolom penilaian guru (`nilai_guru`, `komentar_guru`, `dinilai_at`) tersedia */
  penilaian: boolean
}

export interface KaryaVarian {
  fields: string
  fitur: KaryaFitur
}

/**
 * @param varian daftar varian kolom SELECT dari lengkap ke minimal
 * @param apply fungsi yang menerima string kolom dan mengembalikan { data, error }
 * @returns { data, fitur } — fitur sesuai varian yang berhasil
 */
export async function fetchKaryaList(
  varian: KaryaVarian[],
  apply: (fields: string) => Promise<{ data: any[] | null; error: any }>,
): Promise<{ data: any[]; fitur: KaryaFitur }> {
  let terakhir: any = null
  for (const v of varian) {
    const r = await apply(v.fields)
    if (!r.error) return { data: r.data ?? [], fitur: v.fitur }
    terakhir = r.error
    if (!/column/i.test(String(r.error?.message ?? ''))) throw r.error
  }
  throw terakhir
}

/**
 * Ambil SATU karya by id (untuk halaman detail guru), toleran kolom.
 * Mengikutsertakan join siswa, fenomena, dan pola.
 */
export async function fetchSatuKarya(
  supabase: any,
  id: string,
): Promise<{ data: any | null; fitur: KaryaFitur }> {
  const JOIN = ', siswa:siswa_id(nama_lengkap, no_absen, kelas), fenomena:fenomena_id(nama), pola:pola_id(nama)'
  const BASE = 'id, siswa_id, app, fenomena_id, pola_id, baris1, baris2, baris3, baris4, rima_dipilih, created_at'
  const varian: KaryaVarian[] = [
    { fields: `${BASE}, skor, nilai_guru, komentar_guru, dinilai_at${JOIN}`, fitur: { skor: true, penilaian: true } },
    { fields: `${BASE}, skor${JOIN}`, fitur: { skor: true, penilaian: false } },
    { fields: `${BASE}${JOIN}`, fitur: { skor: false, penilaian: false } },
  ]
  const { data, fitur } = await fetchKaryaList(varian, (fields) =>
    supabase.from('karya').select(fields).eq('id', id).maybeSingle()
      .then((r: any) => ({ data: r.data ? [r.data] : [], error: r.error })),
  )
  return { data: data[0] ?? null, fitur }
}

/**
 * Simpan penilaian guru ke satu karya.
 * Melempar error bila kolom penilaian belum ada di database.
 */
export async function simpanPenilaianGuru(
  supabase: any,
  id: string,
  nilai: number,
  komentar: string,
): Promise<void> {
  const { error } = await supabase.from('karya').update({
    nilai_guru: nilai,
    komentar_guru: komentar?.trim() ? komentar.trim() : null,
    dinilai_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) throw error
}
