import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 md:px-8 py-10 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          © {new Date().getFullYear()} {profile.name} · Built with Next.js, Tailwind CSS & Framer Motion
          <span className="mt-2 block normal-case tracking-normal text-muted/80">
            iPhone 15 Pro Max 3D model by{" "}
            <a href="https://sketchfab.com/3d-models/iphone-15-pro-max-dcf6110190bd4f2682caddedbf850a94" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
              Debesis6
            </a>{" "}
            (
            <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
              CC BY 4.0
            </a>
            )
          </span>
        </p>
        <div className="flex gap-2">
          {[
            { href: profile.github, label: "GitHub", Icon: Github },
            { href: profile.linkedin, label: "LinkedIn", Icon: Linkedin },
            { href: `mailto:${profile.email}`, label: "Email", Icon: Mail },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-sm border border-line text-muted transition hover:border-accent hover:text-accent-ink"
            >
              <Icon size={17} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
