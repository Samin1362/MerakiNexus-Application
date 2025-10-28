import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAccessToken } from "../utils/auth";
import Loader from "../components/Loader";
import {
  ShoppingCart,
  Wallet,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Link as LinkIcon,
  AlertTriangle,
  Info,
  Sparkles,
  User,
  Lock,
  TrendingUp,
  DollarSign,
  Package,
  Image as ImageIcon,
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

  // MetaMask states
  const [isLoading, setIsLoading] = useState(true);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [metaMaskAccount, setMetaMaskAccount] = useState("");

  // Refs for animations
  const rootRef = React.useRef(null);
  const headerRef = React.useRef(null);
  const orderSummaryRef = React.useRef(null);
  const fieldsRef = React.useRef([]);

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

  // MetaMask detection and initialization
  useEffect(() => {
    const detectMetaMask = async () => {
      try {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== "undefined") {
          console.log("✅ MetaMask detected");
          setHasMetaMask(true);

          // Check if already connected
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length > 0) {
            console.log("✅ MetaMask already connected:", accounts[0]);
            setIsMetaMaskConnected(true);
            setMetaMaskAccount(accounts[0]);
            setFormData((prev) => ({
              ...prev,
              senderAddress: accounts[0],
            }));
          }

          // Listen for account changes
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              console.log("🔄 Account changed:", accounts[0]);
              setMetaMaskAccount(accounts[0]);
              setFormData((prev) => ({
                ...prev,
                senderAddress: accounts[0],
              }));
            } else {
              console.log("❌ MetaMask disconnected");
              setIsMetaMaskConnected(false);
              setMetaMaskAccount("");
              setFormData((prev) => ({
                ...prev,
                senderAddress: "",
              }));
            }
          });
        } else {
          console.log("❌ MetaMask not detected");
          setHasMetaMask(false);
        }
      } catch (error) {
        console.error("❌ MetaMask detection error:", error);
        setHasMetaMask(false);
      }
    };

    // Always initialize and stop loading, even if conditions aren't met
    const initializePage = async () => {
      if (isAuthenticated && artworkData) {
        await detectMetaMask();
      }

      // Always stop loading after initialization (with small delay for smooth UX)
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    initializePage();

    // Cleanup
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, [isAuthenticated, artworkData]);

  // Connect to MetaMask
  const connectMetaMask = async () => {
    try {
      console.log("🔗 Connecting to MetaMask...");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        console.log("✅ Connected to MetaMask:", accounts[0]);
        setIsMetaMaskConnected(true);
        setMetaMaskAccount(accounts[0]);
        setFormData((prev) => ({
          ...prev,
          senderAddress: accounts[0],
        }));
      }
    } catch (error) {
      console.error("❌ MetaMask connection error:", error);
      setError(
        error.message || "Failed to connect to MetaMask. Please try again."
      );
    }
  };

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

  // Show loader while checking MetaMask
  if (isLoading) {
    return <Loader text="Initializing Order Page..." />;
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
    <div
      ref={rootRef}
      className="min-h-screen w-full bg-gradient-to-br md:mt-[50px] from-zinc-900 via-indigo-950 to-black text-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header ref={headerRef} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/gallery")}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 mb-3">
            <ShoppingCart className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Complete Your Order
            </h1>
            <Sparkles className="w-8 h-8 text-pink-400 animate-pulse-slow" />
          </div>
          <p className="text-center text-lg text-white/80 max-w-2xl mx-auto">
            Secure blockchain transaction for your digital artwork purchase
          </p>
        </header>

        {/* Marquee Warning Banner */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600/20 via-orange-600/20 to-red-600/20 border-2 border-red-500/50 backdrop-blur-sm">
          <div className="marquee-container py-4 px-4">
            <div className="marquee-content flex items-center gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 whitespace-nowrap"
                >
                  <AlertTriangle className="w-5 h-5 text-orange-300 flex-shrink-0" />
                  <span className="text-white font-semibold">
                    IMPORTANT: Your private key is required for server-side
                    transaction processing
                  </span>
                  <span className="text-orange-200">•</span>
                  <span className="text-white/90">
                    It will NOT be stored or shared
                  </span>
                  <span className="text-orange-200">•</span>
                  <AlertTriangle className="w-5 h-5 text-orange-300 flex-shrink-0" />
                  <span className="text-white font-semibold">
                    Export your key from MetaMask: Account Details → Export
                    Private Key
                  </span>
                  <span className="text-orange-200">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Summary (Sticky) */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div
              ref={orderSummaryRef}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/10 shadow-2xl shadow-purple-900/30"
            >
              {/* Artwork Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={artworkData.artwork?.image_url}
                  alt={artworkData.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Price Badge */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-white" />
                    <span className="text-white font-bold">
                      {artworkData.price} ETH
                    </span>
                  </div>
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Artwork Details</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {artworkData.title}
                  </h3>
                  <p className="text-white/80">by {artworkData.artist}</p>
                </div>
              </div>

              {/* Order Details Card */}
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-400" />
                  Order Summary
                </h2>

                <div className="space-y-3">
                  {/* Price per unit */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 text-white/80">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span>Price per unit</span>
                    </div>
                    <span className="font-semibold text-white">
                      {artworkData.price} ETH
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 text-white/80">
                      <Package className="w-4 h-4 text-indigo-400" />
                      <span>Quantity</span>
                    </div>
                    <span className="font-semibold text-white">
                      {formData.quantity}
                    </span>
                  </div>

                  {/* Available */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 text-white/80">
                      <ShoppingCart className="w-4 h-4 text-pink-400" />
                      <span>Available units</span>
                    </div>
                    <span className="font-semibold text-white">
                      {artworkData.available}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl border-2 border-purple-400/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-purple-300" />
                        <span className="text-lg font-bold text-white">
                          Total Amount
                        </span>
                      </div>
                      <span className="text-2xl font-extrabold text-white">
                        {totalAmount} ETH
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mt-2">
                      Final amount to be transferred
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="space-y-6">
            {/* MetaMask Connection Card */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/10 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-orange-400" />
                Wallet Connection
              </h2>

              {hasMetaMask ? (
                <div>
                  {isMetaMaskConnected ? (
                    <div className="bg-green-500/20 border border-green-400/50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-200 mb-1">
                            MetaMask Connected
                          </h3>
                          <p className="text-sm text-green-100/80 break-all font-mono">
                            {metaMaskAccount}
                          </p>
                          <p className="text-xs text-green-100/60 mt-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Sender address auto-filled
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={connectMetaMask}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl hover:shadow-orange-500/50 transform hover:scale-[1.02]"
                    >
                      <LinkIcon className="w-5 h-5" />
                      Connect MetaMask Wallet
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-yellow-200 mb-1">
                        MetaMask Not Detected
                      </h3>
                      <p className="text-sm text-yellow-100/80 mb-2">
                        MetaMask extension is not installed. You can still
                        proceed by manually entering your wallet address.
                      </p>
                      <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-yellow-200 hover:text-yellow-100 font-semibold underline"
                      >
                        Install MetaMask →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Details Card */}
              <div
                ref={(el) => (fieldsRef.current[0] = el)}
                className="rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/10 p-6 shadow-xl"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                  Transaction Details
                </h2>
                <div className="space-y-4">
                  {/* Quantity */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                      <Package className="w-4 h-4 text-purple-400" />
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="1"
                      max={artworkData.available}
                      className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-white/40 transition-all duration-300 focus:border-purple-400 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20"
                      required
                    />
                  </div>

                  {/* Sender Address */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                      <User className="w-4 h-4 text-pink-400" />
                      Your Wallet Address (Sender)
                      {isMetaMaskConnected && (
                        <span className="text-xs bg-green-500/30 text-green-200 px-2 py-0.5 rounded-full">
                          Auto-filled
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="senderAddress"
                      value={formData.senderAddress}
                      onChange={handleInputChange}
                      placeholder="0x..."
                      className={`w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-white/40 transition-all duration-300 font-mono text-sm ${
                        isMetaMaskConnected
                          ? "bg-green-500/10 border-green-400/30 focus:border-green-400"
                          : "focus:border-pink-400 focus:bg-white/10 focus:shadow-lg focus:shadow-pink-500/20"
                      }`}
                      readOnly={isMetaMaskConnected}
                      required
                    />
                    {isMetaMaskConnected && (
                      <p className="text-xs text-green-200/80 mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Connected via MetaMask
                      </p>
                    )}
                  </div>

                  {/* Receiver Address */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                      <User className="w-4 h-4 text-indigo-400" />
                      Artist Wallet Address (Receiver)
                    </label>
                    <input
                      type="text"
                      name="receiverAddress"
                      value={formData.receiverAddress}
                      onChange={handleInputChange}
                      placeholder="0x..."
                      className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-white/40 transition-all duration-300 focus:border-indigo-400 focus:bg-white/10 focus:shadow-lg focus:shadow-indigo-500/20 font-mono text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Security Verification Card */}
              <div
                ref={(el) => (fieldsRef.current[1] = el)}
                className="rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/10 p-6 shadow-xl"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-400" />
                  Security Verification
                </h2>

                {/* Private Key Info Box */}
                <div className="bg-blue-500/20 border border-blue-400/50 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <h4 className="font-semibold text-blue-200 mb-1">
                        Why do we need your private key?
                      </h4>
                      <p className="text-blue-100/80">
                        Our backend API requires your private key to process the
                        blockchain transaction on your behalf. Your private key
                        is used only for signing this transaction and is{" "}
                        <strong>not stored</strong> anywhere.
                      </p>
                      <p className="text-xs text-blue-100/60 mt-2">
                        💡 To export your private key from MetaMask: Click
                        MetaMask → Account Details → Export Private Key
                      </p>
                    </div>
                  </div>
                </div>

                {/* Private Key Input */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                    <Lock className="w-4 h-4 text-red-400" />
                    Your Private Key (Required)
                  </label>
                  <div className="relative">
                    <input
                      type={showPrivateKey ? "text" : "password"}
                      name="senderPrivateKey"
                      value={formData.senderPrivateKey}
                      onChange={handleInputChange}
                      placeholder="64 hexadecimal characters (without 0x prefix)"
                      className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-white/40 transition-all duration-300 focus:border-red-400 focus:bg-white/10 focus:shadow-lg focus:shadow-red-500/20 font-mono text-sm pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors text-xl"
                    >
                      {showPrivateKey ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <p className="text-xs text-white/60 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Used for secure transaction signing only
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-500/20 border-2 border-red-500/50 rounded-xl text-red-200 shadow-xl animate-pulse">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                ref={(el) => (fieldsRef.current[2] = el)}
                className={`w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl ${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-purple-500/50 hover:shadow-purple-500/70"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                    <span>Processing Transaction...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    <span>Complete Purchase ({totalAmount} ETH)</span>
                    <Sparkles className="w-5 h-5 animate-pulse-slow" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Marquee Animation CSS */}
        <style jsx>{`
          @keyframes marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-33.333%);
            }
          }

          .marquee-content {
            animation: marquee 20s linear infinite;
          }

          .marquee-container:hover .marquee-content {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </div>
  );
};

export default OrderPage;
