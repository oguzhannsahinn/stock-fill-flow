import {
  mockProducts,
  mockLocationsBase,
  emptyLocationValues,
} from "./constants";
import type { Product, Location, SubmitPayload } from "./types";

const SIMULATED_DELAY = 600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchProducts(): Promise<Product[]> {
  await delay(SIMULATED_DELAY);
  return [...mockProducts];
}

export async function fetchLocations(): Promise<Location[]> {
  await delay(SIMULATED_DELAY);
  return mockLocationsBase.map((loc) => ({
    ...loc,
    status: "pending" as const,
    currentStep: 0,
    values: emptyLocationValues(),
  }));
}

export async function submitFillFlow(
  payload: SubmitPayload,
): Promise<{ success: boolean; message: string }> {
  await delay(1200);

  if (Math.random() < 0.15) {
    throw new Error(
      "Sunucu hatası: Dolum işlemi kaydedilemedi. Lütfen tekrar deneyin.",
    );
  }

  return {
    success: true,
    message: `${payload.locations.length} lokasyon için dolum işlemi başarıyla tamamlandı.`,
  };
}
