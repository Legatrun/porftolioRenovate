# Jair Merlo — Portfolio

Single-page, scroll-driven portfolio built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** and **Framer Motion 12**.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Structure

```
src/
  app/
    layout.jsx        fonts (Inter, Space Grotesk, JetBrains Mono), metadata, providers
    page.jsx          section order
    globals.css       design tokens + per-company palettes ([data-theme])
  lib/
    data.js           ALL content (profile, metrics, experience, skills, testimonials)
  components/
    ScrollTheme.jsx   IntersectionObserver → <html data-theme="yape|deltax|trem|alpha|stack|cloud">
    MotionProvider.jsx  honours prefers-reduced-motion
    layout/           Navbar (scroll progress, active section), Footer
    ui/               Reveal, RevealWords, ScrubText, Counter, Magnetic, SectionHeading, HudCorners
    sections/
      Hero.jsx        parallax name, cursor-follow glow, marquee
      Impact.jsx      scroll-scrubbed bio + animated metric counters
      experience/     Experience, Chapter (sticky + parallax), Visuals (company-inspired cards)
      Terminal.jsx    interactive CLI (`jair-merlo --skills [category]`, `--experience`, `--contact`, `help`)
      cloud/          Architecture diagram, CI/CD pipeline, tabbed code showcase
      Testimonials.jsx  draggable carousel + leadership highlights
      Contact.jsx
```

## Editing content

- Everything visible comes from `src/lib/data.js`.
- **Testimonials** are templates (`placeholder: true`). Replace `quote`, `name`, `title` with real recommendations and set `placeholder: false`.
- Company palettes live in `globals.css` under `:root[data-theme="..."]`; any section with `data-theme-section="<name>"` activates one.
