const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export const organizerApi = {
  getMyProjects: async (token) => {
    const response = await fetch(`${BASE_URL}/organizer/my-projects`, {
      headers: { Authorization: token },
    });
    return response.json();
  },

  createProject: async (token, formData) => {
    const response = await fetch(`${BASE_URL}/organizer/create`, {
      method: "POST",
      headers: { Authorization: token },
      body: formData, // The browser automatically sets the correct multipart boundary headers for FormData
    });
    return response.json();
  },

  deleteProject: async (token, projectId) => {
    const response = await fetch(`${BASE_URL}/organizer/${projectId}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });
    return response.json();
  },
};
// Append to src/api/organizer.api.js

export const fetchOrganizerProjects = async () => {
  const token = localStorage.getItem("organizerToken");

  const response = await fetch("/api/organizer/projects", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organizer projects");
  }

  return response.json();
};
// Append to src/api/organizer.api.js

export const fetchOrganizerDashboard = async () => {
  // Replace with your actual auth token logic
  const token = localStorage.getItem("token");

  const response = await fetch("/api/organizer/dashboard", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
};

// Append to src/api/organizer.api.js

export const fetchOrganizerProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/organizer/profile`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to load profile data.");
  }

  return data;
};

export const requestAccountDeletion = async (reasonData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${BASE_URL}/organizer/request-deletion`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(reasonData),
    },
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
export const cancelAccountDeletion = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${BASE_URL}/organizer/cancel-deletion`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to cancel deletion request.");
  }

  return data;
};

export const submitOrganizerApplication = async (applicationData) => {
  const response = await fetch(`${BASE_URL}/organizer/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(applicationData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit application.");
  }

  return data;
};
