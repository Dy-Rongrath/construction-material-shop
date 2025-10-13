import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/lib/hooks';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'BuildMart - Quality Construction Materials',
    template: '%s | BuildMart',
  },
  description:
    'Your trusted source for high-quality construction materials. From cement and steel to lumber and masonry supplies, we deliver excellence to your job site.',
  keywords: [
    'construction materials',
    'building supplies',
    'cement',
    'steel',
    'lumber',
    'masonry',
    'construction equipment',
  ],
  authors: [{ name: 'BuildMart Team' }],
  creator: 'BuildMart',
  publisher: 'BuildMart',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://buildmart.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://buildmart.com',
    title: 'BuildMart - Quality Construction Materials',
    description:
      'Your trusted source for high-quality construction materials. From cement and steel to lumber and masonry supplies.',
    siteName: 'BuildMart',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BuildMart - Construction Materials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildMart - Quality Construction Materials',
    description: 'Your trusted source for high-quality construction materials.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f59e0b' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen flex flex-col`}
      >
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
