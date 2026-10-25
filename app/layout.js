import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import { Toaster } from 'sonner';
import { PhoneFrame } from '@/components/layout/PhoneFrame';
import { BottomNav } from '@/components/layout/BottomNav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-sans-devanagari',
  display: 'swap',
});

export const metadata = {
  title: 'Book My Service — Trusted Local Help, Fairly Priced',
  description:
    'Hyperlocal on-demand blue-collar services platform with transparent pricing, honest trust signals, and Skill Passport.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  themeColor: '#0F2A4A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoDevanagari.variable}`}>
      <body className="antialiased">
        <PhoneFrame>
          {children}
          <BottomNav />
        </PhoneFrame>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
