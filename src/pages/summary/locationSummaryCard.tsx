import { STEPS } from "@/features/fillFlow/constants";
import type { Location } from "@/features/fillFlow/types";
import {
  stepFieldLabels,
  stepToFields,
  formatValue,
} from "@/constants/summaryPage";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LocationSummaryCardProps {
  location: Location;
  index: number;
  onEdit: (locationId: string, stepIndex: number) => void;
}

export function LocationSummaryCard({
  location,
  index,
  onEdit,
}: LocationSummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-neutral-50)]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[var(--color-success-600)] text-white flex items-center justify-center">
            <Check size={13} strokeWidth={3} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">
              Lokasyon {index + 1}
            </p>
            <p className="text-sm font-semibold text-[var(--color-text-heading)]">
              {location.name}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[var(--color-border)]">
        {STEPS.map((step, stepIndex) => {
          const fields = stepToFields[stepIndex] ?? [];
          return (
            <div key={step.id} className="px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                    Adım {stepIndex + 1}: {step.label}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {fields.map((field) => (
                      <div key={field}>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {stepFieldLabels[field]}
                        </p>
                        <p className="text-sm font-semibold text-[var(--color-text-heading)] mt-0.5">
                          {formatValue(field, location.values[field] as string)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  id={`edit-loc-${location.id}-step-${stepIndex}`}
                  onClick={() => onEdit(location.id, stepIndex)}
                  aria-label={`${location.name} için ${step.label} adımını düzenle`}
                  className="shrink-0"
                >
                  Düzenle
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
