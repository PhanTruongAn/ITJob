import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import accountSlice from "./slice/accountSlice";

export const store = configureStore({
  reducer: {
    account: accountSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
