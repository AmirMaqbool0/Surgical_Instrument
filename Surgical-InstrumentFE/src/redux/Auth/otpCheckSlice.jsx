import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async thunk for OTP verification
const baseUrl = import.meta.env.VITE_BASE_URL;

export const checkOtp = createAsyncThunk(
  "auth/checkOtp",
  async ({ email, otp, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/auth/forgot-password/check-otp`,
        { email, otp, token },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      return response.data; // { success: true, message: "OTP verified successfully" }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

const initialState = {
  success: false,
  loading: false,
  error: null,
};

const otpCheckSlice = createSlice({
  name: "otpCheck",
  initialState,
  reducers: {
    clearOtpCheck: (state) => {
      state.success = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(checkOtp.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { clearOtpCheck } = otpCheckSlice.actions;
export default otpCheckSlice.reducer;
