// src/redux/slices/profileUpdateSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${baseUrl}/v1/profile/update`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const profileUpdateSlice = createSlice({
  name: "profileUpdate",
  initialState: {
    loading: false,
    success: false,
    error: null,
    updatedProfile: null,
  },
  reducers: {
    clearProfileUpdateState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.updatedProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.updatedProfile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileUpdateState } = profileUpdateSlice.actions;
export default profileUpdateSlice.reducer;
