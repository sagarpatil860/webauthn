// components/PrivateRoute.js
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated, setRedirectPath } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirectPath(location.pathname);
    }
  }, [isAuthenticated, setRedirectPath, location]);

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
