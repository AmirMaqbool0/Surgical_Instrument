import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchFeaturedProducts = createAsyncThunk(
  'featuredProducts/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await axios.get(`${baseUrl}/v1/product/get/featured`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const featuredProductsSlice = createSlice({
  name: 'featuredProducts',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetFeaturedProductsState: (state) => {
      state.products = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetFeaturedProductsState } = featuredProductsSlice.actions;

export default featuredProductsSlice.reducer;
