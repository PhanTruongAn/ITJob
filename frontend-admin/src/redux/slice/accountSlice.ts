import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchAccount } from "../../apis/authModule"

export const getAccount = createAsyncThunk(
  "account/fetchAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAccount()
      console.log("fetchAccount response:", response)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

interface IState {
  isAuthenticated: boolean
  isLoading: boolean
  // isRefreshToken: boolean;
  // errorRefreshToken: string | null;
  user: {
    id: number
    email: string
    name: string
    avatar?: string
  }
}

const initialState: IState = {
  isAuthenticated: false,
  isLoading: true,
  // isRefreshToken: false,
  // errorRefreshToken: null,
  user: {
    id: 0,
    email: "",
    name: "",
    avatar: "",
  },
}

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUserLoginInfo: (state, action) => {
      state.isAuthenticated = true
      state.isLoading = false
      state.user = action.payload
    },
    setLogoutAction: (state) => {
      localStorage.removeItem("access_token")
      state.isAuthenticated = false
      state.user = { id: 0, email: "", name: "", avatar: "" }
    },
    // setRefreshTokenAction: (state, action) => {
    //   state.isRefreshToken = action.payload?.status ?? false;
    //   state.errorRefreshToken = action.payload?.message ?? "";
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccount.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAccount.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(getAccount.rejected, (state, action) => {
        state.isAuthenticated = false
        state.isLoading = false
      })
  },
})

export const { setUserLoginInfo, setLogoutAction } = accountSlice.actions

export default accountSlice.reducer
