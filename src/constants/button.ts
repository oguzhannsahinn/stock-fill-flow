export type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
export type Size = "sm" | "md" | "lg";

export const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] active:bg-[var(--color-primary-800)] shadow-sm disabled:bg-[var(--color-neutral-300)] disabled:text-[var(--color-neutral-500)]",
  secondary:
    "bg-white text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-neutral-50)] active:bg-[var(--color-neutral-100)] shadow-sm disabled:opacity-50",
  ghost:
    "bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-neutral-100)] active:bg-[var(--color-neutral-200)] disabled:opacity-50",
  danger:
    "bg-[var(--color-danger-600)] text-white hover:bg-[var(--color-danger-700)] active:bg-red-800 shadow-sm disabled:opacity-50",
  success:
    "bg-[var(--color-success-600)] text-white hover:bg-[var(--color-success-700)] active:bg-green-800 shadow-sm disabled:opacity-50",
};

export const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
};
