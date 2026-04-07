// src/redux/slices/orderListSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchOrderList = createAsyncThunk(
  'orderList/fetchOrderList',
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/v1/Account/order-list`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.data.orders; // assuming you're only interested in the "orders" array
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const orderListSlice = createSlice({
  name: 'orderList',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderListSlice.reducer;
