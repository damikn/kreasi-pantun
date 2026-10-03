import type { Fenomena } from '~/data/konten'
import type { KotakFenomena, KotakPola } from '~/data/kotak'

/** Pilihan rima: 1 akhiran + minimal 2 kata dari pohon rima */
export interface RimaChoice {
  suffix: string
  words: string[]
}

/**
 * Model rima KOTAK KREASI (baru, sesuai repo Kotak-Kreasi):
 * - Rima A dipakai untuk baris 1 & 3
 * - Rima B dipakai untuk baris 2 & 4
 */
export interface KotakRimaModel {
  rimaA: RimaChoice
  rimaB: RimaChoice
}

const emptyRima = (): KotakRimaModel => ({
  rimaA: { suffix: '', words: [] },
  rimaB: { suffix: '', words: [] },
})

/**
 * State sesi siswa + progres antar halaman.
 * Siswa login dengan Nama Lengkap (wajib), No. Absen, dan Kelas.
 */
export function useSession() {
  const namaLengkap = useState<string>('siswa_nama_lengkap', () => '')
  const noAbsen = useState<string>('siswa_no_absen', () => '')
  const kelas = useState<string>('siswa_kelas', () => '')
  const siswaId = useState<string>('siswa_id', () => '')

  // --- Kotak Kreasi (model baru: fenomena/pola dari content/kotak/*.json) ---
  const kotakFenomena = useState<KotakFenomena | null>('kotak_fenomena', () => null)
  const kotakPola = useState<KotakPola | null>('kotak_pola', () => null)
  const kotakRima = useState<KotakRimaModel>('kotak_rima', () => emptyRima())

  // --- 5E (tidak berubah) ---
  const limarFenomena = useState<Fenomena | null>('limar_fenomena', () => null)
  const petaGagasan = useState<string>('peta_gagasan', () => '')
  const petaPesan = useState<string>('peta_pesan', () => '')

  // Karya terakhir (untuk halaman hasil)
  const karyaTerakhir = useState<any>('karya_terakhir', () => null)

  function resetKotak() {
    kotakFenomena.value = null
    kotakPola.value = null
    kotakRima.value = emptyRima()
  }

  return {
    namaLengkap, noAbsen, kelas, siswaId,
    kotakFenomena, kotakPola, kotakRima,
    limarFenomena, petaGagasan, petaPesan,
    karyaTerakhir, resetKotak
  }
}
