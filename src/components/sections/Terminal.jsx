"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { experience, profile, skills } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SCREEN } from "@/lib/utils";

const CATS = Object.keys(skills);
const PROMPT = "visitor@merlo.dev:~$";

function run(raw) {
  const cmd = raw.trim().replace(/\s+/g, " ");
  if (!cmd) return [];
  const [bin, flag, arg] = cmd.split(" ");

  if (cmd === "help")
    return [
      { t: "muted", v: "Available commands:" },
      { t: "kv", k: "jair-merlo --skills [category]", v: `categories: ${CATS.join(", ")}` },
      { t: "kv", k: "jair-merlo --experience", v: "career timeline" },
      { t: "kv", k: "jair-merlo --contact", v: "how to reach me" },
      { t: "kv", k: "whoami", v: "short bio" },
      { t: "kv", k: "clear", v: "clear the screen" },
    ];
  if (cmd === "whoami") return [{ t: "text", v: `${profile.name} — ${profile.role}. ${profile.location}.` }, { t: "muted", v: profile.belief }];
  if (bin !== "jair-merlo") return [{ t: "error", v: `command not found: ${bin}. Try "help".` }];

  if (flag === "--skills") {
    const list = arg ? [arg] : CATS;
    if (arg && !skills[arg]) return [{ t: "error", v: `unknown category "${arg}". Use: ${CATS.join(", ")}` }];
    return list.flatMap((c) => [{ t: "head", v: c }, { t: "chips", v: skills[c] }]);
  }
  if (flag === "--experience")
    return experience.map((j) => ({ t: "kv", k: j.period, v: `${j.role} @ ${j.company}` }));
  if (flag === "--contact")
    return [
      { t: "link", k: "email", v: profile.email, href: `mailto:${profile.email}` },
      { t: "link", k: "linkedin", v: "in/jairmerloluque", href: profile.linkedin },
      { t: "link", k: "github", v: "github.com/Legatrun", href: profile.github },
      { t: "kv", k: "phone", v: profile.phone },
    ];
  return [{ t: "error", v: `unknown flag "${flag ?? ""}". Try "help".` }];
}

function Line({ l }) {
  switch (l.t) {
    case "cmd":
      return (
        <p>
          <span className="text-accent-ink">{PROMPT}</span> <span className="text-white">{l.v}</span>
        </p>
      );
    case "head":
      return <p className="mt-3 text-accent-2"># {l.v}</p>;
    case "chips":
      return (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {l.v.map((s) => (
            <span key={s} className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-white/90">
              {s}
            </span>
          ))}
        </div>
      );
    case "kv":
      return (
        <p className="grid grid-cols-[minmax(0,14rem)_1fr] gap-4">
          <span className="text-white">{l.k}</span>
          <span className="text-muted">{l.v}</span>
        </p>
      );
    case "link":
      return (
        <p className="grid grid-cols-[minmax(0,14rem)_1fr] gap-4">
          <span className="text-white">{l.k}</span>
          <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-accent-ink underline-offset-4 hover:underline">
            {l.v}
          </a>
        </p>
      );
    case "error":
      return <p className="text-red-400">{l.v}</p>;
    case "muted":
      return <p className="text-muted">{l.v}</p>;
    default:
      return <p className="text-white/90">{l.v}</p>;
  }
}

export default function Terminal() {
  const [lines, setLines] = useState([{ t: "muted", v: 'Welcome. Type "help" or tap a command below.' }]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const [typing, setTyping] = useState(false);
  const boxRef = useRef(null);
  const inputRef = useRef(null);
  const inView = useInView(boxRef, { once: true, margin: "-25% 0px" });

  const execute = (cmd) => {
    if (cmd.trim() === "clear") return setLines([]);
    setLines((prev) => [...prev, { t: "cmd", v: cmd }, ...run(cmd)]);
    if (cmd.trim()) setHistory((h) => [cmd, ...h]);
    setHIdx(-1);
  };

  // Types a command character by character, then runs it.
  const typeOut = (cmd) => {
    if (typing) return;
    setTyping(true);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setInput(cmd.slice(0, i));
      if (i >= cmd.length) {
        clearInterval(id);
        setTimeout(() => {
          execute(cmd);
          setInput("");
          setTyping(false);
        }, 180);
      }
    }, 38);
  };

  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => typeOut("jair-merlo --skills"), 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    const el = boxRef.current?.querySelector("[data-scroll]");
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      execute(input);
      setInput("");
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const n = Math.min(hIdx + 1, history.length - 1);
      setHIdx(n);
      setInput(history[n]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = hIdx - 1;
      setHIdx(n);
      setInput(n >= 0 ? history[n] : "");
    }
  };

  const quick = ["jair-merlo --skills frontend", "jair-merlo --skills cloud", "jair-merlo --experience", "jair-merlo --contact", "help", "clear"];

  return (
    <section id="stack" data-theme-section="default" className={SCREEN}>
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        <SectionHeading
          index="03"
          kicker="Tech stack"
          title="Run the command. See the stack."
          intro="An interactive CLI — type, use ↑ ↓ for history, or tap a quick command."
        />

        <Reveal>
          <div ref={boxRef} className="overflow-hidden rounded-2xl border border-line bg-black/70 shadow-[0_0_120px_-60px_var(--accent)] backdrop-blur">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-muted">zsh — jair-merlo</span>
            </div>

            <div
              data-scroll
              onClick={() => inputRef.current?.focus()}
              className="h-[clamp(16rem,46svh,26rem)] overflow-y-auto px-5 py-5 font-mono text-[13px] leading-relaxed space-y-1"
              role="log"
              aria-live="polite"
            >
              {lines.map((l, i) => (
                <Line key={i} l={l} />
              ))}
              <label className="flex items-center gap-2">
                <span className="text-accent-ink shrink-0">{PROMPT}</span>
                <span className="sr-only">Terminal command</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  readOnly={typing}
                  spellCheck={false}
                  autoComplete="off"
                  className="flex-1 bg-transparent text-white caret-accent outline-none focus-visible:outline-none"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
              {quick.map((q) => (
                <button
                  key={q}
                  onClick={() => typeOut(q)}
                  disabled={typing}
                  className="rounded-md border border-line bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-muted transition hover:border-accent hover:text-white disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
