import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/auth";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import { SearchBar } from "../components/shared";
import ArtNotFound from "../components/ArtNotFound";

gsap.registerPlugin(ScrollTrigger);

function GalleryPage() {
  const [artworks, setArtworks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const rootRef = useRef(null);
  const cardsRef = useRef([]);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const headerRef = useRef(null);
  const searchBarRef = useRef(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const accessToken = getAccessToken();

  // Filter artworks based on search term
  const filteredArtworks = useMemo(() => {
    if (!searchTerm.trim()) {
      return artworks;
    }

    const searchLower = searchTerm.toLowerCase();
    return artworks.filter((artwork) => {
      const titleMatch = artwork.title?.toLowerCase().includes(searchLower);
      const artistMatch = artwork.artistName
        ?.toLowerCase()
        .includes(searchLower);
      const categoryMatch = artwork.category
        ?.toLowerCase()
        .includes(searchLower);
      const descriptionMatch = artwork.description
        ?.toLowerCase()
        .includes(searchLower);

      return titleMatch || artistMatch || categoryMatch || descriptionMatch;
    });
  }, [artworks, searchTerm]);

  // Clear search handler
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Fetch artworks from API
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        console.log("🎨 Fetching artworks from API...");

        // Always fetch from API now
        const res = await fetch(
          "https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Include auth token if available for authenticated requests
              ...(accessToken && {
                Authorization: accessToken.replace(/^Bearer\s+/i, ""),
              }),
            },
          }
        );

        const data = await res.json();
        console.log("📥 API Response:", data);

        if (res.ok && data.success) {
          setArtworks(Array.isArray(data.data) ? data.data : []);
          console.log(
            "✅ Artworks loaded successfully:",
            data.data.length,
            "items"
          );
        } else {
          setError(data.message || "Failed to load artworks.");
          console.error("❌ API Error:", data);
        }
      } catch (err) {
        console.error("❌ Network Error:", err);
        setError("Unable to connect to server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [accessToken]);

  // Header entrance animation
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          {
            opacity: 0,
            y: -30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }

      if (searchBarRef.current) {
        gsap.fromTo(
          searchBarRef.current,
          {
            opacity: 0,
            scale: 0.95,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.3,
            ease: "back.out(1.7)",
          }
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [loading]);

  // Enhanced Card animations with rotation and scale
  useEffect(() => {
    if (!Array.isArray(filteredArtworks) || filteredArtworks.length === 0)
      return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);

      // Initial entrance animation with stagger
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          scale: 0.9,
          y: 30,
          rotateX: 15,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
        }
      );

      // Scroll-triggered animations for each card
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 40,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [filteredArtworks]);

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

  const items = Array.isArray(filteredArtworks) ? filteredArtworks : [];

  return (
    <div
      ref={rootRef}
      className="min-h-screen w-full bg-gradient-to-br md:mt-[50px] from-zinc-900 via-indigo-950 to-black text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header ref={headerRef} className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Art Gallery ✨
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                Explore our curated collection of stunning AI-generated artworks
                from talented artists worldwide.
              </p>
            </div>
            {/* Search Results Count */}
            {searchTerm && !loading && (
              <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-full border border-purple-400/30 text-sm text-white shadow-lg">
                <span className="font-semibold">{items.length}</span>{" "}
                {items.length === 1 ? "artwork" : "artworks"} found
              </div>
            )}
          </div>

          {/* Enhanced Search Bar with Gradient Border */}
          {!loading && (
            <div ref={searchBarRef} className="max-w-2xl">
              <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 animate-gradient-x">
                <div className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl">
                  <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, artist, category, or description..."
                    showClearButton={true}
                    size="lg"
                    className="border-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Loading */}
        {loading && <Loader text="Loading artworks..." />}

        {/* Error */}
        {error && !loading && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {/* No Results */}
        {!loading && !error && items.length === 0 && searchTerm && (
          <ArtNotFound searchTerm={searchTerm} onClear={handleClearSearch} />
        )}

        {/* Enhanced Grid with Stunning Artistic Cards */}
        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((art, i) => (
              <button
                key={art._id}
                ref={(el) => (cardsRef.current[i] = el)}
                onClick={() => openModal(art)}
                className="group text-left relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg shadow-2xl shadow-purple-900/30 transition-all duration-500 will-change-transform hover:scale-[1.05] hover:shadow-purple-500/40 hover:shadow-3xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 border border-white/10"
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

                {/* Image Section with Overlay */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/50">
                  <img
                    src={art.image_url}
                    alt={art.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-lg border border-white/20">
                    {art.price_per_unit} ETH
                  </div>

                  {/* Classification Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 backdrop-blur-md rounded-full text-xs font-semibold text-white shadow-lg border border-white/20">
                    {Math.round(art.classification_percentage)}% Match
                  </div>

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
                    {art.title}
                  </h3>

                  {/* Artist */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      {art.artist ? art.artist.charAt(0).toUpperCase() : "A"}
                    </div>
                    <p className="text-sm text-white/90 font-medium line-clamp-1">
                      {art.artist || "Unknown Artist"}
                    </p>
                  </div>

                  {/* Classification and Availability */}
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span className="px-2 py-1 bg-white/10 rounded-full border border-white/20">
                      {art.classification}
                    </span>
                    <span className="font-semibold text-emerald-300">
                      {art.available} available
                    </span>
                  </div>
                </div>

                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </button>
            ))}
          </div>
        )}
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

export default GalleryPage;
