import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../state/auth.store";
import utils from "../utils";

export const useAuthLogic = () => {
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  const [verifyingPin, setVerifyingPin] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);

  const verifyPin = async (role, email, pin, onFail) => {
    if (!email) return utils.handleError("Please enter email first");
    if (!pin) return utils.handleError("Please enter PIN");

    try {
      setVerifyingPin(true);
      const result = await authApi.verifyPin(role, email, pin);

      if (result.success) {
        setPinVerified(true);
        utils.handleSuccess("PIN verified");
      } else {
        utils.handleError("Invalid PIN. Switched back to Login.");
        onFail();
        setPinVerified(false);
      }
    } catch (error) {
      utils.handleError(error.message);
    } finally {
      setVerifyingPin(false);
    }
  };

  const login = async (role, formData) => {
    if (!formData.officialEmail || !formData.password)
      return utils.handleError("All fields are required");
    if (!pinVerified) return utils.handleError("Please verify your PIN first");
    if (!role) return utils.handleError("Please select a valid role");

    try {
      const result = await authApi.login(role, formData);
      const { success, message, error, token, name } = result;

      if (success) {
        utils.handleSuccess(message);
        setCredentials(name, role, token);
        setTimeout(() => navigate("/"), 1000);
      } else {
        utils.handleError(error?.details?.[0]?.message || message);
      }
    } catch (err) {
      utils.handleError(err.message || "Login failed");
    }
  };

  const sendOtp = async (endpointBase, role, email, onSuccess) => {
    if (!email || !role)
      return utils.handleError(
        "Please select a role and enter your email first.",
      );

    try {
      setLoadingAction(true);
      const result = await authApi.sendOtp(endpointBase, role, email);
      if (result.success) {
        utils.handleSuccess("OTP sent to your email!");
        onSuccess();
      } else {
        utils.handleError(result.message);
      }
    } catch (error) {
      utils.handleError(error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const verifyOtp = async (endpointBase, role, email, otp, onSuccess) => {
    if (!otp) return utils.handleError("Please enter the OTP");

    try {
      setLoadingAction(true);
      const result = await authApi.verifyOtp(endpointBase, role, email, otp);
      if (result.success) {
        utils.handleSuccess("OTP verified! Please set your new credentials.");
        onSuccess();
      } else {
        utils.handleError(result.message);
      }
    } catch (error) {
      utils.handleError(error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const resetSecret = async (endpointBase, payload, onSuccess) => {
    if (!payload.newSecret || payload.newSecret.length < 4)
      return utils.handleError("Must be at least 4 characters");

    try {
      setLoadingAction(true);
      const result = await authApi.resetSecret(endpointBase, payload);
      if (result.success) {
        utils.handleSuccess("Reset successfully!");
        onSuccess();
      } else {
        utils.handleError(result.message);
      }
    } catch (error) {
      utils.handleError(error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  // Add this inside export const useAuthLogic = () => { ... }
  const signup = async (formData, onSuccess) => {
    // Make sure all required organizer/auth fields are present
    if (
      !formData.organizationName ||
      !formData.officialEmail ||
      !formData.password ||
      !formData.pin ||
      !formData.phoneNumber ||
      !formData.otp
    ) {
      return utils.handleError("All fields including OTP are required");
    }

    try {
      setLoadingAction(true);
      const result = await authApi.signup(formData);
      const { success, message, error } = result;

      if (success) {
        utils.handleSuccess(
          message ||
            "Application submitted successfully! You will be notified via email.",
        );
        setTimeout(() => onSuccess(), 1000);
      } else if (error) {
        utils.handleError(error?.details?.[0]?.message || "Signup failed");
      } else {
        utils.handleError(message || "Submission failed");
      }
    } catch (err) {
      utils.handleError(err.message || "An error occurred during signup");
    } finally {
      setLoadingAction(false);
    }
  };

  // Remember to add 'signup' to the return object at the bottom of the hook!
  return {
    verifyingPin,
    loadingAction,
    pinVerified,
    setPinVerified,
    verifyPin,
    login,
    sendOtp,
    verifyOtp,
    resetSecret,
    signup,
  };
};
