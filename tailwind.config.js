/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        penta: {
          bg: '#0E1015',
          sidebar: '#12151D',
          card: '#181B24',
          cardHover: '#1E2330',
          border: '#242936',
          input: '#151821',
          green: '#20DF74',
          greenHover: '#1BC466',
          greenLight: '#E8FAF0',
          yellow: '#F2A735',
          orange: '#FF8A00',
          red: '#F43F5E',
          muted: '#8B93A4',
          text: '#F1F3F7',
          dim: '#555C6E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(32, 223, 116, 0.25)',
        card: '0 4px 20px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
