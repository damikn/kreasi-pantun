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
│   ├── index.vue              # login: nama lengkap, no absen, kelas
│   ├── pilih.vue              # pilih aplikasi
│   ├── kotak/                 # fenomena, pola (spin), rima, susun, hasil
│   └── limar/                 # 5E: engage-1/2, explore-*, explain (menu + 5 game), elaborate, evaluate
├── supabase/
│   ├── schema.sql             # tabel + RLS
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

## Setup Supabase

1. Buat project di supabase.com.
2. SQL Editor → jalankan `supabase/schema.sql`, lalu `supabase/seed.sql`.
3. Salin **Project URL** dan **anon public key** ke `.env` (atau ke Environment Variables di Vercel).

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
