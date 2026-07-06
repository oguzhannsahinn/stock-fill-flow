import { useRef, useEffect } from "react";
import type { Location } from "@/features/fillFlow/types";
import { TOTAL_STEPS } from "@/features/fillFlow/constants";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STATUS_LABEL, STATUS_BADGE_CLASS } from "@/constants/locationList";

interface LocationListProps {
  locations: Location[];
  activeLocationId: string | null;
  onSelectLocation: (id: string) => void;
}

export function LocationList({
  locations,
  activeLocationId,
  onSelectLocation,
}: LocationListProps) {
  const liveRef = useRef<HTMLParagraphElement>(null);
  const prevActiveRef = useRef(activeLocationId);

  useEffect(() => {
    if (prevActiveRef.current !== activeLocationId && liveRef.current) {
      const loc = locations.find((l) => l.id === activeLocationId);
      if (loc) {
        liveRef.current.textContent = `Aktif lokasyon: ${loc.name}`;
      }
    }
    prevActiveRef.current = activeLocationId;
  }, [activeLocationId, locations]);

  const completedCount = locations.filter(
    (l) => l.status === "completed",
  ).length;
  const totalCount = locations.length;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm flex flex-col h-full">
      <div className="px-4 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-sm font-semibold text-[var(--color-text-heading)]">
          Lokasyonlar
        </h2>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          {completedCount}/{totalCount} tamamlandı
        </p>
        <div
          className="mt-3 h-1.5 bg-[var(--color-neutral-100)] rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={totalCount}
          aria-label={`${totalCount} lokasyondan ${completedCount} tamamlandı`}
        >
          <div
            className="h-full bg-[var(--color-success-500)] rounded-full transition-all duration-500 ease-out"
            style={{
              width:
                totalCount > 0
                  ? `${(completedCount / totalCount) * 100}%`
                  : "0%",
            }}
          />
        </div>
      </div>
      <p
        ref={liveRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <nav aria-label="Lokasyon listesi" className="flex-1 overflow-y-auto">
        <ul role="list" className="p-2 space-y-1">
          {locations.map((loc, index) => {
            const isActive = loc.id === activeLocationId;
            const isClickable =
              loc.status === "completed" || loc.status === "active" || isActive;
            const stepsDone =
              loc.status === "completed" ? TOTAL_STEPS : loc.currentStep;

            return (
              <li key={loc.id} role="listitem">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => isClickable && onSelectLocation(loc.id)}
                  disabled={!isClickable}
                  aria-pressed={isActive}
                  aria-label={`${index + 1}. lokasyon: ${loc.name}, durum: ${STATUS_LABEL[loc.status]}`}
                  className={[
                    "w-full !h-auto !justify-start text-left px-3 py-2.5 rounded-xl transition-all duration-150 min-w-0",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]",
                    isActive
                      ? "bg-[var(--color-primary-50)] border border-[var(--color-primary-200)]"
                      : isClickable
                        ? "hover:bg-[var(--color-neutral-50)] border border-transparent cursor-pointer"
                        : "border border-transparent cursor-not-allowed opacity-50",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2.5 w-full min-w-0">
                    <span
                      className={[
                        "shrink-0 w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center mt-0.5",
                        isActive
                          ? "bg-[var(--color-primary-600)] text-white"
                          : loc.status === "completed"
                            ? "bg-[var(--color-success-600)] text-white"
                            : "bg-[var(--color-neutral-200)] text-[var(--color-neutral-600)]",
                      ].join(" ")}
                    >
                      {loc.status === "completed" ? (
                        <Check size={12} strokeWidth={3} aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div
                        className={[
                          "text-xs font-medium leading-snug",
                          isActive
                            ? "text-[var(--color-primary-800)]"
                            : "text-[var(--color-text)]",
                        ].join(" ")}
                      >
                        {(() => {
                          const parts = loc.name.split(/\s*[-–—]\s*/);
                          if (parts.length > 1) {
                            return (
                              <>
                                <span className="block">{parts[0]}</span>
                                <span className="block text-[10px] text-[var(--color-text-muted)] font-normal mt-0.5">
                                  {parts.slice(1).join(" – ")}
                                </span>
                              </>
                            );
                          }
                          return <span className="block">{loc.name}</span>;
                        })()}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={[
                            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
                            STATUS_BADGE_CLASS[loc.status],
                          ].join(" ")}
                        >
                          {STATUS_LABEL[loc.status]}
                        </span>

                        {loc.status !== "pending" && (
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            {stepsDone}/{TOTAL_STEPS} adım
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
