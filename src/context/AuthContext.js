// context/AuthContext.js
import React, { createContext, useContext, useState } from "react";
import AuthService from "../services/AuthService";
import AuthServiceWebAuthn from "../services/AuthServiceWebAuthn";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthService.isLoggedIn()
  );
  const [redirectPath, setRedirectPath] = useState("/dashboard");

  const login = (username, password) => {
    const result = AuthService.login(username, password);
    setIsAuthenticated(result);
    return result;
  };
  const loginWithWebAuthn = async () => {
    const result = await AuthServiceWebAuthn.authenticate();
    setIsAuthenticated(result);
    return result;
  };
  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        redirectPath,
        setRedirectPath,
        loginWithWebAuthn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
