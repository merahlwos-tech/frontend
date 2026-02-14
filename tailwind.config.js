/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E8001D',
          black: '#0A0A0A',
          white: '#F5F5F5',
          gray: {
            50: '#F9F9F9',
            100: '#EFEFEF',
            200: '#DCDCDC',
            300: '#B4B4B4',
            400: '#888888',
            500: '#5C5C5C',
            600: '#3A3A3A',
            700: '#262626',
            800: '#1A1A1A',
            900: '#0A0A0A',
          },
        },
        status: {
          confirmed: '#3B82F6',
          delivery: '#F59E0B',
          delivered: '#10B981',
          return: '#EF4444',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        heading: ['"Montserrat"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '7rem',
        '10xl': '9rem',
      },
      letterSpacing: {
        widest: '0.3em',
        ultra: '0.5em',
      },
      boxShadow: {
        'brutal': '4px 4px 0px #000',
        'brutal-lg': '6px 6px 0px #000',
        'brutal-xl': '8px 8px 0px #000',
        'brutal-red': '4px 4px 0px #E8001D',
        'inner-red': 'inset 0 0 0 2px #E8001D',
        'glow-red': '0 0 20px rgba(232, 0, 29, 0.4)',
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-red': 'pulseRed 2s infinite',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232, 0, 29, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(232, 0, 29, 0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}