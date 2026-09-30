// src/hooks/useOrganizerDashboardLogic.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrganizerDashboard, submitOrganizerApplication } from "../api/organizer.api";
import { useOrganizerStore } from "../state/organizer.store";

// --------------------------------------------------------
// Hook 1: Dashboard Logic
// --------------------------------------------------------
export const useOrganizerDashboardLogic = () => {
  const navigate = useNavigate();
  const {
    pendingProjects,
    approvedProjects,
    isLoading,
    error,
    setLoading,
    setDashboardData,
    setError,
    clearOrganizerData, 
  } = useOrganizerStore();

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const data = await fetchOrganizerDashboard();
        // Adjust these properties based on your actual backend response
        setDashboardData(data.pendingProjects || [], data.approvedProjects || []);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data.");
      }
    };

    loadDashboard();
  }, [setLoading, setDashboardData, setError]);

  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("organizerToken"); 
    clearOrganizerData(); 
    navigate("/organizer/login");
  };

  const handleHome = () => {
    console.log("Home clicked");
    navigate("/");
  };

  return {
    pendingProjects,
    approvedProjects,
    isLoading,
    error,
    handleLogout,
    handleHome,
  };
};

// --------------------------------------------------------
// Hook 2: Application Registration Logic
// --------------------------------------------------------
export const useOrganizerApplicationLogic = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    officialEmail: "",
    pin: "",
    password: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await submitOrganizerApplication(formData);
      setMessage("✅ Application submitted successfully! You will be notified via the provided email.");
      
      // Reset form on success
      setFormData({
        organizationName: "",
        officialEmail: "",
        pin: "",
        password: "",
        phoneNumber: "",
      });
    } catch (error) {
      setMessage(error.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    message,
    handleChange,
    handleSubmit,
  };
};