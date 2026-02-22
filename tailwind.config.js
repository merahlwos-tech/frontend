/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tb: {
          pink:         '#F9C8D4',
          'pink-soft':  '#FDF0F4',
          'pink-deep':  '#E8A0B4',
          lavender:     '#E8DCF5',
          'lav-soft':   '#F5F0FC',
          'lav-deep':   '#C9ADE8',
          mint:         '#C8EDE0',
          'mint-soft':  '#EEF9F5',
          peach:        '#FFD8C0',
          cream:        '#FDF7F9',
          white:        '#FFFFFF',
          text:         '#2D2340',
          'text-soft':  '#7B6B8A',
          'text-light': '#B8A8C8',
          purple:       '#9B5FC0',
          'purple-soft':'#F0E8FA',
          green:        '#6BBFA0',
        },
        sf: {
          cream:       '#FDF7F9',
          white:       '#FFFFFF',
          beige:       '#F0EAE0',
          'beige-dark':'#E5DDD0',
          rose:        '#F9C8D4',
          'rose-dark': '#E8A0B4',
          'rose-soft': '#FDF0F4',
          sage:        '#6BBFA0',
          'sage-dark': '#5AA88C',
          'sage-soft': '#EEF9F5',
          brown:       '#9B5FC0',
          'brown-light':'#C9ADE8',
          text:        '#2D2340',
          'text-soft': '#7B6B8A',
          'text-light':'#B8A8C8',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Nunito"', 'sans-serif'],
        magic:   ['"Dancing Script"', 'cursive'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'marquee': 'marquee 35s linear infinite',
        'float':   'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(18px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      boxShadow: {
        'soft':    '0 2px 16px rgba(155, 95, 192, 0.08)',
        'soft-lg': '0 6px 32px rgba(155, 95, 192, 0.14)',
        'pink':    '0 4px 20px rgba(249, 200, 212, 0.5)',
        'card':    '0 2px 12px rgba(45, 35, 64, 0.06)',
      },
    },
  },
  plugins: [],
}