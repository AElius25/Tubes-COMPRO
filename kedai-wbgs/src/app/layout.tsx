import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { OrderProvider } from '@/context/OrderContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kedai WBGS - Order',
  description: 'Pesan makanan dan minuman langsung dari meja.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#B3271E',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap"
        />
      </head>
      <body>
        <OrderProvider>{children}</OrderProvider>
      </body>
    </html>
  );
}
