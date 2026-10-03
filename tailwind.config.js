/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './plugins/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        body: ['Nunito', 'sans-serif']
      }
    }
  },
  plugins: []
}
