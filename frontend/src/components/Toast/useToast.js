import { useContext } from "react";
import { ToastContext } from "./ToastContext";

/**
 * Custom hook to use Toast functionality
 *
 * @returns {Object} Toast methods and state
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showInfo,
  } = context;

  // Enhanced toast methods with better defaults
  const toast = {
    // Basic methods
    show: (message, type = "success", duration = 4000) =>
      addToast(message, type, duration),

    success: (message, duration = 4000) => showSuccess(message, duration),

    error: (
      message,
      duration = 5000 // Longer duration for errors
    ) => showError(message, duration),

    info: (message, duration = 4000) => showInfo(message, duration),

    // Utility methods
    remove: removeToast,
    clear: clearToasts,

    // State
    toasts,
    count: toasts.length,
  };

  return toast;
};
