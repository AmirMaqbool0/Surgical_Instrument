import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Async thunk to fetch related products
export const fetchRelatedProducts = createAsyncThunk(
  "relatedProducts/fetch",
  async ({ category_id, manufacturer_id }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${baseUrl}/v1/product/get/related`,
        { category_id, manufacturer_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data.Related_products; // returning related products array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const relatedProductsSlice = createSlice({
  name: "relatedProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default relatedProductsSlice.reducer;
