import React, { createContext, useState, useCallback } from "react";
import Toast from "./Toast";

// Create the Toast Context
export const ToastContext = createContext();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Generate unique ID for each toast
  const generateId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  // Add a new toast
  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = generateId();
    const newToast = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now(),
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    return id;
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Remove all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Toast methods
  const showSuccess = useCallback(
    (message, duration) => {
      return addToast(message, "success", duration);
    },
    [addToast]
  );

  const showError = useCallback(
    (message, duration) => {
      return addToast(message, "error", duration);
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message, duration) => {
      return addToast(message, "info", duration);
    },
    [addToast]
  );

  // Context value
  const contextValue = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showInfo,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            index={index}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
