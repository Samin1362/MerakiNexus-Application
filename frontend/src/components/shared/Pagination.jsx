import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable Pagination Component
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback when page changes
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Items shown per page
 * @param {number} startIndex - Starting index of current page
 * @param {number} maxPageButtons - Maximum number of page buttons to show
 * @param {boolean} showFirstLast - Show first/last buttons
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  startIndex,
  maxPageButtons = 5,
  showFirstLast = false,
  size = "md",
}) => {
  const sizeClasses = {
    sm: {
      button: "px-2 py-1 text-xs",
      icon: "h-3 w-3",
    },
    md: {
      button: "px-3 py-2 text-sm",
      icon: "h-4 w-4",
    },
    lg: {
      button: "px-4 py-3 text-base",
      icon: "h-5 w-5",
    },
  };

  const classes = sizeClasses[size];

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Adjust if we're near the end
    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Info */}
      {totalItems && itemsPerPage && startIndex !== undefined && (
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(startIndex + itemsPerPage, totalItems)}
          </span>{" "}
          of <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      {/* Page Controls */}
      <div className="flex gap-2 items-center">
        {/* First Page Button */}
        {showFirstLast && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`${classes.button} border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200 font-medium`}
          >
            First
          </button>
        )}

        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`${classes.button} border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 flex items-center`}
        >
          <ChevronLeft className={classes.icon} />
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${
                classes.button
              } rounded-lg transition-colors duration-200 font-medium ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`${classes.button} border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 flex items-center`}
        >
          <ChevronRight className={classes.icon} />
        </button>

        {/* Last Page Button */}
        {showFirstLast && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`${classes.button} border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200 font-medium`}
          >
            Last
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
