// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useNavbarLogic } from "../../hooks/useNavbarLogic";

const Navbar = () => {
  const {
    loggedInUser,
    isLoggedIn,
    searchTerm,
    setSearchTerm,
    handleLogout,
    handleSearchSubmit,
    handleProtectedNavigation,
  } = useNavbarLogic();

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center hover:scale-105 transition-transform duration-300"
        >
          <svg
            className="h-10 w-auto"
            viewBox="0 0 200 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* D Shape */}
            <path
              d="M 22 8 L 6 25 L 22 42 L 22 32 L 12 25 L 22 18 Z"
              fill="#FFFFFF"
            />
            <path
              d="M 22 8 h 10 a 17 17 0 0 1 0 34 h -10 v -9 h 10 a 8 8 0 0 0 0 -16 h -10 z"
              fill="#22D3EE"
            />
            <text
              x="24"
              y="30"
              fill="#FFFFFF"
              fontSize="14"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {"{/}"}
            </text>
            <text
              x="60"
              y="33"
              fill="#FFFFFF"
              fontSize="24"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Dev
              <tspan fill="#22D3EE">Gallery</tspan>
            </text>
          </svg>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition"
            />
          </form>

          {/* Nav Links */}
          <Link
            to="/"
            className="text-slate-300 hover:text-cyan-400 font-medium transition"
          >
            Home
          </Link>

          <button
            onClick={handleProtectedNavigation}
            className="text-slate-300 hover:text-cyan-400 font-medium transition cursor-pointer"
          >
            {loggedInUser === "admin" ? "Dashboard" : "Upload"}
          </button>

          <Link
            to="/about"
            className="text-slate-300 hover:text-cyan-400 font-medium transition"
          >
            About
          </Link>

          {/* User Badge */}
          {loggedInUser ? (
            
              <Link
              to="/profile"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold hover:scale-105 transition-all duration-300"
            >
              Profile
              
            </Link>
            
          ) : (
            <Link
              to="/org-apply"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold hover:scale-105 transition-all duration-300"
            >
              Sign Up
            </Link>
          )}

          {/* Auth Button */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-linear-to-r from-red-500 to-pink-600 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 rounded-xl bg-linear-to-r from-cyan-500 to-violet-600 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
