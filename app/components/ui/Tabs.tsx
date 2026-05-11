"use client";

import type { ReactNode } from "react";
import { tv } from "tailwind-variants";

const tabsContainer = tv({
  base: "flex items-center border-b border-ink-300 px-3",
  defaultVariants: { purpose: "sub" },
  variants: {
    purpose: {
      feature: "h-20",
      sub: "h-16",
    },
  },
});

const tab = tv({
  base: "flex flex-1 cursor-pointer items-center justify-center p-2",
  defaultVariants: { active: false, purpose: "sub" },
  compoundVariants: [
    {
      active: true,
      class: { label: "bg-purple text-white" },
      purpose: "feature",
    },
  ],
  slots: {
    label: "w-full rounded-md px-3 py-2 text-center text-sm font-semibold",
  },
  variants: {
    active: {
      false: { label: "text-mist-300 hover:bg-ink-200 hover:text-white" },
      true: { label: "bg-orange text-white" },
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
