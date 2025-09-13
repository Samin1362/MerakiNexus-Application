import React, { useState, useMemo } from "react";
import {
  Search,
  Eye,
  Lock,
  Flame,
  ArrowRightLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Coins,
  TrendingUp,
  DollarSign,
  Activity,
  User,
  Calendar,
  Hash,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const DashboardToken = () => {
  // Mock data for tokens
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mockTokens = [
    {
      id: "TKN-001",
      owner: {
        name: "Alice Johnson",
        email: "alice@example.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face",
      },
      value: 2.5,
      status: "Active",
      createdDate: "2024-09-01",
      metadata: {
        type: "Art Token",
        artwork: "Digital Sunset",
        rarity: "Rare",
      },
      history: [
        {
          date: "2024-09-01",
          action: "Minted",
          details: "Token created for Digital Sunset artwork",
        },
        {
          date: "2024-09-05",
          action: "Transfer",
          details: "Transferred to current owner",
        },
      ],
    },
    {
      id: "TKN-002",
      owner: {
        name: "Bob Smith",
        email: "bob@example.com",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      value: 1.8,
      status: "Pending",
      createdDate: "2024-09-10",
      metadata: {
        type: "Utility Token",
        artwork: "Abstract Mind",
        rarity: "Common",
      },
      history: [
        {
          date: "2024-09-10",
          action: "Minted",
          details: "Token created and pending approval",
        },
      ],
    },
    {
      id: "TKN-003",
      owner: {
        name: "Carol Davis",
        email: "carol@example.com",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      },
      value: 5.2,
      status: "Locked",
      createdDate: "2024-08-25",
      metadata: {
        type: "Premium Token",
        artwork: "Golden Horizon",
        rarity: "Legendary",
      },
      history: [
        {
          date: "2024-08-25",
          action: "Minted",
          details: "Premium token created",
        },
        {
          date: "2024-09-01",
          action: "Locked",
          details: "Token locked for staking rewards",
        },
      ],
    },
    {
      id: "TKN-004",
      owner: {
        name: "David Wilson",
        email: "david@example.com",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      },
      value: 0.9,
      status: "Burned",
      createdDate: "2024-07-15",
      metadata: {
        type: "Art Token",
        artwork: "Destroyed Canvas",
        rarity: "Common",
      },
      history: [
        { date: "2024-07-15", action: "Minted", details: "Token created" },
        {
          date: "2024-08-20",
          action: "Burned",
          details: "Token permanently destroyed",
        },
      ],
    },
    {
      id: "TKN-005",
      owner: {
        name: "Emma Brown",
        email: "emma@example.com",
        avatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
      },
      value: 3.7,
      status: "Active",
      createdDate: "2024-09-08",
      metadata: {
        type: "Art Token",
        artwork: "Ocean Dreams",
        rarity: "Rare",
      },
      history: [
        {
          date: "2024-09-08",
          action: "Minted",
          details: "Token created for Ocean Dreams artwork",
        },
      ],
    },
    {
      id: "TKN-006",
      owner: {
        name: "Frank Miller",
        email: "frank@example.com",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      },
      value: 7.1,
      status: "Active",
      createdDate: "2024-08-30",
      metadata: {
        type: "Premium Token",
        artwork: "Masterpiece Collection",
        rarity: "Legendary",
      },
      history: [
        {
          date: "2024-08-30",
          action: "Minted",
          details: "Premium token created",
        },
      ],
    },
  ];

  // Mock chart data
  const circulationData = [
    { month: "Jan", tokens: 120 },
    { month: "Feb", tokens: 145 },
    { month: "Mar", tokens: 167 },
    { month: "Apr", tokens: 189 },
    { month: "May", tokens: 234 },
    { month: "Jun", tokens: 267 },
    { month: "Jul", tokens: 298 },
    { month: "Aug", tokens: 324 },
    { month: "Sep", tokens: 356 },
  ];

  const distributionData = [
    { name: "Active", value: 65, color: "#10B981" },
    { name: "Locked", value: 20, color: "#8B5CF6" },
    { name: "Pending", value: 10, color: "#F59E0B" },
    { name: "Burned", value: 5, color: "#EF4444" },
  ];

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const itemsPerPage = 5;

  const statuses = ["All", "Active", "Pending", "Locked", "Burned"];

  // Calculate summary statistics
  const stats = useMemo(() => {
    const totalIssued = mockTokens.length;
    const inCirculation = mockTokens.filter(
      (token) => token.status !== "Burned"
    ).length;
    const totalValue = mockTokens.reduce((sum, token) => sum + token.value, 0);
    const transactions24h = 47; // Mock data

    return {
      totalIssued,
      inCirculation,
      totalValue: totalValue.toFixed(2),
      transactions24h,
    };
  }, [mockTokens]);

  // Filter and search logic
  const filteredTokens = useMemo(() => {
    return mockTokens.filter((token) => {
      const matchesSearch =
        token.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.owner.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || token.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, mockTokens]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTokens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTokens = filteredTokens.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Selection handlers
  const handleSelectToken = (id) => {
    setSelectedTokens((prev) =>
      prev.includes(id)
        ? prev.filter((tokenId) => tokenId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTokens.length === paginatedTokens.length) {
      setSelectedTokens([]);
    } else {
      setSelectedTokens(paginatedTokens.map((token) => token.id));
    }
  };

  // Style helpers
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-50 border-green-200";
      case "Pending":
        return "bg-orange-50 border-orange-200";
      case "Locked":
        return "bg-purple-50 border-purple-200";
      case "Burned":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadge = (status) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "Active":
        return `${baseClass} bg-green-100 text-green-800`;
      case "Pending":
        return `${baseClass} bg-orange-100 text-orange-800`;
      case "Locked":
        return `${baseClass} bg-purple-100 text-purple-800`;
      case "Burned":
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  // Modal handlers
  const openModal = (token) => {
    setSelectedToken(token);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedToken(null);
  };

  // Action handlers
  const handleAction = (action, tokenId) => {
    console.log(`${action} action for token ${tokenId}`);
    alert(`${action} action triggered for token ${tokenId}`);
    if (showModal) closeModal();
  };

  const handleBulkAction = (action) => {
    console.log(`${action} action for tokens:`, selectedTokens);
    alert(`${action} action triggered for ${selectedTokens.length} tokens`);
    setSelectedTokens([]);
  };

  const handleIssueToken = (formData) => {
    console.log("Issue new token:", formData);
    alert("New token issued successfully!");
    setShowIssueModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Token Management
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Tokens Issued
                  </p>
                  <p className="text-3xl font-bold mt-1">{stats.totalIssued}</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Coins className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-blue-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Tokens in Circulation
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.inCirculation}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Value Locked
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.totalValue} ETH
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Transactions (24h)
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.transactions24h}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Token Circulation Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Token Circulation Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={circulationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tokens"
                  stroke="url(#gradient)"
                  strokeWidth={3}
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Token Distribution Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Token Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {distributionData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
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
                  placeholder="Search by Token ID or Owner..."
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
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

            {/* Action Buttons */}
            <div className="flex gap-3 w-full xl:w-auto">
              {selectedTokens.length > 0 && (
                <>
                  <button
                    className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                    onClick={() => handleBulkAction("bulk-lock")}
                  >
                    <Lock className="h-4 w-4" />
                    Lock ({selectedTokens.length})
                  </button>
                  <button
                    className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                    onClick={() => handleBulkAction("bulk-burn")}
                  >
                    <Flame className="h-4 w-4" />
                    Burn ({selectedTokens.length})
                  </button>
                </>
              )}
              <button
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                onClick={() => setShowIssueModal(true)}
              >
                <Plus className="h-4 w-4" />
                Issue New Token
              </button>
            </div>
          </div>
        </div>

        {/* Tokens Table */}
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
                        selectedTokens.length === paginatedTokens.length &&
                        paginatedTokens.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Token ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedTokens.map((token) => (
                  <tr
                    key={token.id}
                    className={`hover:bg-gray-50 transition-all duration-200 border-l-4 ${getStatusColor(
                      token.status
                    )} ${
                      selectedTokens.includes(token.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        checked={selectedTokens.includes(token.id)}
                        onChange={() => handleSelectToken(token.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-mono font-medium text-gray-900">
                          {token.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={token.owner.avatar}
                          alt={token.owner.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {token.owner.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {token.owner.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {token.value} ETH
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(token.status)}>
                        {token.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {token.createdDate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(token)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAction("lock", token.id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
                          title="Lock Token"
                        >
                          <Lock className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAction("burn", token.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
                          title="Burn Token"
                        >
                          <Flame className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAction("transfer", token.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
                          title="Transfer Token"
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                        </button>
                      </div>
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
              {Math.min(startIndex + itemsPerPage, filteredTokens.length)} of{" "}
              {filteredTokens.length} results
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

        {/* Token Detail Modal */}
        {showModal && selectedToken && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      Token Details
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Complete information for {selectedToken.id}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Token Information */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Token Information
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Token ID</p>
                            <p className="font-mono font-semibold text-gray-900">
                              {selectedToken.id}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Value</p>
                            <p className="font-semibold text-gray-900">
                              {selectedToken.value} ETH
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <span
                              className={getStatusBadge(selectedToken.status)}
                            >
                              {selectedToken.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Created Date
                            </p>
                            <p className="font-semibold text-gray-900">
                              {selectedToken.createdDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Metadata
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Type</p>
                            <p className="font-semibold text-gray-900">
                              {selectedToken.metadata.type}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Artwork</p>
                            <p className="font-semibold text-gray-900">
                              {selectedToken.metadata.artwork}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Rarity</p>
                            <p className="font-semibold text-gray-900">
                              {selectedToken.metadata.rarity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transaction History */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Transaction History
                      </h4>
                      <div className="space-y-3">
                        {selectedToken.history.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                              {item.action === "Minted" && (
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                              )}
                              {item.action === "Transfer" && (
                                <ArrowRightLeft className="h-5 w-5 text-green-600" />
                              )}
                              {item.action === "Locked" && (
                                <Lock className="h-5 w-5 text-purple-600" />
                              )}
                              {item.action === "Burned" && (
                                <Flame className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-gray-900">
                                  {item.action}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.date}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600">
                                {item.details}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Owner Information & Actions */}
                  <div className="space-y-6">
                    {/* Owner Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Token Owner
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={selectedToken.owner.avatar}
                            alt={selectedToken.owner.name}
                            className="w-16 h-16 rounded-full object-cover shadow-sm"
                          />
                          <div>
                            <p className="font-semibold text-lg text-gray-900">
                              {selectedToken.owner.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {selectedToken.owner.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Admin Actions
                      </h4>
                      <div className="space-y-3">
                        <button
                          onClick={() => handleAction("lock", selectedToken.id)}
                          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                        >
                          <Lock className="h-4 w-4" />
                          Lock Token
                        </button>
                        <button
                          onClick={() => handleAction("burn", selectedToken.id)}
                          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                        >
                          <Flame className="h-4 w-4" />
                          Burn Token
                        </button>
                        <button
                          onClick={() =>
                            handleAction("transfer", selectedToken.id)
                          }
                          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                          Transfer Token
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Issue Token Modal */}
        {showIssueModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Issue New Token
                  </h2>
                  <button
                    onClick={() => setShowIssueModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleIssueToken({});
                  }}
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Owner Email
                      </label>
                      <input
                        type="email"
                        placeholder="owner@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Token Value (ETH)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="1.5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Token Type
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Art Token</option>
                          <option>Utility Token</option>
                          <option>Premium Token</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rarity
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Common</option>
                          <option>Rare</option>
                          <option>Legendary</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Artwork Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter artwork name..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowIssueModal(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium"
                      >
                        Issue Token
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardToken;
