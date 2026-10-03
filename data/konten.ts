// Data konten statis aplikasi. Dipakai sebagai fallback bila Supabase belum dikonfigurasi.
// ID diselaraskan dengan supabase/seed.sql.

export interface Fenomena {
  id: number
  nama: string
  deskripsi: string
  icon: string
  app: 'kotak' | '5e'
}

export interface Pola {
  id: number
  nomor: number
  nama: string
  deskripsiSampiran: string
  deskripsiIsi: string
  contoh: string[]
}

export interface KataRima {
  kata: string
  akhiran: string
  kategori: string
}

export const fenomenaKotak: Fenomena[] = [
  { id: 1, nama: 'Penggunaan media sosial berlebihan', deskripsi: 'Terlalu lama bermain gawai hingga lupa waktu belajar dan istirahat.', icon: '📱', app: 'kotak' },
  { id: 2, nama: 'Sampah plastik di lingkungan', deskripsi: 'Sampah plastik berserakan mencemari tanah dan sungai di sekitar kita.', icon: '🗑️', app: 'kotak' },
  { id: 3, nama: 'Perundungan di sekolah', deskripsi: 'Ejekan dan perlakuan tidak menyenangkan kepada teman di sekolah.', icon: '🧒', app: 'kotak' },
  { id: 4, nama: 'Gaya hidup sehat', deskripsi: 'Rajin berolahraga, makan bergizi, dan istirahat cukup setiap hari.', icon: '💪', app: 'kotak' },
  { id: 5, nama: 'Krisis kepercayaan diri', deskripsi: 'Merasa minder dan takut mencoba hal baru karena takut gagal.', icon: '😟', app: 'kotak' },
  { id: 6, nama: 'Pentingnya pendidikan', deskripsi: 'Sekolah membuka wawasan dan menjadi bekal meraih cita-cita.', icon: '🎓', app: 'kotak' },
  { id: 7, nama: 'Fenomena FOMO', deskripsi: 'Takut ketinggalan tren hingga selalu ingin ikut-ikutan teman.', icon: '😱', app: 'kotak' },
  { id: 8, nama: 'Kepedulian terhadap lingkungan', deskripsi: 'Menjaga kebersihan dan kelestarian alam di sekitar kita.', icon: '🌍', app: 'kotak' },
  { id: 9, nama: 'Budaya instan', deskripsi: 'Ingin serba cepat tanpa proses, malas berusaha dan berjuang.', icon: '⏰', app: 'kotak' },
  { id: 10, nama: 'Toleransi dan perbedaan', deskripsi: 'Menghargai teman yang berbeda suku, agama, dan pendapat.', icon: '🤝', app: 'kotak' }
]

export const fenomena5e: Fenomena[] = [
  { id: 101, nama: 'Kebersihan kelas', deskripsi: 'Sampah yang berserakan membuat ruang kelas terlihat kurang nyaman.', icon: '🧹', app: '5e' },
  { id: 102, nama: 'Membantu teman', deskripsi: 'Seorang teman kesulitan membawa buku yang banyak.', icon: '📚', app: '5e' },
  { id: 103, nama: 'Penggunaan gawai', deskripsi: 'Bermain gawai terus-menerus hingga lupa waktu belajar.', icon: '📱', app: '5e' },
  { id: 104, nama: 'Menunda tugas', deskripsi: 'Pekerjaan sekolah dikerjakan mepet tenggat waktu.', icon: '⏳', app: '5e' },
  { id: 105, nama: 'Menjaga lingkungan', deskripsi: 'Menanam pohon dan merawat kebersihan sekitar rumah.', icon: '🌳', app: '5e' },
  { id: 106, nama: 'Menghargai teman', deskripsi: 'Mendengarkan pendapat teman dengan sopan dan terbuka.', icon: '💛', app: '5e' },
  { id: 107, nama: 'Disiplin waktu', deskripsi: 'Datang tepat waktu dan mengatur jadwal dengan baik.', icon: '⏰', app: '5e' },
  { id: 108, nama: 'Kerja sama', deskripsi: 'Bekerja dalam kelompok untuk mencapai tujuan bersama.', icon: '👥', app: '5e' }
]

