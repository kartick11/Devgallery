// src/components/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { usePublicRouteLogic } from "../hooks/usePublicRouteLogic";

const PublicRoute = ({ children }) => {
  const { redirectPath } = usePublicRouteLogic();

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;