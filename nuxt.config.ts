// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  // SPA (tanpa SSR): seluruh logika sesi berjalan di browser.
  // Ini memastikan sesi yang tersimpan di localStorage dipulihkan
  // sebelum middleware auth berjalan — refresh tidak lagi me-logout.
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],
  css: ['~/assets/css/main.css'],
  // Prerender app shell (/) menjadi index.html statis agar bisa di-precache
  // service worker — syarat agar aplikasi tetap terbuka saat offline.
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
  pwa: {
    // Update service worker otomatis tanpa prompt
    registerType: 'autoUpdate',
    manifest: {
      name: 'Kreasi Pantun',
      short_name: 'Kreasi Pantun',
      description: 'Aplikasi belajar membuat pantun: Kotak Kreasi dan Kreasi Pantun 5E.',
      lang: 'id',
      theme_color: '#10b981',
      background_color: '#fef3c7',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    workbox: {
      // Pola glob eksplisit: modul @vite-pwa/nuxt me-reset pola default,
      // jadi sebutkan semua aset app agar masuk precache.
      globPatterns: ['**/*.{js,css,html,png,svg,ico,webmanifest,woff,woff2}'],
      // Navigasi SPA saat offline → fallback ke app shell yang sudah di-precache
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/api\//],
      runtimeCaching: [
        {
          // Navigasi antar halaman: utamakan jaringan, fallback ke cache
          urlPattern: ({ request }: any) => request.mode === 'navigate',
          handler: 'NetworkFirst' as const,
          options: {
            cacheName: 'navigasi',
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 50, maxAgeSeconds: 24 * 3600 },
          },
        },
        {
          // API Supabase (GET): utamakan jaringan, fallback ke cache 1 hari
          urlPattern: ({ url }: any) =>
            url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/rest/'),
          handler: 'NetworkFirst' as const,
          method: 'GET' as const,
          options: {
            cacheName: 'supabase-api',
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 100, maxAgeSeconds: 24 * 3600 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    devOptions: { enabled: false },
  },
  runtimeConfig: {
    migrateSecret: '',
    dbPassword: '',
    public: {
      // Diisi lewat environment variable (jangan hardcode secret di kode):
      // NUXT_PUBLIC_SUPABASE_URL dan NUXT_PUBLIC_SUPABASE_ANON_KEY
      supabaseUrl: '',
      supabaseAnonKey: '',
      // Kode akses dashboard guru (env NUXT_PUBLIC_GURU_CODE).
      // Obfuskasi sederhana, bukan keamanan serius — cukup untuk
      // membedakan guru dari siswa di lingkungan sekolah.
      guruCode: '',
    }
  },
  app: {
    head: {
      title: 'Kreasi Pantun — Belajar Membuat Pantun',
      htmlAttrs: { lang: 'id' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplikasi pembelajaran membuat pantun: Kotak Kreasi dan Kreasi Pantun 5E.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap'
        }
      ]
    }
  }
})
