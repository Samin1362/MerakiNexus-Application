import React from "react";

/**
 * Reusable Card Component
 * @param {node} children - Card content
 * @param {string} className - Additional classes
 * @param {boolean} hover - Enable hover effect
 * @param {function} onClick - Click handler
 * @param {string} padding - Padding size: 'none', 'sm', 'md', 'lg'
 */
const Card = ({
  children,
  className = "",
  hover = false,
  onClick,
  padding = "md",
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClass = hover
    ? "hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    : "";
  const clickableClass = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${paddingClasses[padding]} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

/**
 * Card Header Component
 */
export const CardHeader = ({ children, className = "" }) => (
  <div className={`border-b border-gray-100 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

/**
 * Card Title Component
 */
export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

/**
 * Card Description Component
 */
export const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
);

/**
 * Card Content Component
 */
export const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

/**
 * Card Footer Component
 */
export const CardFooter = ({ children, className = "" }) => (
  <div className={`border-t border-gray-100 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;
