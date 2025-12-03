/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        steel: {
          50: '#f4f6fa',
          100: '#e9edf2',
          200: '#bccada',
          300: '#8ea6c1',
          400: '#6083a9',
          500: '#345e90',
          600: '#27486e',
          700: '#1e3755',
          800: '#14253b',
          900: '#0b1422',
        },
        blueprint: '#1e293b',
        accent: '#f59e42',
        warning: '#facc15',
      },
      fontFamily: {
        sans: ['Poppins', 'Roboto Slab', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Roboto Slab', 'Poppins', 'ui-serif', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'engineering-grid': "url('https://www.transparenttextures.com/patterns/round.png')",
        'blueprint': "linear-gradient(135deg, #1e293b 60%, #345e90 100%)",
      },
    },
  },
  plugins: [],
};
