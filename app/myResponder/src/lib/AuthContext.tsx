// @ts-nocheck
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const mockUser = {
  id: "local-user",
  email: "demo@local.test",
  full_name: "Demo User",
  role: "user",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(mockUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/home";
  };

  const navigateToLogin = () => {
    window.location.href = "/home";
  };

  const checkUserAuth = async () => {
    setUser(mockUser);
    setIsAuthenticated(true);
    return mockUser;
  };

  const checkAppState = async () => mockUser;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth: false,
        isLoadingPublicSettings: false,
        authError: null,
        appPublicSettings: {},
        authChecked: true,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
