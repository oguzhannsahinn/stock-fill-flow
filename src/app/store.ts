import { configureStore } from "@reduxjs/toolkit";
import fillFlowReducer from "@/features/fillFlow/fillFlowSlice";

export const store = configureStore({
  reducer: {
    fillFlow: fillFlowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
