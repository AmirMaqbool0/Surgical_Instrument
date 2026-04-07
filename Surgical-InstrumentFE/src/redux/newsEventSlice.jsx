import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchNewsEvents = createAsyncThunk(
  'newsEvents/fetchNewsEvents',
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/v1/news-event/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      return response.data.data; // Assuming data is in response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const newsEventSlice = createSlice({
  name: 'newsEvents',
  initialState: {
    newsEvents: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.newsEvents = action.payload;
      })
      .addCase(fetchNewsEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default newsEventSlice.reducer;
