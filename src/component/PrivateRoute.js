import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) return null;

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
