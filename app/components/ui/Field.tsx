"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/cn";

const wrapper = tv({ base: "flex flex-col gap-1" });
const label = tv({ base: "text-xs font-semibold tracking-wide text-mist-300 uppercase" });
const helper = tv({ base: "text-xs text-mist-500" });
const input = tv({
  base: "w-full rounded-md border-2 border-ink-300 bg-ink-100 px-3 py-2 font-mono text-sm text-white outline-none focus:border-orange disabled:cursor-not-allowed disabled:opacity-60",
});

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: ReactNode;
  className?: string;
};

export function Field({ label: labelText, helperText, className, ...rest }: FieldProps) {
  const id = useId();
  return (
    <div className={wrapper({ class: className })}>
      <label className={label()} htmlFor={id}>
        {labelText}
      </label>
      <input className={input()} id={id} {...rest} />
      {helperText ? <span className={helper()}>{helperText}</span> : null}
    </div>
  );
}

type CheckboxFieldProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
};

export function Toggle({ checked, onChange, label: labelText }: CheckboxFieldProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-white">
      <input
        checked={checked}
        className={cn(
          "size-4 rounded-sm border-2 border-ink-300 bg-ink-100 accent-orange",
          "focus:ring-2 focus:ring-orange",
        )}
        onChange={(e) => onChange(e.target.checked)}
        type="checkbox"
      />
      {labelText}
    </label>
  );
}
