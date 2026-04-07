// src/redux/slices/bundleSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchBundles = createAsyncThunk(
  'bundle/fetchBundles',
  async (_, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/v1/bundle/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const bundleSlice = createSlice({
  name: 'bundle',
  initialState: {
    bundles: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBundles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBundles.fulfilled, (state, action) => {
        state.loading = false;
        state.bundles = action.payload;
      })
      .addCase(fetchBundles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default bundleSlice.reducer;
