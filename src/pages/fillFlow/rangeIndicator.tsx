export interface RangeIndicatorProps {
  min: number;
  max: number;
  value: number;
}

export function RangeIndicator({ min, max, value }: RangeIndicatorProps) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const isValid = value >= min && value <= max;

  return (
    <div
      className="p-3 rounded-xl bg-[var(--color-neutral-50)] border border-[var(--color-border)]"
      aria-label={`Dolum miktarı ${value}, minimum ${min}, maksimum ${max}`}
    >
      <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-2">
        <span>Min: {min}</span>
        <span
          className={[
            "font-semibold",
            isValid
              ? "text-[var(--color-success-700)]"
              : "text-[var(--color-danger-600)]",
          ].join(" ")}
        >
          {value}
        </span>
        <span>Maks: {max}</span>
      </div>
      <div className="h-2 bg-[var(--color-neutral-200)] rounded-full overflow-hidden">
        <div
          className={[
            "h-full rounded-full transition-all duration-300",
            isValid
              ? "bg-[var(--color-success-500)]"
              : "bg-[var(--color-danger-500)]",
          ].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
