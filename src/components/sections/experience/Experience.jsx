import { experience } from "@/lib/data";
import Chapter from "./Chapter";

export default function Experience() {
  return (
    <section id="experience" className="relative">
      {experience.map((job, i) => (
        <Chapter key={job.id} job={job} index={i} />
      ))}
    </section>
  );
}
