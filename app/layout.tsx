// Arquivo: app/layout.tsx
// Localização: /app/layout.tsx
// Descrição: Layout raiz da aplicação DeepCX

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'DeepCX - Pesquisas de Satisfação',
  description: 'Sistema de pesquisas de satisfação para lojas físicas',
  keywords: 'pesquisa, satisfação, NPS, CSAT, feedback, cliente',
  authors: [{ name: 'DeepCX Team' }],
  creator: 'DeepCX',
  publisher: 'DeepCX',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://deepcx.com',
    siteName: 'DeepCX',
    title: 'DeepCX - Pesquisas de Satisfação',
    description: 'Mejora la experiencia de tus clientes con nuestras encuestas de satisfacción',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DeepCX',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeepCX - Pesquisas de Satisfação',
    description: 'Mejora la experiencia de tus clientes con nuestras encuestas de satisfacción',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          {/* Header Global (opcional - apenas para páginas admin) */}
          {/* <Header /> */}
          
          {/* Conteúdo Principal */}
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Footer Global (opcional) */}
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  );
}