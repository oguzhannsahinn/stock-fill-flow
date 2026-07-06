import { Input as HeadlessInput } from "@headlessui/react";
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", error, ...props },
  ref,
) {
  const hasBg = className.includes("bg-");
  const hasRounded = className.includes("rounded-");

  return (
    <HeadlessInput
      ref={ref}
      className={[
        "w-full border text-sm",
        !hasRounded && "rounded-lg",
        "focus:outline-none focus:border-transparent",
        error
          ? "border-[var(--color-danger-500)] focus:ring-[var(--color-danger-500)] bg-[var(--color-danger-50)]"
          : [
              "border-[var(--color-border)] text-[var(--color-text-heading)] placeholder:text-[var(--color-neutral-400)] hover:border-[var(--color-neutral-300)]",
              !hasBg && "bg-[var(--color-neutral-50)]",
            ]
              .filter(Boolean)
              .join(" "),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
});
