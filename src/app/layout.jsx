import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Jair Merlo | Full Stack Developer',
  description: 'Portafolio de Jair Merlo Luque, desarrollador especializado en React, Next.js y AWS.',
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