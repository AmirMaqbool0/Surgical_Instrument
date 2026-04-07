import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchSingleProduct = createAsyncThunk(
  "singleProduct/fetchSingleProduct",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token"); 
      if (!token) throw new Error("Authentication token is missing");

      const response = await axios.get(
        `${baseUrl}/v1/product/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      return response.data.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

const singleProductSlice = createSlice({
  name: "singleProduct",
  initialState: {
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default singleProductSlice.reducer;
