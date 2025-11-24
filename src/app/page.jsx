"use client";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { HomePage } from "@/app/home/page";
import ShowcasePage from "@/app/showcase/page";
import { AboutPage } from "@/app/about/page";

const App = () => {
  const [activeTab, setActiveTab] = useState('home');

  const navigate = (tab) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">

      <main className="pt-24 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomePage key="home" navigate={navigate} />}
          {activeTab === 'showcase' && <ShowcasePage key="showcase" />}
          {activeTab === 'about' && <AboutPage key="about" />}
        </AnimatePresence>
      </main>

    </div>
  );
};

export default App;