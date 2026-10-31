"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Server } from 'lucide-react';

const AWSDemo = () => {
  return (
    <div className="relative h-64 border border-line rounded-xl bg-white/[0.03] overflow-hidden flex items-center justify-center">
      {/* Fondo de cuadrícula sutil */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#f2f2f2 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="relative z-10 flex items-center gap-8 md:gap-16">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-ink-2 rounded-lg shadow-lg border border-line flex items-center justify-center mb-2">
            <Globe className="text-accent" size={32} />
          </div>
          <span className="text-xs font-semibold text-fg/80">CloudFront</span>
        </motion.div>

        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          className="h-0.5 bg-white/15 relative"
        >
           <motion.div 
             animate={{ x: [0, 60] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             className="absolute top-1/2 -mt-1 w-2 h-2 bg-accent rounded-full"
           />
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-ink-2 rounded-lg shadow-lg border border-line flex items-center justify-center mb-2">
            <Server className="text-accent" size={32} />
          </div>
          <span className="text-xs font-semibold text-fg/80">AWS S3</span>
        </motion.div>
        
        <div className="absolute top-4 right-4 bg-accent/10 text-accent text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
          Uptime 99.9%
        </div>
      </div>
    </div>
  );
};

export default AWSDemo;