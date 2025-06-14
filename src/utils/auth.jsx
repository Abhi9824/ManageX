// // // src/utils/auth.js
// // import { useSelector } from "react-redux";
// // import { Navigate, Outlet } from "react-router-dom";

// // const ProtectedRoute = ({ role }) => {
// //   const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

// //   if (loading) {
// //     return <div className="text-center mt-5">Checking authentication...</div>;
// //   }

// //   if (!isAuthenticated || !user) {
// //     return <Navigate to="/login" />;
// //   }
// //   if (role && user.role !== role) {
// //     return <Navigate to="/" />;
// //   }

// //   // Everything is okay, allow access
// //   return <Outlet />;
// // };

// // export default ProtectedRoute;

// // src/utils/auth.js
// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({ role, allowedRoles, children }) => {
//   const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

//   if (loading) {
//     return <div className="text-center mt-5">Checking authentication...</div>;
//   }

//   if (!isAuthenticated || !user) {
//     return <Navigate to="/login" />;
//   }

//   if (role && user.role !== role) {
//     return <Navigate to="/" />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/" />;
//   }

//   // If children exist, render them (used as wrapper)
//   if (children) {
//     return children;
//   }

//   // Otherwise, use outlet (used in nested route)
//   return <Outlet />;
// };

// export default ProtectedRoute;

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role, allowedRoles, children }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // ⏳ Show loading while auth state is being resolved
  if (loading || (isAuthenticated && !user)) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // ❌ Role doesn't match
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // ✅ Everything is fine
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
