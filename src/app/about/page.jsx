"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export const AboutPage = () => {
  const experiences = [
    {
      company: "DeltaX",
      role: "Semi Senior Frontend Engineer",
      period: "Mayo 2024 - Actualidad",
      desc: "Liderando la optimización de herramientas logísticas. Mejoré el performance en 22 puntos Lighthouse y gestioné 3 proyectos simultáneos.",
      stack: ["React", "Next.js", "AWS", "Material UI"]
    },
    {
      company: "Trem Group",
      role: "Semi Senior Frontend Engineer",
      period: "Marzo 2022 - Abril 2024",
      desc: "Desarrollo SaaS inmobiliario B2B. Logré cargas 80% más rápidas mediante code-splitting y arquitectura SOLID.",
      stack: ["React", "Redux", "Docker", "Stripe"]
    },
    {
      company: "Alpha Systems",
      role: "Junior Full Stack Developer",
      period: "Agosto 2020 - Enero 2022",
      desc: "Servicios financieros para ATMs. Reduje problemas de datos duplicados en un 50% rediseñando el back-office.",
      stack: ["Vue.js", ".NET", "MySQL", "TypeScript"]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-10 max-w-4xl"
    >
      <SectionTitle title="Trayectoria Profesional" subtitle="Más de 5 años creando soluciones de alto impacto en Fintech, Logística y Real Estate." />

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {experiences.map((exp, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-hover:bg-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors">
              <Cpu size={18} className="text-white" />
            </div>

            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900">{exp.company}</h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">{exp.period}</span>
              </div>
              <div className="text-blue-600 font-medium text-sm mb-3">{exp.role}</div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{exp.desc}</p>
              <div className="flex flex-wrap gap-2">
                {exp.stack.map(tech => (
                  <span key={tech} className="text-[10px] uppercase font-bold text-slate-500 border border-slate-200 px-2 py-1 rounded-md">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AboutPage;