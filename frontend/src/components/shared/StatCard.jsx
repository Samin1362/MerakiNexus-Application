import React from "react";

/**
 * Statistics Card Component for Dashboards
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {node} icon - Icon component (from lucide-react)
 * @param {string} gradient - Tailwind gradient classes
 * @param {string} change - Change percentage/indicator
 * @param {string} trend - Trend direction: 'up', 'down', or 'neutral'
 * @param {string} subtitle - Additional subtitle text
 * @param {function} onClick - Click handler
 */
const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient = "from-blue-500 to-purple-600",
  change,
  trend,
  subtitle,
  onClick,
}) => {
  const getTrendColor = () => {
    if (!trend) return "text-gray-600";
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className={`bg-gradient-to-br ${gradient} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/90 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {(change || subtitle) && (
            <p
              className={`text-sm mt-2 ${
                change ? getTrendColor() : "text-white/80"
              }`}
            >
              {change || subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className="bg-white bg-opacity-20 p-3 rounded-lg ml-4">
            <Icon className="h-8 w-8 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
