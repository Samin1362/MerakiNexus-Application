// Status configuration for artwork management
export const statusConfig = {
  Pending: {
    badge: "bg-orange-100 text-orange-800",
    border: "bg-orange-50 border-orange-200",
    color: "orange",
  },
  Approved: {
    badge: "bg-green-100 text-green-800",
    border: "bg-green-50 border-green-200",
    color: "green",
  },
  Featured: {
    badge: "bg-purple-100 text-purple-800",
    border: "bg-purple-50 border-purple-200",
    color: "purple",
  },
  Rejected: {
    badge: "bg-red-100 text-red-800",
    border: "bg-red-50 border-red-200",
    color: "red",
  },
};

export const getStatusBadge = (status) => {
  const config = statusConfig[status];
  return config
    ? `px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`
    : "px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800";
};

export const getStatusBorder = (status) => {
  const config = statusConfig[status];
  return config ? config.border : "bg-gray-50 border-gray-200";
};
