import type { Fenomena, Pola } from '~/data/konten'

/**
 * State sesi siswa + progres antar halaman.
 * Siswa login dengan Nama Lengkap (wajib), No. Absen, dan Kelas.
 */
export function useSession() {
  const namaLengkap = useState<string>('siswa_nama_lengkap', () => '')
  const noAbsen = useState<string>('siswa_no_absen', () => '')
  const kelas = useState<string>('siswa_kelas', () => '')
  const siswaId = useState<string>('siswa_id', () => '')

  // --- Kotak Kreasi ---
  const kotakFenomena = useState<Fenomena | null>('kotak_fenomena', () => null)
  const kotakPola = useState<Pola | null>('kotak_pola', () => null)
  const kotakRima = useState<string[]>('kotak_rima', () => [])

  // --- 5E ---
  const limarFenomena = useState<Fenomena | null>('limar_fenomena', () => null)
  const petaGagasan = useState<string>('peta_gagasan', () => '')
  const petaPesan = useState<string>('peta_pesan', () => '')

  // Karya terakhir (untuk halaman hasil)
  const karyaTerakhir = useState<any>('karya_terakhir', () => null)

  function resetKotak() {
    kotakFenomena.value = null
    kotakPola.value = null
    kotakRima.value = []
  }

  return {
    namaLengkap, noAbsen, kelas, siswaId,
    kotakFenomena, kotakPola, kotakRima,
    limarFenomena, petaGagasan, petaPesan,
    karyaTerakhir, resetKotak
  }
}
