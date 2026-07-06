import type { Product, Location, StepConfig } from "./types";

export const STEPS: StepConfig[] = [
  {
    id: "critical-amount",
    label: "Kritik Miktar",
    description: "Stokta bulunması gereken kritik minimum miktarı girin.",
  },
  {
    id: "min-max-capacity",
    label: "Min / Maks Kapasite",
    description:
      "Lokasyon için minimum ve maksimum kapasite sınırlarını belirleyin.",
  },
  {
    id: "fill-amount",
    label: "Dolum Miktarı",
    description: "Bu lokasyona yapılacak dolum miktarını girin.",
  },
  {
    id: "expiry-date",
    label: "Son Kullanım Tarihi",
    description: "Ürünün son kullanım tarihini girin.",
  },
];

export const TOTAL_STEPS = STEPS.length; // 4

export const mockProducts: Product[] = [
  {
    id: "p-001",
    name: "Serum Fizyolojik %0.9 NaCl 500ml",
    sku: "SF-500-09",
    unit: "Şişe",
    category: "IV Sıvılar",
  },
  {
    id: "p-002",
    name: "Ringer Laktat Solüsyonu 500ml",
    sku: "RL-500",
    unit: "Şişe",
    category: "IV Sıvılar",
  },
  {
    id: "p-003",
    name: "Dekstroz %5 250ml",
    sku: "DX5-250",
    unit: "Şişe",
    category: "IV Sıvılar",
  },
  {
    id: "p-004",
    name: "Amoksisilin 500mg Kapsül",
    sku: "AMX-500-CAP",
    unit: "Kutu",
    category: "Antibiyotikler",
  },
  {
    id: "p-005",
    name: "Sefazolin Sodyum 1g Flakon",
    sku: "CFZ-1G",
    unit: "Flakon",
    category: "Antibiyotikler",
  },
  {
    id: "p-006",
    name: "Parasetamol 500mg Tablet",
    sku: "PCT-500-TAB",
    unit: "Kutu",
    category: "Analjezikler",
  },
  {
    id: "p-007",
    name: "İbuprofen 400mg Film Tablet",
    sku: "IBU-400-FT",
    unit: "Kutu",
    category: "Analjezikler",
  },
  {
    id: "p-008",
    name: "İnsülin Aspart 100 IU/ml Kalem",
    sku: "INS-ASP-100",
    unit: "Kalem",
    category: "Diyabet İlaçları",
  },
];

export const mockLocationsBase: Omit<
  Location,
  "status" | "currentStep" | "values"
>[] = [
  { id: "l-001", name: "Acil Servis – Medikal Dolabı A1" },
  { id: "l-002", name: "Acil Servis – Medikal Dolabı A2" },
  { id: "l-003", name: "Yoğun Bakım Ünitesi – Depo B1" },
  { id: "l-004", name: "Yoğun Bakım Ünitesi – Depo B2" },
  { id: "l-005", name: "Ameliyathane – İlaç Dolabı C1" },
  { id: "l-006", name: "Ameliyathane – Sarf Malzeme Rafı C2" },
  { id: "l-007", name: "Dahiliye Koğuşu – Hemşire Arabalığı D1" },
  { id: "l-008", name: "Kadın Doğum – İlaç Odası E1" },
  { id: "l-009", name: "Ortopedi Servisi – Medikal Depo F1" },
  { id: "l-010", name: "Eczane – Ana Depo" },
];

export const emptyLocationValues = (): Location["values"] => ({
  criticalAmount: null,
  minCapacity: null,
  maxCapacity: null,
  fillAmount: null,
  expiryDate: null,
});
