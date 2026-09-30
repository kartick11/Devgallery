const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = {
  verifyPin: async (role, email, pin) => {
    const response = await fetch(`${BASE_URL}/auth/verify-pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, email, pin }),
    });
    return response.json();
  },

  login: async (role, formData) => {
    const url =
      role === "organizer"
        ? `${BASE_URL}/organizer/login`
        : `${BASE_URL}/admin/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    return response.json();
  },

  sendOtp: async (endpointBase, role, email) => {
    const response = await fetch(`${BASE_URL}/auth/${endpointBase}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, email }),
    });
    return response.json();
  },

  verifyOtp: async (endpointBase, role, email, otp) => {
    const response = await fetch(
      `${BASE_URL}/auth/${endpointBase}/verify-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, otp }),
      },
    );
    return response.json();
  },

  resetSecret: async (endpointBase, payload) => {
    const response = await fetch(`${BASE_URL}/auth/${endpointBase}/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  signup: async (formData) => {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    return response.json();
  },

  sendOtp: async (officialEmail) => {
    const res = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ officialEmail }),
    });
    return res.json();
  },

  verifyOtp: async (officialEmail, otp) => {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ officialEmail, otp }),
    });
    return res.json();
  },
};
