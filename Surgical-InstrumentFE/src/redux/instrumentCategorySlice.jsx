import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;



export const fetchInstrumentCategories = createAsyncThunk(
  "instrumentCategory/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/v1/instrument-category/get`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch categories");
    }
  }
);

const instrumentCategorySlice = createSlice({
  name: "instrumentCategory",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstrumentCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstrumentCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchInstrumentCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default instrumentCategorySlice.reducer;
