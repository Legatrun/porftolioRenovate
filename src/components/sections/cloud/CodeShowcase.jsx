"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

const files = {
  "deploy.yml": `# GitHub Actions → S3 + CloudFront (30 min → <5 min)
name: deploy
on:
  push:
    branches: [main]
jobs:
  ship:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test -- --ci
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: \${{ secrets.AWS_DEPLOY_ROLE }}
          aws-region: us-east-1
      - run: aws s3 sync ./out s3://$BUCKET --delete
      - run: aws cloudfront create-invalidation --distribution-id $CDN --paths "/*"`,
  "handler.ts": `// Lambda behind API Gateway — typed, stateless, observable
import type { APIGatewayProxyHandler } from "aws-lambda";
import { getPool } from "./db";

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;
  if (!id) return { statusCode: 400, body: "Missing id" };

  const db = await getPool(); // reused across warm invocations
  const [rows] = await db.query("SELECT * FROM listings WHERE id = ?", [id]);

  console.log(JSON.stringify({ level: "info", id, hit: !!rows.length }));
  return { statusCode: 200, body: JSON.stringify(rows[0] ?? null) };
};`,
  "Listing.jsx": `// SOLID, reusable UI — 80% quicker page loads at scale
import { memo } from "react";
import dynamic from "next/dynamic";

const Gallery = dynamic(() => import("./Gallery"), { ssr: false });

export const Listing = memo(function Listing({ data, onSelect }) {
  return (
    <article className="card" onClick={() => onSelect(data.id)}>
      <h3>{data.title}</h3>
      <Price value={data.price} currency={data.currency} />
      <Gallery images={data.images} priority={false} />
    </article>
  );
});`,
};

const KW = /\b(import|from|export|const|let|async|await|return|function|if|type|on|jobs|steps|with|name|run|uses|runs-on)\b/g;

function highlight(line) {
  const comment = line.match(/^(\s*)(#|\/\/)(.*)$/);
  if (comment) return <span className="text-white/35">{line}</span>;
  const parts = line.split(/("[^"]*"|`[^`]*`|'[^']*')/g);
  return parts.map((p, i) =>
    /^["'`]/.test(p) ? (
      <span key={i} className="text-accent-2">{p}</span>
    ) : (
      <span
        key={i}
        dangerouslySetInnerHTML={{
          __html: p
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(KW, '<span class="text-accent-ink">$1</span>')
            .replace(/\b(\d+)\b/g, '<span class="text-amber-300">$1</span>'),
        }}
      />
    )
  );
}

export default function CodeShowcase() {
  const names = Object.keys(files);
  const [tab, setTab] = useState(names[0]);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(files[tab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-black/60">
      <div className="flex items-center justify-between border-b border-line pr-3">
        <div role="tablist" className="flex overflow-x-auto">
          {names.map((n) => (
            <button
              key={n}
              role="tab"
              aria-selected={tab === n}
              onClick={() => setTab(n)}
              className={`relative px-4 py-3 font-mono text-xs transition ${tab === n ? "text-white" : "text-muted hover:text-white"}`}
            >
              {n}
              {tab === n && <motion.span layoutId="code-tab" className="absolute inset-x-0 bottom-0 h-px bg-accent" />}
            </button>
          ))}
        </div>
        <button onClick={copy} aria-label="Copy code" className="grid h-8 w-8 place-items-center rounded-md text-muted hover:bg-white/5 hover:text-white">
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.pre
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="overflow-x-auto p-4 font-mono text-[12px] leading-5 short:text-[11px] short:leading-[18px] short:py-3"
        >
          <code>
            {files[tab].split("\n").map((l, i) => (
              <div key={i} className="table-row">
                <span className="table-cell select-none pr-5 text-right text-white/20">{i + 1}</span>
                <span className="table-cell whitespace-pre text-white/85">{highlight(l)}</span>
              </div>
            ))}
          </code>
        </motion.pre>
      </AnimatePresence>
    </div>
  );
}
