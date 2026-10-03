-- ============================================================
-- Kreasi Pantun — data awal (seed)
-- Jalankan SETELAH schema.sql
-- ============================================================

-- ---- Fenomena: Kotak Kreasi (id 1-10) ----
insert into public.fenomena (id, nama, deskripsi, icon, app) values
(1, 'Penggunaan media sosial berlebihan', 'Terlalu lama bermain gawai hingga lupa waktu belajar dan istirahat.', '📱', 'kotak'),
(2, 'Sampah plastik di lingkungan', 'Sampah plastik berserakan mencemari tanah dan sungai di sekitar kita.', '🗑️', 'kotak'),
(3, 'Perundungan di sekolah', 'Ejekan dan perlakuan tidak menyenangkan kepada teman di sekolah.', '🧒', 'kotak'),
(4, 'Gaya hidup sehat', 'Rajin berolahraga, makan bergizi, dan istirahat cukup setiap hari.', '💪', 'kotak'),
(5, 'Krisis kepercayaan diri', 'Merasa minder dan takut mencoba hal baru karena takut gagal.', '😟', 'kotak'),
(6, 'Pentingnya pendidikan', 'Sekolah membuka wawasan dan menjadi bekal meraih cita-cita.', '🎓', 'kotak'),
(7, 'Fenomena FOMO', 'Takut ketinggalan tren hingga selalu ingin ikut-ikutan teman.', '😱', 'kotak'),
(8, 'Kepedulian terhadap lingkungan', 'Menjaga kebersihan dan kelestarian alam di sekitar kita.', '🌍', 'kotak'),
(9, 'Budaya instan', 'Ingin serba cepat tanpa proses, malas berusaha dan berjuang.', '⏰', 'kotak'),
(10, 'Toleransi dan perbedaan', 'Menghargai teman yang berbeda suku, agama, dan pendapat.', '🤝', 'kotak');

-- ---- Fenomena: 5E (id 101-108) ----
insert into public.fenomena (id, nama, deskripsi, icon, app) values
(101, 'Kebersihan kelas', 'Sampah yang berserakan membuat ruang kelas terlihat kurang nyaman.', '🧹', '5e'),
(102, 'Membantu teman', 'Seorang teman kesulitan membawa buku yang banyak.', '📚', '5e'),
(103, 'Penggunaan gawai', 'Bermain gawai terus-menerus hingga lupa waktu belajar.', '📱', '5e'),
(104, 'Menunda tugas', 'Pekerjaan sekolah dikerjakan mepet tenggat waktu.', '⏳', '5e'),
(105, 'Menjaga lingkungan', 'Menanam pohon dan merawat kebersihan sekitar rumah.', '🌳', '5e'),
(106, 'Menghargai teman', 'Mendengarkan pendapat teman dengan sopan dan terbuka.', '💛', '5e'),
(107, 'Disiplin waktu', 'Datang tepat waktu dan mengatur jadwal dengan baik.', '⏰', '5e'),
(108, 'Kerja sama', 'Bekerja dalam kelompok untuk mencapai tujuan bersama.', '👥', '5e');

-- ---- Pola pantun ----
insert into public.pola (id, nomor, nama, deskripsi_sampiran, deskripsi_isi, contoh) values
(1, 1, 'Repetisi pada Awal Sampiran',
 'Kata pertama pada baris 1 diulang sebagai kata pertama pada baris 2.',
 'Isi bebas, sesuaikan dengan pesan yang ingin disampaikan.',
 'Di tepi pantai ombak berkejaran,
Di kala senja langit memerah;
Hormati guru setiap waktu,
Ilmu berkah hidup pun mudah.'),
(2, 2, 'Repetisi pada Awal Isi',
 'Sampiran bebas, gunakan gambaran alam sekitar.',
 'Kata pertama pada baris 3 diulang sebagai kata pertama pada baris 4.',
 'Anak ayam turun sepuluh,
Mati satu tinggal sembilan;
Tuntut ilmu dengan sungguh-sungguh,
Sungguh mulia cita-citamu kawan.'),
(3, 3, 'Repetisi pada Akhir dan Awal Sampiran',
 'Kata terakhir pada baris 1 digunakan sebagai kata awal pada baris 2.',
 'Isi bebas, sesuaikan dengan pesan yang ingin disampaikan.',
 'Pergi ke pasar membeli mangga,
Mangga manis dibawa pulang;
Rajin belajar sejak muda,
Agar cita-cita mudah gemilang.'),
(4, 4, 'Isi Berupa Nasihat',
 'Sampiran bertema alam sekitar.',
 'Baris 3 dan 4 berisi nasihat atau pesan moral.',
 'Bunga mawar harum baunya,
Tumbuh subur di tepi taman;
Jagalah lisan dan perbuatanmu,
Agar hidup penuh kedamaian.'),
(5, 5, 'Isi Berupa Ajakan',
 'Sampiran bertema alam sekitar.',
 'Baris 3 dan 4 berisi ajakan untuk berbuat baik.',
 'Ke hutan melihat rusa,
Rusa lari ke dalam semak;
Mari menjaga kebersihan,
Lingkungan sehat hati pun senang.');

-- ---- Kata rima ----
insert into public.kata_rima (kata, akhiran, kategori) values
('cahaya', '-a', 'kata benda'),
('bahagia', '-a', 'kata sifat'),
('percaya', '-a', 'kata kerja'),
('nyata', '-a', 'kata sifat'),
('ceria', '-a', 'kata sifat'),
('dunia', '-a', 'kata benda'),
('senja', '-a', 'kata benda'),
('hati', '-i', 'kata benda'),
('melati', '-i', 'kata benda'),
('sejati', '-i', 'kata sifat'),
('pagi', '-i', 'kata benda'),
('budi', '-i', 'kata benda'),
('awan', '-an', 'kata benda'),
('kawan', '-an', 'kata benda'),
('jalan', '-an', 'kata benda'),
('bulan', '-an', 'kata benda'),
('taman', '-an', 'kata benda'),
('pulang', '-ang', 'kata kerja'),
('gemilang', '-ang', 'kata sifat'),
('senang', '-ang', 'kata sifat'),
('datang', '-ang', 'kata kerja'),
('belajar', '-ar', 'kata kerja'),
('segar', '-ar', 'kata sifat'),
('sabar', '-ar', 'kata sifat'),
('jamu', '-u', 'kata benda'),
('ilmu', '-u', 'kata benda'),
('malu', '-u', 'kata sifat'),
('pandai', '-ai', 'kata sifat'),
('ramai', '-ai', 'kata sifat'),
('damai', '-ai', 'kata sifat'),
('indah', '-indah', 'kata sifat'),
('mudah', '-indah', 'kata sifat');
