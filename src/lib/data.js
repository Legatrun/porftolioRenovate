export const profile = {
  name: "Jair Merlo",
  role: "Full Stack Developer",
  location: "Bolivia · Remote",
  email: "joaquimmerlo1@gmail.com",
  phone: "+591 77256099",
  phoneHref: "tel:+59177256099",
  linkedin: "https://www.linkedin.com/in/jairmerloluque/",
  github: "https://github.com/Legatrun",
  cv: "https://docs.google.com/document/d/1nSvOKaZT4bJvBNaLd_WJ4TCimXRMweyEhyVypRdt4-I/export?format=pdf",
  summary:
    "Web developer with over 6 years of experience building scalable applications across financial, real estate, logistics, and non-profit sectors. Skilled in React, C# / .NET, and Node.js (Nest.js) with a focus on performance, clean architecture, and AWS deployments.",
  belief:
    "High-quality software comes from effective communication, collaboration, and continuous improvement.",
  education: { school: "UNIVALLE University, Bolivia", degree: "Electronic Engineering (Bachelor's Degree)" },
  languages: [
    { name: "English", level: "Advanced" },
    { name: "Spanish", level: "Native" },
    { name: "Portuguese", level: "Intermediate" },
  ],
};

export const metrics = [
  { value: 22, prefix: "+", suffix: "", label: "Points gained on Google Lighthouse", context: "Yape" },
  { value: 10, prefix: "", suffix: "x", label: "Faster rendering after library overhaul", context: "Trem Group" },
  { value: 6, prefix: "", suffix: "+", label: "Years building scalable systems", context: "2020 — today" },
  { value: 20, prefix: "+", suffix: "M", label: "Active users in the app ecosystem", context: "Yape" },
  { value: 80, prefix: "", suffix: "%", label: "Quicker page load via SOLID components", context: "Trem Group" },
  { value: 5, prefix: "<", suffix: " min", label: "Deploy time, down from 30 minutes", context: "CI/CD" },
];

export const experience = [
  {
    id: "yape",
    company: "Yape",
    role: "Senior Frontend Developer",
    period: "Feb 2025 — Present",
    location: "USA · Remote",
    sector: "Fintech · Super-app",
    url: "https://www.yape.com.bo/",
    summary:
      "Leading financial super-app and ecosystem in the region with over 20M users, specializing in digital payments, micro-credits, and mobile banking services.",
    highlights: [
      { stat: "+22", label: "Lighthouse points" },
      { stat: "6M+", label: "Website users" },
      { stat: "20M+", label: "Ecosystem users" },
    ],
    bullets: [
      "Led the migration of a legacy system to Next.js 16, modernizing the frontend architecture and optimizing its integration with .NET backend services for scalability and maintainability.",
      "Raised Google Lighthouse scores by 22 points through a strategic migration to lightweight, efficient libraries.",
      "Maintained the main website (6M+ users) on a modular architecture, optimizing performance for Google Tag Manager integration.",
      "Managed the SDLC and implemented automated CI/CD workflows (pipelines and releases) with Azure DevOps.",
      "Coordinated directly with Strategy, Growth and Marketing on the definition, prioritization and delivery of technical requirements.",
    ],
    stack: ["Next.js", ".NET", "JavaScript", "Azure DevOps", "SonarQube", "GitHub Actions", "CSS3", "Figma"],
  },
  {
    id: "deltax",
    company: "DeltaX",
    role: "Semi Senior Frontend Engineer",
    period: "Jul 2024 — Aug 2025",
    location: "LATAM · Remote",
    sector: "Logistics · AI platform",
    url: "https://www.deltax.io/",
    summary:
      "Leading logistics company in Latin America serving 200+ companies, specializing in the management of loading and unloading operations for transportation companies.",
    highlights: [
      { stat: "10+", label: "Countries supported" },
      { stat: "200+", label: "Companies served" },
      { stat: "5K+", label: "Landing page users" },
    ],
    bullets: [
      "Adapted logistics tools to each company's specific measures and to the requirements of 10+ countries, across devices with responsive design.",
      "Turned Figma designs into Jira user stories, worked closely with QA, and managed 3 projects simultaneously while meeting deadlines.",
      "Built a modular, performance-first landing page for 5,000+ users.",
    ],
    stack: ["React", "Next.js", "TypeScript", "Node.js", "Material UI", "Tailwind", "Tesseract.js", "AWS", "JWT"],
  },
  {
    id: "trem",
    company: "Trem Group",
    role: "Semi Senior Frontend Engineer",
    period: "Mar 2022 — May 2024",
    location: "Miami, USA · Remote",
    sector: "Real estate · B2B SaaS",
    url: "https://www.tremgroup.com/",
    summary:
      "Real estate technology company building tools for 1,000+ real estate brands and managing their websites.",
    highlights: [
      { stat: "10x", label: "Rendering speed" },
      { stat: "80%", label: "Quicker page load" },
      { stat: "15+", label: "Payment gateways" },
    ],
    bullets: [
      "Achieved 80% quicker page loads by breaking the frontend into reusable React components following SOLID principles.",
      "Developed and integrated 15+ payment gateways with Stripe, React, Redux, Redux Persist and reCAPTCHA-backed token creation.",
      "Improved rendering time 10x by replacing outdated libraries and shrinking stylesheet size.",
      "Built CI/CD pipelines with GitHub Actions and AWS CodeDeploy, cutting deploy time from 30 minutes to under 5.",
      "Fixed 50+ critical bugs and secured quality with Jest test coverage.",
      "Built a highly scalable system with 20+ Ant Design components rendering correctly across platforms.",
    ],
    stack: ["React 18", "Redux Toolkit", "RTK Query", "Ant Design", "Stripe", "Docker", "Vite", "Cypress", "TanStack"],
  },
  {
    id: "alpha",
    company: "Alpha Systems",
    role: "Junior Full Stack Developer",
    period: "Aug 2020 — Jan 2022",
    location: "La Paz, Bolivia · Hybrid",
    sector: "Financial infrastructure · ATMs",
    url: "https://www.alphasystems.com.bo/",
    summary:
      "Financial technology company that provides 75% of ATM services in Bolivia, plus maintenance and back-office systems for financial institutions.",
    highlights: [
      { stat: "75%", label: "Of Bolivia's ATMs" },
      { stat: "-50%", label: "Duplicate-data issues" },
      { stat: "+30%", label: "Bugs caught pre-release" },
    ],
    bullets: [
      "Shipped 10+ new features to the internal AngularJS UI library of reusable components.",
      "Extended the CRM to manage 500 customers' data for a regional bank's specific needs with MySQL.",
      "Redesigned the internal back-office (Angular + .NET), reducing duplicate-data issues by 50%.",
      "Implemented end-to-end automated test suites, detecting 30% more issues before release.",
    ],
    stack: ["Angular", "AngularJS", ".NET", "TypeScript", "RxJS", "MySQL", "Visual Studio"],
  },
];

