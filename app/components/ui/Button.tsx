"use client";

import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const button = tv({
  base: "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
  defaultVariants: { intent: "primary" },
  variants: {
    intent: {
      ghost: "text-mist-300 hover:bg-ink-200 hover:text-white",
      primary: "bg-orange text-white hover:bg-orange/90",
      secondary: "border-2 border-ink-300 bg-ink-100 text-white hover:bg-ink-200",
    },
  },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export function Button({ className, intent, ...rest }: ButtonProps) {
  return <button className={button({ intent, class: className })} type="button" {...rest} />;
}
