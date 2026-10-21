"use client";
import { useState } from "react";
import { ArrowUpRight, Check, Copy, GraduationCap, Languages } from "lucide-react";
import { profile } from "@/lib/data";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <section id="contact" data-theme-section="default" className="relative overflow-hidden border-t border-line py-28 md:py-40">
      <div aria-hidden className="glow-orb absolute left-1/2 top-full -ml-[35vmax] -mt-[35vmax] h-[70vmax] w-[70vmax] opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          <span className="text-accent">06</span>
          <span className="h-px w-10 bg-accent/60" />
          Contact
        </Reveal>
        <h2 className="mt-6 font-display text-[12vw] md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tighter">
          <RevealWords text="Let's build" />
          <br />
          <RevealWords text="something fast." delay={0.15} wordClassName="text-gradient" />
        </h2>

        <Reveal delay={0.2} className="mt-12 flex flex-wrap items-center gap-4">
          <Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-black transition hover:bg-accent"
            >
              {profile.email}
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-4 text-sm text-muted transition hover:border-white hover:text-white"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy email"}
          </button>
        </Reveal>

        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {[
            { k: "LinkedIn", v: "in/jairmerloluque", href: profile.linkedin },
            { k: "GitHub", v: "github.com/Legatrun", href: profile.github },
            { k: "Phone", v: profile.phone, href: profile.phoneHref },
            { k: "Résumé", v: "Download PDF", href: profile.cv },
          ].map((c) => (
            <a
              key={c.k}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex items-center justify-between bg-[var(--bg)] p-6 transition hover:bg-white/[0.04]"
            >
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{c.k}</span>
                <span className="mt-1 block">{c.v}</span>
              </span>
              <ArrowUpRight size={18} className="text-muted transition group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-line p-6">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              <GraduationCap size={14} className="text-accent" /> Education
            </p>
            <p className="mt-3 font-semibold">{profile.education.degree}</p>
            <p className="text-muted">{profile.education.school}</p>
          </Reveal>
          <Reveal delay={0.08} className="rounded-2xl border border-line p-6">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              <Languages size={14} className="text-accent" /> Languages
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
              {profile.languages.map((l) => (
                <li key={l.name}>
                  <span className="font-semibold">{l.name}</span> <span className="text-muted">· {l.level}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
