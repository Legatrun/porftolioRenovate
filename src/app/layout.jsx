import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Jair Merlo - Portafolio",
  description: "Desarrollador web especializado en React, Next.js y UI moderna.",
  openGraph: {
    title: "Jair Merlo - Portafolio",
    description: "Desarrollador web especializado en React, Next.js y UI moderna.",
    url: "https://jairmerlo.netlify.app",
    siteName: "Jair Merlo Portfolio",
    images: [
      {
        url: "https://jairmerlo.netlify.app/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-blue-100">
          <Navbar />
          <main className="pt-24 pb-20 flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}