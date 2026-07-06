export const CATEGORIES = [
  "Tümü",
  "IV Sıvılar",
  "Antibiyotikler",
  "Analjezikler",
  "Diyabet İlaçları",
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];

export const categoryStyles: Record<
  string,
  { badge: string; filter: string; filterActive: string; dot: string }
> = {
  "IV Sıvılar": {
    badge: "bg-pink-50 text-pink-700 border border-pink-100",
    filter: "border-pink-200 text-pink-700 hover:bg-pink-50",
    filterActive: "bg-pink-500 text-white border-pink-500 shadow-sm",
    dot: "bg-pink-400",
  },
  Antibiyotikler: {
    badge: "bg-amber-50 text-amber-700 border border-amber-100",
    filter: "border-amber-200 text-amber-700 hover:bg-amber-50",
    filterActive: "bg-amber-500 text-white border-amber-500 shadow-sm",
    dot: "bg-amber-400",
  },
  Analjezikler: {
    badge: "bg-purple-50 text-purple-700 border border-purple-100",
    filter: "border-purple-200 text-purple-700 hover:bg-purple-50",
    filterActive: "bg-purple-600 text-white border-purple-600 shadow-sm",
    dot: "bg-purple-500",
  },
  "Diyabet İlaçları": {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    filter: "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
    filterActive: "bg-emerald-600 text-white border-emerald-600 shadow-sm",
    dot: "bg-emerald-500",
  },
};
