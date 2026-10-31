"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { profile } from "@/lib/data";

const links = [
  { href: "#impact", label: "Impact" },
  { href: "#experience", label: "Experience" },
  { href: "#tech-impact", label: "Tech Impact" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-black/55 backdrop-blur-xl border-b border-line" : "bg-transparent"
      )}
    >
      <motion.div style={{ scaleX: progress }} className="absolute bottom-0 left-0 right-0 h-px origin-left bg-accent" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8 h-16" aria-label="Primary">
        <a href="#top" className="group flex items-center gap-2.5 font-display font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-accent text-on-accent transition-transform duration-300 group-hover:rotate-[-8deg]">
            J
          </span>
          <span>
            Merlo<span className="text-accent-ink">.dev</span>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={cn(
                  "relative px-3.5 py-2 text-sm transition-colors",
                  active === l.href ? "text-white" : "text-muted hover:text-white"
                )}
              >
                {active === l.href && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-sm bg-white/[0.07] border border-line" />
                )}
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-sm border border-line bg-white/[0.04] px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent-ink"
          >
            Résumé <ArrowUpRight size={15} />
          </a>
          <button
            className="lg:hidden grid h-10 w-10 place-items-center rounded-sm border border-line"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-line bg-black/90 backdrop-blur-xl px-5"
          >
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3.5 font-display text-2xl border-b border-line">
                  {l.label}
                </a>
              </li>
            ))}
            <li className="py-5">
              <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-accent-ink">
                Download résumé <ArrowUpRight size={16} />
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
