import { Routes, Route } from "react-router-dom";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";

import ManagerDashboard from "./pages/ManagerDashboard/ManagerDashboard";
import EngineerDashboard from "./pages/Engineer/EngineerDashboard ";
import ProtectedRoute from "./utils/auth.jsx";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Navbar from "./components/Navbar/Navbar";
import { fetchProfile } from "./features/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./pages/Profile/Profile.jsx";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div>
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={["manager", "engineer"]}>
                  {user?.role === "manager" ? (
                    <ManagerDashboard />
                  ) : (
                    <EngineerDashboard />
                  )}
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["manager", "engineer"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
