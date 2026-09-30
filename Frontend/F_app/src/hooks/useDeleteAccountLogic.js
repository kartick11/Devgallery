// src/hooks/useDeleteAccountLogic.js
import { useState } from "react";
import { toast } from "react-toastify";
// Make sure to import your new API function here
import { requestAccountDeletion, cancelAccountDeletion } from "../api/organizer.api";

// Optional: pass an onSuccess callback (like fetchProfile) to update the UI instantly
export const useDeleteAccountLogic = (onSuccessCallback) => {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false); // NEW: Track cancellation loading

  // Existing submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    if (reason === "Other" && !otherReason.trim()) {
      toast.error("Please mention the reason");
      return;
    }

    if (!confirmed) {
      toast.error("Please confirm account deletion");
      return;
    }

    try {
      setLoading(true);
      
      await requestAccountDeletion({
        reason,
        customReason: otherReason,
      });

      toast.success("Deletion request submitted");
      
      // Reset form after successful submission
      setReason("");
      setOtherReason("");
      setConfirmed(false);
      
      // Trigger UI refresh if callback is provided
      if (onSuccessCallback) onSuccessCallback();
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // NEW: Cancellation logic
  const handleCancelDeletion = async () => {
    try {
      setCancelLoading(true);
      
      const response = await cancelAccountDeletion();
      
      // Show the backend message which includes the cooldown info
      toast.success(response?.data?.message || "Account deletion cancelled successfully");
      
      // Trigger UI refresh so the profile page updates to 'Active' status
      if (onSuccessCallback) onSuccessCallback();
      
    } catch (error) {
      console.error("Cancel Deletion Error:", error);
      
      // Display the specific backend error (e.g., if Admin scheduled it)
      const errorMessage = error.response?.data?.message || error.message || "Failed to cancel deletion";
      toast.error(errorMessage);
    } finally {
      setCancelLoading(false);
    }
  };

  return {
    reason,
    setReason,
    otherReason,
    setOtherReason,
    confirmed,
    setConfirmed,
    loading,
    handleSubmit,
    // NEW exports
    handleCancelDeletion,
    cancelLoading
  };
};