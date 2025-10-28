import React from "react";

/**
 * Universal Status Badge Component
 * @param {string} status - Status value
 * @param {object} config - Optional custom configuration
 * @param {string} size - Badge size: 'sm', 'md', 'lg'
 * @param {boolean} withDot - Show status dot
 */
const StatusBadge = ({ status, config, size = "md", withDot = false }) => {
  // Default status configurations
  const defaultConfig = {
    Active: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
      dot: "bg-green-500",
    },
    Pending: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-200",
      dot: "bg-orange-500",
    },
    "Pending Review": {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
      dot: "bg-yellow-500",
    },
    "Under Review": {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    Approved: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
      dot: "bg-green-500",
    },
    Featured: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
    Rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    Suspended: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-200",
      dot: "bg-orange-500",
    },
    Banned: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    Locked: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
    Burned: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    Inactive: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
      dot: "bg-gray-500",
    },
  };

  // Use custom config or default
  const statusConfig = config || defaultConfig;
  const currentConfig = statusConfig[status] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
    dot: "bg-gray-500",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${currentConfig.bg} ${currentConfig.text} ${currentConfig.border} ${sizeClasses[size]}`}
    >
      {withDot && (
        <span
          className={`${dotSizes[size]} rounded-full ${currentConfig.dot} animate-pulse`}
        />
      )}
      {status}
    </span>
  );
};

export default StatusBadge;
