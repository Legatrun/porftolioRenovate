"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, CheckCircle2, Cloud } from 'lucide-react';
import PipelineDemo from '@/components/showcase/PipelineDemo';
import AWSDemo from '@/components/showcase/AWSDemo';

const ShowcasePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-10 space-y-16"
    >
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Showcase Técnico</h1>
        <p className="text-slate-600">
          Debido a acuerdos de confidencialidad (NDA) con mis clientes anteriores (DeltaX, Trem Group),
          no puedo mostrar código fuente directo. Sin embargo, he creado estos demostraciones interactivas
          para ilustrar mis habilidades en arquitectura, despliegue y optimización.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold mb-4">
            <Terminal size={12} /> DEVOPS & CI/CD
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Automatización de Despliegues</h2>
          <p className="text-slate-600 mb-6">
            Implementación de pipelines robustos utilizando GitHub Actions. Mi enfoque reduce el error humano y garantiza que solo el código que pasa las pruebas (Jest/Cypress) llegue a producción.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center text-slate-700 text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-500 mr-3" />
              Reducción de tiempos de deploy de 30m a 5m.
            </li>
            <li className="flex items-center text-slate-700 text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-500 mr-3" />
              Integración de SonarQube para calidad de código.
            </li>
            <li className="flex items-center text-slate-700 text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-500 mr-3" />
              Estrategias Blue/Green deployment.
            </li>
          </ul>
        </div>
        <PipelineDemo />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-center pt-10 border-t border-slate-100">
        <div className="order-2 lg:order-1">
          <AWSDemo />
        </div>
        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold mb-4">
            <Cloud size={12} /> AWS ARCHITECTURE
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Infraestructura Escalable</h2>
          <p className="text-slate-600 mb-6">
            Diseño arquitecturas Serverless y tradicionales para garantizar alta disponibilidad. Mi experiencia con S3 y CloudFront asegura que los assets estáticos carguen en milisegundos en cualquier parte del mundo.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="font-bold text-slate-900 text-lg">60%</div>
              <div className="text-xs text-slate-500">Reducción de latencia</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="font-bold text-slate-900 text-lg">99.9%</div>
              <div className="text-xs text-slate-500">Uptime garantizado</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShowcasePage;