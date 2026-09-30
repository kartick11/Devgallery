const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export const projectApi = {
  submitVote: async (projectId, name, facialPattern) => {
    const response = await fetch(`${BASE_URL}/project/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, name, facialPattern }),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  },  
  getProjects: async (searchTerm) => {
    const url = searchTerm
      ? `${BASE_URL}/project/search/${searchTerm}`
      : `${BASE_URL}/project`;

    const response = await fetch(url);
    return response.json();
  },
};

export const fetchProjectById = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/project/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch project details.");
  }
  return result.project;
};

export const fetchProjectsBySearchTerm = async (searchTerm) => {
  const response = await fetch(
    `${BASE_URL}/project/search/${searchTerm}`,
  );
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch search results.");
  }
  return data.projects;
};
