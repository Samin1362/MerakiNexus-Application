import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAccessToken } from "../utils/auth";
import {
  ShoppingCart,
  Wallet,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Get artwork data from navigation state
  const artworkData = location.state;

  // Form state
  const [formData, setFormData] = useState({
    quantity: 1,
    senderAddress: "",
    receiverAddress: "",
    senderPrivateKey: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  // Redirect if not authenticated or no artwork data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!artworkData) {
      navigate("/gallery");
      return;
    }
  }, [isAuthenticated, artworkData, navigate]);

  // Calculate total amount
  const totalAmount = artworkData
    ? (artworkData.price * formData.quantity).toFixed(6)
    : "0";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (error) setError("");
  };

  const validateForm = () => {
    if (
      !formData.senderAddress ||
      !formData.receiverAddress ||
      !formData.senderPrivateKey
    ) {
      setError("Please fill in all required fields.");
      return false;
    }

    if (formData.quantity < 1 || formData.quantity > artworkData.available) {
      setError(`Quantity must be between 1 and ${artworkData.available}.`);
      return false;
    }

    // Basic wallet address validation (Ethereum addresses start with 0x and are 42 characters)
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(formData.senderAddress)) {
      setError("Invalid sender wallet address format.");
      return false;
    }

    if (!addressRegex.test(formData.receiverAddress)) {
      setError("Invalid receiver wallet address format.");
      return false;
    }

    // Basic private key validation (64 hex characters)
    const privateKeyRegex = /^[a-fA-F0-9]{64}$/;
    if (!privateKeyRegex.test(formData.senderPrivateKey)) {
      setError(
        "Invalid private key format. Must be 64 hexadecimal characters."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const payload = {
        nexus: artworkData.artworkId,
        user: user?.id || user?._id,
        quantity: parseInt(formData.quantity),
        sender: formData.senderAddress,
        receiver: formData.receiverAddress,
        amount: totalAmount,
        senderPrivateKey: formData.senderPrivateKey,
      };

      console.log("🚀 Order payload:", {
        ...payload,
        senderPrivateKey: "[HIDDEN]",
      });

      const response = await fetch(
        "https://meraki-nexus-api.vercel.app/meraki-nexus-api/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken.replace(/^Bearer\s+/i, ""),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("📥 Order response:", data);

      if (response.ok && data.success) {
        setOrderSuccess(true);
        setOrderData(data.data);
        console.log("✅ Order completed successfully:", data.data);
      } else {
        setError(data.message || "Order failed. Please try again.");
        console.error("❌ Order failed:", data);
      }
    } catch (err) {
      console.error("❌ Order error:", err);
      setError(
        "Unable to process order. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if no artwork data
  if (!artworkData) {
    return null;
  }

  // Success screen
  if (orderSuccess && orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Completed Successfully!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Your order has been placed and the artwork ownership has been
            transferred.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Order ID:</span> {orderData._id}
              </p>
              <p>
                <span className="font-medium">Artwork:</span>{" "}
                {artworkData.title}
              </p>
              <p>
                <span className="font-medium">Artist:</span>{" "}
                {artworkData.artist}
              </p>
              <p>
                <span className="font-medium">Quantity:</span>{" "}
                {orderData.quantity}
              </p>
              <p>
                <span className="font-medium">Total Amount:</span> {totalAmount}{" "}
                ETH
              </p>
              <p>
                <span className="font-medium">Order Date:</span>{" "}
                {new Date(orderData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/gallery")}
              className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
            >
              Back to Gallery
            </button>
            <button
              onClick={() => navigate("/artist-dashboard")}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/gallery")}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Complete Your Order</h1>
            <p className="text-white/70">Secure blockchain transaction</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Artwork Summary */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Order Summary
            </h2>

            <div className="flex gap-4 mb-6">
              <img
                src={artworkData.artwork?.image_url}
                alt={artworkData.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-lg font-bold">{artworkData.title}</h3>
                <p className="text-white/70">by {artworkData.artist}</p>
                <p className="text-sm text-white/60 mt-1">
                  {artworkData.price} ETH per unit
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Price per unit:</span>
                <span>{artworkData.price} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>{formData.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Available units:</span>
                <span>{artworkData.available}</span>
              </div>
              <div className="border-t border-white/20 pt-3 flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span>{totalAmount} ETH</span>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Payment Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  max={artworkData.available}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 focus:bg-white/15"
                  required
                />
              </div>

              {/* Sender Address */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Wallet Address (Sender)
                </label>
                <input
                  type="text"
                  name="senderAddress"
                  value={formData.senderAddress}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 focus:bg-white/15 font-mono text-sm"
                  required
                />
              </div>

              {/* Receiver Address */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Artist Wallet Address (Receiver)
                </label>
                <input
                  type="text"
                  name="receiverAddress"
                  value={formData.receiverAddress}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 focus:bg-white/15 font-mono text-sm"
                  required
                />
              </div>

              {/* Private Key */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Private Key
                </label>
                <div className="relative">
                  <input
                    type={showPrivateKey ? "text" : "password"}
                    name="senderPrivateKey"
                    value={formData.senderPrivateKey}
                    onChange={handleInputChange}
                    placeholder="Enter your MetaMask private key"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 focus:bg-white/15 font-mono text-sm pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPrivateKey ? "🙈" : "👁️"}
                  </button>
                </div>
                <p className="text-xs text-white/60 mt-1">
                  ⚠️ Your private key is used for transaction signing and is not
                  stored.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing Transaction...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Complete Purchase - {totalAmount} ETH
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
