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
 *
 * Sesi disimpan ke localStorage (lihat save()/restore()) sehingga tidak
 * hilang saat halaman di-refresh. Plugin plugins/session.client.ts
 * memanggil restore() saat aplikasi dimulai dan menyimpan otomatis
 * setiap ada perubahan state.
 */
export function useSession() {
  const namaLengkap = useState<string>('siswa_nama_lengkap', () => '')
  const noAbsen = useState<string>('siswa_no_absen', () => '')
  const kelas = useState<string>('siswa_kelas', () => '')
  const siswaId = useState<string>('siswa_id', () => '')

  // Status login guru (dashboard /guru)
  const guruAuthed = useState<boolean>('guru_authed', () => false)

  // Penanda sekali-pakai: true tepat setelah siswa lama berhasil masuk kembali.
  // Tidak dipersist ke localStorage — hanya untuk banner sambutan di /pilih.
  const datangKembali = useState<boolean>('siswa_datang_kembali', () => false)

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

  // ---- Persistensi sesi (localStorage) ----
  const STORAGE_KEY = 'kreasi-pantun-sesi-v1'

  /** Simpan seluruh state sesi ke localStorage. Aman dipanggil di server (no-op). */
  function save() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        namaLengkap: namaLengkap.value,
        noAbsen: noAbsen.value,
        kelas: kelas.value,
        siswaId: siswaId.value,
        guruAuthed: guruAuthed.value,
        kotakFenomena: kotakFenomena.value,
        kotakPola: kotakPola.value,
        kotakRima: kotakRima.value,
        limarFenomena: limarFenomena.value,
        petaGagasan: petaGagasan.value,
        petaPesan: petaPesan.value,
        karyaTerakhir: karyaTerakhir.value,
      }))
    } catch { /* abaikan: storage penuh / tidak tersedia */ }
  }

  /** Kembalikan state sesi dari localStorage. Dipanggil sekali saat aplikasi dimulai (client). */
  function restore() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const d = JSON.parse(raw)
      if (typeof d.namaLengkap === 'string') namaLengkap.value = d.namaLengkap
      if (typeof d.noAbsen === 'string') noAbsen.value = d.noAbsen
      if (typeof d.kelas === 'string') kelas.value = d.kelas
      if (typeof d.siswaId === 'string') siswaId.value = d.siswaId
      if (typeof d.guruAuthed === 'boolean') guruAuthed.value = d.guruAuthed
      if (d.kotakFenomena) kotakFenomena.value = d.kotakFenomena
      if (d.kotakPola) kotakPola.value = d.kotakPola
      if (d.kotakRima) kotakRima.value = d.kotakRima
      if (d.limarFenomena) limarFenomena.value = d.limarFenomena
      if (typeof d.petaGagasan === 'string') petaGagasan.value = d.petaGagasan
      if (typeof d.petaPesan === 'string') petaPesan.value = d.petaPesan
      if (d.karyaTerakhir) karyaTerakhir.value = d.karyaTerakhir
    } catch { /* abaikan: data korup */ }
  }

  /** Keluar sebagai siswa: bersihkan state + hapus simpanan lokal. */
  function logout() {
    namaLengkap.value = ''
    noAbsen.value = ''
    kelas.value = ''
    siswaId.value = ''
    resetKotak()
    limarFenomena.value = null
    petaGagasan.value = ''
    petaPesan.value = ''
    karyaTerakhir.value = null
    if (import.meta.client) {
      try { localStorage.removeItem(STORAGE_KEY) } catch { /* abaikan */ }
    }
  }

  /** Keluar sebagai guru. */
  function logoutGuru() {
    guruAuthed.value = false
    save()
  }

  return {
    namaLengkap, noAbsen, kelas, siswaId, guruAuthed, datangKembali,
    kotakFenomena, kotakPola, kotakRima,
    limarFenomena, petaGagasan, petaPesan,
    karyaTerakhir, resetKotak,
    save, restore, logout, logoutGuru,
  }
}
