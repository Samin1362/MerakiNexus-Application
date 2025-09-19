// JWT Token utilities for MerakiNexus Authentication
import Cookies from "js-cookie";

/**
 * Decode JWT token without verification (for client-side role extraction)
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

/**
 * Store authentication tokens in cookies
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token (optional)
 */
export const storeTokens = (accessToken, refreshToken = null) => {
  try {
    // Store access token with 7 days expiry
    Cookies.set("merakiNexus_accessToken", accessToken, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });

    if (refreshToken) {
      // Store refresh token with 30 days expiry
      Cookies.set("merakiNexus_refreshToken", refreshToken, {
        expires: 30,
        secure: true,
        sameSite: "strict",
      });
    }
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

/**
 * Get access token from cookies
 * @returns {string|null} - Access token or null
 */
export const getAccessToken = () => {
  try {
    return Cookies.get("merakiNexus_accessToken") || null;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

/**
 * Get refresh token from cookies
 * @returns {string|null} - Refresh token or null
 */
export const getRefreshToken = () => {
  try {
    return Cookies.get("merakiNexus_refreshToken") || null;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

/**
 * Remove all authentication tokens from cookies
 */
export const clearTokens = () => {
  try {
    Cookies.remove("merakiNexus_accessToken");
    Cookies.remove("merakiNexus_refreshToken");
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has valid token
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;

  const decoded = decodeJWT(token);
  if (!decoded) return false;

  // Check if token is expired
  const currentTime = Date.now() / 1000;
  if (decoded.exp && decoded.exp < currentTime) {
    clearTokens();
    return false;
  }

  return true;
};

/**
 * Get user role from access token
 * @returns {string|null} - User role or null
 */
export const getUserRole = () => {
  const token = getAccessToken();
  if (!token) return null;

  const decoded = decodeJWT(token);
  return decoded?.role || null;
};

/**
 * Get user info from access token
 * @returns {object|null} - User info or null
 */
export const getUserInfo = () => {
  const token = getAccessToken();
  if (!token) return null;

  const decoded = decodeJWT(token);
  return decoded || null;
};

/**
 * Check if user has required role
 * @param {string} requiredRole - Required role
 * @returns {boolean} - True if user has required role
 */
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

/**
 * Check if user has any of the required roles
 * @param {string[]} requiredRoles - Array of required roles
 * @returns {boolean} - True if user has any of the required roles
 */
export const hasAnyRole = (requiredRoles) => {
  const userRole = getUserRole();
  return requiredRoles.includes(userRole);
};

/**
 * Get redirect path based on user role
 * @param {string} role - User role
 * @returns {string} - Redirect path
 */
export const getRoleBasedRedirectPath = (role) => {
  switch (role) {
    case "Admin":
      return "/dashboard";
    case "Artist":
      return "/artist-dashboard";
    case "User":
    default:
      return "/";
  }
};
