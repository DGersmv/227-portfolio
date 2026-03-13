/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
    scrollText: 'scrollText 20s linear infinite',
  },
  keyframes: {
    scrollText: {
      '0%': { transform: 'translateY(0%)' },
      '100%': { transform: 'translateY(-100%)' },
    }
  }
    },
  },
  plugins: [],
}

