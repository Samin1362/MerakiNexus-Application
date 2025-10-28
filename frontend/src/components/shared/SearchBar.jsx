import React from "react";
import { Search, X } from "lucide-react";

/**
 * Reusable Search Bar Component
 * @param {string} value - Current search value
 * @param {function} onChange - Callback when search value changes
 * @param {string} placeholder - Placeholder text
 * @param {boolean} showClearButton - Show clear button when there's text
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {string} className - Additional classes
 */
const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  showClearButton = true,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: {
      input: "pl-9 pr-4 py-2 text-sm",
      icon: "h-4 w-4",
      iconLeft: "left-3",
    },
    md: {
      input: "pl-10 pr-4 py-3 text-sm",
      icon: "h-5 w-5",
      iconLeft: "left-3",
    },
    lg: {
      input: "pl-12 pr-4 py-4 text-base",
      icon: "h-6 w-6",
      iconLeft: "left-4",
    },
  };

  const classes = sizeClasses[size];

  const handleClear = () => {
    onChange({ target: { value: "" } });
  };

  return (
    <div className={`relative flex-1 min-w-0 ${className}`}>
      <Search
        className={`absolute ${classes.iconLeft} top-1/2 transform -translate-y-1/2 text-gray-400 ${classes.icon}`}
      />
      <input
        type="text"
        placeholder={placeholder}
        className={`${classes.input} ${
          showClearButton && value ? "pr-10" : ""
        } border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full`}
        value={value}
        onChange={onChange}
      />
      {showClearButton && value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X className={classes.icon} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
