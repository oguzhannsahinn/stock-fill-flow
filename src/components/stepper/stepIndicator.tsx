import type { StepConfig } from "@/features/fillFlow/types";
import { Check } from "lucide-react";

export type StepStatus = "pending" | "active" | "completed";

interface StepIndicatorProps {
  step: StepConfig;
  stepNumber: number;
  status: StepStatus;
  isLast: boolean;
  onClick?: () => void;
  canNavigate: boolean;
}

export function StepIndicator({
  step,
  stepNumber,
  status,
  isLast,
  onClick,
  canNavigate,
}: StepIndicatorProps) {
  const isCompleted = status === "completed";
  const isActive = status === "active";

  return (
    <li className="flex items-center gap-0" role="listitem">
      <div className="flex items-center gap-0 flex-1">
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={canNavigate ? onClick : undefined}
            disabled={!canNavigate}
            aria-current={isActive ? "step" : undefined}
            aria-label={`${stepNumber}. adım: ${step.label} – ${
              isCompleted ? "Tamamlandı" : isActive ? "Aktif" : "Bekliyor"
            }`}
            className={[
              "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold",
              "transition-all duration-300 relative shrink-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isCompleted
                ? "bg-[var(--color-success-600)] text-white focus-visible:ring-[var(--color-success-600)] cursor-pointer hover:bg-[var(--color-success-700)]"
                : isActive
                  ? "bg-[var(--color-primary-600)] text-white ring-4 ring-[var(--color-primary-100)] focus-visible:ring-[var(--color-primary-600)] cursor-default"
                  : "bg-[var(--color-neutral-200)] text-[var(--color-neutral-500)] focus-visible:ring-[var(--color-neutral-400)] cursor-not-allowed",
              canNavigate && isCompleted ? "cursor-pointer" : "",
            ].join(" ")}
          >
            {isCompleted ? (
              <Check size={16} strokeWidth={2.5} aria-hidden="true" />
            ) : (
              stepNumber
            )}
          </button>

          <span
            className={[
              "mt-2 text-xs font-medium text-center whitespace-nowrap leading-tight",
              isActive
                ? "text-[var(--color-primary-700)]"
                : isCompleted
                  ? "text-[var(--color-success-700)]"
                  : "text-[var(--color-neutral-400)]",
            ].join(" ")}
          >
            {step.label}
          </span>
        </div>

        {!isLast && (
          <div className="flex-1 mx-2 mb-5 relative h-0.5 rounded-full overflow-hidden bg-[var(--color-neutral-200)]">
            <div
              className={[
                "absolute inset-0 rounded-full transition-all duration-500 ease-out",
                isCompleted
                  ? "bg-[var(--color-success-500)] w-full"
                  : "bg-transparent w-0",
              ].join(" ")}
            />
          </div>
        )}
      </div>
    </li>
  );
}
