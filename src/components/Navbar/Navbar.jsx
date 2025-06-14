import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsPersonFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../features/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b2545] px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-2 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-yellow-400 transition duration-200 font-[Instrument] !no-underline hover:!no-underline"
        >
          ManageX
        </Link>

        {/* Hamburger button (mobile only) */}
        <button
          className="text-[#c1a35f] md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="text-white hover:text-[#e2a9a9] transition-colors !no-underline hover:!no-underline"
            >
              Login
            </Link>
          ) : (
            <Link
              to="/profile"
              className="flex items-center text-white hover:text-[#e2a9a9] transition-colors !no-underline hover:!no-underline"
            >
              <BsPersonFill className="mr-1 text-lg" />
              <span>{loading ? "Loading..." : user?.name || "Profile"}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 flex flex-col space-y-2 px-4">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="text-white hover:text-[#e2a9a9] transition-colors !no-underline hover:!no-underline"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <Link
              to="/profile"
              className="flex items-center text-white hover:text-[#e2a9a9] transition-colors !no-underline hover:!no-underline"
              onClick={() => setIsMenuOpen(false)}
            >
              <BsPersonFill className="mr-1 text-lg" />
              <span>{loading ? "Loading..." : user?.name || "Profile"}</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
