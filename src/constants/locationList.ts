import type { Location } from "@/features/fillFlow/types";

export const STATUS_LABEL: Record<Location["status"], string> = {
  pending: "Bekliyor",
  active: "İşlemde",
  completed: "Tamamlandı",
};

export const STATUS_BADGE_CLASS: Record<Location["status"], string> = {
  pending: "bg-[var(--color-neutral-100)] text-[var(--color-neutral-500)]",
  active: "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]",
  completed: "bg-[var(--color-success-50)] text-[var(--color-success-700)]",
};
