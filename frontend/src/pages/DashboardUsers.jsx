import React, { useState, useMemo } from "react";
import {
  Users,
  UserCheck,
  Palette,
  Shield,
  Search,
  Filter,
  Eye,
  Edit,
  Ban,
  UserX,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Mail,
  Crown,
  Clock,
  Image,
  CreditCard,
  ChevronDown,
  Star,
  MapPin,
  Calendar,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  Download,
  Upload,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import { mockUsers, userRoles, userStatuses } from "../data/mockUsers";

const DashboardUsers = () => {
  // State from imported mock data
  const [users] = useState(mockUsers);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  // const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // table or cards
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 6;

  // Enhanced filter and search logic
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "joinDate") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Summary calculations with enhanced metrics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const artists = users.filter((u) => u.role === "Artist").length;
  // const admins = users.filter(u => u.role === "Admin").length;
  // const verifiedUsers = users.filter(u => u.verified).length;
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSales, 0);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Suspended":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "Banned":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Suspended":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "Banned":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200";
      case "Artist":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200";
      case "User":
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Enhanced User Profile Modal
  const UserProfileModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
          {/* Enhanced Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 rounded-t-3xl text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-2xl"
                  />
                  {user.verified && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold">{user.name}</h3>
                  <p className="text-blue-100 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </p>
                  <p className="text-blue-100 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </p>
                  <p className="text-blue-100 flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>Last active: {user.lastActive}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="p-8 space-y-8">
            {/* Status and Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center space-x-3 mb-4">
                  <Crown className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-purple-800">Role</span>
                </div>
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-center space-x-3 mb-4">
                  {getStatusIcon(user.status)}
                  <span className="font-semibold text-green-800">Status</span>
                </div>
                <span
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${getStatusBadgeColor(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </div>

              {user.role === "Artist" && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <Star className="w-6 h-6 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">
                      Rating
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-yellow-800">
                      {user.rating}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(user.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border border-blue-100">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <p className="text-sm text-blue-600 font-medium mb-1">Joined</p>
                <p className="font-bold text-blue-800">
                  {new Date(user.joinDate).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center border border-purple-100">
                <Image className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <p className="text-sm text-purple-600 font-medium mb-1">
                  Artworks
                </p>
                <p className="font-bold text-purple-800">{user.artworks}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border border-green-100">
                <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <p className="text-sm text-green-600 font-medium mb-1">
                  Transactions
                </p>
                <p className="font-bold text-green-800">{user.transactions}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center border border-orange-100">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <p className="text-sm text-orange-600 font-medium mb-1">
                  Total Sales
                </p>
                <p className="font-bold text-orange-800">
                  {formatCurrency(user.totalSales)}
                </p>
              </div>
            </div>

            {user.role === "Artist" && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
                <h4 className="font-semibold text-indigo-800 mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Artist Metrics</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-800">
                      {user.followers}
                    </p>
                    <p className="text-sm text-indigo-600">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-800">
                      {(user.totalSales / user.artworks).toFixed(0) || 0}
                    </p>
                    <p className="text-sm text-indigo-600">Avg. Sale Price</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-800">
                      {((user.transactions / user.artworks) * 100).toFixed(1) ||
                        0}
                      %
                    </p>
                    <p className="text-sm text-indigo-600">Conversion Rate</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Actions */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Account Actions</span>
              </h4>
              <div className="flex flex-wrap gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Edit Profile
                </button>
                {user.role !== "Admin" && (
                  <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Promote to Admin
                  </button>
                )}
                {user.status === "Active" && (
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                    Suspend Account
                  </button>
                )}
                <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header Section */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Users Management
              </h1>
              <p className="text-gray-600">
                Manage and monitor all platform users
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button
                onClick={handleRefresh}
                className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
              <button className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Enhanced Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold">{totalUsers}</p>
                  <p className="text-blue-200 text-xs mt-1">
                    +12% from last month
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold">{activeUsers}</p>
                  <p className="text-green-200 text-xs mt-1">
                    +8% from last month
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
                  <UserCheck className="w-8 h-8 text-green-200" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Artists</p>
                  <p className="text-3xl font-bold">{artists}</p>
                  <p className="text-purple-200 text-xs mt-1">
                    +15% from last month
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
                  <Palette className="w-8 h-8 text-purple-200" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Revenue</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-indigo-200 text-xs mt-1">
                    +23% from last month
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-indigo-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Table Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Enhanced Controls */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users, emails, locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  />
                </div>

                {/* Enhanced Filters */}
                <div className="relative">
                  <button
                    onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
                    className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span>Filters</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        showFiltersDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showFiltersDropdown && (
                    <div className="absolute top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-20 p-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                          </label>
                          <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            {userRoles.map((role) => (
                              <option key={role} value={role}>
                                {role === "All" ? "All Roles" : role}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            {userStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status === "All" ? "All Statuses" : status}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sort By
                          </label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="name">Name</option>
                            <option value="joinDate">Join Date</option>
                            <option value="lastActive">Last Active</option>
                            <option value="totalSales">Total Sales</option>
                            <option value="artworks">Artworks</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <button
                            onClick={() => {
                              setRoleFilter("All");
                              setStatusFilter("All");
                              setSortBy("name");
                              setSortOrder("asc");
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Reset Filters
                          </button>
                          <button
                            onClick={() => setShowFiltersDropdown(false)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "table"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "cards"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Cards
                  </button>
                </div>

                <button
                  // onClick={() => setShowAddUserModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add User</span>
                </button>

                {selectedUsers.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {selectedUsers.length} selected
                    </span>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Table/Cards View */}
          {viewMode === "table" ? (
            // Desktop Table
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(paginatedUsers.map((u) => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>User</span>
                        {sortBy === "name" && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              sortOrder === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleSort("lastActive")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Last Active</span>
                        {sortBy === "lastActive" && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              sortOrder === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Performance
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-full shadow-md group-hover:shadow-lg transition-shadow"
                            />
                            {user.verified && (
                              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-400 flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{user.location}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-xl text-sm font-medium ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(user.status)}
                          <span
                            className={`px-3 py-1 rounded-xl text-sm font-medium ${getStatusBadgeColor(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {user.lastActive}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.role === "Artist" ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Image className="w-4 h-4 text-purple-500" />
                              <span className="font-medium">
                                {user.artworks}
                              </span>
                              <span className="text-gray-500">artworks</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="font-medium">
                                {formatCurrency(user.totalSales)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-sm">
                            <CreditCard className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">
                              {user.transactions}
                            </span>
                            <span className="text-gray-500">purchases</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => setSelectedModal(user)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors group-hover:scale-110 transform"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors group-hover:scale-110 transform"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors group-hover:scale-110 transform"
                            title="Suspend"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <div className="relative group/menu">
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group-hover:scale-110 transform">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Enhanced Cards View
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-16 h-16 rounded-full shadow-md"
                        />
                        {user.verified && (
                          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400 flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{user.location}</span>
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-xl text-sm font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(user.status)}
                        <span
                          className={`px-3 py-1 rounded-xl text-sm font-medium ${getStatusBadgeColor(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      {user.role === "Artist" ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-purple-600 mb-1">
                              <Image className="w-4 h-4" />
                            </div>
                            <p className="font-semibold text-gray-900">
                              {user.artworks}
                            </p>
                            <p className="text-xs text-gray-500">Artworks</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                              <TrendingUp className="w-4 h-4" />
                            </div>
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(user.totalSales)}
                            </p>
                            <p className="text-xs text-gray-500">Sales</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <p className="font-semibold text-gray-900">
                            {user.transactions}
                          </p>
                          <p className="text-xs text-gray-500">Transactions</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Last active: {user.lastActive}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedModal(user)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      View Profile
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors">
                      <Ban className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <span>
                  Showing {startIndex + 1} to{" "}
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredAndSortedUsers.length
                  )}{" "}
                  of {filteredAndSortedUsers.length} users
                </span>
                {(searchTerm ||
                  roleFilter !== "All" ||
                  statusFilter !== "All") && (
                  <span className="text-blue-600">
                    (filtered from {totalUsers} total)
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
                >
                  First
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                            : "text-gray-700 hover:bg-gray-100 hover:scale-105"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedModal}
        onClose={() => setSelectedModal(null)}
      />
    </div>
  );
};

export default DashboardUsers;
