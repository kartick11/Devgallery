// src/hooks/usePublicRouteLogic.js

export const usePublicRouteLogic = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  // const role = localStorage.getItem("userRole"); // Reserved for future use

  const getRedirectPath = () => {
    // If authenticated as an organizer, send to home (or organizer dashboard)
    if (token && user === "organizer") {
      return "/";
    }

    // If authenticated as an admin, send to admin dashboard
    if (token && user === "admin") {
      return "/admin/dashboard";
    }

    // If no redirect is needed, return null
    return null;
  };

  return {
    redirectPath: getRedirectPath(),
  };
};