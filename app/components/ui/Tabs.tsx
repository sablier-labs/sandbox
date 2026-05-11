"use client";

import type { ReactNode } from "react";
import { tv } from "tailwind-variants";

const tabsContainer = tv({
  base: "flex items-center border-b border-ink-300 px-2",
  defaultVariants: { purpose: "sub" },
  variants: {
    purpose: {
      feature: "h-14",
      sub: "h-12",
    },
  },
});

const tab = tv({
  base: "flex flex-1 cursor-pointer items-center justify-center p-1.5 focus-visible:outline-none",
  defaultVariants: { active: false, purpose: "sub" },
  compoundVariants: [
    {
      active: true,
      class: { label: "bg-purple text-white shadow-sm shadow-purple/30" },
      purpose: "feature",
    },
  ],
  slots: {
    label: "w-full rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors",
  },
  variants: {
    active: {
      false: { label: "text-mist-300 hover:bg-ink-100 hover:text-white" },
      true: { label: "bg-orange text-white shadow-sm shadow-orange/30" },
    },
    purpose: {
      feature: {},
      sub: {},
    },
  },
});

export type TabSpec<T extends string | number> = { value: T; label: ReactNode };

type TabsProps<T extends string | number> = {
  active: T;
  onChange: (next: T) => void;
  options: TabSpec<T>[];
  purpose?: "feature" | "sub";
};

export function Tabs<T extends string | number>({
  active,
  onChange,
  options,
  purpose = "sub",
}: TabsProps<T>) {
  return (
    <div className={tabsContainer({ purpose })}>
      {options.map((opt) => {
        const isActive = opt.value === active;
        const slots = tab({ active: isActive, purpose });
        return (
          <button
            className={slots.base()}
            data-active={isActive}
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            type="button"
          >
            <span className={slots.label()}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
