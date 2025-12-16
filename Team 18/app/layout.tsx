import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import Script from 'next/script';
import { appConfig } from '@/config/app';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});
export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
  keywords: appConfig.keywords.join(', '),
  authors: [{ name: appConfig.company.name }],
  creator: appConfig.company.name,
  publisher: appConfig.company.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(appConfig.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: appConfig.title,
    description: appConfig.description,
    url: appConfig.url,
    siteName: appConfig.name,
    images: [
      {
        url: appConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${appConfig.company.name} - ${appConfig.company.tagline}`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: appConfig.title,
    description: appConfig.description,
    images: [appConfig.ogImage],
    creator: '@coffeecorp',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.variable}>
        <Providers>{children}</Providers>
        <Analytics />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="1373896a-fb20-4c9d-b718-c723a2471ae5"
        />
      </body>
    </html>
  );
}
