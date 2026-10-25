/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F2A4A',
          dark: '#0A1C33',
          light: '#1B3B66',
        },
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FEF3C7',
        },
        verified: {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
        },
        vouched: {
          DEFAULT: '#2563EB',
          light: '#DBEAFE',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
        },
        surface: '#F8FAFC',
        muted: '#64748B',
        heading: '#0F172A',
      },
      boxShadow: {
        card: '0 8px 24px rgba(15, 42, 74, 0.08)',
        'card-hover': '0 12px 32px rgba(15, 42, 74, 0.12)',
        sheet: '0 -8px 32px rgba(15, 42, 74, 0.14)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
