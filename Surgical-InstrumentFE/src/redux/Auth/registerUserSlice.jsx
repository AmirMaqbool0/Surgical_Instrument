import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/auth/interaction/registration`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );


      const token = response.data?.data?.token;
      if (token) {
        sessionStorage.setItem("authToken", token);
        console.log("Token stored:", token);
      } else {
        console.error("Token missing in response!");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

const initialState = {
  user: null,
  authToken: sessionStorage.getItem("authToken") || null, 
  success: false,
  loading: false,
  error: null,
};

const registerUserSlice = createSlice({
  name: "registerUser",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.authToken = null;
      state.success = false;
      state.loading = false;
      state.error = null;
      sessionStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.data;
        state.authToken = action.payload.data?.token || null; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = registerUserSlice.actions;
export default registerUserSlice.reducer;
