-- ============================================================
-- Kreasi Pantun — skema database Supabase
-- Cara pakai: buka Supabase Dashboard > SQL Editor > paste seluruh
-- isi file ini > Run. Lalu jalankan seed.sql untuk data awal.
-- ============================================================

-- Hapus tabel lama bila ada (urutan memperhatikan foreign key)
drop table if exists public.refleksi;
drop table if exists public.peta_ide;
drop table if exists public.karya;
drop table if exists public.kata_rima;
drop table if exists public.pola;
drop table if exists public.fenomena;
drop table if exists public.siswa;

-- ---- Siswa ----
create table public.siswa (
  id uuid primary key default gen_random_uuid(),
  nama_lengkap text not null,
  no_absen text,
  kelas text,
  created_at timestamptz not null default now()
);

-- ---- Fenomena (data master, diisi via seed.sql) ----
create table public.fenomena (
  id int primary key,
  nama text not null,
  deskripsi text,
  icon text,
  app text not null check (app in ('kotak', '5e'))
);

-- ---- Pola pantun (data master, diisi via seed.sql) ----
create table public.pola (
  id int primary key,
  nomor int not null,
  nama text not null,
  deskripsi_sampiran text,
  deskripsi_isi text,
  contoh text
);

-- ---- Kata rima (data master, diisi via seed.sql) ----
create table public.kata_rima (
  id serial primary key,
  kata text not null,
  akhiran text not null,
  kategori text
);

-- ---- Karya pantun siswa ----
create table public.karya (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid references public.siswa(id) on delete set null,
  app text not null check (app in ('kotak', '5e')),
  fenomena_id int references public.fenomena(id) on delete set null,
  pola_id int references public.pola(id) on delete set null,
  baris1 text not null,
  baris2 text not null,
  baris3 text not null,
  baris4 text not null,
  rima_dipilih text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index idx_karya_created on public.karya(created_at desc);
create index idx_karya_app on public.karya(app);

-- ---- Peta ide (5E: Explore) ----
create table public.peta_ide (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid references public.siswa(id) on delete set null,
  fenomena_id int references public.fenomena(id) on delete set null,
  gagasan text,
  pesan text,
  created_at timestamptz not null default now()
);

-- ---- Refleksi (5E: Evaluate) ----
create table public.refleksi (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid references public.siswa(id) on delete set null,
  jawaban jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security: policy permissive untuk role anon
-- (aplikasi akses langsung dengan anon key, tanpa login Supabase)
-- ============================================================
alter table public.siswa enable row level security;
alter table public.fenomena enable row level security;
alter table public.pola enable row level security;
alter table public.kata_rima enable row level security;
alter table public.karya enable row level security;
alter table public.peta_ide enable row level security;
alter table public.refleksi enable row level security;

create policy "anon full access siswa"    on public.siswa    for all to anon using (true) with check (true);
create policy "anon full access fenomena" on public.fenomena for all to anon using (true) with check (true);
create policy "anon full access pola"     on public.pola     for all to anon using (true) with check (true);
create policy "anon full access kata_rima" on public.kata_rima for all to anon using (true) with check (true);
create policy "anon full access karya"    on public.karya    for all to anon using (true) with check (true);
create policy "anon full access peta_ide" on public.peta_ide for all to anon using (true) with check (true);
create policy "anon full access refleksi" on public.refleksi for all to anon using (true) with check (true);
