"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Box, CheckCircle2, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

const PipelineDemo = () => {
  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-2xl overflow-hidden relative font-mono text-sm text-slate-300">
      <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center px-4 space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-4 text-xs text-slate-500">ci-cd-pipeline.yml</span>
      </div>
      <div className="mt-8 space-y-6">
        {['Build', 'Test', 'Deploy'].map((step, i) => (
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.5, duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center border-2",
              i === 2 ? "border-green-500 text-green-500" : "border-blue-500 text-blue-500"
            )}>
              {i === 0 && <Box size={14} />}
              {i === 1 && <CheckCircle2 size={14} />}
              {i === 2 && <Cloud size={14} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-white">{step} Phase</span>
                <span className="text-xs text-slate-400">{i === 0 ? '12s' : i === 1 ? '45s' : '5s'}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ delay: i * 0.5, duration: 0.8, ease: "easeInOut" }}
                  className={cn("h-full", i === 2 ? "bg-green-500" : "bg-blue-500")}
                />
              </div>
              <p className="text-xs mt-1 text-slate-500">
                {i === 0 && "Compiling Next.js assets..."}
                {i === 1 && "Running Jest & Cypress tests..."}
                {i === 2 && "Uploading to AWS S3 & Invalidating CloudFront..."}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-slate-800 text-center text-green-400 flex items-center justify-center gap-2">
        <CheckCircle2 size={16} />
        <span>Pipeline Completed Successfully</span>
      </div>
    </div>
  );
};

export default PipelineDemo;