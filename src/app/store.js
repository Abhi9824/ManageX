import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import projectsSlice from "../features/projectSlice";
import assignmentsSlice from "../features/assignmentSlice";
import engineersSlice from "../features/engineerSlice";
import capacityReducer from "../features/capacitySlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    projects: projectsSlice,
    assignments: assignmentsSlice,
    engineers: engineersSlice,
    capacity: capacityReducer,
  },
});
