"use client";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowRight, Terminal, Github, Linkedin, Mail, Zap, Cloud, Layout, Database } from "lucide-react";

export const HomePage = ({ navigate }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-20 pt-10"
  >
    <section className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
          Disponible para nuevas oportunidades
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
          Arquitectura Limpia & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Performance</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Soy <strong className="text-slate-900">Jair Merlo</strong>, Full Stack Developer con 5+ años especializándome en construir aplicaciones web escalables. Experto en React, Nest.js y despliegues robustos en AWS.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => navigate('showcase')} variant="primary" icon={ArrowRight}>
            Ver Demos Técnicos
          </Button>
          <Button onClick={() => navigate('about')} variant="secondary" icon={Terminal}>
            Ver Experiencia
          </Button>
        </div>
        <div className="flex gap-4 pt-4 text-slate-400">
          <a href="#" className="hover:text-slate-900 transition-colors"><Github size={24} /></a>
          <a href="#" className="hover:text-blue-700 transition-colors"><Linkedin size={24} /></a>
          <a href="#" className="hover:text-red-500 transition-colors"><Mail size={24} /></a>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full filter blur-3xl opacity-50"></div>
        <div className="relative bg-white/50 backdrop-blur-sm border border-white/60 p-8 rounded-2xl shadow-xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <Zap className="text-yellow-500 mb-2" />
              <h3 className="font-bold text-slate-800">High Performance</h3>
              <p className="text-sm text-slate-500">Optimización Core Web Vitals</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <Cloud className="text-blue-500 mb-2" />
              <h3 className="font-bold text-slate-800">Cloud Native</h3>
              <p className="text-sm text-slate-500">AWS S3, Lambda, EC2</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <Layout className="text-purple-500 mb-2" />
              <h3 className="font-bold text-slate-800">Scalable UI</h3>
              <p className="text-sm text-slate-500">Atomic Design & SOLID</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <Database className="text-green-500 mb-2" />
              <h3 className="font-bold text-slate-800">Backend Logic</h3>
              <p className="text-sm text-slate-500">Nest.js & Microservicios</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-10 border-y border-slate-100 bg-slate-50/50">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Tecnologías Principales</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {['Next.js', 'React', 'TypeScript', 'Node.js', 'AWS', 'Tailwind', 'Nest.js', 'PostgreSQL'].map(tech => (
            <span key={tech} className="text-xl font-bold text-slate-800">{tech}</span>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

export default HomePage;