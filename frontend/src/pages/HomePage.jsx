import { useEffect, useRef, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Loader from "../components/Loader";
import {
  Sparkles,
  Heart,
  TrendingUp,
  Coins,
  Eye,
  ArrowRight,
  LogIn,
  Chrome,
} from "lucide-react";
import Banner from "../components/Banner";
import AboutMerakiNexus from "../components/AboutMerakiNexus";
import { useAuth } from "../contexts/AuthContext";

// Memoized Artwork Card Component - Gallery Style
const ArtworkCard = memo(({ artwork, onClick }) => (
  <button
    onClick={onClick}
    className="group text-left relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg shadow-2xl shadow-purple-900/30 transition-all duration-500 will-change-transform hover:scale-[1.05] hover:shadow-purple-500/40 hover:shadow-3xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 border border-white/10 w-full"
  >
    {/* Gradient Border Effect */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

    {/* Image Section with Overlay */}
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/50">
      <img
        src={artwork.image_url}
        alt={artwork.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

      {/* Price Badge */}
      {artwork.price_per_unit !== undefined && (
        <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-lg border border-white/20">
          {artwork.price_per_unit} ETH
        </div>
      )}

      {/* Classification Badge */}
      {typeof artwork.classification_percentage === "number" && (
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 backdrop-blur-md rounded-full text-xs font-semibold text-white shadow-lg border border-white/20">
          {Math.round(artwork.classification_percentage)}% Match
        </div>
      )}

      {/* Hover Action Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full text-white font-bold shadow-2xl border border-white/30 transform scale-95 group-hover:scale-100 transition-transform duration-500">
          View Details ✨
        </div>
      </div>
    </div>

    {/* Info Section with Glass Effect */}
    <div className="p-5 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
      {/* Title */}
      <h3 className="text-lg font-bold text-white line-clamp-1 mb-2 group-hover:text-purple-200 transition-colors duration-300">
        {artwork.title}
      </h3>

      {/* Artist */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shadow-lg">
          {artwork.artist ? artwork.artist.charAt(0).toUpperCase() : "A"}
        </div>
        <p className="text-sm text-white/90 font-medium line-clamp-1">
          {artwork.artist || "Unknown Artist"}
        </p>
      </div>

      {/* Classification and Availability */}
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="px-2 py-1 bg-white/10 rounded-full border border-white/20">
          {artwork.classification || "Uncategorized"}
        </span>
        {artwork.available !== undefined && (
          <span className="font-semibold">
            {artwork.available > 0
              ? `${artwork.available} Available`
              : "Sold Out"}
          </span>
        )}
      </div>
    </div>

    {/* Shimmer Effect on Hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </div>
  </button>
));

// Feature Card Component
const FeatureCard = memo(({ feature }) => {
  const IconComponent = feature.icon;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-8 shadow-2xl shadow-indigo-950/20 transition-all duration-700 hover:-translate-y-3 hover:bg-white/15 hover:shadow-purple-500/30 hover:border-purple-400/40">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-indigo-500/0 to-purple-500/0 opacity-0 transition-opacity duration-700 group-hover:opacity-15" />

      <div className="relative z-10">
        {/* Icon container */}
        <div className="w-18 h-18 rounded-3xl bg-gradient-to-br from-purple-400 via-indigo-500 to-purple-600 flex items-center justify-center mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl">
          <IconComponent className="w-9 h-9 text-white" />
        </div>

        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-100 transition-colors duration-300">
          {feature.title}
        </h3>

        <p className="text-white/85 leading-relaxed text-lg">
          {feature.description}
        </p>

        {/* Animated bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 scale-x-0 origin-left transition-transform duration-700 group-hover:scale-x-100" />
      </div>
    </div>
  );
});

function HomePage() {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rootRef = useRef(null);
  const authCardRef = useRef(null);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Navigation handlers
  const navigateToGallery = () => {
    window.location.href = "/gallery";
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    console.log("Google login clicked");
  };

  // Load featured artworks from gallery API
  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const response = await fetch(
          "https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          const artworksList = Array.isArray(data.data) ? data.data : [];

          // Sort by price_per_unit in descending order (highest price first)
          const sortedArtworks = artworksList.sort((a, b) => {
            const priceA = a.price_per_unit || 0;
            const priceB = b.price_per_unit || 0;
            return priceB - priceA;
          });

          // Take top 4 most expensive artworks
          setArtworks(sortedArtworks.slice(0, 4));
        } else {
          console.error("Failed to load artworks:", data.message);
          setArtworks([]);
        }
      } catch (error) {
        console.error("Failed to load artworks:", error);
        setArtworks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworks();
  }, []);

  // Auth card animation
  useEffect(() => {
    if (!isAuthenticated && authCardRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          authCardRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }, authCardRef);

      return () => ctx.revert();
    }
  }, [isAuthenticated]);

  // Modal animations
  useEffect(() => {
    if (!modalRef.current || !overlayRef.current) return;

    if (isModalOpen) {
      gsap.set(overlayRef.current, { pointerEvents: "auto" });
      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      ).fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power3.out" },
        "<"
      );
    } else {
      const tl = gsap.timeline({
        onComplete: () =>
          gsap.set(overlayRef.current, { pointerEvents: "none" }),
      });
      tl.to(modalRef.current, {
        opacity: 0,
        scale: 0.97,
        y: 8,
        duration: 0.2,
        ease: "power2.in",
      }).to(
        overlayRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        "<"
      );
    }
  }, [isModalOpen]);

  const openModal = (art) => {
    setSelected(art);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelected(null), 300);
  };

  const platformFeatures = [
    {
      title: "AI Art Generation",
      description:
        "Create stunning artworks with state-of-the-art AI models and neural networks for unlimited creative possibilities.",
      icon: Sparkles,
    },
    {
      title: "Sentiment Analysis",
      description:
        "Deep understanding of emotional resonance across all creative content using advanced machine learning.",
      icon: Heart,
    },
    {
      title: "Aesthetic Scoring",
      description:
        "Quantify visual appeal using sophisticated algorithms trained on millions of artistic masterpieces.",
      icon: TrendingUp,
    },
    {
      title: "Web3 Collectibles",
      description:
        "Mint, trade, and showcase blockchain-verified digital assets with full ownership transparency.",
      icon: Coins,
    },
  ];

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen w-full md:mt-[50px] overflow-x-hidden bg-gradient-to-br from-zinc-900 via-indigo-950 to-black"
    >
      {/* Enhanced ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-white/6 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-fuchsia-400/12 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-cyan-400/8 blur-2xl" />
      </div>

      {/* Hero Section */}
      <Banner />

      {/* Main content container with grid layout */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left/Center (2/3 width) */}
          <div className="lg:col-span-2 space-y-24">
            {/* Featured Artworks Section */}
            <section className="space-y-16">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
                  <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Featured Artworks
                  </h2>
                  <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
                </div>
                <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                  Discover exceptional pieces from our curated collection of
                  AI-enhanced digital masterpieces
                </p>
                {/* Decorative gradient line */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
                  <div className="h-1 w-1 rounded-full bg-purple-400" />
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
                </div>
              </div>

              {/* Artworks grid */}
              {isLoading ? (
                <div className="relative min-h-[400px]">
                  <Loader text="Loading featured artworks..." />
                </div>
              ) : artworks.length > 0 ? (
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                  {artworks.map((artwork) => (
                    <ArtworkCard
                      key={artwork._id || artwork.id}
                      artwork={artwork}
                      onClick={() => openModal(artwork)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-6">
                    <Sparkles className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    No Featured Artworks
                  </h3>
                  <p className="text-white/60 text-lg">
                    Check back soon for amazing new pieces!
                  </p>
                </div>
              )}

              {/* Gallery CTA button */}
              <div className="text-center pt-8">
                <button
                  onClick={navigateToGallery}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 px-12 py-6 text-white font-bold text-xl shadow-2xl shadow-purple-500/30 transition-all duration-500 hover:scale-105 hover:shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-400/50"
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] transition-transform duration-1000 group-hover:translate-x-[200%]" />

                  <div className="relative flex items-center gap-4">
                    Browse Full Gallery
                    <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </button>
              </div>
            </section>

            {/* Features Section */}
            <section className="space-y-16">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-400 animate-pulse" />
                  <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Platform Features
                  </h2>
                  <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
                </div>
                <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                  Experience the future of digital art with our cutting-edge AI
                  and blockchain technology suite
                </p>
                {/* Decorative gradient line */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
                  <div className="h-1 w-1 rounded-full bg-purple-400" />
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
                </div>
              </div>

              <div className="grid gap-10 sm:grid-cols-2">
                {platformFeatures.map((feature, index) => (
                  <FeatureCard
                    key={feature.title}
                    feature={feature}
                    index={index}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Aside Section (1/3 width) - Sticky */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Auth Card */}
              {!isAuthenticated && (
                <div className="space-y-6">
                  <div
                    ref={authCardRef}
                    className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 p-6 shadow-2xl"
                  >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-indigo-600/10 opacity-50" />

                    {/* Decorative blur orbs */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />

                    {/* Header Section */}
                    <div className="relative z-10 border-b border-white/10 pb-5 mb-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                        <h3 className="text-2xl font-extrabold text-center bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent uppercase tracking-wide">
                          Join MerakiNexus
                        </h3>
                        <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
                      </div>
                      <p className="text-center text-white/60 text-xs font-medium">
                        Sign in to explore, create, and collect digital art
                      </p>
                    </div>

                    {/* Buttons Section */}
                    <div className="relative z-10 space-y-3">
                      {/* Login Button */}
                      <button
                        onClick={handleLogin}
                        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-purple-500/20 backdrop-blur-md p-[2px] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                      >
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300">
                          <LogIn className="w-5 h-5" />
                          Login
                        </div>
                      </button>

                      {/* Google Login Button */}
                      <button
                        onClick={handleGoogleLogin}
                        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 hover:border-white/40 hover:bg-white/20"
                      >
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="relative flex items-center justify-center gap-3 text-white font-semibold py-3 px-6">
                          <Chrome className="w-5 h-5" />
                          Continue with Google
                        </div>
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 mt-6 pt-5 border-t border-white/10">
                      <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                        <div className="h-px w-6 bg-gradient-to-r from-transparent to-purple-400/30" />
                        <span>Secure Authentication</span>
                        <div className="h-px w-6 bg-gradient-to-l from-transparent to-purple-400/30" />
                      </div>
                    </div>

                    {/* Decorative corner accents */}
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-purple-400/10 rounded-tr-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-indigo-400/10 rounded-bl-2xl pointer-events-none" />
                  </div>

                  {/* About MerakiNexus Component */}
                  <AboutMerakiNexus />
                </div>
              )}

              {/* If user is authenticated, only show About */}
              {isAuthenticated && <AboutMerakiNexus />}
            </div>
          </aside>
        </div>
      </div>

      {/* Modal */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${
          isModalOpen ? "" : "pointer-events-none opacity-0"
        }`}
        onClick={closeModal}
      >
        <div
          ref={modalRef}
          className="relative mx-4 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 p-6 text-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute right-3 top-3 rounded-md p-2 text-white/80 hover:bg-white/10"
            onClick={closeModal}
            aria-label="Close"
          >
            ×
          </button>
          {selected && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="text-center">
                <h2 className="text-3xl font-bold">{selected.title}</h2>
                <p className="text-white/80 text-xl mt-2">{selected.artist}</p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Image Section */}
                <div className="overflow-hidden rounded-xl bg-black">
                  <img
                    src={selected.image_url}
                    alt={selected.title}
                    className="w-full object-cover"
                  />
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  {/* Pricing & Availability Section */}
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl border border-purple-400/30">
                    <h3 className="text-lg font-semibold mb-3 text-purple-200">
                      Pricing & Availability
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-purple-200 font-medium">
                          Price per Unit:
                        </span>
                        <p className="text-white font-bold text-lg">
                          {selected.price_per_unit} ETH
                        </p>
                      </div>
                      <div>
                        <span className="text-purple-200 font-medium">
                          Available:
                        </span>
                        <p className="text-white font-bold text-lg">
                          {selected.available} units
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-purple-400/20">
                      <span className="text-purple-200 font-medium">
                        Total Value:
                      </span>
                      <p className="text-white font-bold text-xl">
                        ${Number(selected.art_value_usd).toLocaleString()}
                      </p>
                    </div>

                    {/* Buy Now Button */}
                    <div className="mt-4">
                      {isAuthenticated ? (
                        <button
                          onClick={() => {
                            navigate("/order", {
                              state: {
                                artwork: selected,
                                artworkId: selected._id,
                                price: selected.price_per_unit,
                                title: selected.title,
                                artist: selected.artist,
                                available: selected.available,
                              },
                            });
                          }}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                        >
                          🛒 Buy Now - {selected.price_per_unit} ETH
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate("/login")}
                          className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                        >
                          🔐 Login to Purchase
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Artwork Details */}
                  <div className="p-4 bg-white/5 rounded-xl">
                    <h3 className="text-lg font-semibold mb-3">
                      Artwork Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm text-white/90">
                      <div>
                        <span className="text-white/60">Year:</span>{" "}
                        <span className="font-medium">
                          {selected.created_year}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Medium:</span>{" "}
                        <span className="font-medium">{selected.medium}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Classification:</span>{" "}
                        <span className="font-medium">
                          {selected.classification}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Confidence:</span>{" "}
                        <span className="font-medium">
                          {Math.round(selected.classification_percentage)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Artist Information */}
                  {selected.user && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h3 className="text-lg font-semibold mb-3">
                        Artist Information
                      </h3>
                      <div className="text-sm text-white/90 space-y-2">
                        <p>
                          <span className="text-white/60">Name:</span>{" "}
                          <span className="font-medium">
                            {selected.user.name}
                          </span>
                        </p>
                        <p>
                          <span className="text-white/60">Email:</span>{" "}
                          <span className="font-medium">
                            {selected.user.email}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Scores Section */}
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">
                  AI Analysis Scores
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {selected.scores &&
                    Object.entries(selected.scores).map(([key, value]) => (
                      <div
                        key={key}
                        className="text-center p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <p className="text-xs text-white/60 capitalize mb-1">
                          {key.replaceAll("_", " ")}
                        </p>
                        <p className="text-lg font-bold text-white">
                          {Number(value).toFixed(2)}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Tags Section */}
              {selected.tags && selected.tags.length > 0 && (
                <div className="p-4 bg-white/5 rounded-xl">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-200 text-sm rounded-full border border-purple-400/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps Section */}
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-white/70">
                  <div>
                    <span className="text-white/60">Created:</span>
                    <p className="font-medium">
                      {new Date(selected.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60">Last Updated:</span>
                    <p className="font-medium">
                      {new Date(selected.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
