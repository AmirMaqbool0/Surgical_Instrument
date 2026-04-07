
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchSingleBundle = createAsyncThunk(
  "singleBundle/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/v1/bundle/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const singleBundleSlice = createSlice({
  name: "singleBundle",
  initialState: {
    bundle: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleBundle.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSingleBundle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bundle = action.payload;
      })
      .addCase(fetchSingleBundle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default singleBundleSlice.reducer;
