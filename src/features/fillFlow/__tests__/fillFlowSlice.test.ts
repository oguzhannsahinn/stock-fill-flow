import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import fillFlowReducer, {
  selectProduct,
  selectLocations,
  startFlow,
  advanceStep,
  goToStep,
  resetFlow,
} from "@/features/fillFlow/fillFlowSlice";
import {
  mockProducts,
  mockLocationsBase,
  emptyLocationValues,
} from "@/features/fillFlow/constants";
import type { Location } from "@/features/fillFlow/types";

function buildStore() {
  return configureStore({ reducer: { fillFlow: fillFlowReducer } });
}

const mockLocations: Location[] = mockLocationsBase.map((l) => ({
  ...l,
  status: "pending",
  currentStep: 0,
  values: emptyLocationValues(),
}));

describe("fillFlowSlice – selectProduct", () => {
  it("seçilen ürün ID'si state'e kaydedilir", () => {
    const store = buildStore();
    store.dispatch(selectProduct("p-001"));
    expect(store.getState().fillFlow.selectedProductId).toBe("p-001");
  });

  it("farklı ürün seçilince üzerine yazılır", () => {
    const store = buildStore();
    store.dispatch(selectProduct("p-001"));
    store.dispatch(selectProduct("p-002"));
    expect(store.getState().fillFlow.selectedProductId).toBe("p-002");
  });
});

describe("fillFlowSlice – selectLocations", () => {
  it("seçilen lokasyon ID'leri state'e kaydedilir", () => {
    const store = buildStore();
    store.dispatch({
      type: "fillFlow/loadLocations/fulfilled",
      payload: mockLocations,
    });

    store.dispatch(selectLocations(["l-001", "l-002"]));
    const state = store.getState().fillFlow;
    expect(state.selectedLocationIds).toEqual(["l-001", "l-002"]);
    expect(Object.keys(state.locations)).toEqual(["l-001", "l-002"]);
  });

  it("lokasyon temizlendiğinde state boşalır", () => {
    const store = buildStore();
    store.dispatch({
      type: "fillFlow/loadLocations/fulfilled",
      payload: mockLocations,
    });
    store.dispatch(selectLocations(["l-001"]));
    store.dispatch(selectLocations([]));
    const state = store.getState().fillFlow;
    expect(state.selectedLocationIds).toHaveLength(0);
    expect(Object.keys(state.locations)).toHaveLength(0);
  });
});

describe("fillFlowSlice – startFlow", () => {
  function prepareStore() {
    const store = buildStore();
    store.dispatch({
      type: "fillFlow/loadLocations/fulfilled",
      payload: mockLocations,
    });
    store.dispatch(selectProduct(mockProducts[0].id));
    store.dispatch(selectLocations(["l-001", "l-002", "l-003"]));
    store.dispatch(startFlow());
    return store;
  }

  it('flowStatus "filling" olur', () => {
    const store = prepareStore();
    expect(store.getState().fillFlow.flowStatus).toBe("filling");
  });

  it("ilk lokasyon aktif yapılır", () => {
    const store = prepareStore();
    const state = store.getState().fillFlow;
    expect(state.activeLocationId).toBe("l-001");
    expect(state.locations["l-001"].status).toBe("active");
  });

  it("geri kalan lokasyonlar pending kalır", () => {
    const store = prepareStore();
    const state = store.getState().fillFlow;
    expect(state.locations["l-002"].status).toBe("pending");
    expect(state.locations["l-003"].status).toBe("pending");
  });
});

describe("fillFlowSlice – advanceStep", () => {
  function prepareFlowStore() {
    const store = buildStore();
    store.dispatch({
      type: "fillFlow/loadLocations/fulfilled",
      payload: mockLocations,
    });
    store.dispatch(selectProduct(mockProducts[0].id));
    store.dispatch(selectLocations(["l-001", "l-002"]));
    store.dispatch(startFlow());
    return store;
  }

  it("currentStep bir artar", () => {
    const store = prepareFlowStore();
    store.dispatch(advanceStep("l-001"));
    expect(store.getState().fillFlow.locations["l-001"].currentStep).toBe(1);
  });

  it('son adımdan sonra lokasyon "completed" olur ve sıradaki aktive geçer', () => {
    const store = prepareFlowStore();
    store.dispatch(advanceStep("l-001"));
    store.dispatch(advanceStep("l-001"));
    store.dispatch(advanceStep("l-001"));
    store.dispatch(advanceStep("l-001"));

    const state = store.getState().fillFlow;
    expect(state.locations["l-001"].status).toBe("completed");
    expect(state.activeLocationId).toBe("l-002");
    expect(state.locations["l-002"].status).toBe("active");
  });

  it('tüm lokasyonlar tamamlanınca flowStatus "summary" olur', () => {
    const store = prepareFlowStore();
    for (let i = 0; i < 4; i++) store.dispatch(advanceStep("l-001"));
    for (let i = 0; i < 4; i++) store.dispatch(advanceStep("l-002"));

    expect(store.getState().fillFlow.flowStatus).toBe("summary");
    expect(store.getState().fillFlow.activeLocationId).toBeNull();
  });
});

describe("fillFlowSlice – goToStep", () => {
  it("tamamlanmış bir adıma geri dönülebilir", () => {
    const store = buildStore();
    store.dispatch({
      type: "fillFlow/loadLocations/fulfilled",
      payload: mockLocations,
    });
    store.dispatch(selectLocations(["l-001"]));
    store.dispatch(startFlow());
    store.dispatch(advanceStep("l-001"));
    store.dispatch(advanceStep("l-001"));
    store.dispatch(goToStep({ locationId: "l-001", stepIndex: 0 }));
    expect(store.getState().fillFlow.locations["l-001"].currentStep).toBe(0);
  });

  it("ileri bir adıma atlama yapılamaz (mevcut adımdan büyük)", () => {
    const store = buildStore();
    store.dispatch({
      type: "fillFlow/loadLocations/fulfilled",
      payload: mockLocations,
    });
    store.dispatch(selectLocations(["l-001"]));
    store.dispatch(startFlow());
    store.dispatch(goToStep({ locationId: "l-001", stepIndex: 2 }));
    expect(store.getState().fillFlow.locations["l-001"].currentStep).toBe(0);
  });
});

describe("fillFlowSlice – resetFlow", () => {
  it("resetFlow sonrası state başlangıç değerlerine döner", () => {
    const store = buildStore();
    store.dispatch({
      type: "fillFlow/loadLocations/fulfilled",
      payload: mockLocations,
    });
    store.dispatch(selectProduct("p-001"));
    store.dispatch(selectLocations(["l-001"]));
    store.dispatch(startFlow());
    store.dispatch(resetFlow());

    const state = store.getState().fillFlow;
    expect(state.selectedProductId).toBeNull();
    expect(state.selectedLocationIds).toHaveLength(0);
    expect(state.flowStatus).toBe("selection");
    expect(state.activeLocationId).toBeNull();
  });
});
