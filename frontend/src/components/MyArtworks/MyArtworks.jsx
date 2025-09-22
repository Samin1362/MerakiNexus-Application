import React, { useState, useEffect, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Plus, X, Palette, Loader2, Trash2, Edit3 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getAccessToken } from "../../utils/auth";
import MyArtwork from "./MyArtwork";

// Loading skeleton component
const SkeletonCard = () => (
  <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-md shadow-lg shadow-black/20 animate-pulse">
    <div className="h-48 bg-white/10 rounded-xl mb-4"></div>
    <div className="space-y-3">
      <div className="h-6 bg-white/10 rounded w-3/4"></div>
      <div className="h-4 bg-white/10 rounded w-1/2"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-white/10 rounded-full w-20"></div>
        <div className="h-4 bg-white/10 rounded w-16"></div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-8 bg-white/10 rounded w-16"></div>
        <div className="h-8 bg-white/10 rounded w-16"></div>
      </div>
    </div>
  </div>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
    <p className="text-white/70 text-lg">Loading your artworks...</p>
  </div>
);

const MyArtworks = () => {
  // Auth context and navigation
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [selectedArtworkDetails, setSelectedArtworkDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [toast, setToast] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    medium: "",
    created_year: "",
    tags: "",
  });

  // Refs for GSAP animations
  const cardsRef = useRef([]);
  const modalRef = useRef(null);

  // GSAP hover animations for cards
  useEffect(() => {
    if (artworks.length > 0 && cardsRef.current.length > 0) {
      const currentCards = cardsRef.current;

      currentCards.forEach((card) => {
        if (card) {
          const handleMouseEnter = () => {
            gsap.to(card, {
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.3)",
              duration: 0.3,
              ease: "power2.out",
            });
          };

          const handleMouseLeave = () => {
            gsap.to(card, {
              scale: 1,
              boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
              duration: 0.3,
              ease: "power2.out",
            });
          };

          card.addEventListener("mouseenter", handleMouseEnter);
          card.addEventListener("mouseleave", handleMouseLeave);

          // Store cleanup functions
          card._cleanupFunctions = [
            () => card.removeEventListener("mouseenter", handleMouseEnter),
            () => card.removeEventListener("mouseleave", handleMouseLeave),
          ];
        }
      });

      // Cleanup function
      return () => {
        currentCards.forEach((card) => {
          if (card && card._cleanupFunctions) {
            card._cleanupFunctions.forEach((cleanup) => cleanup());
          }
        });
      };
    }
  }, [artworks]);

  // Modal animations
  useEffect(() => {
    if (editModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [editModalOpen]);

  // Fetch artworks from API
  useEffect(() => {
    const fetchArtworks = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get access token for authentication
        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("No access token found. Please log in again.");
        }

        // Clean the token (remove Bearer prefix if present)
        const authToken = accessToken.replace(/^Bearer\s+/i, "");

        const response = await fetch(
          "https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          // Filter artworks by user email
          const userArtworks = data.data.filter(
            (artwork) => artwork.user?.email === user.email
          );
          setArtworks(userArtworks);
        } else {
          throw new Error(data.message || "Failed to fetch artworks");
        }
      } catch (err) {
        console.error("Error fetching artworks:", err);
        setError(err.message || "Failed to load artworks");
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [user?.email]);

  const handleEditSubmit = () => {
    // Update artwork in local state
    setArtworks((prev) =>
      prev.map((artwork) =>
        artwork._id === selectedArtwork._id
          ? {
              ...artwork,
              title: editForm.title,
              medium: editForm.medium,
              created_year: editForm.created_year,
              tags: editForm.tags.split(",").map((tag) => tag.trim()),
            }
          : artwork
      )
    );
    setEditModalOpen(false);
    setSelectedArtwork(null);
  };

  // Toast utility function
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // CRUD Handlers
  const handleDeleteArtwork = async (artworkId) => {
    try {
      // Get access token for authentication
      const accessToken = getAccessToken();
      if (!accessToken) {
        showToast("No access token found. Please log in again.", "error");
        return;
      }

      // Clean the token (remove Bearer prefix if present)
      const authToken = accessToken.replace(/^Bearer\s+/i, "");

      // Call delete API endpoint
      const response = await fetch(
        `https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/${artworkId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Success - show toast and remove from state
        showToast("Artwork deleted successfully!");
        setArtworks((prev) =>
          prev.filter((artwork) => artwork._id !== artworkId)
        );
      } else {
        throw new Error(data.message || "Failed to delete artwork");
      }
    } catch (error) {
      console.error("Delete artwork error:", error);
      showToast("Failed to delete artwork", "error");
    }
  };

  const handleEditArtwork = (artwork) => {
    setSelectedArtwork(artwork);
    setEditForm({
      title: artwork.title,
      medium: artwork.medium,
      created_year: artwork.created_year,
      tags: artwork.tags.join(", "),
    });
    setEditModalOpen(true);
  };

  const handleDetailsArtwork = async (artworkId) => {
    setLoadingDetails(true);
    setIsDetailsModalOpen(true); // Open modal immediately to show loading state

    try {
      // Get access token for authentication
      const accessToken = getAccessToken();
      if (!accessToken) {
        showToast("No access token found. Please log in again.", "error");
        return;
      }

      // Clean the token (remove Bearer prefix if present)
      const authToken = accessToken.replace(/^Bearer\s+/i, "");

      // Call details API endpoint
      const response = await fetch(
        `https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/${artworkId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        // Success - store details
        setSelectedArtworkDetails(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch artwork details");
      }
    } catch (error) {
      console.error("Fetch artwork details error:", error);
      showToast("Failed to fetch artwork details", "error");
      // Close modal on error
      setIsDetailsModalOpen(false);
      setSelectedArtworkDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCreateNew = () => {
    // Navigate to the main upload page
    navigate("/upload");
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Artworks
            </h1>
            <p className="text-gray-600">
              Manage and showcase your creative collection
            </p>
          </div>
          <button
            disabled
            className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-xl cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Upload New Artwork
          </button>
        </div>

        {/* Loading Content */}
        <LoadingSpinner />

        {/* Skeleton Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">
            <X className="w-24 h-24 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Error Loading Artworks
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Artworks</h1>
          <p className="text-gray-600">
            Manage and showcase your creative collection
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Upload New Artwork
        </button>
      </div>

      {/* Artworks Grid */}
      {artworks.length === 0 ? (
        <div className="text-center py-20">
          <Palette className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No artworks yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start building your portfolio by uploading your first artwork
          </p>
          <button
            onClick={handleCreateNew}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
          >
            Upload Your First Artwork
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {artworks.map((artwork, index) => (
            <MyArtwork
              key={artwork._id}
              artwork={artwork}
              refEl={(el) => (cardsRef.current[index] = el)}
              onEdit={handleEditArtwork}
              onDelete={handleDeleteArtwork}
              onDetails={handleDetailsArtwork}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-white/30 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Artwork</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-white/50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medium
                  </label>
                  <input
                    type="text"
                    value={editForm.medium}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        medium: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-white/50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={editForm.created_year}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        created_year: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-white/50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-white/50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="neon, cityscape, future"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setIsDetailsModalOpen(false);
            setSelectedArtworkDetails(null);
            setLoadingDetails(false);
          }}
        >
          <div
            className="relative mx-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                Artwork Details
              </h2>
              <button
                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedArtworkDetails(null);
                  setLoadingDetails(false);
                }}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {loadingDetails ? (
                // Loading State
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="animate-spin w-8 h-8 text-blue-500 mb-4" />
                  <span className="text-sm text-gray-500">
                    Loading details...
                  </span>
                </div>
              ) : selectedArtworkDetails ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image Section */}
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={selectedArtworkDetails.image_url}
                        alt={selectedArtworkDetails.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedArtworkDetails.title}
                      </h3>
                      <p className="text-lg text-gray-600">
                        {selectedArtworkDetails.artist || "Unknown Artist"}
                      </p>
                    </div>

                    {/* Artwork Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-500 block">Year</span>
                        <span className="font-semibold text-gray-900">
                          {selectedArtworkDetails.created_year}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-500 block">Medium</span>
                        <span className="font-semibold text-gray-900">
                          {selectedArtworkDetails.medium}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-500 block">
                          Classification
                        </span>
                        <span className="font-semibold text-gray-900">
                          {selectedArtworkDetails.classification}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-500 block">Confidence</span>
                        <span className="font-semibold text-gray-900">
                          {selectedArtworkDetails.classification_percentage?.toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 col-span-2">
                        <span className="text-green-600 block">Art Value</span>
                        <span className="font-bold text-green-800 text-lg">
                          $
                          {selectedArtworkDetails.art_value_usd?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* AI Scores */}
                    {selectedArtworkDetails.scores && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          AI Analysis Scores
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(selectedArtworkDetails.scores).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-sm"
                              >
                                <span className="capitalize text-blue-700">
                                  {key.replace(/_/g, " ")}
                                </span>
                                <span className="font-semibold text-blue-900">
                                  {typeof value === "number"
                                    ? value.toFixed(2)
                                    : value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {selectedArtworkDetails.tags &&
                      selectedArtworkDetails.tags.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Tags
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedArtworkDetails.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Metadata */}
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Metadata
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Artwork ID:</span>
                          <span className="font-mono text-xs">
                            {selectedArtworkDetails._id}
                          </span>
                        </div>
                        {selectedArtworkDetails.createdAt && (
                          <div className="flex justify-between">
                            <span>Created:</span>
                            <span>
                              {new Date(
                                selectedArtworkDetails.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {selectedArtworkDetails.updatedAt && (
                          <div className="flex justify-between">
                            <span>Last Updated:</span>
                            <span>
                              {new Date(
                                selectedArtworkDetails.updatedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Error state or no data
                <div className="flex flex-col items-center justify-center py-12">
                  <X className="w-8 h-8 text-gray-400 mb-4" />
                  <span className="text-sm text-gray-500">
                    No artwork details available
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
              toast.type === "error"
                ? "border-l-4 border-red-500"
                : "border-l-4 border-green-500"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {toast.type === "error" ? (
                    <svg
                      className="h-6 w-6 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    {toast.type === "error" ? "Error" : "Success"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setToast(null)}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Suspense wrapper component
const MyArtworksWithSuspense = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Artworks
              </h1>
              <p className="text-gray-600">
                Manage and showcase your creative collection
              </p>
            </div>
            <button
              disabled
              className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-xl cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              Upload New Artwork
            </button>
          </div>

          {/* Suspense Loading Content */}
          <LoadingSpinner />

          {/* Skeleton Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      }
    >
      <MyArtworks />
    </Suspense>
  );
};

export default MyArtworksWithSuspense;
