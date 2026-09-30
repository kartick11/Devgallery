import { Navigate, Outlet } from "react-router-dom";

const OrganizerProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "organizer") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default OrganizerProtectedRoute;