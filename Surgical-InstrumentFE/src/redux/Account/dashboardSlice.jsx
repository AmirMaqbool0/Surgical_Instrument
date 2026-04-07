import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;


export const fetchUserProfile = createAsyncThunk(
  'dashboard/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      // Don't fetch if not logged in
      return rejectWithValue('Not logged in');
    }
    try {
      const response = await axios.get(`${baseUrl}/v1/account/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      return response.data.data; // only returning user data part
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user profile'
      );
    }
  }
);


const initialState = {
  user: null,
  loading: false,
  error: null,
};


const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
