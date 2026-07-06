import type { LocationValues, ValidationResult } from "./types";

type StepIndex = 0 | 1 | 2 | 3;

export function validateStep(
  values: LocationValues,
  step: StepIndex,
): ValidationResult {
  switch (step) {
    case 0:
      return validateCriticalAmount(values);
    case 1:
      return validateMinMaxCapacity(values);
    case 2:
      return validateFillAmount(values);
    case 3:
      return validateExpiryDate(values);
    default:
      return { valid: true, errors: [] };
  }
}

function validateCriticalAmount(values: LocationValues): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const { criticalAmount } = values;

  if (criticalAmount === null || criticalAmount === undefined) {
    errors.push({
      field: "criticalAmount",
      message: "Kritik miktar zorunludur.",
    });
  } else if (!Number.isFinite(criticalAmount) || criticalAmount <= 0) {
    errors.push({
      field: "criticalAmount",
      message: "Kritik miktar sıfırdan büyük bir sayı olmalıdır.",
    });
  }

  return { valid: errors.length === 0, errors };
}

function validateMinMaxCapacity(values: LocationValues): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const { minCapacity, maxCapacity } = values;

  if (minCapacity === null || minCapacity === undefined) {
    errors.push({
      field: "minCapacity",
      message: "Minimum kapasite zorunludur.",
    });
  } else if (!Number.isFinite(minCapacity) || minCapacity <= 0) {
    errors.push({
      field: "minCapacity",
      message: "Minimum kapasite sıfırdan büyük bir sayı olmalıdır.",
    });
  }

  if (maxCapacity === null || maxCapacity === undefined) {
    errors.push({
      field: "maxCapacity",
      message: "Maksimum kapasite zorunludur.",
    });
  } else if (!Number.isFinite(maxCapacity) || maxCapacity <= 0) {
    errors.push({
      field: "maxCapacity",
      message: "Maksimum kapasite sıfırdan büyük bir sayı olmalıdır.",
    });
  }

  if (
    minCapacity !== null &&
    maxCapacity !== null &&
    Number.isFinite(minCapacity) &&
    Number.isFinite(maxCapacity) &&
    minCapacity > 0 &&
    maxCapacity > 0 &&
    minCapacity >= maxCapacity
  ) {
    errors.push({
      field: "minCapacity",
      message: "Minimum kapasite, maksimum kapasiteden küçük olmalıdır.",
    });
  }

  return { valid: errors.length === 0, errors };
}

function validateFillAmount(values: LocationValues): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const { fillAmount, minCapacity, maxCapacity } = values;

  if (fillAmount === null || fillAmount === undefined) {
    errors.push({
      field: "fillAmount",
      message: "Dolum miktarı zorunludur.",
    });
  } else if (!Number.isFinite(fillAmount) || fillAmount <= 0) {
    errors.push({
      field: "fillAmount",
      message: "Dolum miktarı sıfırdan büyük bir sayı olmalıdır.",
    });
  } else if (
    minCapacity !== null &&
    maxCapacity !== null &&
    (fillAmount < minCapacity || fillAmount > maxCapacity)
  ) {
    errors.push({
      field: "fillAmount",
      message: `Dolum miktarı ${minCapacity} ile ${maxCapacity} arasında olmalıdır.`,
    });
  }

  return { valid: errors.length === 0, errors };
}

function validateExpiryDate(values: LocationValues): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const { expiryDate } = values;

  if (!expiryDate) {
    errors.push({
      field: "expiryDate",
      message: "Son kullanım tarihi zorunludur.",
    });
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(expiryDate);
    if (selected <= today) {
      errors.push({
        field: "expiryDate",
        message: "Son kullanım tarihi bugünden ileri bir tarih olmalıdır.",
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateAllSteps(values: LocationValues): boolean {
  return (
    validateStep(values, 0).valid &&
    validateStep(values, 1).valid &&
    validateStep(values, 2).valid &&
    validateStep(values, 3).valid
  );
}
