/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Check,
  X,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Image,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Shield,
  Star,
  Camera,
} from "lucide-react";
import {
  mockPendingArtworks,
  mockUserRequests,
  mockRecentActivities,
} from "../data/mockApprovals";

const DashboardApprovals = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const pendingArtworks = mockPendingArtworks.length;
    const pendingUsers = mockUserRequests.length;
    const approvalsToday = 12; // Mock data
    const rejectionsToday = 3; // Mock data

    return { pendingArtworks, pendingUsers, approvalsToday, rejectionsToday };
  }, []);

  // Filter logic
  const filteredArtworks = useMemo(() => {
    if (filterType === "Users") return [];
    return mockPendingArtworks.filter(
      (artwork) =>
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, filterType]);

  const filteredUsers = useMemo(() => {
    if (filterType === "Artworks") return [];
    return mockUserRequests.filter(
      (request) =>
        request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, filterType]);

  // Action handlers
  const handleArtworkAction = (action, artworkId) => {
    console.log(`${action} artwork ${artworkId}`);
    alert(`Artwork ${action} successfully!`);
  };

  const handleUserAction = (action, userId) => {
    console.log(`${action} user request ${userId}`);
    alert(`User request ${action} successfully!`);
  };

  const openModal = (item, type) => {
    setSelectedItem({ ...item, type });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Approvals Management
          </h1>
          <p className="text-gray-600">
            Review and manage pending approvals for artworks and user requests
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Pending Artworks
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.pendingArtworks}
                </p>
                <p className="text-xs text-blue-600 mt-1">Awaiting review</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
                <Image className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  User Requests
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.pendingUsers}
                </p>
                <p className="text-xs text-purple-600 mt-1">Pending approval</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Approvals Today
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.approvalsToday}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% from yesterday
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Rejections Today
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.rejectionsToday}
                </p>
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -2% from yesterday
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-lg">
                <XCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by artwork title, artist name, or user..."
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Items</option>
                  <option value="Artworks">Artworks Only</option>
                  <option value="Users">User Requests Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Pending Artworks */}
            {(filterType === "All" || filterType === "Artworks") && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Pending Artwork Approvals ({filteredArtworks.length})
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Artwork
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Artist
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Submitted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredArtworks.map((artwork) => (
                        <tr
                          key={artwork.id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={artwork.thumbnail}
                                alt={artwork.title}
                                className="w-16 h-12 object-cover rounded-lg shadow-sm"
                              />
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {artwork.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {artwork.category}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={artwork.artist.avatar}
                                alt={artwork.artist.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {artwork.artist.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {artwork.artist.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {artwork.dateSubmitted}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="h-3 w-3 mr-1" />
                              {artwork.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openModal(artwork, "artwork")}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleArtworkAction("approve", artwork.id)
                                }
                                className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 flex items-center gap-1 text-sm font-medium"
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleArtworkAction("reject", artwork.id)
                                }
                                className="px-3 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg transition-all duration-200 flex items-center gap-1 text-sm font-medium"
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* User Requests */}
            {(filterType === "All" || filterType === "Users") && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Requests ({filteredUsers.length})
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Request Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((request) => (
                        <tr
                          key={request.id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={request.user.avatar}
                                alt={request.user.name}
                                className="w-10 h-10 rounded-full object-cover shadow-sm"
                              />
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {request.user.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {request.user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {request.requestType ===
                                "Artist Verification" && (
                                <Shield className="h-4 w-4 text-blue-500" />
                              )}
                              {request.requestType === "Profile Update" && (
                                <User className="h-4 w-4 text-green-500" />
                              )}
                              {request.requestType === "Premium Account" && (
                                <Star className="h-4 w-4 text-purple-500" />
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                {request.requestType}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {request.date}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              <Clock className="h-3 w-3 mr-1" />
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openModal(request, "user")}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleUserAction("approve", request.id)
                                }
                                className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 flex items-center gap-1 text-sm font-medium"
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleUserAction("reject", request.id)
                                }
                                className="px-3 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg transition-all duration-200 flex items-center gap-1 text-sm font-medium"
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Activity Timeline Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </h3>

              <div className="space-y-4">
                {mockRecentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {activity.type === "approved" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-xs font-semibold ${
                            activity.type === "approved"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {activity.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {activity.item}
                      </p>
                      <p className="text-xs text-gray-500">
                        by {activity.user.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm font-medium">
                View All Activities
              </button>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedItem.type === "artwork"
                      ? "Artwork Details"
                      : "User Request Details"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {selectedItem.type === "artwork" ? (
                  <div className="space-y-6">
                    <div className="flex gap-6">
                      <img
                        src={selectedItem.thumbnail}
                        alt={selectedItem.title}
                        className="w-32 h-24 object-cover rounded-lg shadow-sm"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedItem.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {selectedItem.category}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Submitted: {selectedItem.dateSubmitted}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Artist Information
                      </h4>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={selectedItem.artist.avatar}
                          alt={selectedItem.artist.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {selectedItem.artist.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedItem.artist.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedItem.description}
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() =>
                          handleArtworkAction("approve", selectedItem.id)
                        }
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                      >
                        <Check className="h-4 w-4" />
                        Approve Artwork
                      </button>
                      <button
                        onClick={() =>
                          handleArtworkAction("reject", selectedItem.id)
                        }
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                      >
                        <X className="h-4 w-4" />
                        Reject Artwork
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        User Information
                      </h4>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={selectedItem.user.avatar}
                          alt={selectedItem.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {selectedItem.user.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedItem.user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Request Details
                      </h4>
                      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Request Type:
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {selectedItem.requestType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Date Submitted:
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {selectedItem.date}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {selectedItem.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Details
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedItem.details}
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() =>
                          handleUserAction("approve", selectedItem.id)
                        }
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                      >
                        <Check className="h-4 w-4" />
                        Approve Request
                      </button>
                      <button
                        onClick={() =>
                          handleUserAction("reject", selectedItem.id)
                        }
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                      >
                        <X className="h-4 w-4" />
                        Reject Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardApprovals;
