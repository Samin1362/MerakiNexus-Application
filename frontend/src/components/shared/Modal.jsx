import React from "react";
import { X } from "lucide-react";

/**
 * Reusable Modal Component
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal is closed
 * @param {string} title - Modal title
 * @param {string} subtitle - Optional subtitle
 * @param {node} children - Modal content
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'
 * @param {boolean} showCloseButton - Show/hide close button
 * @param {string} className - Additional classes for modal content
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "2xl",
  showCloseButton = true,
  className = "",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    full: "max-w-full",
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto shadow-2xl ${className}`}
      >
        <div className="p-6 sm:p-8">
          {/* Header */}
          {(title || subtitle || showCloseButton) && (
            <div className="flex justify-between items-start mb-6">
              <div>
                {title && (
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {title}
                  </h2>
                )}
                {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
