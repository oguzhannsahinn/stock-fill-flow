export type LocationStatus = "pending" | "active" | "completed";

export interface LocationValues {
  criticalAmount: number | null;
  minCapacity: number | null;
  maxCapacity: number | null;
  fillAmount: number | null;
  expiryDate: string | null;
}

export interface Location {
  id: string;
  name: string;
  status: LocationStatus;
  currentStep: number;
  values: LocationValues;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  unit: string;
  category: string;
}

export type StepStatus = "pending" | "active" | "completed";

export interface StepConfig {
  id: string;
  label: string;
  description: string;
}

export interface ValidationError {
  field: keyof LocationValues;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export type FlowStatus = "selection" | "filling" | "summary" | "submitted";

export interface FillFlowState {
  selectedProductId: string | null;
  selectedLocationIds: string[];
  locations: Record<string, Location>;
  activeLocationId: string | null;
  flowStatus: FlowStatus;
  submitStatus: "idle" | "loading" | "success" | "error";
  submitError: string | null;
}

export interface SubmitPayload {
  productId: string;
  locations: Location[];
}
