"use client";

import { ExternalLink } from "lucide-react";
import { tv } from "tailwind-variants";

const link = tv({
  base: "inline-flex items-center gap-1 text-sm font-semibold text-mist-300 hover:text-white",
});

export function Navigation() {
  return (
    <nav className="flex items-center justify-between border-b border-ink-300 pb-4">
      <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight md:text-3xl">
        <span className="inline-block size-2.5 rounded-full bg-orange shadow-[0_0_12px] shadow-orange/60" />
        Sablier Sandbox
      </h1>
      <div className="flex items-center gap-4">
        <a className={link()} href="https://docs.sablier.com" rel="noreferrer" target="_blank">
          Docs <ExternalLink className="size-3" />
        </a>
        <a
          className={link()}
          href="https://github.com/sablier-labs/sandbox"
          rel="noreferrer"
          target="_blank"
        >
          GitHub <ExternalLink className="size-3" />
        </a>
      </div>
    </nav>
  );
}
