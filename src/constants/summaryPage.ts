import type { LocationValues } from "@/features/fillFlow/types";

export const stepFieldLabels: Record<keyof LocationValues, string> = {
  criticalAmount: "Kritik Miktar",
  minCapacity: "Min. Kapasite",
  maxCapacity: "Maks. Kapasite",
  fillAmount: "Dolum Miktarı",
  expiryDate: "Son Kullanım Tarihi",
};

export const stepToFields: Record<number, (keyof LocationValues)[]> = {
  0: ["criticalAmount"],
  1: ["minCapacity", "maxCapacity"],
  2: ["fillAmount"],
  3: ["expiryDate"],
};

export function formatValue(
  field: keyof LocationValues,
  value: string | null,
): string {
  if (value === null || value === undefined) return "—";
  if (field === "expiryDate" && typeof value === "string") {
    return new Date(value).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  return `${value}${field !== "expiryDate" ? " Adet" : ""}`;
}
