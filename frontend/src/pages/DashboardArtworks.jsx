import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  Check,
  Upload,
  ChevronLeft,
  ChevronRight,
  Image,
  CheckCircle,
  Clock,
  Star,
  User,
  Calendar,
  FileImage,
  HardDrive,
} from "lucide-react";
import { mockArtworks, categories, statuses } from "../data/mockArtworks";
import { getStatusBadge, getStatusBorder } from "../utils/statusConfig";
import ArtworkActions from "../components/ArtworkActions";

const DashboardArtworks = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 6;

  // Calculate summary statistics
  const stats = useMemo(
    () => ({
      total: mockArtworks.length,
      pending: mockArtworks.filter((art) => art.status === "Pending").length,
      approved: mockArtworks.filter((art) => art.status === "Approved").length,
      featured: mockArtworks.filter((art) => art.status === "Featured").length,
    }),
    []
  );

  // Filter and search logic
  const filteredArtworks = useMemo(() => {
    return mockArtworks.filter((artwork) => {
      const matchesSearch =
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || artwork.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All" || artwork.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, categoryFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArtworks = filteredArtworks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Selection handlers
  const handleSelectArtwork = (id) => {
    setSelectedArtworks((prev) =>
      prev.includes(id) ? prev.filter((artId) => artId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedArtworks(
      selectedArtworks.length === paginatedArtworks.length
        ? []
        : paginatedArtworks.map((art) => art.id)
    );
  };

  // Modal handlers
  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArtwork(null);
  };

  // Action handlers
  const handleAction = (action, artworkId) => {
    console.log(`${action} action for artwork ${artworkId}`);
    alert(`${action} action triggered for artwork ${artworkId}`);
    if (showModal) closeModal();
  };

  const handleBulkAction = (action) => {
    console.log(`${action} action for artworks:`, selectedArtworks);
    alert(`${action} action triggered for ${selectedArtworks.length} artworks`);
    setSelectedArtworks([]);
  };

  // Summary stat card component
  const StatCard = ({ title, value, icon, gradient }) => {
    const IconComponent = icon;
    return (
      <div
        className={`${gradient} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <IconComponent className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Artwork Management
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <StatCard
              title="Total Artworks"
              value={stats.total}
              icon={Image}
              gradient="bg-gradient-to-br from-blue-500 to-purple-600"
            />
            <StatCard
              title="Pending Approvals"
              value={stats.pending}
              icon={Clock}
              gradient="bg-gradient-to-br from-orange-400 to-red-500"
            />
            <StatCard
              title="Approved Artworks"
              value={stats.approved}
              icon={CheckCircle}
              gradient="bg-gradient-to-br from-green-400 to-blue-500"
            />
            <StatCard
              title="Featured Artworks"
              value={stats.featured}
              icon={Star}
              gradient="bg-gradient-to-br from-purple-500 to-pink-500"
            />
          </div>
        </div>

        {/* Controls Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full xl:w-auto">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by title or artist..."
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-0"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-0"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full xl:w-auto">
              {selectedArtworks.length > 0 && (
                <button
                  className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                  onClick={() => handleBulkAction("bulk-approve")}
                >
                  <Check className="h-4 w-4" />
                  Approve Selected ({selectedArtworks.length})
                </button>
              )}
              <button className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl">
                <Upload className="h-4 w-4" />
                Upload Artwork
              </button>
            </div>
          </div>
        </div>

        {/* Artworks Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      checked={
                        selectedArtworks.length === paginatedArtworks.length &&
                        paginatedArtworks.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Artwork
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Artist
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedArtworks.map((artwork) => (
                  <tr
                    key={artwork.id}
                    className={`hover:bg-gray-50 transition-all duration-200 border-l-4 ${getStatusBorder(
                      artwork.status
                    )} ${
                      selectedArtworks.includes(artwork.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        checked={selectedArtworks.includes(artwork.id)}
                        onChange={() => handleSelectArtwork(artwork.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={artwork.thumbnail}
                          alt={artwork.title}
                          className="w-16 h-12 object-cover rounded-lg shadow-sm mr-4"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {artwork.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {artwork.uploadDate}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {artwork.artist}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {artwork.category}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(artwork.status)}>
                        {artwork.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ArtworkActions
                        artwork={artwork}
                        onView={openModal}
                        onAction={handleAction}
                        variant="compact"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredArtworks.length)} of{" "}
              {filteredArtworks.length} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {showModal && selectedArtwork && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Artwork Details
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Artwork Image */}
                  <div>
                    <img
                      src={selectedArtwork.thumbnail}
                      alt={selectedArtwork.title}
                      className="w-full h-80 sm:h-96 object-cover rounded-xl shadow-lg"
                    />
                  </div>

                  {/* Artwork Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                        {selectedArtwork.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {selectedArtwork.description}
                      </p>
                      <span className={getStatusBadge(selectedArtwork.status)}>
                        {selectedArtwork.status}
                      </span>
                    </div>

                    {/* Artist Info */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Artist Information
                      </h4>
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={selectedArtwork.artistAvatar}
                          alt={selectedArtwork.artist}
                          className="w-16 h-16 rounded-full object-cover shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-lg text-gray-900">
                            {selectedArtwork.artist}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            {selectedArtwork.category}
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {selectedArtwork.artistBio}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Artwork Metadata
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-gray-600 block">
                              Upload Date
                            </span>
                            <span className="font-semibold text-gray-900">
                              {selectedArtwork.uploadDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FileImage className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-gray-600 block">
                              Resolution
                            </span>
                            <span className="font-semibold text-gray-900">
                              {selectedArtwork.resolution}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
                          <HardDrive className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="text-gray-600 block">
                              File Size
                            </span>
                            <span className="font-semibold text-gray-900">
                              {selectedArtwork.fileSize}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Admin Actions
                      </h4>
                      <ArtworkActions
                        artwork={selectedArtwork}
                        onView={openModal}
                        onAction={handleAction}
                        variant="full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardArtworks;
