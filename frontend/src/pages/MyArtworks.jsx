import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Trash2, Edit3, Plus, X, Palette } from "lucide-react";

// Demo data for artworks
const DEMO_ARTWORKS = [
  {
    _id: "1",
    title: "Blue Dreams",
    artist: "Chloe Dubois",
    image_url: "https://picsum.photos/seed/art12/600/400",
    classification: "Futurism",
    classification_percentage: 95.2,
    art_value_usd: 17200,
    created_year: "2023",
    medium: "Digital",
    tags: ["neon", "cityscape", "future"],
  },
  {
    _id: "2",
    title: "Ethereal Landscapes",
    artist: "Marcus Chen",
    image_url: "https://picsum.photos/seed/art34/600/400",
    classification: "Abstract",
    classification_percentage: 88.7,
    art_value_usd: 12500,
    created_year: "2024",
    medium: "Oil on Canvas",
    tags: ["abstract", "landscape", "modern"],
  },
  {
    _id: "3",
    title: "Urban Pulse",
    artist: "Sofia Rodriguez",
    image_url: "https://picsum.photos/seed/art56/600/400",
    classification: "Contemporary",
    classification_percentage: 92.4,
    art_value_usd: 8900,
    created_year: "2024",
    medium: "Acrylic",
    tags: ["urban", "street", "contemporary"],
  },
  {
    _id: "4",
    title: "Quantum Reflections",
    artist: "Alex Thompson",
    image_url: "https://picsum.photos/seed/art78/600/400",
    classification: "Surrealism",
    classification_percentage: 91.3,
    art_value_usd: 15600,
    created_year: "2023",
    medium: "Mixed Media",
    tags: ["quantum", "reflection", "surreal"],
  },
  {
    _id: "5",
    title: "Digital Harmony",
    artist: "Emma Wilson",
    image_url: "https://picsum.photos/seed/art90/600/400",
    classification: "Digital Art",
    classification_percentage: 96.8,
    art_value_usd: 22000,
    created_year: "2024",
    medium: "Digital",
    tags: ["harmony", "digital", "vibrant"],
  },
];

const MyArtworks = () => {
  // State management
  const [artworks, setArtworks] = useState(DEMO_ARTWORKS);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
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
    if ((editModalOpen || deleteModalOpen) && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [editModalOpen, deleteModalOpen]);

  // CRUD Operations
  const handleEdit = (artwork) => {
    setSelectedArtwork(artwork);
    setEditForm({
      title: artwork.title,
      medium: artwork.medium,
      created_year: artwork.created_year,
      tags: artwork.tags.join(", "),
    });
    setEditModalOpen(true);
  };

  const handleDelete = (artwork) => {
    setSelectedArtwork(artwork);
    setDeleteModalOpen(true);
  };

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

  const confirmDelete = () => {
    // Remove artwork from local state
    setArtworks((prev) =>
      prev.filter((artwork) => artwork._id !== selectedArtwork._id)
    );
    setDeleteModalOpen(false);
    setSelectedArtwork(null);
  };

  const handleCreateNew = () => {
    // In a real app, this would navigate to upload route
    console.log("Navigate to upload artwork page");
    // Example: navigate('/artist-dashboard/upload');
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork, index) => (
            <div
              key={artwork._id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/30 hover:border-purple-400/50 transition-all duration-300"
            >
              {/* Artwork Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Classification Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white">
                  {artwork.classification} •{" "}
                  {artwork.classification_percentage.toFixed(1)}%
                </div>

                {/* Value Badge */}
                <div className="absolute top-3 right-3 px-2 py-1 bg-green-600/80 backdrop-blur-sm rounded-full text-xs text-white">
                  ${artwork.art_value_usd.toLocaleString()}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                  {artwork.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <span>{artwork.medium}</span>
                  <span>•</span>
                  <span>{artwork.created_year}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {artwork.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                  {artwork.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      +{artwork.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(artwork)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 text-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(artwork)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors duration-200 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm border border-white/30 shadow-2xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Artwork
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-900">
                  "{selectedArtwork?.title}"
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyArtworks;
