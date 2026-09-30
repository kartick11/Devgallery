// src/pages/OrganizerApplicationForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { authApi } from "../api/auth.api"; // Import your auth API for OTP
import { submitOrganizerApplication } from "../api/organizer.api"; // Import your dedicated organizer API
import utils from "../utils";

const OrganizerApplicationForm = () => {
  const navigate = useNavigate();

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
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Added loading state for final submit

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

    setLoadingSubmit(true);
    try {
      // Call the dedicated organizer API instead of the standard auth signup
      const data = await submitOrganizerApplication(formData);

      if (data.success) {
        utils.handleSuccess("Application submitted successfully! Pending admin approval.");
        setTimeout(() => navigate('/'), 3000);
      } else {
        utils.handleError(data.message || "Failed to submit application.");
      }
    } catch (error) {
      utils.handleError(error.message || "Failed to submit application. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />

      <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-slate-950 via-indigo-950 to-cyan-950">
        <div className="w-full max-w-lg backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8">
          
          <h2 className="text-4xl font-bold text-center text-white mb-2">
            Organizer Application
          </h2>

          <p className="text-center text-slate-300 mb-8">
            Apply to showcase your college projects on DevGallery
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Organization Name */}
            <div>
              <label className="block text-slate-200 font-medium mb-2">Organization Name</label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                required
                className="w-full bg-white/10 text-white placeholder-slate-400 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter organization name"
              />
            </div>

            {/* Official Email with OTP */}
            <div>
              <label className="block text-slate-200 font-medium mb-2">Official Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="officialEmail"
                  value={formData.officialEmail}
                  onChange={handleChange}
                  required
                  disabled={isEmailVerified || isOtpSent}
                  className="w-full bg-white/10 text-white placeholder-slate-400 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                  placeholder="example@college.edu"
                />
                {!isEmailVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loadingOtp || isOtpSent}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 rounded-xl font-medium transition whitespace-nowrap disabled:opacity-50"
                  >
                    {loadingOtp ? "Sending..." : isOtpSent ? "Sent" : "Send OTP"}
                  </button>
                )}
              </div>

              {/* OTP Input */}
              {isOtpSent && !isEmailVerified && (
                <div className="bg-slate-800/80 p-4 mt-3 rounded-xl border border-cyan-500/50">
                  <label className="block text-cyan-400 text-sm font-medium mb-2">
                    Enter 6-digit verification code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength="6"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white tracking-[0.5em] text-center font-bold focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 rounded-xl font-medium transition"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}

              {isEmailVerified && (
                <p className="text-emerald-400 text-sm font-medium mt-2">✓ Email successfully verified</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-slate-200 font-medium mb-2">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full bg-white/10 text-white placeholder-slate-400 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter phone number"
              />
            </div>

            {/* PIN */}
            <div>
              <label className="block text-slate-200 font-medium mb-2">Security PIN</label>
              <input
                type="text"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                required
                maxLength={4}
                className="w-full bg-white/10 text-white placeholder-slate-400 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="4-digit PIN"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-200 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/10 text-white placeholder-slate-400 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Create password"
              />
            </div>

            <button
              type="submit"
              disabled={loadingSubmit || !isEmailVerified}
              className="w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 transition-all duration-300 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loadingSubmit ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrganizerApplicationForm;