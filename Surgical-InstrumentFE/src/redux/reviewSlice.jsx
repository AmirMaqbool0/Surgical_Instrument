import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

export const uploadReview = createAsyncThunk(
  'review/uploadReview',
  async ({ type_id, title, description, rating }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem('token');

      if (!token) {
        return rejectWithValue({ message: 'User not authenticated' });
      }

      const response = await axios.post(
       `${baseUrl}/v1/review/create`,
        {
          type: 'product',
          type_id,
          title,
          description,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Add token to header
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetReviewState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadReview.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(uploadReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(uploadReview.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
