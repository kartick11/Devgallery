const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const adminApi = {
  getApprovedOrganizers: async (token) => {
    const response = await fetch(`${BASE_URL}/admin/organizers`, {
      headers: { Authorization: token },
    });
    return response.json();
  },

  getPendingOrganizers: async (token) => {
    const response = await fetch(`${BASE_URL}/admin/pending-organizers`, {
      headers: { Authorization: token },
    });
    return response.json();
  },

  approveOrganizer: async (token, id) => {
    const response = await fetch(`${BASE_URL}/admin/approve/${id}`, {
      method: "PUT",
      headers: { Authorization: token },
    });
    return response.json();
  },

  rejectOrganizer: async (token, id, reason, blockEmail) => {
    const response = await fetch(`${BASE_URL}/admin/reject/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ reason, blockEmail }),
    });
    return response.json();
  },

  deleteOrganizer: async (
    token,
    { organizerId, hideProjects, deletionCustomReason },
  ) => {
    // Matches your exact Express route from the terminal log
    const response = await fetch(`${BASE_URL}/admin/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // FIX: Matches your other API calls exactly (no template literals)
        Authorization: token,
      },
      body: JSON.stringify({
        organizerId,
        hideProjects,
        deletionCustomReason,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to schedule organizer for deletion.",
      );
    }

    return data;
  },

  getScheduledDeletions: async (token) => {
    const response = await fetch(`${BASE_URL}/admin/scheduled-deletions`, {
      headers: { Authorization: token },
    });
    return response.json();
  },

  cancelDeletion: async (token, organizerId) => {
    const response = await fetch(`${BASE_URL}/admin/cancel-deletion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ organizerId }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to cancel deletion.");
    }
    return data;
  },
};
