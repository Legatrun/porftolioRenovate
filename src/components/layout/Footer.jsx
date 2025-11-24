import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} Jair Merlo. Construido con Next.js & Tailwind.
        </div>
        <div className="flex space-x-6 text-slate-400">
          <a href="https://github.com/Legatrun" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 cursor-pointer">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/in/jairmerloluque" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 cursor-pointer">
            <Linkedin size={20} />
          </a>
          <a href="mailto:joaquimmerlo1@gmail.com" className="hover:text-red-500 cursor-pointer">
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;