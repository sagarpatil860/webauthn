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
  const loginWithWebAuthn = async (username) => {
    const result = await AuthService.loginWithWebAuthn(username);
    setIsAuthenticated(result);
    return result;
  };
  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  const signup = (username, password) => {
    const result = AuthService.signup(username, password);
    setIsAuthenticated(result);
    return result;
  };

  const signupVerify = (verifyOptions) => {
    const result = AuthService.signupVerify(verifyOptions);
    return result;
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
        signup,
        signupVerify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
