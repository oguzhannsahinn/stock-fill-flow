import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FillFlowState, Location, LocationValues, Product } from "./types";
import { emptyLocationValues } from "./constants";
import { fetchProducts, fetchLocations, submitFillFlow } from "./fakeApi";
import { TOTAL_STEPS } from "./constants";

export const loadProducts = createAsyncThunk<Product[]>(
  "fillFlow/loadProducts",
  async () => fetchProducts(),
);

export const loadLocations = createAsyncThunk<Location[]>(
  "fillFlow/loadLocations",
  async () => fetchLocations(),
);

export const submitFlow = createAsyncThunk<
  { success: boolean; message: string },
  void,
  { state: { fillFlow: FillFlowState } }
>("fillFlow/submit", async (_, { getState, rejectWithValue }) => {
  const { selectedProductId, selectedLocationIds, locations } =
    getState().fillFlow;
  if (!selectedProductId) return rejectWithValue("Ürün seçilmedi.");

  const selectedLocs = selectedLocationIds
    .map((id) => locations[id])
    .filter(Boolean);
  try {
    return await submitFillFlow({
      productId: selectedProductId,
      locations: selectedLocs,
    });
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Bilinmeyen hata",
    );
  }
});

const initialState: FillFlowState & {
  products: Product[];
  allLocations: Location[];
  loadingProducts: boolean;
  loadingLocations: boolean;
} = {
  products: [],
  allLocations: [],
  loadingProducts: false,
  loadingLocations: false,
  selectedProductId: null,
  selectedLocationIds: [],
  locations: {},
  activeLocationId: null,
  flowStatus: "selection",
  submitStatus: "idle",
  submitError: null,
};

const fillFlowSlice = createSlice({
  name: "fillFlow",
  initialState,
  reducers: {
    selectProduct(state, action: PayloadAction<string>) {
      state.selectedProductId = action.payload;
    },

    selectLocations(state, action: PayloadAction<string[]>) {
      const newIds = action.payload;
      state.selectedLocationIds = newIds;
      const newLocations: Record<string, Location> = {};
      newIds.forEach((id) => {
        const base = state.allLocations.find((l) => l.id === id);
        if (base) {
          newLocations[id] = state.locations[id] ?? {
            ...base,
            status: "pending",
            currentStep: 0,
            values: emptyLocationValues(),
          };
        }
      });
      state.locations = newLocations;
    },

    startFlow(state) {
      if (state.selectedLocationIds.length === 0) return;
      const firstId = state.selectedLocationIds[0];
      state.activeLocationId = firstId;
      state.flowStatus = "filling";
      state.selectedLocationIds.forEach((id, index) => {
        if (state.locations[id]) {
          state.locations[id].status = index === 0 ? "active" : "pending";
        }
      });
    },

    setActiveLocation(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (!state.locations[id]) return;
      state.activeLocationId = id;

      if (state.locations[id].status === "pending") {
        state.locations[id].status = "active";
      }
    },

    updateLocationValues(
      state,
      action: PayloadAction<{
        locationId: string;
        values: Partial<LocationValues>;
      }>,
    ) {
      const { locationId, values } = action.payload;
      if (!state.locations[locationId]) return;
      Object.assign(state.locations[locationId].values, values);
    },

    advanceStep(state, action: PayloadAction<string>) {
      const loc = state.locations[action.payload];
      if (!loc) return;

      const nextStep = loc.currentStep + 1;

      if (nextStep >= TOTAL_STEPS) {
        loc.currentStep = TOTAL_STEPS;
        loc.status = "completed";

        const ids = state.selectedLocationIds;
        const currentIndex = ids.indexOf(action.payload);
        const nextLocId = ids[currentIndex + 1];

        if (nextLocId && state.locations[nextLocId]) {
          state.activeLocationId = nextLocId;
          state.locations[nextLocId].status = "active";
        } else {
          state.activeLocationId = null;
          state.flowStatus = "summary";
        }
      } else {
        loc.currentStep = nextStep;
      }
    },

    goToStep(
      state,
      action: PayloadAction<{ locationId: string; stepIndex: number }>,
    ) {
      const { locationId, stepIndex } = action.payload;
      const loc = state.locations[locationId];
      if (!loc) return;
      if (stepIndex < loc.currentStep) {
        loc.currentStep = stepIndex;
        if (loc.status === "completed") {
          loc.status = "active";
          state.activeLocationId = locationId;
          state.flowStatus = "filling";
        }
      }
    },

    editLocation(
      state,
      action: PayloadAction<{ locationId: string; stepIndex: number }>,
    ) {
      const { locationId, stepIndex } = action.payload;
      const loc = state.locations[locationId];
      if (!loc) return;

      loc.currentStep = stepIndex;
      loc.status = "active";
      state.activeLocationId = locationId;
      state.flowStatus = "filling";
    },

    goToSummary(state) {
      state.flowStatus = "summary";
    },

    backToFlow(state) {
      state.flowStatus = "filling";
      if (!state.activeLocationId && state.selectedLocationIds.length > 0) {
        const lastId =
          state.selectedLocationIds[state.selectedLocationIds.length - 1];
        state.activeLocationId = lastId;
        if (state.locations[lastId]) {
          state.locations[lastId].status = "active";
        }
      }
    },
    resetFlow(state) {
      state.selectedProductId = null;
      state.selectedLocationIds = [];
      state.locations = {};
      state.activeLocationId = null;
      state.flowStatus = "selection";
      state.submitStatus = "idle";
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loadingProducts = true;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loadingProducts = false;
      })
      .addCase(loadProducts.rejected, (state) => {
        state.loadingProducts = false;
      });

    builder
      .addCase(loadLocations.pending, (state) => {
        state.loadingLocations = true;
      })
      .addCase(loadLocations.fulfilled, (state, action) => {
        state.allLocations = action.payload;
        state.loadingLocations = false;
      })
      .addCase(loadLocations.rejected, (state) => {
        state.loadingLocations = false;
      });

    builder
      .addCase(submitFlow.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
      })
      .addCase(submitFlow.fulfilled, (state) => {
        state.submitStatus = "success";
        state.flowStatus = "submitted";
      })
      .addCase(submitFlow.rejected, (state, action) => {
        state.submitStatus = "error";
        state.submitError =
          (action.payload as string) ?? "Bilinmeyen hata oluştu.";
      });
  },
});

export const {
  selectProduct,
  selectLocations,
  startFlow,
  setActiveLocation,
  updateLocationValues,
  advanceStep,
  goToStep,
  editLocation,
  goToSummary,
  backToFlow,
  resetFlow,
} = fillFlowSlice.actions;

export default fillFlowSlice.reducer;
