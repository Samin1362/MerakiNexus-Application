import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute component for role-based route protection
 * @param {React.ReactNode} children - Child components to render
 * @param {string[]} allowedRoles - Array of roles allowed to access this route
 * @param {string} redirectTo - Path to redirect if access denied (default: /login)
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = "/login",
}) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg font-medium">Loading...</p>
          <p className="text-purple-200 text-sm mt-1">
            Verifying authentication
          </p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role (if roles are specified)
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect based on user's actual role
    const roleBasedRedirect = getRoleBasedRedirect(role);
    return <Navigate to={roleBasedRedirect} replace />;
  }

  // User is authenticated and has required role
  return children;
};

/**
 * Get redirect path based on user role
 * @param {string} role - User role
 * @returns {string} - Redirect path
 */
const getRoleBasedRedirect = (role) => {
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

/**
 * AdminRoute - Shortcut for Admin-only routes
 */
export const AdminRoute = ({ children, redirectTo = "/login" }) => (
  <ProtectedRoute allowedRoles={["Admin"]} redirectTo={redirectTo}>
    {children}
  </ProtectedRoute>
);

/**
 * ArtistRoute - Shortcut for Artist-only routes
 */
export const ArtistRoute = ({ children, redirectTo = "/login" }) => (
  <ProtectedRoute allowedRoles={["Artist"]} redirectTo={redirectTo}>
    {children}
  </ProtectedRoute>
);

/**
 * UserRoute - Shortcut for User-only routes (if needed)
 */
export const UserRoute = ({ children, redirectTo = "/login" }) => (
  <ProtectedRoute allowedRoles={["User"]} redirectTo={redirectTo}>
    {children}
  </ProtectedRoute>
);

/**
 * AuthenticatedRoute - For routes that require any authenticated user
 */
export const AuthenticatedRoute = ({ children, redirectTo = "/login" }) => (
  <ProtectedRoute
    allowedRoles={["Admin", "Artist", "User"]}
    redirectTo={redirectTo}
  >
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
