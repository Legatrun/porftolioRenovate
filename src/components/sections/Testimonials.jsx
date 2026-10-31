"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { leadership, testimonials } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export default function Testimonials() {
  const [[i, dir], setState] = useState([0, 0]);
  const go = (d) => setState(([c]) => [(c + d + testimonials.length) % testimonials.length, d]);
  const t = testimonials[i];

  return (
    <section id="endorsements" data-theme-section="default" className="relative border-t border-line py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading index="05" kicker="Endorsements & leadership" title="What working together looks like." />

        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-7 md:p-10">
              <Quote className="text-accent" size={32} />
              <div className="relative flex-1 py-8" aria-live="polite">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.figure
                    key={i}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -40 }}
                    transition={{ duration: 0.4 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => Math.abs(info.offset.x) > 60 && go(info.offset.x < 0 ? 1 : -1)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <blockquote className={`font-display text-2xl md:text-3xl leading-snug ${t.placeholder ? "text-white/45 italic" : ""}`}>
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-dashed border-white/25 font-mono text-xs text-muted">
                        {t.placeholder ? "?" : t.name.split(" ").map((w) => w[0]).join("")}
                      </span>
                      <span>
                        <span className="block font-semibold">{t.name}</span>
                        <span className="block text-sm text-muted">{t.title}</span>
                      </span>
                      {t.placeholder && (
                        <span className="ml-auto rounded-sm border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">Template</span>
                      )}
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {testimonials.map((_, k) => (
                    <button
                      key={k}
                      onClick={() => setState([k, k > i ? 1 : -1])}
                      aria-label={`Show endorsement ${k + 1}`}
                      className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-accent" : "w-3 bg-white/20 hover:bg-white/40"}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => go(-1)} aria-label="Previous" className="grid h-10 w-10 place-items-center rounded-sm border border-line transition hover:border-accent hover:text-accent">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => go(1)} aria-label="Next" className="grid h-10 w-10 place-items-center rounded-sm border border-line transition hover:border-accent hover:text-accent">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {leadership.map((l, k) => (
              <Reveal key={l.title} delay={k * 0.07}>
                <div className="group h-full rounded-2xl border border-line bg-white/[0.02] p-5 transition hover:border-accent/50 hover:bg-white/[0.04]">
                  <p className="flex items-center gap-2 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
                    {l.title}
                  </p>
                  <p className="mt-1.5 text-sm text-muted">{l.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
