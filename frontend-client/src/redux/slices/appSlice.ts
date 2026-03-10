import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AppState {
  mode: "light" | "dark"
}

const initialState: AppState = {
  mode: "light",
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<"light" | "dark">) => {
      state.mode = action.payload
    },
  },
})

export const { setMode } = appSlice.actions
export default appSlice.reducer
