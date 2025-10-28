import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAccessToken } from "../utils/auth";
import Loader from "../components/Loader";
import {
  User,
  ShoppingBag,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Clock,
  Star,
  TrendingUp,
  Eye,
  Package,
} from "lucide-react";

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user's orders/owned artworks
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const accessToken = getAccessToken();

        if (!accessToken) {
          setError("Authentication token not found. Please login again.");
          setLoading(false);
          return;
        }

        const userId = user?.id || user?._id;
        console.log("🔍 Fetching orders for user:", userId);

        const response = await fetch(
          `https://meraki-nexus-api.vercel.app/meraki-nexus-api/order/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: accessToken.replace(/^Bearer\s+/i, ""),
            },
          }
        );

        const data = await response.json();
        console.log("📥 User orders response:", data);

        if (response.ok && data.success) {
          setOrders(Array.isArray(data.data) ? data.data : []);
          console.log(
            "✅ Orders loaded successfully:",
            data.data.length,
            "orders"
          );
        } else {
          setError(data.message || "Failed to load your orders.");
          console.error("❌ API Error:", data);
        }
      } catch (err) {
        console.error("❌ Network Error:", err);
        setError("Unable to connect to server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [isAuthenticated, user]);

  // Calculate dashboard stats
  const dashboardStats = {
    totalArtworks: orders.length,
    totalSpent: orders.reduce(
      (sum, order) => sum + order.nexus?.price_per_unit * order.quantity,
      0
    ),
    totalQuantity: orders.reduce((sum, order) => sum + order.quantity, 0),
    averagePrice:
      orders.length > 0
        ? orders.reduce((sum, order) => sum + order.nexus?.price_per_unit, 0) /
          orders.length
        : 0,
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  if (loading) {
    return <Loader text="Loading your collection..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-blue-400/5 blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName || user?.name || "User"}!
          </h1>
          <p className="text-xl text-white/80">Your Personal Art Collection</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/30 rounded-xl">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Artworks Owned</p>
                <p className="text-2xl font-bold">
                  {dashboardStats.totalArtworks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/30 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Total Invested</p>
                <p className="text-2xl font-bold">
                  {dashboardStats.totalSpent.toFixed(4)} ETH
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/30 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Total Quantity</p>
                <p className="text-2xl font-bold">
                  {dashboardStats.totalQuantity}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Avg. Price</p>
                <p className="text-2xl font-bold">
                  {dashboardStats.averagePrice.toFixed(4)} ETH
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold mb-4">No Artworks Yet</h3>
            <p className="text-white/70 text-lg mb-6">
              You haven't purchased any artworks yet. Start building your
              collection!
            </p>
            <button
              onClick={() => (window.location.href = "/gallery")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Browse Gallery
            </button>
          </div>
        ) : (
          <>
            {/* Collection Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">My Art Collection</h2>
              <p className="text-white/70">
                {orders.length} artwork{orders.length !== 1 ? "s" : ""} owned
              </p>
            </div>

            {/* Artworks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="group bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  onClick={() => openModal(order)}
                >
                  {/* Artwork Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={order.nexus?.image_url}
                      alt={order.nexus?.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Owned Badge */}
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      OWNED
                    </div>

                    {/* Quick Info Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-full bg-white/90 text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-white transition-colors">
                        <Eye className="w-4 h-4 inline mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Artwork Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1 truncate">
                      {order.nexus?.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-2">
                      by {order.nexus?.artist}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">
                        Qty: {order.quantity}
                      </span>
                      <span className="text-green-400 font-medium">
                        {order.nexus?.price_per_unit} ETH
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-white/50">
                      Purchased:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detailed Modal */}
      {isModalOpen && selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 rounded-2xl p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 rounded-md p-2 text-white/80 hover:bg-white/10"
              onClick={closeModal}
            >
              ×
            </button>

            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-3xl font-bold">
                  {selectedOrder.nexus?.title}
                </h2>
                <p className="text-white/80 text-xl mt-2">
                  by {selectedOrder.nexus?.artist}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Image */}
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={selectedOrder.nexus?.image_url}
                    alt={selectedOrder.nexus?.title}
                    className="w-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {/* Ownership Info */}
                  <div className="p-4 bg-green-500/20 rounded-xl border border-green-400/30">
                    <h3 className="text-lg font-semibold mb-3 text-green-200">
                      Ownership Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Quantity Owned:</span>
                        <span className="font-bold">
                          {selectedOrder.quantity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Purchase Price:</span>
                        <span className="font-bold">
                          {selectedOrder.nexus?.price_per_unit} ETH
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Paid:</span>
                        <span className="font-bold">
                          {(
                            selectedOrder.nexus?.price_per_unit *
                            selectedOrder.quantity
                          ).toFixed(4)}{" "}
                          ETH
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Purchase Date:</span>
                        <span className="font-bold">
                          {new Date(
                            selectedOrder.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Artwork Details */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="text-lg font-semibold mb-3">
                      Artwork Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-white/60">Year:</span>
                        <p className="font-medium">
                          {selectedOrder.nexus?.created_year}
                        </p>
                      </div>
                      <div>
                        <span className="text-white/60">Medium:</span>
                        <p className="font-medium">
                          {selectedOrder.nexus?.medium}
                        </p>
                      </div>
                      <div>
                        <span className="text-white/60">Classification:</span>
                        <p className="font-medium">
                          {selectedOrder.nexus?.classification}
                        </p>
                      </div>
                      <div>
                        <span className="text-white/60">Confidence:</span>
                        <p className="font-medium">
                          {Math.round(
                            selectedOrder.nexus?.classification_percentage
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Scores */}
                  {selectedOrder.nexus?.scores && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h3 className="text-lg font-semibold mb-3">
                        AI Analysis Scores
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(selectedOrder.nexus.scores).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="text-center p-3 bg-white/5 rounded-lg"
                            >
                              <p className="text-xs text-white/60 capitalize mb-1">
                                {key.replaceAll("_", " ")}
                              </p>
                              <p className="text-lg font-bold">
                                {Number(value).toFixed(2)}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedOrder.nexus?.tags &&
                    selectedOrder.nexus.tags.length > 0 && (
                      <div className="p-4 bg-white/5 rounded-xl">
                        <h3 className="text-lg font-semibold mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedOrder.nexus.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-500/20 text-blue-200 text-sm rounded-full border border-blue-400/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
