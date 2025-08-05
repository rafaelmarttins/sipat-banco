import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Login = () => {
  // Redirect to the new auth page
  return <Navigate to="/auth" replace />;
};

export default Login;
