import type { InputHTMLAttributes, ReactNode } from "react";
import { XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NumericFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value"
> {
  id: string;
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  error?: string;
  hint?: string;
  unit?: string;
  leftIcon?: ReactNode;
  required?: boolean;
}

export function NumericField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  unit,
  leftIcon,
  required = false,
  min,
  max,
  ...rest
}: NumericFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedByIds = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(" ");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "" || raw === "-") {
      onChange(null);
    } else {
      const parsed = parseFloat(raw);
      onChange(isNaN(parsed) ? null : parsed);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[var(--color-text-heading)]"
      >
        {label}
        {required && (
          <span
            className="ml-1 text-[var(--color-danger-500)]"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)] pointer-events-none">
            {leftIcon}
          </div>
        )}

        <Input
          id={id}
          type="number"
          value={value ?? ""}
          onChange={handleChange}
          min={min}
          max={max}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedByIds || undefined}
          error={!!error}
          className={[
            "h-11 rounded-xl bg-white",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            leftIcon ? "pl-10" : "pl-4",
            unit ? "pr-16" : "pr-4",
          ].join(" ")}
          {...rest}
        />

        {unit && (
          <div className="absolute right-0 top-0 h-full flex items-center pr-1">
            <span className="h-9 px-3 flex items-center text-xs font-medium text-[var(--color-text-muted)]">
              {unit}
            </span>
          </div>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-[var(--color-danger-600)] flex items-center gap-1.5"
        >
          <XCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={hintId} className="text-xs text-[var(--color-text-muted)]">
          {hint}
        </p>
      )}
    </div>
  );
}
