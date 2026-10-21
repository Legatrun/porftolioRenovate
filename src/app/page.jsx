import Hero from "@/components/sections/Hero";
import Impact from "@/components/sections/Impact";
import Experience from "@/components/sections/experience/Experience";
import Terminal from "@/components/sections/Terminal";
import Cloud from "@/components/sections/cloud/Cloud";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Impact />
      <Experience />
      <Terminal />
      <Cloud />
      <Testimonials />
      <Contact />
    </>
  );
}
