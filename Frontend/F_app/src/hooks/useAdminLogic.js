import { useState, useEffect, useCallback } from "react";
import { adminApi } from "../api/admin.api";
import { useAdminStore } from "../state/admin.store";

export const useAdminLogic = () => {
  const {
    pendingOrganizers,
    approvedOrganizers,
    setPendingOrganizers,
    setApprovedOrganizers,
    removePendingOrganizer,
  } = useAdminStore();

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  // State for organizers pending deletion
  const [scheduledOrganizers, setScheduledOrganizers] = useState([]);
  
  const token = localStorage.getItem("token"); 

  const fetchApprovedOrganizers = useCallback(async () => {
    if (!token) return;
    try {
      const data = await adminApi.getApprovedOrganizers(token);
      if (data.success) {
        setApprovedOrganizers(data.organizers || []);
      }
    } catch (error) {
      console.error("Error fetching approved organizers:", error);
    }
  }, [token, setApprovedOrganizers]);

  const fetchPendingOrganizers = useCallback(async () => {
    if (!token) return;
    try {
      const data = await adminApi.getPendingOrganizers(token);
      if (data.success) {
        setPendingOrganizers(data.applications || []);
      }
    } catch (error) {
      console.error("Error fetching pending organizers:", error);
    }
  }, [token, setPendingOrganizers]);

  const fetchScheduledDeletions = useCallback(async () => {
    if (!token) return;
    try {
      const data = await adminApi.getScheduledDeletions(token);
      if (data.success) {
        setScheduledOrganizers(data.organizers || []);
      }
    } catch (error) {
      console.error("Error fetching scheduled deletions:", error);
    }
  }, [token]);

  // Initial load
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchPendingOrganizers(), 
        fetchApprovedOrganizers(),
        fetchScheduledDeletions()
      ]);
      setLoading(false);
    };
    loadAll();
  }, [fetchPendingOrganizers, fetchApprovedOrganizers, fetchScheduledDeletions]);

  // --- MISSING FUNCTION RESTORED ---
  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      const data = await adminApi.approveOrganizer(token, id);

      if (data.success) {
        removePendingOrganizer(id);
        fetchApprovedOrganizers(); // Refresh the approved list
      }
    } catch (error) {
      console.error("Approve Error:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // --- MISSING FUNCTION RESTORED ---
  const handleReject = async (id, reason, blockEmail, onSuccess) => {
    try {
      setProcessingId(id);
      const data = await adminApi.rejectOrganizer(
        token,
        id,
        reason,
        blockEmail,
      );

      if (data.success) {
        removePendingOrganizer(id);
        if (onSuccess) onSuccess(); // Callback to close modal in UI
      }
    } catch (error) {
      console.error("Reject Error:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (
    organizerId,
    hideProjects,
    deletionCustomReason,
    onSuccessCallback,
  ) => {
    setProcessingId(organizerId);
    try {
      await adminApi.deleteOrganizer(token, {
        organizerId,
        hideProjects,
        deletionCustomReason,
      });

      // Move from approved to scheduled locally so UI updates instantly
      const targetOrg = approvedOrganizers.find(org => org._id === organizerId);
      const updatedOrganizers = approvedOrganizers.filter(
        (org) => org._id !== organizerId
      );
      setApprovedOrganizers(updatedOrganizers);
      
      if (targetOrg) {
         setScheduledOrganizers(prev => [
           ...prev, 
           { ...targetOrg, deletionScheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
         ]);
      }

      if (onSuccessCallback) onSuccessCallback();
    } catch (error) {
      console.error("Delete Error:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelDeletion = async (organizerId) => {
    setProcessingId(organizerId);
    try {
      await adminApi.cancelDeletion(token, organizerId);
      
      // Move organizer back from scheduled list to approved list in UI
      const restoredOrg = scheduledOrganizers.find(org => org._id === organizerId);
      setScheduledOrganizers(scheduledOrganizers.filter(org => org._id !== organizerId));
      if (restoredOrg) {
        setApprovedOrganizers([...approvedOrganizers, restoredOrg]);
      }
    } catch (error) {
      console.error("Cancel Deletion Error:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return {
    pendingOrganizers,
    approvedOrganizers,
    scheduledOrganizers,
    loading,
    processingId,
    handleApprove,
    handleReject,
    handleDelete,
    handleCancelDeletion,
  };
};