import React from "react";

/**
 * Reusable Table Component
 * @param {array} columns - Array of column definitions
 *   [{
 *     key: string,
 *     label: string,
 *     render?: function,
 *     sortable?: boolean,
 *     align?: 'left' | 'center' | 'right',
 *     width?: string
 *   }]
 * @param {array} data - Array of data objects
 * @param {string} keyField - Unique key field for rows
 * @param {function} onRowClick - Optional row click handler
 * @param {boolean} striped - Striped rows
 * @param {boolean} hoverable - Hover effect on rows
 * @param {string} emptyMessage - Message when no data
 */
const Table = ({
  columns = [],
  data = [],
  keyField = "id",
  onRowClick,
  striped = false,
  hoverable = true,
  emptyMessage = "No data available",
}) => {
  const getAlignClass = (align = "left") => {
    const alignMap = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };
    return alignMap[align] || alignMap.left;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {/* Header */}
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${getAlignClass(
                  column.align
                )} ${column.width ? column.width : ""}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row[keyField] || rowIndex}
                className={`
                  ${striped && rowIndex % 2 === 1 ? "bg-gray-50" : ""}
                  ${hoverable ? "hover:bg-gray-100" : ""}
                  ${onRowClick ? "cursor-pointer" : ""}
                  transition-colors duration-200
                `}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 text-sm text-gray-900 ${getAlignClass(
                      column.align
                    )}`}
                  >
                    {column.render
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Table Container Component
 */
export const TableContainer = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

export default Table;
