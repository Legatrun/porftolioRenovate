"use client";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowRight, Terminal, Github, Linkedin, Mail, Zap, Cloud, Layout, Database } from "lucide-react";
import Link from "next/link";

export const HomePage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-20 pt-10"
  >
    <section className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium border border-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Actualmente en Yape · Abierto a nuevas oportunidades
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-fg leading-tight">
          Arquitectura Limpia & <span className="text-gradient">Performance</span>
        </h1>
        <p className="text-lg text-fg/80 leading-relaxed">
          Soy <strong className="text-fg">Jair Merlo</strong>, Full Stack Developer con más de 6 años de experiencia construyendo aplicaciones web escalables en Fintech, Real Estate y Logística. Experto en React, Node.js, Angular y despliegues robustos en AWS.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/showcase">
            <Button variant="primary" icon={ArrowRight}>
              Qué puedo hacer por ti?
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="secondary" icon={Terminal}>
              Ver Experiencia
            </Button>
          </Link>
        </div>
        <div className="flex gap-4 pt-4 text-muted">
          <a href="https://github.com/Legatrun" target="_blank" className="hover:text-fg transition-colors"><Github size={24} /></a>
          <a href="https://www.linkedin.com/in/jairmerloluque/" target="_blank" className="hover:text-accent transition-colors"><Linkedin size={24} /></a>
          <a href="mailto:joaquimmerlo1@gmail.com" target="_blank" className="hover:text-red-500 transition-colors"><Mail size={24} /></a>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent rounded-full filter blur-3xl opacity-50"></div>
        <div className="relative bg-white/[0.03] backdrop-blur-sm border border-line p-8 rounded-2xl shadow-xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-ink-2 rounded-xl shadow-sm border border-line">
              <Zap className="text-accent mb-2" />
              <h3 className="font-bold text-fg">High Performance</h3>
              <p className="text-sm text-muted">SEO optimization</p>
            </div>
            <div className="p-4 bg-ink-2 rounded-xl shadow-sm border border-line">
              <Cloud className="text-accent mb-2" />
              <h3 className="font-bold text-fg">Cloud Native</h3>
              <p className="text-sm text-muted">AWS S3, Lambda, EC2</p>
            </div>
            <div className="p-4 bg-ink-2 rounded-xl shadow-sm border border-line">
              <Layout className="text-accent mb-2" />
              <h3 className="font-bold text-fg">Scalable UI</h3>
              <p className="text-sm text-muted">Atomic Design & SOLID</p>
            </div>
            <div className="p-4 bg-ink-2 rounded-xl shadow-sm border border-line">
              <Database className="text-accent mb-2" />
              <h3 className="font-bold text-fg">Databases</h3>
              <p className="text-sm text-muted">Aurora, DynamoDB, RDS</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-10 border-y border-line bg-white/[0.03]">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-6">Tecnologías Principales</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {['Next.js', 'React', 'Angular', 'TypeScript', 'Tailwind', 'Node.js', 'AWS', 'Azure DevOps', 'MySQL'].map(tech => (
            <span key={tech} className="text-xl font-bold text-fg">{tech}</span>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

export default HomePage;