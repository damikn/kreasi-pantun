// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      // Diisi lewat environment variable (jangan hardcode secret di kode):
      // NUXT_PUBLIC_SUPABASE_URL dan NUXT_PUBLIC_SUPABASE_ANON_KEY
      supabaseUrl: '',
      supabaseAnonKey: ''
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
