import { experience } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Chapter from "./Chapter";

export default function Experience() {
  return (
    <section id="experience" className="relative pt-28 md:pt-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8" data-theme-section="default">
        <SectionHeading
          index="02"
          kicker="Work experience"
          title="Four products. Four industries. One standard."
          intro="Scroll through each chapter — the interface adapts to the digital identity of the company behind it."
        />
        <nav aria-label="Experience chapters" className="mb-16 flex flex-wrap gap-2">
          {experience.map((j, i) => (
            <a
              key={j.id}
              href={`#exp-${j.id}`}
              className="rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted transition hover:border-white hover:text-white"
            >
              {String(i + 1).padStart(2, "0")} · {j.company}
            </a>
          ))}
        </nav>
      </div>
      {experience.map((job, i) => (
        <Chapter key={job.id} job={job} index={i} />
      ))}
    </section>
  );
}
