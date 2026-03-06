import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const justHello = localFont({
  src: '../../public/Logo  imagens y Tipografia/Just Hello.otf',
  variable: '--font-just-hello',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Floripondio - Organización y Cursos',
  description: 'Plataforma oficial de Floripondio para Cursos, Servicios de Organización y Productos Exclusivos.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${justHello.variable} antialiased selection:bg-rose-500/30 selection:text-rose-900 dark:selection:bg-rose-500/30 dark:selection:text-white min-h-screen bg-neutral-50 dark:bg-neutral-950`}
      >
        {children}
      </body>
    </html>
  );
}
