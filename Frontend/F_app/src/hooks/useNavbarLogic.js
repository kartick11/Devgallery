// src/hooks/useNavbarLogic.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useNavbarLogic = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    setIsLoggedIn(!!token);
    setLoggedInUser(user || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setLoggedInUser("");

    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      // Use encodeURIComponent to safely handle special characters in the search term
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    } else {
      navigate("/");
    }
  };

  const handleProtectedNavigation = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (loggedInUser === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/upload");
    }
  };

  return {
    loggedInUser,
    isLoggedIn,
    searchTerm,
    setSearchTerm,
    handleLogout,
    handleSearchSubmit,
    handleProtectedNavigation,
  };
};