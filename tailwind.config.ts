import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0F17',
        surface: '#111827',
        primary: '#38BDF8',
        accent: '#EAB308',
        text: '#E5E7EB'
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.35)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
} satisfies Config;
