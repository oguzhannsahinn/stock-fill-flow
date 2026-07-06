import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Calendar,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DAYS, MONTHS } from "@/constants/dateField";

interface DateFieldProps {
  id: string;
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  error?: string;
  hint?: string;
  required?: boolean;
}

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseIso(
  iso: string | null,
): { y: number; m: number; d: number } | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function startDow(year: number, month: number) {
  const raw = new Date(year, month, 1).getDay();
  return (raw + 6) % 7;
}

export function DateField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required = false,
}: DateFieldProps) {
  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();

  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1);
  const minY = minDate.getFullYear();
  const minM = minDate.getMonth();
  const minD = minDate.getDate();

  const parsed = parseIso(value);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed?.y ?? minY);
  const [viewMonth, setViewMonth] = useState(parsed?.m ?? minM);

  const containerRef = useRef<HTMLDivElement>(null);
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const isDisabled = (y: number, m: number, d: number) => {
    if (y < minY) return true;
    if (y === minY && m < minM) return true;
    if (y === minY && m === minM && d < minD) return true;
    return false;
  };

  const isToday = (y: number, m: number, d: number) =>
    y === todayY && m === todayM && d === todayD;

  const isSelected = (y: number, m: number, d: number) =>
    parsed ? parsed.y === y && parsed.m === m && parsed.d === d : false;

  const handleDayClick = (d: number) => {
    if (isDisabled(viewYear, viewMonth, d)) return;
    onChange(toIso(viewYear, viewMonth, d));
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const formatDisplay = (iso: string | null) => {
    if (!iso) return null;
    const p = parseIso(iso);
    if (!p) return null;
    return `${String(p.d).padStart(2, "0")} ${MONTHS[p.m]} ${p.y}`;
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const startOffset = startDow(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const display = formatDisplay(value);

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

      <div className="relative" ref={containerRef}>
        <button
          id={id}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-describedby={describedBy || undefined}
          onClick={() => setOpen((o) => !o)}
          className={[
            "w-full h-11 pl-10 pr-9 rounded-xl border text-sm font-medium text-left",
            "flex items-center cursor-pointer select-none",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent",
            display
              ? "text-[var(--color-text-heading)] bg-white"
              : "text-[var(--color-text-muted)] bg-white",
            error
              ? "border-[var(--color-danger-500)] focus:ring-[var(--color-danger-500)] bg-[var(--color-danger-50)]"
              : open
                ? "border-[var(--color-primary-500)] ring-2 ring-[var(--color-primary-200)]"
                : "border-[var(--color-border)] hover:border-[var(--color-primary-400)] hover:shadow-sm",
          ].join(" ")}
        >
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)] pointer-events-none">
            <Calendar size={16} aria-hidden="true" />
          </span>

          <span className="truncate">{display ?? "gg.aa.yyyy"}</span>

          {display ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]
                         hover:text-[var(--color-danger-500)] transition-colors cursor-pointer"
              aria-label="Tarihi temizle"
            >
              <X size={14} aria-hidden="true" />
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)] pointer-events-none">
              <ChevronDown size={14} aria-hidden="true" />
            </span>
          )}
        </button>

        {open && (
          <div
            role="dialog"
            aria-label="Takvim"
            className={[
              "absolute z-50 mt-2 w-72 rounded-2xl border border-[var(--color-border)]",
              "bg-white shadow-dropdown",
              "animate-in fade-in slide-in-from-top-1 duration-150",
            ].join(" ")}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-neutral-100)]">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevMonth}
                aria-label="Önceki ay"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </Button>

              <span className="text-sm font-semibold text-[var(--color-text-heading)]">
                {MONTHS[viewMonth]} {viewYear}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={nextMonth}
                aria-label="Sonraki ay"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </Button>
            </div>

            <div className="grid grid-cols-7 px-3 pt-3 pb-1">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-semibold uppercase tracking-wide
                             text-[var(--color-text-muted)] pb-1"
                >
                  {d}
                </div>
              ))}

              {cells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} />;
                }
                const disabled = isDisabled(viewYear, viewMonth, day);
                const selected = isSelected(viewYear, viewMonth, day);
                const today_ = isToday(viewYear, viewMonth, day);

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleDayClick(day)}
                    className={[
                      "mx-auto w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium",
                      "transition-all duration-150 cursor-pointer",
                      selected
                        ? "bg-[var(--color-primary-600)] text-white shadow-md"
                        : today_
                          ? "border-2 border-[var(--color-primary-400)] text-[var(--color-primary-700)] bg-[var(--color-primary-50)]"
                          : disabled
                            ? "text-[var(--color-neutral-300)] cursor-not-allowed"
                            : "text-[var(--color-text)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-700)]",
                    ].join(" ")}
                    aria-label={`${day} ${MONTHS[viewMonth]} ${viewYear}`}
                    aria-pressed={selected}
                    aria-disabled={disabled}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-neutral-100)]">
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Temizle
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Kapat
              </Button>
            </div>
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
