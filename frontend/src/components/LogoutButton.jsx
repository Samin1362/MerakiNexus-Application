import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAccessToken, clearTokens } from "../utils/auth";
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
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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
        showToast("You have been logged out successfully.");

        // Delay redirect to show success message
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } else {
        // API returned error
        showToast(data.message || "Logout failed. Please try again.", "error");
        // Still clear tokens and redirect on API error as fallback
        clearTokens();
        contextLogout();
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Network error. You have been logged out locally.", "error");

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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
              toast.type === "error"
                ? "border-l-4 border-red-500"
                : "border-l-4 border-green-500"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {toast.type === "error" ? (
                    <svg
                      className="h-6 w-6 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    {toast.type === "error" ? "Logout Error" : "Success"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setToast(null)}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;
