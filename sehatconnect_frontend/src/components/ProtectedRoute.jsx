import React from "react";
import { Navigate, useParams } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const { id } = useParams();

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // ❌ ID mismatch (VERY IMPORTANT FIX)
  if (id && userId && id !== userId) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;