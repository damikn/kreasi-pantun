# 📦 Kreasi Pantun

Aplikasi web pembelajaran membuat pantun untuk siswa. Setelah login (Nama Lengkap, No. Absen, Kelas),
siswa memilih salah satu dari dua aplikasi:

- **KOTAK KREASI** — 4 langkah: pilih fenomena → putar roda pola → pilih rima → susun pantun → unduh karya sebagai gambar.
- **Kreasi Pantun 5E** — model pembelajaran Engage → Explore → Explain (5 permainan) → Elaborate → Evaluate (galeri + refleksi).

Dibangun dengan **Nuxt 3 + Tailwind CSS + Supabase**.

## Struktur

```
kreasi-pantun/
├── app.vue                    # root
├── assets/css/main.css        # Tailwind + komponen UI (btn, card, input)
├── components/                # StepBar, PantunCard
├── composables/
│   ├── useSession.ts          # state sesi siswa & progres
│   └── useSupabase.ts         # client Supabase (dari runtimeConfig)
├── data/konten.ts             # data fenomena, pola, rima, konten game
├── layouts/app.vue            # header + nama siswa
├── middleware/auth.ts         # wajib login dulu
├── pages/
│   ├── index.vue              # login: nama lengkap, no absen, kelas (mendukung login ulang)
│   ├── pilih.vue              # pilih aplikasi
│   ├── karyaku.vue            # 📖 buku karya siswa yang login
│   ├── kotak/                 # fenomena, pola (spin), rima, susun, hasil
│   ├── limar/                 # 5E: engage-1/2, explore-*, explain (menu + 5 game), elaborate, evaluate
│   └── guru/                  # 👩‍🏫 dashboard guru: index (kode akses), dashboard (statistik + tabel)
├── supabase/
│   ├── schema.sql             # tabel + RLS
│   ├── migrasi-002.sql        # index tambahan (aman dijalankan di DB aktif)
│   └── seed.sql               # data fenomena, pola, kata rima
└── .env.example
```

## Cara menjalankan lokal

```bash
npm install
cp .env.example .env   # isi NUXT_PUBLIC_SUPABASE_URL & NUXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev            # buka http://localhost:3000
```

Tanpa Supabase pun aplikasi tetap jalan (mode lokal, data tersimpan di memori sesi).

## Fitur sesi & akun

- **Sesi persisten**: identitas siswa dan draf progres tersimpan di `localStorage`
  (via `plugins/session.client.ts`), jadi me-refresh halaman tidak lagi me-logout.
  Aplikasi berjalan sebagai SPA (`ssr: false`) agar pemulihan sesi terjadi
  sebelum middleware auth berjalan.
- **Login ulang**: siswa yang sudah terdaftar (nama + kelas sama) langsung masuk
  ke akun lamanya — tidak membuat duplikat baris di tabel `siswa`.
- **Buku Karyaku** (`/karyaku`): daftar semua pantun milik siswa yang login.
- **Tombol Keluar** tersedia di header untuk siswa maupun guru.

## Dashboard Guru 👩‍🏫

- Buka `/guru`, masukkan **kode guru** (default: `kreasi-guru`,
  ganti via env `NUXT_PUBLIC_GURU_CODE` — set juga di Vercel).
- Dashboard (`/guru/dashboard`): kartu statistik (siswa, total karya,
  Kotak Kreasi, 5E, refleksi), filter per kelas / aplikasi / nama,
  tabel karya, dan tabel siswa beserta jumlah karyanya.

> Catatan: kode guru adalah obfuskasi sederhana, bukan keamanan serius —
> cukup untuk memisahkan peran di lingkungan sekolah.

## Setup Supabase

1. Buat project di supabase.com.
2. SQL Editor → jalankan `supabase/schema.sql`, lalu `supabase/seed.sql`.
3. Salin **Project URL** dan **anon public key** ke `.env` (atau ke Environment Variables di Vercel).
4. (Untuk database yang sudah berjalan) jalankan juga `supabase/migrasi-002.sql`
   untuk menambah index — aman, tidak mengubah data.

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Di Vercel: **Add New Project → Import** repo tersebut (framework terdeteksi otomatis: Nuxt.js).
3. Tambahkan Environment Variables:
   - `NUXT_PUBLIC_SUPABASE_URL`
   - `NUXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Selesai 🎉

## Build

```bash
npm run build
```
