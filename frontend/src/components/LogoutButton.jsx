import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAccessToken, clearTokens } from "../utils/auth";
import { useToast } from "./Toast";
import { LogOut } from "lucide-react";

/**
 * Enhanced LogoutButton component with API integration and toast notifications
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Button variant: 'default', 'sidebar', 'icon'
 * @param {boolean} showIcon - Whether to show logout icon
 * @param {boolean} showText - Whether to show logout text
 */
const LogoutButton = ({
  className = "",
  variant = "default",
  showIcon = true,
  showText = true,
}) => {
  const navigate = useNavigate();
  const { logout: contextLogout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const toast = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        // If no token, just clear everything and redirect
        contextLogout();
        navigate("/login", { replace: true });
        return;
      }

      // Call logout API
      const response = await fetch(
        "https://meraki-nexus-api.vercel.app/meraki-nexus-api/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success === true || response.ok) {
        // Success - clear tokens and redirect
        clearTokens();
        contextLogout();
        toast.success("You have been logged out successfully.");

        // Delay redirect to show success message
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } else {
        // API returned error
        toast.error(data.message || "Logout failed. Please try again.");
        // Still clear tokens and redirect on API error as fallback
        clearTokens();
        contextLogout();
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Network error. You have been logged out locally.");

      // Clear tokens and redirect even on network error
      clearTokens();
      contextLogout();
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const baseClasses =
    "flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2";

  const variantClasses = {
    default:
      "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform",
    sidebar:
      "w-full text-gray-600 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg",
    icon: "p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg",
  };

  const combinedClasses = `${baseClasses} ${
    variantClasses[variant]
  } ${className} ${isLoggingOut ? "opacity-70 cursor-not-allowed" : ""}`;

  return (
    <>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={combinedClasses}
        title="Sign Out"
      >
        {isLoggingOut ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            {showText && <span className="font-bold">Signing out...</span>}
          </>
        ) : (
          <>
            {showIcon && (
              <LogOut className={`w-4 h-4 ${showText ? "mr-2" : ""}`} />
            )}
            {showText && <span className="font-bold">Sign Out</span>}
          </>
        )}
      </button>
    </>
  );
};

export default LogoutButton;
