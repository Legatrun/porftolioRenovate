"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/showcase', label: 'Showcase' },
    { href: '/about', label: 'Perfil & CV' },
  ];

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
          onClick={() => window.location.href = 'mailto:joaquimmerlo1@gmail.com'}
        >
          Contactar
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;