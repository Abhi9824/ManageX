import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios";

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/projects");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch projects"
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/projects/${projectId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch project"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.user?.token;

      const res = await axiosInstance.post("/projects", projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Project creation failed"
      );
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    currentProject: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearCurrentProject(state) {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // === fetchProjectById ===
      .addCase(fetchProjectById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // === createProject ===
      .addCase(createProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// === Exports ===

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
