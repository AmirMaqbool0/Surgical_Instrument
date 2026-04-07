import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk for Login
const baseUrl = import.meta.env.VITE_BASE_URL;
export const loginUser = createAsyncThunk(
  "loginUser/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/auth/interaction/login`,
        userData
      );
      
      
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Something went wrong"
      );
    }
  }
);

// Create Slice
const loginUserSlice = createSlice({
  name: "loginUser",
  initialState: {
    user: null,
    token: null, 
    status: "idle",
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("token"); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.customer; // Changed from data to customer
        state.token = action.payload.token;
        // Store token in sessionStorage only after Redux state is updated
        sessionStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export Actions & Reducer
export const { logoutUser } = loginUserSlice.actions;
export default loginUserSlice.reducer;