import { NumericField } from "@/components/ui/fields/numericField";
import { DateField } from "@/components/ui/fields/dateField";
import type { LocationValues } from "@/features/fillFlow/types";
import { RangeIndicator } from "./rangeIndicator";

export interface StepContentProps {
  step: 0 | 1 | 2 | 3;
  values: LocationValues;
  onChange: (partial: Partial<LocationValues>) => void;
  getError: (field: keyof LocationValues) => string | undefined;
}

export function StepContent({
  step,
  values,
  onChange,
  getError,
}: StepContentProps) {
  switch (step) {
    case 0:
      return (
        <div className="max-w-sm space-y-4">
          <NumericField
            id="critical-amount"
            label="Kritik Miktar"
            value={values.criticalAmount}
            onChange={(v) => onChange({ criticalAmount: v })}
            error={getError("criticalAmount")}
            hint="Stok bu miktarın altına düştüğünde uyarı verilir."
            unit="Adet"
            min={1}
            required
          />
        </div>
      );
    case 1:
      return (
        <div className="max-w-sm space-y-4">
          <NumericField
            id="min-capacity"
            label="Minimum Kapasite"
            value={values.minCapacity}
            onChange={(v) => onChange({ minCapacity: v })}
            error={getError("minCapacity")}
            unit="Adet"
            min={1}
            required
          />
          <NumericField
            id="max-capacity"
            label="Maksimum Kapasite"
            value={values.maxCapacity}
            onChange={(v) => onChange({ maxCapacity: v })}
            error={getError("maxCapacity")}
            hint={
              values.minCapacity !== null
                ? `Minimum kapasiteden (${values.minCapacity}) büyük olmalıdır.`
                : "Maksimum kapasite minimumdan büyük olmalıdır."
            }
            unit="Adet"
            min={values.minCapacity !== null ? values.minCapacity + 1 : 1}
            required
          />
        </div>
      );
    case 2:
      return (
        <div className="max-w-sm space-y-4">
          <NumericField
            id="fill-amount"
            label="Dolum Miktarı"
            value={values.fillAmount}
            onChange={(v) => onChange({ fillAmount: v })}
            error={getError("fillAmount")}
            hint={
              values.minCapacity !== null && values.maxCapacity !== null
                ? `${values.minCapacity} ile ${values.maxCapacity} arasında olmalıdır.`
                : "Önce min/maks kapasiteyi belirleyin."
            }
            unit="Adet"
            min={values.minCapacity ?? 1}
            max={values.maxCapacity ?? undefined}
            required
          />
          {values.minCapacity !== null &&
            values.maxCapacity !== null &&
            values.fillAmount !== null && (
              <RangeIndicator
                min={values.minCapacity}
                max={values.maxCapacity}
                value={values.fillAmount}
              />
            )}
        </div>
      );
    case 3:
      return (
        <div className="max-w-sm space-y-4">
          <DateField
            id="expiry-date"
            label="Son Kullanım Tarihi"
            value={values.expiryDate}
            onChange={(v) => onChange({ expiryDate: v })}
            error={getError("expiryDate")}
            hint="Bugünden sonraki bir tarih seçin."
            required
          />
        </div>
      );
    default:
      return null;
  }
}