export const skills = {
  frontend: [
    "React", "Next.js", "TypeScript", "JavaScript", "Angular", "Vue.js", "Svelte", "Redux Toolkit",
    "RTK Query", "Tailwind CSS", "Styled-components", "Ant Design", "MUI", "Storybook",
  ],
  backend: ["Node.js", "Nest.js", "Express", "C# / .NET", "REST APIs", "Redis", "Mongoose", "MySQL", "Firebase", "JWT"],
  cloud: ["AWS EC2", "S3", "Lambda", "API Gateway", "CloudFront", "RDS", "Route 53", "IAM", "CloudWatch", "ECS / ECR", "CloudFormation", "AppSync"],
  devops: ["Azure DevOps", "GitHub Actions", "AWS CodeDeploy", "Docker", "SonarQube", "GitLab", "Vite"],
  testing: ["Jest", "React Testing Library", "Cypress", "TDD", "E2E suites"],
  practices: ["Clean Architecture", "SOLID", "DDD", "OOP", "Scrum", "Figma → Code"],
};

export const testimonials = [
  {
    placeholder: true,
    quote: "Space reserved for a recommendation from a Yape teammate or lead. Paste the text from LinkedIn recommendations here.",
    name: "Recommendation pending",
    title: "Colleague · Yape",
  },
  {
    placeholder: true,
    quote: "Space reserved for a recommendation from a Trem Group manager or client stakeholder.",
    name: "Recommendation pending",
    title: "Manager · Trem Group",
  },
  {
    placeholder: true,
    quote: "Space reserved for a recommendation from a DeltaX product or QA partner.",
    name: "Recommendation pending",
    title: "Product · DeltaX",
  },
];

export const leadership = [
  { title: "Led a Next.js 16 migration", text: "Owned the modernization of a legacy frontend serving millions of fintech users." },
  { title: "Cross-functional delivery", text: "Partnered with Strategy, Growth and Marketing to scope and prioritize requirements." },
  { title: "Parallel project ownership", text: "Managed 3 logistics projects at once while meeting every deadline." },
  { title: "Release automation", text: "Designed pipelines that cut deploys from 30 to under 5 minutes." },
];
