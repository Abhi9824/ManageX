import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios";

export const fetchCapacities = createAsyncThunk(
  "capacity/fetchCapacities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/engineers/capacity");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const capacitySlice = createSlice({
  name: "capacity",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCapacities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCapacities.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(fetchCapacities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default capacitySlice.reducer;
