"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, FileText, Github, GraduationCap, Languages, Linkedin, Phone } from "lucide-react";
import { profile } from "@/lib/data";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import Footer from "@/components/layout/Footer";
import { SCREEN, cn } from "@/lib/utils";

const TZ = "America/La_Paz";

/** Live local time; rendered after mount to avoid a hydration mismatch. */
function LocalTime() {
  const [t, setT] = useState(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums text-fg">{t ?? "--:--"}</span>;
}

const LINKS = [
  { k: "LinkedIn", v: "in/jairmerloluque", href: profile.linkedin, Icon: Linkedin },
  { k: "GitHub", v: "github.com/Legatrun", href: profile.github, Icon: Github },
  { k: "Phone", v: profile.phone, href: profile.phoneHref, Icon: Phone },
  { k: "Résumé", v: "Download PDF", href: profile.cv, Icon: FileText },
];

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
    <section id="contact" data-theme-section="default" className={cn(SCREEN, "overflow-hidden pb-0")}>
      <div aria-hidden className="glow-orb absolute -right-[20vmax] top-1/3 h-[60vmax] w-[60vmax] opacity-15" />
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto my-auto grid w-full max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
        {/* Pitch */}
        <div>
          <Reveal className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
            <span className="text-accent-ink">06</span>
            <span className="h-px w-10 bg-accent/60" />
            Contact
          </Reveal>

          <Reveal delay={0.05} className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span className="inline-flex items-center gap-2 rounded-sm border border-accent/50 bg-accent/10 px-2.5 py-1 text-accent-ink">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Open to new opportunities
            </span>
            <span>{profile.location}</span>
            <span>
              Local time <LocalTime /> <span className="text-muted">GMT-4</span>
            </span>
          </Reveal>

          <h2 className="mt-6 font-display text-[13vw] md:text-8xl short:md:text-7xl font-bold leading-[0.88] tracking-tighter">
            <RevealWords text="Let's build" />
            <br />
            <RevealWords text="something fast." delay={0.15} wordClassName="text-gradient pb-[0.12em]" />
          </h2>

          <Reveal delay={0.2} className="mt-8 short:mt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Drop a line</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="group relative font-display text-2xl md:text-4xl short:md:text-3xl font-semibold tracking-tight break-all"
              >
                {profile.email}
                <span aria-hidden className="absolute -bottom-1 left-0 h-[3px] w-full origin-left scale-x-[0.25] bg-accent transition-transform duration-500 group-hover:scale-x-100" />
              </a>
              <button
                onClick={copy}
                aria-label={copied ? "Email copied" : "Copy email"}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-sm border px-3 font-mono text-[11px] uppercase tracking-widest transition",
                  copied ? "border-accent text-accent-ink" : "border-line text-muted hover:border-white hover:text-white"
                )}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <Magnetic className="mt-6 short:mt-4 inline-block">
              <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-2 btn-accent rounded-sm px-7 py-4 font-semibold">
                Start a project
                <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
          </Reveal>
        </div>

        {/* Channels + credentials */}
        <div>
          <ul className="border-t border-line">
            {LINKS.map(({ k, v, href, Icon }, i) => (
              <Reveal as="li" key={k} delay={0.08 * i} className="border-b border-line">
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-4 overflow-hidden px-2 py-4 short:py-3 transition-colors duration-300 hover:text-on-accent"
                >
                  <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                  <span className="relative font-mono text-[10px] tracking-[0.2em] text-muted transition-colors group-hover:text-on-accent/70">{String(i + 1).padStart(2, "0")}</span>
                  <Icon size={18} className="relative flex-none text-accent-ink transition-colors group-hover:text-on-accent" />
                  <span className="relative min-w-0 flex-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted transition-colors group-hover:text-on-accent/70">{k}</span>
                    <span className="block truncate font-display text-lg font-medium">{v}</span>
                  </span>
                  <ArrowUpRight size={20} className="relative flex-none transition-transform duration-300 group-hover:rotate-45" />
                </a>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.3} className="mt-5 short:mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line text-sm">
            <div className="bg-[var(--bg)] p-4">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                <GraduationCap size={13} className="text-accent-ink" /> Education
              </p>
              <p className="mt-2 font-semibold leading-snug">{profile.education.degree}</p>
              <p className="text-muted">{profile.education.school}</p>
            </div>
            <div className="bg-[var(--bg)] p-4">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                <Languages size={13} className="text-accent-ink" /> Languages
              </p>
              <ul className="mt-2 space-y-0.5">
                {profile.languages.map((l) => (
                  <li key={l.name} className="flex justify-between gap-2">
                    <span className="font-semibold">{l.name}</span>
                    <span className="text-muted">{l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative mt-10 short:mt-6 w-full">
        <Footer />
      </div>
    </section>
  );
}
