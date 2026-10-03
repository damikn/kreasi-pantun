-- ============================================================
-- Kreasi Pantun — migrasi 002 (AMAN dijalankan di database aktif)
-- Fitur: login ulang siswa + dashboard guru
-- Cara pakai: Supabase Dashboard > SQL Editor > paste isi file ini > Run.
-- Hanya menambah index; tidak mengubah/menghapus data.
-- ============================================================

-- Percepat pencarian karya per siswa (dipakai halaman Karyaku & dashboard guru)
create index if not exists idx_karya_siswa
  on public.karya (siswa_id);

-- Percepat pencarian siswa berdasarkan nama (dipakai saat login ulang)
create index if not exists idx_siswa_nama
  on public.siswa (nama_lengkap);

-- Percepat filter karya per kelas di dashboard guru
create index if not exists idx_karya_app
  on public.karya (app);

-- Kolom skor (dipakai dashboard guru & halaman Karyaku).
-- Idempoten: aman dijalankan walau kolom sudah ada.
alter table public.karya
  add column if not exists skor integer;
