"use client";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { motion } from "framer-motion";
import { Cpu, GraduationCap, Languages } from "lucide-react";

const experiences = [
  {
    company: "Yape",
    role: "Software Engineer",
    location: "Latam (Híbrido)",
    period: "Febrero 2026 - Actualmente",
    current: true,
    desc: "Super-app financiera líder en la región con más de 15M de usuarios. Lideré la migración de un sistema legacy a Next.js 16, incrementé 22 puntos en Google Lighthouse y mantengo el sitio principal (+6M de usuarios) con pipelines de CI/CD en Azure DevOps.",
    stack: ["Next.js", "JavaScript", "Azure DevOps", "SonarQube", "CI/CD"]
  },
  {
    company: "DeltaX",
    role: "Semi Senior Frontend Engineer",
    location: "Latam (Remoto)",
    period: "Julio 2024 - Agosto 2025",
    desc: "Empresa líder en logística para más de 200 empresas en Latinoamérica. Adapté herramientas de logística para más de 10 países con diseños responsivos y gestioné 3 proyectos simultáneos según diseños en Figma.",
    stack: ["React", "TypeScript", "Material UI", "Tailwind", "AWS"]
  },
  {
    company: "Trem Group",
    role: "Semi Senior Frontend Engineer",
    location: "Miami, USA (Remoto)",
    period: "Marzo 2022 - Mayo 2024",
    desc: "SaaS inmobiliario B2B para más de 1000 marcas. Logré cargas 80% más rápidas con componentes reutilizables y principios SOLID, integré 5+ pasarelas de pago con Stripe y reduje el tiempo de deploy de 30 a 5 minutos.",
    stack: ["React", "Redux", "Angular", "Docker", "Stripe"]
  },
  {
    company: "Alpha Systems",
    role: "Junior Full Stack Developer",
    location: "La Paz, Bolivia (Híbrido)",
    period: "Agosto 2020 - Enero 2022",
    desc: "Servicios financieros para ATMs en Bolivia. Rediseñé el sistema de back-office reduciendo problemas de datos duplicados en un 50% e implementé pruebas E2E que detectaron 30% más errores antes de producción.",
    stack: ["Vue", "Angular", "MySQL", ".NET", "TypeScript"]
  }
];

const skills = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "Angular", "Vue.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Ant Design"]
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "API RESTful", ".NET", "MySQL", "MongoDB", "Firebase", "JWT"]
  },
  {
    title: "Cloud & DevOps",
    items: ["AWS (EC2, S3, Lambda)", "CloudFront", "Azure DevOps", "GitHub Actions", "Docker", "CI/CD"]
  },
  {
    title: "Calidad & Herramientas",
    items: ["Jest", "Cypress", "SonarQube", "Figma", "Jira", "Git"]
  }
];

export const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-10 max-w-4xl"
    >
      <SectionTitle title="Trayectoria Profesional" subtitle="Más de 6 años creando soluciones de alto impacto en Fintech, Logística y Real Estate." />

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {experiences.map((exp, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

            <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors ${exp.current ? "bg-blue-600" : "bg-slate-300 group-hover:bg-blue-600"}`}>
              <Cpu size={18} className="text-white" />
            </div>

            <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow ${exp.current ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-100"}`}>
              <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="font-bold text-slate-900">{exp.company}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap flex items-center gap-1.5 ${exp.current ? "bg-blue-50 text-blue-700" : "text-slate-400 bg-slate-50"}`}>
                  {exp.current && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />}
                  {exp.period}
                </span>
              </div>
              <div className="text-blue-600 font-medium text-sm mb-1">{exp.role}</div>
              <div className="text-slate-400 text-xs mb-3">{exp.location}</div>
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

      <div className="mt-20">
        <SectionTitle title="Habilidades Técnicas" subtitle="Stack principal con el que construyo productos escalables de extremo a extremo." />
        <div className="grid sm:grid-cols-2 gap-6">
          {skills.map((group) => (
            <div key={group.title} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 grid sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={20} className="text-blue-600" />
            <h3 className="font-bold text-slate-900">Educación</h3>
          </div>
          <div className="text-sm">
            <div className="font-semibold text-slate-800">Ingeniería Electrónica</div>
            <div className="text-slate-500">Universidad del Valle · La Paz, Bolivia</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Languages size={20} className="text-blue-600" />
            <h3 className="font-bold text-slate-900">Idiomas</h3>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-600">
            <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">Español (Nativo)</span>
            <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">Portugués</span>
            <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">Inglés</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPage;
