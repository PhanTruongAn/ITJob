import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAccount } from "../../apis/authModule";
export const getAccount = createAsyncThunk("account/fetchAccount", async () => {
  const response = await fetchAccount();
  console.log("Check: ", response.data);
  return response.data;
});

interface IState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshToken: boolean;
  errorRefreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

const initialState: IState = {
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  errorRefreshToken: "",
  user: {
    id: "",
    email: "",
    name: "",
  },
};

export const accountSlide = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUserLoginInfo: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user.id = action?.payload?.id;
      state.user.email = action.payload.email;
      state.user.name = action.payload.name;
    },
    setLogoutAction: (state, action) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
      state.user = {
        id: "",
        email: "",
        name: "",
      };
    },
    setRefreshTokenAction: (state, action) => {
      state.isRefreshToken = action.payload?.status ?? false;
      state.errorRefreshToken = action.payload?.message ?? "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAccount.pending, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = true;
      }
    });

    builder.addCase(getAccount.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user.id = action?.payload?.user?.id;
        state.user.email = action.payload.user?.email;
        state.user.name = action.payload.user?.name;
      }
    });

    builder.addCase(getAccount.rejected, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = false;
      }
    });
  },
});

export const { setUserLoginInfo, setLogoutAction, setRefreshTokenAction } =
  accountSlide.actions;

export default accountSlide.reducer;
