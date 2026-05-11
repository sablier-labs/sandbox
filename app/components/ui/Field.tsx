"use client";

import { Check } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import { tv } from "tailwind-variants";

const wrapper = tv({ base: "flex flex-col gap-1.5" });
const label = tv({ base: "text-xs font-semibold tracking-wide text-mist-300 uppercase" });
const helper = tv({ base: "text-xs text-mist-500" });
const input = tv({
  base: "w-full rounded-md border-2 border-ink-300 bg-ink-100 px-3 py-2.5 font-mono text-sm text-white transition-colors outline-none placeholder:text-mist-500 hover:border-ink-300/80 focus:border-orange focus:ring-2 focus:ring-orange/30 disabled:cursor-not-allowed disabled:opacity-60",
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
    <label className="group inline-flex cursor-pointer items-center gap-2 text-sm text-white select-none">
      <input
        checked={checked}
        className="peer sr-only"
        onChange={(e) => onChange(e.target.checked)}
        type="checkbox"
      />
      <span className="grid size-4 place-items-center rounded-sm border-2 border-ink-300 bg-ink-100 transition-colors peer-checked:border-orange peer-checked:bg-orange peer-focus-visible:ring-2 peer-focus-visible:ring-orange/40 peer-checked:[&_svg]:opacity-100">
        <Check className="size-3 text-white opacity-0 transition-opacity" strokeWidth={3} />
      </span>
      {labelText}
    </label>
  );
}