export const daftarPola: Pola[] = [
  {
    id: 1, nomor: 1, nama: 'Repetisi pada Awal Sampiran',
    deskripsiSampiran: 'Kata pertama pada baris 1 diulang sebagai kata pertama pada baris 2.',
    deskripsiIsi: 'Isi bebas, sesuaikan dengan pesan yang ingin disampaikan.',
    contoh: [
      'Di tepi pantai ombak berkejaran,',
      'Di kala senja langit memerah;',
      'Hormati guru setiap waktu,',
      'Ilmu berkah hidup pun mudah.'
    ]
  },
  {
    id: 2, nomor: 2, nama: 'Repetisi pada Awal Isi',
    deskripsiSampiran: 'Sampiran bebas, gunakan gambaran alam sekitar.',
    deskripsiIsi: 'Kata pertama pada baris 3 diulang sebagai kata pertama pada baris 4.',
    contoh: [
      'Anak ayam turun sepuluh,',
      'Mati satu tinggal sembilan;',
      'Tuntut ilmu dengan sungguh-sungguh,',
      'Sungguh mulia cita-citamu kawan.'
    ]
  },
  {
    id: 3, nomor: 3, nama: 'Repetisi pada Akhir dan Awal Sampiran',
    deskripsiSampiran: 'Kata terakhir pada baris 1 digunakan sebagai kata awal pada baris 2.',
    deskripsiIsi: 'Isi bebas, sesuaikan dengan pesan yang ingin disampaikan.',
    contoh: [
      'Pergi ke pasar membeli mangga,',
      'Mangga manis dibawa pulang;',
      'Rajin belajar sejak muda,',
      'Agar cita-cita mudah gemilang.'
    ]
  },
  {
    id: 4, nomor: 4, nama: 'Isi Berupa Nasihat',
    deskripsiSampiran: 'Sampiran bertema alam sekitar.',
    deskripsiIsi: 'Baris 3 dan 4 berisi nasihat atau pesan moral.',
    contoh: [
      'Bunga mawar harum baunya,',
      'Tumbuh subur di tepi taman;',
      'Jagalah lisan dan perbuatanmu,',
      'Agar hidup penuh kedamaian.'
    ]
  },
  {
    id: 5, nomor: 5, nama: 'Isi Berupa Ajakan',
    deskripsiSampiran: 'Sampiran bertema alam sekitar.',
    deskripsiIsi: 'Baris 3 dan 4 berisi ajakan untuk berbuat baik.',
    contoh: [
      'Ke hutan melihat rusa,',
      'Rusa lari ke dalam semak;',
      'Mari menjaga kebersihan,',
      'Lingkungan sehat hati pun senang.'
    ]
  }
]

export const kataRima: KataRima[] = [
  { kata: 'cahaya', akhiran: '-a', kategori: 'kata benda' },
  { kata: 'bahagia', akhiran: '-a', kategori: 'kata sifat' },
  { kata: 'percaya', akhiran: '-a', kategori: 'kata kerja' },
  { kata: 'nyata', akhiran: '-a', kategori: 'kata sifat' },
  { kata: 'ceria', akhiran: '-a', kategori: 'kata sifat' },
  { kata: 'dunia', akhiran: '-a', kategori: 'kata benda' },
  { kata: 'senja', akhiran: '-a', kategori: 'kata benda' },
  { kata: 'hati', akhiran: '-i', kategori: 'kata benda' },
  { kata: 'melati', akhiran: '-i', kategori: 'kata benda' },
  { kata: 'sejati', akhiran: '-i', kategori: 'kata sifat' },
  { kata: 'pagi', akhiran: '-i', kategori: 'kata benda' },
  { kata: 'budi', akhiran: '-i', kategori: 'kata benda' },
  { kata: 'awan', akhiran: '-an', kategori: 'kata benda' },
  { kata: 'kawan', akhiran: '-an', kategori: 'kata benda' },
  { kata: 'jalan', akhiran: '-an', kategori: 'kata benda' },
  { kata: 'bulan', akhiran: '-an', kategori: 'kata benda' },
  { kata: 'taman', akhiran: '-an', kategori: 'kata benda' },
  { kata: 'pulang', akhiran: '-ang', kategori: 'kata kerja' },
  { kata: 'gemilang', akhiran: '-ang', kategori: 'kata sifat' },
  { kata: 'senang', akhiran: '-ang', kategori: 'kata sifat' },
  { kata: 'datang', akhiran: '-ang', kategori: 'kata kerja' },
  { kata: 'belajar', akhiran: '-ar', kategori: 'kata kerja' },
  { kata: 'segar', akhiran: '-ar', kategori: 'kata sifat' },
  { kata: 'sabar', akhiran: '-ar', kategori: 'kata sifat' },
  { kata: 'jamu', akhiran: '-u', kategori: 'kata benda' },
  { kata: 'ilmu', akhiran: '-u', kategori: 'kata benda' },
  { kata: 'malu', akhiran: '-u', kategori: 'kata sifat' },
  { kata: 'pandai', akhiran: '-ai', kategori: 'kata sifat' },
  { kata: 'ramai', akhiran: '-ai', kategori: 'kata sifat' },
  { kata: 'damai', akhiran: '-ai', kategori: 'kata sifat' },
  { kata: 'indah', akhiran: '-indah', kategori: 'kata sifat' },
  { kata: 'mudah', akhiran: '-indah', kategori: 'kata sifat' }
]

