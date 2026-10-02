import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const id = localStorage.getItem("id");

  if (!id) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
