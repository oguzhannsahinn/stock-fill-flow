import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Location } from "./types";
import { TOTAL_STEPS } from "./constants";
import { mockProducts } from "./constants";

export const selectFillFlowState = (state: RootState) => state.fillFlow;

export const selectProducts = (state: RootState) => state.fillFlow.products;

export const selectAllLocations = (state: RootState) =>
  state.fillFlow.allLocations;

export const selectSelectedProductId = (state: RootState) =>
  state.fillFlow.selectedProductId;

export const selectSelectedLocationIds = (state: RootState) =>
  state.fillFlow.selectedLocationIds;

export const selectLocationsMap = (state: RootState) =>
  state.fillFlow.locations;

export const selectActiveLocationId = (state: RootState) =>
  state.fillFlow.activeLocationId;

export const selectFlowStatus = (state: RootState) => state.fillFlow.flowStatus;

export const selectSubmitStatus = (state: RootState) =>
  state.fillFlow.submitStatus;

export const selectSubmitError = (state: RootState) =>
  state.fillFlow.submitError;

export const selectLoadingProducts = (state: RootState) =>
  state.fillFlow.loadingProducts;

export const selectLoadingLocations = (state: RootState) =>
  state.fillFlow.loadingLocations;

export const selectSelectedProduct = createSelector(
  [selectSelectedProductId, selectProducts],
  (id, products) => products.find((p) => p.id === id) ?? null,
);
export const selectSelectedLocations = createSelector(
  [selectSelectedLocationIds, selectLocationsMap],
  (ids, locationsMap): Location[] =>
    ids.map((id) => locationsMap[id]).filter(Boolean),
);

export const selectActiveLocation = createSelector(
  [selectActiveLocationId, selectLocationsMap],
  (id, locationsMap): Location | null =>
    id ? (locationsMap[id] ?? null) : null,
);
export const selectCompletedLocationCount = createSelector(
  [selectSelectedLocations],
  (locations) => locations.filter((l) => l.status === "completed").length,
);

export const selectIsAllCompleted = createSelector(
  [selectSelectedLocationIds, selectLocationsMap],
  (ids, locationsMap) =>
    ids.length > 0 &&
    ids.every((id) => locationsMap[id]?.status === "completed"),
);

export const selectOverallProgress = createSelector(
  [selectSelectedLocations],
  (locations): number => {
    if (locations.length === 0) return 0;
    const total = locations.length * TOTAL_STEPS;
    const done = locations.reduce((acc, loc) => {
      return acc + (loc.status === "completed" ? TOTAL_STEPS : loc.currentStep);
    }, 0);
    return Math.round((done / total) * 100);
  },
);

export const selectProductCategories = createSelector(
  [selectProducts],
  (products) => [...new Set(products.map((p) => p.category))],
);

export { mockProducts };
