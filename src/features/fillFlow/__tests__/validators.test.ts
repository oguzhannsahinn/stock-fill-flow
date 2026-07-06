import { describe, it, expect } from "vitest";
import { validateStep, validateAllSteps } from "@/features/fillFlow/validators";
import type { LocationValues } from "@/features/fillFlow/types";

const emptyValues = (): LocationValues => ({
  criticalAmount: null,
  minCapacity: null,
  maxCapacity: null,
  fillAmount: null,
  expiryDate: null,
});

const tomorrow = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const yesterday = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

describe("validateStep – Adım 0: Kritik Miktar", () => {
  it("geçerli bir değerle valid döner", () => {
    const result = validateStep({ ...emptyValues(), criticalAmount: 10 }, 0);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("null değerle zorunlu hata döner", () => {
    const result = validateStep(emptyValues(), 0);
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe("criticalAmount");
  });

  it("sıfır değerle hata döner", () => {
    const result = validateStep({ ...emptyValues(), criticalAmount: 0 }, 0);
    expect(result.valid).toBe(false);
  });

  it("negatif değerle hata döner", () => {
    const result = validateStep({ ...emptyValues(), criticalAmount: -5 }, 0);
    expect(result.valid).toBe(false);
  });
});

describe("validateStep – Adım 1: Min/Maks Kapasite", () => {
  it("min < maks olduğunda valid döner", () => {
    const result = validateStep(
      { ...emptyValues(), minCapacity: 10, maxCapacity: 100 },
      1,
    );
    expect(result.valid).toBe(true);
  });

  it("min eksik olduğunda hata döner", () => {
    const result = validateStep(
      { ...emptyValues(), minCapacity: null, maxCapacity: 100 },
      1,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "minCapacity")).toBe(true);
  });

  it("maks eksik olduğunda hata döner", () => {
    const result = validateStep(
      { ...emptyValues(), minCapacity: 10, maxCapacity: null },
      1,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "maxCapacity")).toBe(true);
  });

  it("min >= maks olduğunda cross-field hatası döner", () => {
    const result = validateStep(
      { ...emptyValues(), minCapacity: 100, maxCapacity: 50 },
      1,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === "minCapacity")).toBe(true);
  });

  it("min === maks eşit olduğunda hata döner", () => {
    const result = validateStep(
      { ...emptyValues(), minCapacity: 50, maxCapacity: 50 },
      1,
    );
    expect(result.valid).toBe(false);
  });
});

describe("validateStep – Adım 2: Dolum Miktarı", () => {
  it("min-maks aralığında değerle valid döner", () => {
    const result = validateStep(
      { ...emptyValues(), minCapacity: 10, maxCapacity: 100, fillAmount: 50 },
      2,
    );
    expect(result.valid).toBe(true);
  });

  it("null değerle hata döner", () => {
    const result = validateStep({ ...emptyValues(), fillAmount: null }, 2);
    expect(result.valid).toBe(false);
  });

  it("min değerinin altında hata döner", () => {
    const result = validateStep(
      { ...emptyValues(), minCapacity: 20, maxCapacity: 100, fillAmount: 5 },
      2,
    );
    expect(result.valid).toBe(false);
  });

  it("maks değerinin üstünde hata döner", () => {
    const result = validateStep(
      { ...emptyValues(), minCapacity: 10, maxCapacity: 50, fillAmount: 200 },
      2,
    );
    expect(result.valid).toBe(false);
  });

  it("sınır değerlerinde (min ve maks) valid döner", () => {
    const atMin = validateStep(
      { ...emptyValues(), minCapacity: 10, maxCapacity: 100, fillAmount: 10 },
      2,
    );
    expect(atMin.valid).toBe(true);

    const atMax = validateStep(
      { ...emptyValues(), minCapacity: 10, maxCapacity: 100, fillAmount: 100 },
      2,
    );
    expect(atMax.valid).toBe(true);
  });
});

describe("validateStep – Adım 3: Son Kullanım Tarihi", () => {
  it("yarınki tarihle valid döner", () => {
    const result = validateStep(
      { ...emptyValues(), expiryDate: tomorrow() },
      3,
    );
    expect(result.valid).toBe(true);
  });

  it("null değerle hata döner", () => {
    const result = validateStep(emptyValues(), 3);
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe("expiryDate");
  });

  it("geçmiş tarihle hata döner", () => {
    const result = validateStep(
      { ...emptyValues(), expiryDate: yesterday() },
      3,
    );
    expect(result.valid).toBe(false);
  });
});

describe("validateAllSteps", () => {
  it("tüm alanlar dolu ve geçerliyse true döner", () => {
    const values: LocationValues = {
      criticalAmount: 5,
      minCapacity: 10,
      maxCapacity: 100,
      fillAmount: 50,
      expiryDate: tomorrow(),
    };
    expect(validateAllSteps(values)).toBe(true);
  });

  it("herhangi bir alan eksikse false döner", () => {
    const values: LocationValues = {
      criticalAmount: 5,
      minCapacity: 10,
      maxCapacity: 100,
      fillAmount: null, // eksik
      expiryDate: tomorrow(),
    };
    expect(validateAllSteps(values)).toBe(false);
  });
});
