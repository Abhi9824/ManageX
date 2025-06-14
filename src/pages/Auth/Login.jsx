import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../features/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("engineer");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password, role })).then((res) => {
      if (!res.error) {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b2545] to-[#13315c] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-[#0b2545] mb-6 font-[instrument]">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b2545]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b2545]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b2545]"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="engineer">Engineer</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0b2545] text-white font-semibold py-2 rounded-lg hover:bg-[#163d67] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2 text-sm">
              {error}
            </div>
          )}
        </form>

        <div className="text-center mt-6 text-sm text-gray-700">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-[#0b2545] font-medium hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
