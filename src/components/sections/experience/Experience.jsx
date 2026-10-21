import { experience } from "@/lib/data";
import { SCREEN } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import Chapter from "./Chapter";

export default function Experience() {
  return (
    <section id="experience" className="relative">
      <div className={SCREEN} data-theme-section="default">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <SectionHeading
            index="02"
            kicker="Work experience"
            title="Four products. Four industries. One standard."
            intro="Each chapter snaps into place and the interface takes on the digital identity of the company behind it."
          />
          <nav aria-label="Experience chapters" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {experience.map((j, i) => (
              <Reveal key={j.id} delay={i * 0.07}>
                <a
                  href={`#exp-${j.id}`}
                  className="group block h-full rounded-2xl border border-line bg-white/[0.02] p-5 transition hover:-translate-y-1 hover:border-white/30"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                    {String(i + 1).padStart(2, "0")} · {j.period}
                  </span>
                  <span className="mt-4 block font-display text-2xl font-bold">{j.company}</span>
                  <span className="mt-1 block text-sm text-muted">{j.role}</span>
                  <span className="mt-4 block text-xs text-muted">{j.sector}</span>
                </a>
              </Reveal>
            ))}
          </nav>
        </div>
      </div>
      {experience.map((job, i) => (
        <Chapter key={job.id} job={job} index={i} />
      ))}
    </section>
  );
}