export const akhiranList = ['-a', '-i', '-an', '-ang', '-ar', '-u', '-ai', '-indah']

// ---- Konten khusus 5E ----

export const pantunContoh = [
  'Pergi ke taman memetik melati,',
  'Singgah sebentar membeli jamu.',
  'Jagalah kelas sepenuh hati,',
  'Agar nyaman menuntut ilmu.'
]

export const engageFenomena = {
  judul: 'Kebersihan kelas',
  deskripsi: 'Sampah yang berserakan membuat ruang kelas terlihat kurang nyaman.',
  pesan: 'Jagalah kebersihan kelas bersama-sama agar suasana belajar menjadi nyaman.',
  pantun: pantunContoh
}

export const matchingGame = {
  fenomena: [
    { id: 'A', label: 'Kelas yang kotor', icon: '🏫' },
    { id: 'B', label: 'Membantu teman yang kesulitan membawa buku', icon: '📚' }
  ],
  pesanOptions: [
    { id: 'p1', teks: 'Menjaga kebersihan kelas agar nyaman untuk belajar.', cocokUntuk: 'A' },
    { id: 'p2', teks: 'Membantu teman yang mengalami kesulitan dengan tulus.', cocokUntuk: 'B' }
  ],
  pantunOptions: [
    {
      id: 't1',
      baris: [
        'Bersih kelasnya, hati senang,',
        'Ilmu pun makin terang.',
        'Jagalah kebersihan dengan sayang,',
        'Untuk masa depan yang gemilang.'
      ],
      cocokUntuk: 'A'
    },
    {
      id: 't2',
      baris: [
        'Teman sejati ibarat pelita,',
        'Menerangi di saat gelap.',
        'Bantulah dengan sepenuh hati,',
        'Itu tanda persahabatan yang tulus.'
      ],
      cocokUntuk: 'B'
    }
  ]
}

// TTS: penempatan kata yang sudah dihitung agar saling bersilangan.
// Grid: baris 0-7, kolom 2-6.
export interface TtsWord {
  nomor: number
  kata: string
  arah: 'mendatar' | 'menurun'
  baris: number
  kolom: number
  petunjuk: string
}

export const ttsWords: TtsWord[] = [
  { nomor: 1, kata: 'ISI', arah: 'mendatar', baris: 4, kolom: 2, petunjuk: 'Bagian pantun yang memuat pesan atau maksud.' },
  { nomor: 2, kata: 'SAMPIRAN', arah: 'menurun', baris: 0, kolom: 4, petunjuk: 'Bagian awal pantun yang mengantarkan isi.' },
  { nomor: 3, kata: 'RIMA', arah: 'mendatar', baris: 2, kolom: 2, petunjuk: 'Kesamaan bunyi pada akhir baris pantun.' },
  { nomor: 4, kata: 'PANTUN', arah: 'menurun', baris: 1, kolom: 5, petunjuk: 'Salah satu bentuk puisi rakyat.' }
]

export const kriteriaEvaluasi = [
  'Pantun terdiri atas empat baris.',
  'Sampiran dan isi tersusun dengan tepat.',
  'Bunyi akhir baris memiliki kesesuaian rima.',
  'Isi pantun menyampaikan pesan yang jelas.',
  'Pilihan kata sesuai dengan gagasan dan makna.'
]

export const pertanyaanRefleksi = [
  'Hal menarik apa yang kamu pelajari hari ini tentang pantun?',
  'Bagian mana yang paling mudah dan paling menantang bagimu?',
  'Bagaimana perasaanmu setelah berhasil membuat pantun sendiri?',
  'Apa yang ingin kamu perbaiki dari pantun yang kamu buat?'
]
