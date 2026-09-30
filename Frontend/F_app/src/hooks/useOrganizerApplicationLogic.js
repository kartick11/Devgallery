// src/hooks/useOrganizerDashboardLogic.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import utils from "../utils"; // Import your custom toast utils[cite: 5]

export const useOrganizerApplicationLogic = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  
  const [formData, setFormData] = useState({
    organizationName: "",
    officialEmail: "",
    phoneNumber: "",
    pin: "",
    password: "",
    otp: "",
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!formData.officialEmail) {
      utils.handleError("Please enter your official email first.");
      return;
    }
    setLoadingOtp(true);
    try {
      const data = await authApi.sendOtp(formData.officialEmail);
      if (data.success) {
        setIsOtpSent(true);
        utils.handleSuccess("OTP sent to your email!");
      } else {
        utils.handleError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      utils.handleError("Failed to send OTP.");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput) {
      utils.handleError("Please enter the 6-digit OTP.");
      return;
    }
    try {
      const data = await authApi.verifyOtp(formData.officialEmail, otpInput);
      if (data.success) {
        setIsEmailVerified(true);
        setFormData((prev) => ({ ...prev, otp: otpInput }));
        utils.handleSuccess("Email verified successfully!");
      } else {
        utils.handleError(data.message || "Invalid OTP.");
      }
    } catch (error) {
      utils.handleError("Failed to verify OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      utils.handleError("Please verify your email before applying.");
      return;
    }

    setLoading(true);
    try {
      // Add your final submit API call here
      // await organizerApi.submitApplication(formData);

      utils.handleSuccess("Application submitted successfully! You will be notified via the provided email.");
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      utils.handleError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    loadingOtp,
    isOtpSent,
    isEmailVerified,
    otpInput,
    setOtpInput,
    handleChange,
    handleSendOtp,
    handleVerifyOtp,
    handleSubmit,
  };
};