"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Download, Menu, X } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/showcase', label: 'My Work' },
    { href: '/about', label: 'Resume' },
  ];

  const handleDownloadCV = () => {
    const pdfUrl = "https://docs.google.com/document/d/1nSvOKaZT4bJvBNaLd_WJ4TCimXRMweyEhyVypRdt4-I/export?format=pdf";
    window.open(pdfUrl, '_blank');
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled ? "bg-white/80 backdrop-blur-md border-slate-200 py-3 shadow-sm" : "bg-transparent border-transparent py-5"
    )}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">J</div>
          <span className="text-slate-900 tracking-tight">Merlo<span className="text-blue-600">.dev</span></span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600 capitalize",
                pathname === link.href ? "text-blue-600" : "text-slate-500"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button
          className="hidden md:inline-flex text-sm px-4 py-2"
          variant="primary"
          onClick={handleDownloadCV}
          icon={Download}
        >
          Descargar CV
        </Button>

        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden container mx-auto px-4 pt-4 pb-2 flex flex-col gap-1 border-t border-slate-100 mt-4 bg-white/95 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "text-sm font-medium py-2.5 transition-colors capitalize",
                pathname === link.href ? "text-blue-600" : "text-slate-600"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3">
            <Button
              variant="primary"
              icon={Download}
              onClick={handleDownloadCV}
              className="w-full text-sm px-4 py-2"
            >
              Descargar CV
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;