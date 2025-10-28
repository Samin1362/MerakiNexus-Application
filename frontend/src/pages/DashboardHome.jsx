// frontend/src/pages/DashboardHome.jsx
import React from "react";
import {
  Users,
  Palette,
  Image,
  Coins,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  UserPlus,
} from "lucide-react";

/* eslint-disable no-unused-vars */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  userGrowthData,
  artworkCategoriesData,
  recentActivities,
  dashboardMetrics,
} from "../data/mockDashboardStats";

const DashboardHome = () => {
  // ===== Mock Data imported from centralized location =====
  const metrics = dashboardMetrics.map((metric, index) => {
    const icons = [Users, Palette, Image, DollarSign, Clock, Coins];
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-purple-500 to-pink-600",
      "from-blue-600 to-cyan-500",
      "from-purple-600 to-blue-500",
      "from-orange-500 to-red-500",
      "from-green-500 to-emerald-600",
    ];
    return {
      ...metric,
      icon: icons[index],
      gradient: gradients[index],
    };
  });

  // ===== Components =====
  const MetricCard = ({ title, value, icon: Icon, gradient, change }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`p-3 rounded-lg bg-gradient-to-r ${gradient} text-white`}
          >
            <Icon size={24} />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <TrendingUp
            size={16}
            className={
              change.startsWith("+") ? "text-green-500" : "text-red-500"
            }
          />
          <span
            className={`text-sm font-medium ${
              change.startsWith("+") ? "text-green-500" : "text-red-500"
            }`}
          >
            {change}
          </span>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-2">
        {activity.status === "Success" ? (
          <CheckCircle size={16} className="text-green-500" />
        ) : activity.action === "New User Registered" ? (
          <UserPlus size={16} className="text-blue-500" />
        ) : (
          <AlertCircle size={16} className="text-orange-500" />
        )}
        <span className="text-sm font-medium text-gray-900">
          {activity.action}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-xs text-gray-500">{activity.user}</span>
        <span className="text-xs text-gray-400">{activity.time}</span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            activity.status === "Success"
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {activity.status}
        </span>
      </div>
    </div>
  );

  // ===== Render =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Home
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Welcome back, Admin!</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Growth */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              User Growth
            </h3>
            <p className="text-gray-600 text-sm mb-4">Last 6 Months</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="url(#gradient)"
                    strokeWidth={3}
                    dot={{ fill: "#8B5CF6", r: 4 }}
                    activeDot={{ r: 6, stroke: "#8B5CF6" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Artwork Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Artwork Categories
            </h3>
            <p className="text-gray-600 text-sm mb-4">Distribution Overview</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={artworkCategoriesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {artworkCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Recent Activity
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Latest platform actions and updates
          </p>
          <div>
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium">
              View All Activities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
