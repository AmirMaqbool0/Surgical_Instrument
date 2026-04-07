import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/auth/forgot-password/send-otp`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );


      const otpToken = response.data?.data?.token;
      if (otpToken) {
        sessionStorage.setItem("otpToken", otpToken);
        console.log("OTP Token stored:", otpToken); 
      } else {
        console.error("OTP Token missing in response!");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP request failed"
      );
    }
  }
);

const initialState = {
  otpToken: sessionStorage.getItem("otpToken") || null,
  success: false,
  loading: false,
  error: null,
};

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    clearOtp: (state) => {
      state.otpToken = null;
      state.success = false;
      state.loading = false;
      state.error = null;
      sessionStorage.removeItem("otpToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.otpToken = action.payload.token || null; // ✅ Store OTP token
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { clearOtp } = otpSlice.actions;
export default otpSlice.reducer;
