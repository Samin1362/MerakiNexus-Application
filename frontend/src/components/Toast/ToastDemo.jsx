import React from "react";
import { useToast } from "./useToast";

/**
 * Demo component to showcase the Toast functionality
 * This can be used for testing or as an example
 */
const ToastDemo = () => {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Operation completed successfully!");
  };

  const handleError = () => {
    toast.error("Something went wrong. Please try again.");
  };

  const handleInfo = () => {
    toast.info("Here's some useful information for you.");
  };

  const handleMultiple = () => {
    toast.success("First toast!");
    setTimeout(() => toast.error("Second toast!"), 500);
    setTimeout(() => toast.info("Third toast!"), 1000);
  };

  const handleLongMessage = () => {
    toast.success(
      "This is a longer message to demonstrate how the toast handles extended content and wrapping behavior."
    );
  };

  const handleCustomDuration = () => {
    toast.show("This toast stays for 8 seconds!", "info", 8000);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
      <h2 className="text-xl font-bold text-white mb-6 text-center">
        Toast Demo
      </h2>

      <div className="space-y-3">
        <button
          onClick={handleSuccess}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
        >
          Show Success Toast
        </button>

        <button
          onClick={handleError}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        >
          Show Error Toast
        </button>

        <button
          onClick={handleInfo}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          Show Info Toast
        </button>

        <button
          onClick={handleMultiple}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
        >
          Show Multiple Toasts
        </button>

        <button
          onClick={handleLongMessage}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
        >
          Show Long Message
        </button>

        <button
          onClick={handleCustomDuration}
          className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200"
        >
          Custom Duration (8s)
        </button>

        <button
          onClick={() => toast.clear()}
          className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
        >
          Clear All Toasts
        </button>
      </div>

      <div className="mt-6 text-sm text-white/70 text-center">
        <p>Current toast count: {toast.count}</p>
      </div>
    </div>
  );
};

export default ToastDemo;
