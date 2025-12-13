/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nos couleurs personnalisées
        panda: { DEFAULT: '#C25E3E', light: '#E68A6A', dark: '#9A462B' }, // Rouille
        nature: { DEFAULT: '#7F9074', light: '#A6B59E' }, // Vert
        sand: { DEFAULT: '#F5F0EB', dark: '#EBE7E0' }, // <--- J'ai foncé un peu le beige pour qu'on le voie mieux !
        charcoal: '#2D2D2D' // Noir doux
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'], // On force la police ici
      }
    },
  },
  plugins: [],
}