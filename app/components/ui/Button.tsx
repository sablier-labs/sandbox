"use client";

import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const button = tv({
  base: "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
  defaultVariants: { intent: "primary" },
  variants: {
    intent: {
      ghost: "text-mist-300 hover:bg-ink-200 hover:text-white focus-visible:ring-mist-500/40",
      primary:
        "bg-orange text-white shadow-sm shadow-orange/20 hover:bg-orange/90 hover:shadow-md hover:shadow-orange/30 focus-visible:ring-orange/40",
      secondary:
        "border-2 border-ink-300 bg-ink-100 text-white hover:border-mist-500 hover:bg-ink-200 focus-visible:ring-mist-500/40",
    },
  },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export function Button({ className, intent, ...rest }: ButtonProps) {
  return <button className={button({ intent, class: className })} type="button" {...rest} />;
}
