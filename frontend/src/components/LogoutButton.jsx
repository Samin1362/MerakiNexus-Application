import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";

/**
 * Reusable Logout Button Component
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Button variant: 'default', 'sidebar', 'icon'
 */
const LogoutButton = ({
  className = "",
  variant = "default",
  showIcon = true,
  showText = true,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const baseClasses =
    "flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400";

  const variantClasses = {
    default:
      "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md",
    sidebar:
      "w-full text-gray-600 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg",
    icon: "p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button onClick={handleLogout} className={combinedClasses} title="Sign Out">
      {showIcon && <LogOut className={`w-4 h-4 ${showText ? "mr-2" : ""}`} />}
      {showText && <span className="font-medium">Sign Out</span>}
    </button>
  );
};

export default LogoutButton;
