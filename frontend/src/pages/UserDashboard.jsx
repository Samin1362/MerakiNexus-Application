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
  Sparkles,
  Award,
  Newspaper,
  X,
  Crown,
  Palette,
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

        if (response.ok && data.success) {
          setOrders(Array.isArray(data.data) ? data.data : []);
        } else {
          setError(data.message || "Failed to load your orders.");
        }
      } catch {
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
    <div className="min-h-screen w-full bg-gradient-to-br md:mt-[50px] from-zinc-900 via-indigo-950 to-black text-white overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-indigo-600/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Stunning Header Section */}
        <header className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 relative">
              <Crown className="w-12 h-12 text-white animate-pulse-slow" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full blur-xl opacity-50 animate-ping-slow" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse-slow" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Welcome back, {user?.firstName || user?.name || "Collector"}!
            </h1>
            <Sparkles className="w-8 h-8 text-pink-400 animate-pulse-slow" />
          </div>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Your exclusive collection of digital masterpieces
          </p>
        </header>

        {/* Stunning Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1 - Artworks Owned */}
          <div className="relative group rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-xl border border-purple-400/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-purple-200/80 text-sm font-medium mb-1">
                  Artworks Owned
                </p>
                <p className="text-4xl font-extrabold text-white">
                  {dashboardStats.totalArtworks}
                </p>
              </div>
              <div className="p-4 bg-purple-500/30 rounded-xl">
                <ImageIcon className="w-8 h-8 text-purple-200" />
              </div>
            </div>
          </div>

          {/* Card 2 - Total Invested */}
          <div className="relative group rounded-2xl bg-gradient-to-br from-emerald-600/30 to-green-600/30 backdrop-blur-xl border border-emerald-400/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/10 group-hover:to-green-500/10 transition-all duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-emerald-200/80 text-sm font-medium mb-1">
                  Total Invested
                </p>
                <p className="text-4xl font-extrabold text-white">
                  {dashboardStats.totalSpent.toFixed(4)}
                </p>
                <p className="text-emerald-200/60 text-xs mt-1">ETH</p>
              </div>
              <div className="p-4 bg-emerald-500/30 rounded-xl">
                <DollarSign className="w-8 h-8 text-emerald-200" />
              </div>
            </div>
          </div>

          {/* Card 3 - Total Quantity */}
          <div className="relative group rounded-2xl bg-gradient-to-br from-pink-600/30 to-rose-600/30 backdrop-blur-xl border border-pink-400/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/10 group-hover:to-rose-500/10 transition-all duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-pink-200/80 text-sm font-medium mb-1">
                  Total Quantity
                </p>
                <p className="text-4xl font-extrabold text-white">
                  {dashboardStats.totalQuantity}
                </p>
              </div>
              <div className="p-4 bg-pink-500/30 rounded-xl">
                <Package className="w-8 h-8 text-pink-200" />
              </div>
            </div>
          </div>

          {/* Card 4 - Average Price */}
          <div className="relative group rounded-2xl bg-gradient-to-br from-amber-600/30 to-orange-600/30 backdrop-blur-xl border border-amber-400/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-amber-200/80 text-sm font-medium mb-1">
                  Avg. Price
                </p>
                <p className="text-4xl font-extrabold text-white">
                  {dashboardStats.averagePrice.toFixed(4)}
                </p>
                <p className="text-amber-200/60 text-xs mt-1">ETH</p>
              </div>
              <div className="p-4 bg-amber-500/30 rounded-xl">
                <TrendingUp className="w-8 h-8 text-amber-200" />
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
          <div className="text-center py-16 px-4">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10">
                <Palette className="w-16 h-16 text-purple-300 animate-pulse-slow" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-ping-slow" />
            </div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Your Collection Awaits
            </h3>
            <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
              You haven't purchased any artworks yet. Start building your
              exclusive collection of digital masterpieces!
            </p>
            <button
              onClick={() => (window.location.href = "/gallery")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/50"
            >
              <Sparkles className="w-5 h-5" />
              Browse Gallery
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            {/* Collection Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-8 h-8 text-purple-400" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  My Art Collection
                </h2>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                <p className="text-white/80 font-semibold">
                  {orders.length} {orders.length !== 1 ? "artworks" : "artwork"}
                </p>
              </div>
            </div>

            {/* Stunning Artworks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="group relative rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/30"
                  onClick={() => openModal(order)}
                >
                  {/* Shimmer Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                  {/* Artwork Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={order.nexus?.image_url}
                      alt={order.nexus?.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {/* Owned Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                      <span className="text-white text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        OWNED
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-purple-500/90 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                      <span className="text-white text-xs font-bold">
                        {order.nexus?.price_per_unit} ETH
                      </span>
                    </div>

                    {/* Quick View Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="px-6 py-3 bg-white/95 backdrop-blur-md text-gray-900 rounded-xl font-bold shadow-xl hover:bg-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        View Details
                      </button>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white mb-1 truncate">
                        {order.nexus?.title}
                      </h3>
                      <p className="text-white/90 text-sm flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {order.nexus?.artist}
                      </p>
                    </div>
                  </div>

                  {/* Info Card Section */}
                  <div className="p-4 space-y-3">
                    {/* Classification Badge */}
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-lg text-indigo-200 text-xs font-semibold">
                        {order.nexus?.classification || "Digital Art"}
                      </span>
                      <span className="text-white/60 text-xs">
                        Qty: {order.quantity}
                      </span>
                    </div>

                    {/* Purchase Info */}
                    <div className="flex items-center justify-between text-xs text-white/60 pt-2 border-t border-white/10">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <TrendingUp className="w-3 h-3" />
                        Owned
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Stunning Detailed Modal */}
      {isModalOpen && selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-zinc-900 via-indigo-950 to-black rounded-3xl p-8 text-white shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:rotate-90 z-10"
              onClick={closeModal}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="space-y-8">
              {/* Header */}
              <div className="text-center pb-6 border-b border-white/10">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full">
                  <Star className="w-4 h-4 text-emerald-300 fill-emerald-300" />
                  <span className="text-emerald-200 text-sm font-semibold">
                    In Your Collection
                  </span>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3">
                  {selectedOrder.nexus?.title}
                </h2>
                <p className="text-white/80 text-xl flex items-center justify-center gap-2">
                  <User className="w-5 h-5" />
                  by {selectedOrder.nexus?.artist}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 p-2">
                  <img
                    src={selectedOrder.nexus?.image_url}
                    alt={selectedOrder.nexus?.title}
                    className="w-full object-cover rounded-xl shadow-2xl"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-purple-500/90 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                    <span className="text-white text-sm font-bold">
                      {selectedOrder.nexus?.price_per_unit} ETH
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  {/* Ownership Info */}
                  <div className="p-6 bg-gradient-to-br from-emerald-600/30 to-green-600/30 rounded-2xl border border-emerald-400/30 shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-6 h-6 text-emerald-300" />
                      <h3 className="text-xl font-bold text-emerald-200">
                        Ownership Details
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Quantity Owned
                        </span>
                        <span className="font-bold text-white text-lg">
                          {selectedOrder.quantity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Purchase Price
                        </span>
                        <span className="font-bold text-white text-lg">
                          {selectedOrder.nexus?.price_per_unit} ETH
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Total Paid
                        </span>
                        <span className="font-bold text-white text-lg">
                          {(
                            selectedOrder.nexus?.price_per_unit *
                            selectedOrder.quantity
                          ).toFixed(4)}{" "}
                          ETH
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-emerald-500/20 rounded-lg border border-emerald-400/30 mt-4">
                        <span className="text-emerald-200 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Purchase Date
                        </span>
                        <span className="font-bold text-emerald-100">
                          {new Date(
                            selectedOrder.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Artwork Details */}
                  <div className="p-6 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-2xl border border-indigo-400/30 shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-6 h-6 text-indigo-300" />
                      <h3 className="text-xl font-bold text-indigo-200">
                        Artwork Details
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <span className="text-white/60 text-xs block mb-1">
                          Year
                        </span>
                        <p className="font-bold text-white text-lg">
                          {selectedOrder.nexus?.created_year || "N/A"}
                        </p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <span className="text-white/60 text-xs block mb-1">
                          Medium
                        </span>
                        <p className="font-bold text-white text-lg">
                          {selectedOrder.nexus?.medium || "Digital"}
                        </p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <span className="text-white/60 text-xs block mb-1">
                          Classification
                        </span>
                        <p className="font-bold text-white text-lg">
                          {selectedOrder.nexus?.classification || "Art"}
                        </p>
                      </div>
                      <div className="p-3 bg-indigo-500/20 rounded-lg border border-indigo-400/30">
                        <span className="text-indigo-200 text-xs block mb-1">
                          Confidence
                        </span>
                        <p className="font-bold text-indigo-100 text-lg">
                          {Math.round(
                            selectedOrder.nexus?.classification_percentage || 0
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Scores */}
                  {selectedOrder.nexus?.scores && (
                    <div className="p-6 bg-gradient-to-br from-pink-600/30 to-rose-600/30 rounded-2xl border border-pink-400/30 shadow-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="w-6 h-6 text-pink-300" />
                        <h3 className="text-xl font-bold text-pink-200">
                          AI Analysis Scores
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedOrder.nexus.scores).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300"
                            >
                              <p className="text-xs text-white/60 capitalize mb-2">
                                {key.replaceAll("_", " ")}
                              </p>
                              <p className="text-2xl font-bold text-white">
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
                      <div className="p-6 bg-gradient-to-br from-amber-600/30 to-yellow-600/30 rounded-2xl border border-amber-400/30 shadow-xl">
                        <h3 className="text-xl font-bold text-amber-200 mb-4">
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {selectedOrder.nexus.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-white/10 backdrop-blur-md text-white text-sm font-semibold rounded-full border border-amber-400/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                              #{tag}
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
