
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth";
import permissions from "../roles/permissions";

const ProtectedRoute = ({ component: Component, name, required }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;
  const allowed = permissions[user.role]?.[name];
  if (!allowed || (required === "R/W" && allowed !== "R/W")) {
    return <Navigate to="/unauthorized" />;
  }
  return <Component />;
};

export default ProtectedRoute;
