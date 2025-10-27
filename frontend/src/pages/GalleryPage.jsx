import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/auth";
import { useAuth } from "../contexts/AuthContext";

gsap.registerPlugin(ScrollTrigger);

function GalleryPage() {
  const [artworks, setArtworks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const rootRef = useRef(null);
  const cardsRef = useRef([]);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const accessToken = getAccessToken();

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

  // Card animations
  useEffect(() => {
    if (!Array.isArray(artworks) || artworks.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);

      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.96, y: 12 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
        }
      );

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
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
  }, [artworks]);

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

  const items = Array.isArray(artworks) ? artworks : [];

  return (
    <div
      ref={rootRef}
      className="min-h-screen w-full bg-gradient-to-br md:mt-[50px] from-zinc-900 via-indigo-950 to-black text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Art Gallery
          </h1>
          <p className="mt-2 text-white/70">
            Explore curated AI art and creative works.
          </p>
        </header>

        {/* Loading */}
        {loading && (
          <p className="text-center text-white/70">Loading artworks...</p>
        )}

        {/* Error */}
        {error && !loading && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((art, i) => (
            <button
              key={art._id}
              ref={(el) => (cardsRef.current[i] = el)}
              onClick={() => openModal(art)}
              className="group text-left rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md shadow-xl shadow-indigo-950/20 transition-transform will-change-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-black">
                <img
                  src={art.image_url}
                  alt={art.title}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{art.title}</h3>
                <p className="text-sm text-white/80">{art.artist}</p>
                <p className="mt-1 text-xs text-white/70">
                  {art.classification} •{" "}
                  {Math.round(art.classification_percentage)}%
                </p>
              </div>
            </button>
          ))}
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

export default GalleryPage;
