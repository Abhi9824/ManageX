import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios";

// Fetch all engineers
export const fetchEngineers = createAsyncThunk(
  "engineers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/engineers");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch engineers"
      );
    }
  }
);

export const createEngineer = createAsyncThunk(
  "engineers/create",
  async (engineer, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/engineers", engineer);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create engineer"
      );
    }
  }
);

// Delete an engineer
export const deleteEngineer = createAsyncThunk(
  "engineers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/engineers/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete engineer"
      );
    }
  }
);

const engineerSlice = createSlice({
  name: "engineers",
  initialState: {
    engineers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEngineers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEngineers.fulfilled, (state, action) => {
        state.engineers = action.payload;
        state.loading = false;
      })
      .addCase(fetchEngineers.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(createEngineer.fulfilled, (state, action) => {
        state.engineers.push(action.payload);
      })
      .addCase(createEngineer.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteEngineer.fulfilled, (state, action) => {
        state.engineers = state.engineers.filter(
          (eng) => eng._id !== action.payload
        );
      })
      .addCase(deleteEngineer.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default engineerSlice.reducer;
