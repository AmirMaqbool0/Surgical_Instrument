import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;


export const fetchAllProducts = createAsyncThunk(
  "categoryProduct/fetchAll",
  async (category_id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/v1/product/get`,
        { category_id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.errors ||
        error.message || 
        "Failed to fetch products"
      );
    }
  }
);

// Fetch all products without category filter
export const fetchAllProductsWithoutCategory = createAsyncThunk(
  "categoryProduct/fetchAllWithoutCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/v1/product/get`,
        {}, // Empty body - no category_id means all products
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.errors ||
        error.message || 
        "Failed to fetch all products"
      );
    }
  }
);

// Fetch with filters
export const fetchFilteredProducts = createAsyncThunk(
  "categoryProduct/fetchFiltered",
  async ({ category_id, filters = {} }, { rejectWithValue }) => {
    try {
      const requestBody = {
        category_id,
        ...(filters.search && { search: filters.search }),
        ...(filters.min_price !== undefined && filters.min_price !== "" && { min_price: Number(filters.min_price) }),
        ...(filters.max_price !== undefined && filters.max_price !== "" && { max_price: Number(filters.max_price) }),
        ...(filters.min_quantity !== undefined && filters.min_quantity !== "" && { min_quantity: Number(filters.min_quantity) }),
        ...(filters.max_quantity !== undefined && filters.max_quantity !== "" && { max_quantity: Number(filters.max_quantity) }),
      };

      const response = await axios.post(`${baseUrl}/v1/product/get`, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.errors ||
        error.message || 
        "Failed to fetch products"
      );
    }
  }
);

const categoryProductSlice = createSlice({
  name: "categoryProduct",
  initialState: {
    products: [],
    filteredProducts: [], // Stores filtered results from backend
    loading: false,
    error: null,
    currentFilters: {
      search: "",
      min_price: "",
      max_price: "",
      min_quantity: "",
      max_quantity: "",
    },
    hasAppliedFilters: false,
    isFiltering: false, 
  },
  reducers: {
    updateFilters: (state, action) => {
      state.currentFilters = {
        ...state.currentFilters,
        ...action.payload
      };
      state.hasAppliedFilters = Object.values(action.payload).some(val => val !== "");
    },
    clearFilters: (state) => {
      state.currentFilters = {
        search: "",
        min_price: "",
        max_price: "",
        min_quantity: "",
        max_quantity: "",
      };
      state.hasAppliedFilters = false;
      state.isFiltering = false;
      state.filteredProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
 
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
        state.isFiltering = false;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
      })
      
      // Fetch all products without category
      .addCase(fetchAllProductsWithoutCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProductsWithoutCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
        state.isFiltering = false;
      })
      .addCase(fetchAllProductsWithoutCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
      })
      
      // Filtered fetch
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload || [];
        state.isFiltering = true;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.filteredProducts = [];
      });
  },
});

export const { updateFilters, clearFilters } = categoryProductSlice.actions;
export default categoryProductSlice.reducer;