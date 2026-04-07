import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;


export const fetchLatestOrder = createAsyncThunk(
  'latestOrder/fetchLatestOrder',
  async (_, { rejectWithValue }) => {
    try {

      const token = sessionStorage.getItem('token');

      const response = await axios.get(`${baseUrl}/v1/account/order-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data; // Only return the `data` part
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch latest order'
      );
    }
  }
);

const latestOrderSlice = createSlice({
  name: 'latestOrder',
  initialState: {
    personalInfo: null,
    deliveryInfo: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.personalInfo = action.payload.personal_info;
        state.deliveryInfo = action.payload.delivery_info;
      })
      .addCase(fetchLatestOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default latestOrderSlice.reducer;
