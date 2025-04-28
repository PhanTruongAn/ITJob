import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAccount } from "../../apis/authModule";

export const getAccount = createAsyncThunk(
  "account/fetchAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAccount();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

interface IState {
  isAuthenticated: boolean;
  isLoading: boolean;
  // isRefreshToken: boolean;
  // errorRefreshToken: string | null;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

const initialState: IState = {
  isAuthenticated: false,
  isLoading: true,
  // isRefreshToken: false,
  // errorRefreshToken: null,
  user: {
    id: "",
    email: "",
    name: "",
  },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUserLoginInfo: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
    },
    setLogoutAction: (state) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
      state.user = { id: "", email: "", name: "" };
    },
    // setRefreshTokenAction: (state, action) => {
    //   state.isRefreshToken = action.payload?.status ?? false;
    //   state.errorRefreshToken = action.payload?.message ?? "";
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAccount.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(getAccount.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { setUserLoginInfo, setLogoutAction } = accountSlice.actions;

export default accountSlice.reducer;
