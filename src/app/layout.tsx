import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import { Providers } from '@/components/providers';
import { ErrorBoundary } from '@/components';
import { StructuredData } from '@/components/SEO';
import { PerformanceMonitor } from '@/components';
import { generateOrganizationStructuredData } from '@/utils/seo';

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
    default: 'Construction Material Shop - Quality Construction Materials',
    template: '%s | Construction Material Shop',
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
  authors: [{ name: 'Construction Material Shop Team' }],
  creator: 'Construction Material Shop',
  publisher: 'Construction Material Shop',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://constructionmaterialshop.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://constructionmaterialshop.com',
    title: 'Construction Material Shop - Quality Construction Materials',
    description:
      'Your trusted source for high-quality construction materials. From cement and steel to lumber and masonry supplies.',
    siteName: 'Construction Material Shop',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Material Shop - Construction Materials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Material Shop - Quality Construction Materials',
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
  const organizationData = generateOrganizationStructuredData();

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* DNS prefetch for common domains */}
        <link rel="dns-prefetch" href="//placehold.co" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen flex flex-col`}
      >
        <StructuredData data={organizationData} />
        <PerformanceMonitor />
        <ErrorBoundary>
          <Providers>
            <ClientLayout>{children}</ClientLayout>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
