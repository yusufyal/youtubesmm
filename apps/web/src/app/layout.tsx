import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/context/theme-context';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-SG4HQTYR9S';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ayn.yt'),
  title: {
    default: 'AYN YouTube - Premium YouTube Growth Services',
    template: '%s | AYN YouTube',
  },
  description:
    'Boost your YouTube presence with premium views, subscribers, watch time, and engagement services. Fast delivery, real results, 24/7 support.',
  keywords: [
    'buy youtube views',
    'youtube subscribers',
    'youtube watch time',
    'youtube growth',
    'smm panel',
    'youtube marketing',
  ],
  authors: [{ name: 'AYN YouTube' }],
  creator: 'AYN YouTube',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'AYN YouTube',
    title: 'AYN YouTube - Premium YouTube Growth Services',
    description:
      'Boost your YouTube presence with premium views, subscribers, watch time, and engagement services.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AYN YouTube',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AYN YouTube - Premium YouTube Growth Services',
    description:
      'Boost your YouTube presence with premium views, subscribers, watch time, and engagement services.',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

// Organization Schema for SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AYN YouTube',
  url: process.env.NEXT_PUBLIC_SITE_URL,
  logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
  sameAs: [
    'https://twitter.com/aynyoutube',
    'https://instagram.com/aynyoutube',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@ayn.yt',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="/" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
