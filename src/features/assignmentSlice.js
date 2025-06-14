import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";

const initialState = {
  assignments: [],
  status: "idle",
  error: null,
  currentAssignment: null,
  currentStatus: "idle",
  currentError: null,
};

export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/assignments");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createAssignment = createAsyncThunk(
  "assignments/createAssignment",
  async (assignmentData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/assignments", assignmentData);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create assignment");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateAssignment = createAsyncThunk(
  "assignments/updateAssignment",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/assignments/${id}`, updateData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  "assignments/deleteAssignment",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/assignments/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    clearCurrentAssignment(state) {
      state.currentAssignment = null;
      state.currentStatus = "idle";
      state.currentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH assignments
      .addCase(fetchAssignments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = "success";
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // CREATE assignment
      .addCase(createAssignment.pending, (state) => {
        state.currentStatus = "loading";
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.currentStatus = "success";
        state.assignments.push(action.payload);
        state.currentAssignment = action.payload;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = action.payload;
      })

      // UPDATE assignment
      .addCase(updateAssignment.pending, (state) => {
        state.currentStatus = "loading";
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.currentStatus = "success";
        const idx = state.assignments.findIndex(
          (a) => a._id === action.payload._id
        );
        if (idx !== -1) {
          state.assignments[idx] = action.payload;
        }
        state.currentAssignment = action.payload;
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = action.payload;
      })

      // DELETE assignment
      .addCase(deleteAssignment.pending, (state) => {
        state.currentStatus = "loading";
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.currentStatus = "success";
        state.assignments = state.assignments.filter(
          (a) => a._id !== action.payload
        );
        if (
          state.currentAssignment &&
          state.currentAssignment._id === action.payload
        ) {
          state.currentAssignment = null;
        }
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = action.payload;
      });
  },
});

export const { clearCurrentAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
