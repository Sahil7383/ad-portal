import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, isAdminRoute = false }) => {
  const { user } = useAuth();
  console.log("user", user);
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (isAdminRoute && !user.isAdmin) {
    // Redirect to home or another page if not an admin
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
