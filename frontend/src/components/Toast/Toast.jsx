import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const Toast = ({
  id,
  message,
  type = "success",
  duration = 4000,
  onClose,
  index = 0,
}) => {
  const toastRef = useRef(null);
  const timeoutRef = useRef(null);

  // Get appropriate icon for toast type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-white" />;
      case "error":
        return <XCircle className="w-5 h-5 text-white" />;
      case "info":
        return <Info className="w-5 h-5 text-white" />;
      default:
        return <CheckCircle className="w-5 h-5 text-white" />;
    }
  };

  // Get appropriate styling for toast type
  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-purple-500/90 to-blue-500/90 border border-purple-300/30";
      case "error":
        return "bg-gradient-to-r from-red-500/90 to-red-600/90 border border-red-300/30";
      case "info":
        return "bg-gradient-to-r from-blue-500/90 to-blue-600/90 border border-blue-300/30";
      default:
        return "bg-gradient-to-r from-purple-500/90 to-blue-500/90 border border-purple-300/30";
    }
  };

  // Handle close with animation
  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Exit animation
    gsap.to(toastRef.current, {
      x: 400,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        onClose(id);
      },
    });
  };

  // Entrance animation
  useEffect(() => {
    if (toastRef.current) {
      // Initial state
      gsap.set(toastRef.current, {
        x: 400,
        opacity: 0,
        scale: 0.9,
      });

      // Calculate position based on index
      const topPosition = 20 + index * 80; // Stack toasts 80px apart

      // Set position
      gsap.set(toastRef.current, {
        top: `${topPosition}px`,
      });

      // Entrance animation
      gsap.to(toastRef.current, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    }
  }, [index]);

  // Auto-dismiss timer
  useEffect(() => {
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={toastRef}
      className={`
        fixed right-4 z-[9999] max-w-sm w-full
        backdrop-blur-md rounded-xl shadow-2xl
        transform transition-all duration-300
        ${getToastStyles()}
      `}
      style={{
        boxShadow: `
          0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04),
          0 0 20px rgba(139, 92, 246, 0.3)
        `,
      }}
    >
      <div className="p-4">
        <div className="flex items-start">
          {/* Icon */}
          <div className="flex-shrink-0 mr-3">{getIcon()}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white leading-5">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </p>
            <p className="mt-1 text-sm text-white/90 leading-5">{message}</p>
          </div>

          {/* Close Button */}
          <div className="flex-shrink-0 ml-3">
            <button
              onClick={handleClose}
              className="inline-flex text-white/70 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar for duration */}
        {duration > 0 && (
          <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-white/60 rounded-full origin-left"
              style={{
                animation: `toast-progress ${duration}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes toast-progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
