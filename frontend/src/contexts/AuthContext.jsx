import React, { createContext, useContext, useState, useEffect } from "react";
import {
  isAuthenticated,
  getUserRole,
  getUserInfo,
  clearTokens,
  storeTokens,
  getStoredUserData,
} from "../utils/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (isAuthenticated()) {
          // First try to get stored user data, fallback to JWT data
          const storedUserData = getStoredUserData();
          const userInfo = getUserInfo();
          const userRole = getUserRole();

          // Use stored user data if available, otherwise fallback to JWT
          setUser(storedUserData || userInfo);
          setRole(userRole);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user with tokens
   * @param {string} accessToken - Access token
   * @param {string} refreshToken - Refresh token
   * @param {object} userData - User data (optional)
   */
  const login = (accessToken, refreshToken, userData = null) => {
    try {
      storeTokens(accessToken, refreshToken, userData);
      const userRole = getUserRole();

      // Use provided user data if available, otherwise get from JWT
      if (userData) {
        setUser(userData);
      } else {
        const userInfo = getUserInfo();
        setUser(userInfo);
      }

      setRole(userRole);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    try {
      clearTokens();
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const authenticated = () => {
    return isAuthenticated() && user !== null;
  };

  /**
   * Check if user has required role
   * @param {string} requiredRole - Required role
   * @returns {boolean}
   */
  const hasRole = (requiredRole) => {
    return role === requiredRole;
  };

  /**
   * Check if user has any of the required roles
   * @param {string[]} requiredRoles - Array of required roles
   * @returns {boolean}
   */
  const hasAnyRole = (requiredRoles) => {
    return requiredRoles.includes(role);
  };

  const value = {
    user,
    role,
    loading,
    login,
    logout,
    authenticated,
    hasRole,
    hasAnyRole,
    isAuthenticated: authenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
