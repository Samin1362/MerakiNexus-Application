// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { gsap } from "gsap";
// import { useAuth } from "../contexts/AuthContext";
// import { getAccessToken } from "../utils/auth";
// import { useToast } from "../components/Toast";
// import Loader from "../components/Loader";
// import {
//   Upload,
//   Palette,
//   DollarSign,
//   Eye,
//   CheckCircle,
//   TrendingUp,
//   Image as ImageIcon,
//   Star,
//   Crown,
//   Sparkles,
//   Edit3,
//   Trash2,
//   X,
//   Loader2,
//   Clock,
//   Package,
//   Calendar,
// } from "lucide-react";

// const ArtistHome = () => {
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const toast = useToast();

//   // State management
//   const [artworks, setArtworks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedArtwork, setSelectedArtwork] = useState(null);
//   const [originalArtwork, setOriginalArtwork] = useState(null);
//   const [selectedArtworkDetails, setSelectedArtworkDetails] = useState(null);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [isUpdatingArtwork, setIsUpdatingArtwork] = useState(false);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     classification: "",
//     art_value_usd: "",
//     created_year: "",
//     tags: "",
//     price_per_unit: "",
//   });

//   // Refs for GSAP animations
//   const modalRef = useRef(null);

//   // Fetch artworks from API
//   useEffect(() => {
//     const fetchArtworks = async () => {
//       if (!isAuthenticated || !user?.email) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError("");

//         const accessToken = getAccessToken();
//         if (!accessToken) {
//           setError("Authentication token not found. Please login again.");
//           setLoading(false);
//           return;
//         }

//         const authToken = accessToken.replace(/^Bearer\s+/i, "");

//         const response = await fetch(
//           "https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: authToken,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (data.success && Array.isArray(data.data)) {
//           // Filter artworks by user email
//           const userArtworks = data.data.filter(
//             (artwork) => artwork.user?.email === user.email
//           );
//           setArtworks(userArtworks);
//         } else {
//           throw new Error(data.message || "Failed to fetch artworks");
//         }
//       } catch (err) {
//         setError(err.message || "Failed to load artworks");
//         setArtworks([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArtworks();
//   }, [isAuthenticated, user?.email]);

//   // Calculate dashboard stats
//   const dashboardStats = {
//     totalArtworks: artworks.length,
//     pendingApprovals: artworks.filter((art) => art.status === "pending").length,
//     totalValue: artworks.reduce(
//       (sum, art) => sum + (art.art_value_usd || 0),
//       0
//     ),
//     averageConfidence:
//       artworks.length > 0
//         ? artworks.reduce(
//             (sum, art) => sum + (art.classification_percentage || 0),
//             0
//           ) / artworks.length
//         : 0,
//   };

//   // Modal animations
//   useEffect(() => {
//     if (editModalOpen && modalRef.current) {
//       gsap.fromTo(
//         modalRef.current,
//         { opacity: 0, scale: 0.9, y: 20 },
//         { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" }
//       );
//     }
//   }, [editModalOpen]);

//   // CRUD Handlers
//   const handleEditSubmit = async () => {
//     if (!selectedArtwork || !originalArtwork) {
//       toast.error("No artwork selected for editing");
//       return;
//     }

//     setIsUpdatingArtwork(true);

//     try {
//       const accessToken = getAccessToken();
//       if (!accessToken) {
//         toast.error("No access token found. Please log in again.");
//         return;
//       }

//       const authToken = accessToken.replace(/^Bearer\s+/i, "");

//       // Prepare current form values for comparison
//       const currentValues = {
//         title: editForm.title.trim(),
//         classification: editForm.classification.trim(),
//         art_value_usd: parseFloat(editForm.art_value_usd) || 0,
//         created_year: parseInt(editForm.created_year) || 0,
//         price_per_unit: parseFloat(editForm.price_per_unit) || 0,
//         tags: editForm.tags
//           .split(",")
//           .map((tag) => tag.trim())
//           .filter((tag) => tag.length > 0),
//       };

//       // Prepare original values for comparison
//       const originalValues = {
//         title: originalArtwork.title || "",
//         classification: originalArtwork.classification || "",
//         art_value_usd: originalArtwork.art_value_usd || 0,
//         created_year: originalArtwork.created_year || 0,
//         price_per_unit: originalArtwork.price_per_unit || 0,
//         tags: Array.isArray(originalArtwork.tags) ? originalArtwork.tags : [],
//       };

//       // Create update payload with only changed properties
//       const updatePayload = {};
//       let hasChanges = false;

//       if (currentValues.title !== originalValues.title) {
//         updatePayload.title = currentValues.title;
//         hasChanges = true;
//       }

//       if (currentValues.classification !== originalValues.classification) {
//         updatePayload.classification = currentValues.classification;
//         hasChanges = true;
//       }

//       if (currentValues.art_value_usd !== originalValues.art_value_usd) {
//         updatePayload.art_value_usd = currentValues.art_value_usd;
//         hasChanges = true;
//       }

//       if (currentValues.created_year !== originalValues.created_year) {
//         updatePayload.created_year = currentValues.created_year;
//         hasChanges = true;
//       }

//       if (currentValues.price_per_unit !== originalValues.price_per_unit) {
//         updatePayload.price_per_unit = currentValues.price_per_unit;
//         hasChanges = true;
//       }

//       // Compare tags arrays
//       const tagsChanged =
//         currentValues.tags.length !== originalValues.tags.length ||
//         !currentValues.tags.every(
//           (tag, index) => tag === originalValues.tags[index]
//         );

//       if (tagsChanged) {
//         updatePayload.tags = currentValues.tags;
//         hasChanges = true;
//       }

//       if (!hasChanges) {
//         toast.info("No changes detected");
//         setEditModalOpen(false);
//         setSelectedArtwork(null);
//         setOriginalArtwork(null);
//         return;
//       }

//       // Send PATCH request to update artwork
//       const response = await fetch(
//         `https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/${selectedArtwork._id}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: authToken,
//           },
//           body: JSON.stringify(updatePayload),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         // Update artwork in local state
//         setArtworks((prev) =>
//           prev.map((artwork) =>
//             artwork._id === selectedArtwork._id
//               ? {
//                   ...artwork,
//                   ...updatePayload,
//                 }
//               : artwork
//           )
//         );

//         setEditModalOpen(false);
//         setSelectedArtwork(null);
//         setOriginalArtwork(null);
//         toast.success("Artwork updated successfully!");
//       } else {
//         throw new Error(data.message || "Failed to update artwork");
//       }
//     } catch {
//       toast.error("Failed to update artwork");
//     } finally {
//       setIsUpdatingArtwork(false);
//     }
//   };

//   const handleDeleteArtwork = async (artworkId) => {
//     if (!window.confirm("Are you sure you want to delete this artwork?")) {
//       return;
//     }

//     try {
//       const accessToken = getAccessToken();
//       if (!accessToken) {
//         toast.error("No access token found. Please log in again.");
//         return;
//       }

//       const authToken = accessToken.replace(/^Bearer\s+/i, "");

//       const response = await fetch(
//         `https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/${artworkId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: authToken,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         toast.success("Artwork deleted successfully!");
//         setArtworks((prev) =>
//           prev.filter((artwork) => artwork._id !== artworkId)
//         );
//       } else {
//         throw new Error(data.message || "Failed to delete artwork");
//       }
//     } catch {
//       toast.error("Failed to delete artwork");
//     }
//   };

//   const handleEditArtwork = (artwork) => {
//     setSelectedArtwork(artwork);
//     setOriginalArtwork(artwork);
//     setEditForm({
//       title: artwork.title || "",
//       classification: artwork.classification || "",
//       art_value_usd: artwork.art_value_usd?.toString() || "",
//       created_year: artwork.created_year?.toString() || "",
//       price_per_unit: artwork.price_per_unit?.toString() || "",
//       tags: Array.isArray(artwork.tags) ? artwork.tags.join(", ") : "",
//     });
//     setEditModalOpen(true);
//   };

//   const handleDetailsArtwork = async (artworkId) => {
//     setLoadingDetails(true);
//     setIsDetailsModalOpen(true);

//     try {
//       const accessToken = getAccessToken();
//       if (!accessToken) {
//         toast.error("No access token found. Please log in again.");
//         return;
//       }

//       const authToken = accessToken.replace(/^Bearer\s+/i, "");

//       const response = await fetch(
//         `https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/${artworkId}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: authToken,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success && data.data) {
//         setSelectedArtworkDetails(data.data);
//       } else {
//         throw new Error(data.message || "Failed to fetch artwork details");
//       }
//     } catch {
//       toast.error("Failed to fetch artwork details");
//       setIsDetailsModalOpen(false);
//       setSelectedArtworkDetails(null);
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   const handleUploadArtwork = () => {
//     navigate("/upload");
//   };

//   if (loading) {
//     return <Loader text="Loading your artworks..." />;
//   }

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br md:mt-[50px] from-zinc-900 via-indigo-950 to-black text-white overflow-hidden">
//       {/* Animated Background Orbs */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
//         <div
//           className="absolute bottom-20 left-10 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse-slow"
//           style={{ animationDelay: "1s" }}
//         />
//         <div
//           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-indigo-600/10 rounded-full blur-3xl animate-pulse-slow"
//           style={{ animationDelay: "2s" }}
//         />
//       </div>

//       <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//         {/* Stunning Header Section */}
//         <header className="text-center mb-12">
//           <div className="relative inline-block mb-6">
//             <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 relative">
//               <Palette className="w-12 h-12 text-white animate-pulse-slow" />
//               <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full blur-xl opacity-50 animate-ping-slow" />
//             </div>
//           </div>
//           <div className="flex items-center justify-center gap-3 mb-3">
//             <Sparkles className="w-8 h-8 text-purple-400 animate-pulse-slow" />
//             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
//               Welcome back, {user?.firstName || user?.name || "Artist"}!
//             </h1>
//             <Sparkles className="w-8 h-8 text-pink-400 animate-pulse-slow" />
//           </div>
//           <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
//             Manage your creative portfolio and track your artistic journey
//           </p>

//           {/* Upload Button */}
//           <button
//             onClick={handleUploadArtwork}
//             className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/50"
//           >
//             <Upload className="w-5 h-5" />
//             Upload New Artwork
//           </button>
//         </header>

//         {/* Stunning Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           {/* Card 1 - Total Artworks */}
//           <div className="relative group rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-xl border border-purple-400/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-300" />
//             <div className="relative flex items-center justify-between">
//               <div>
//                 <p className="text-purple-200/80 text-sm font-medium mb-1">
//                   Total Artworks
//                 </p>
//                 <p className="text-4xl font-extrabold text-white">
//                   {dashboardStats.totalArtworks}
//                 </p>
//               </div>
//               <div className="p-4 bg-purple-500/30 rounded-xl">
//                 <ImageIcon className="w-8 h-8 text-purple-200" />
//               </div>
//             </div>
//           </div>

//           {/* Card 2 - Pending Approvals */}
//           <div className="relative group rounded-2xl bg-gradient-to-br from-amber-600/30 to-orange-600/30 backdrop-blur-xl border border-amber-400/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all duration-300" />
//             <div className="relative flex items-center justify-between">
//               <div>
//                 <p className="text-amber-200/80 text-sm font-medium mb-1">
//                   Pending Approvals
//                 </p>
//                 <p className="text-4xl font-extrabold text-white">
//                   {dashboardStats.pendingApprovals}
//                 </p>
//               </div>
//               <div className="p-4 bg-amber-500/30 rounded-xl">
//                 <Clock className="w-8 h-8 text-amber-200" />
//               </div>
//             </div>
//           </div>

//           {/* Card 3 - Total Value */}
//           <div className="relative group rounded-2xl bg-gradient-to-br from-emerald-600/30 to-green-600/30 backdrop-blur-xl border border-emerald-400/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/10 group-hover:to-green-500/10 transition-all duration-300" />
//             <div className="relative flex items-center justify-between">
//               <div>
//                 <p className="text-emerald-200/80 text-sm font-medium mb-1">
//                   Total Value
//                 </p>
//                 <p className="text-4xl font-extrabold text-white">
//                   ${dashboardStats.totalValue.toLocaleString()}
//                 </p>
//               </div>
//               <div className="p-4 bg-emerald-500/30 rounded-xl">
//                 <DollarSign className="w-8 h-8 text-emerald-200" />
//               </div>
//             </div>
//           </div>

//           {/* Card 4 - Avg Confidence */}
//           <div className="relative group rounded-2xl bg-gradient-to-br from-pink-600/30 to-rose-600/30 backdrop-blur-xl border border-pink-400/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/10 group-hover:to-rose-500/10 transition-all duration-300" />
//             <div className="relative flex items-center justify-between">
//               <div>
//                 <p className="text-pink-200/80 text-sm font-medium mb-1">
//                   Avg. Confidence
//                 </p>
//                 <p className="text-4xl font-extrabold text-white">
//                   {dashboardStats.averageConfidence.toFixed(1)}%
//                 </p>
//               </div>
//               <div className="p-4 bg-pink-500/30 rounded-xl">
//                 <TrendingUp className="w-8 h-8 text-pink-200" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         {error ? (
//           <div className="text-center py-12">
//             <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
//               <X className="w-8 h-8 text-red-400" />
//             </div>
//             <p className="text-red-400 text-lg">{error}</p>
//           </div>
//         ) : artworks.length === 0 ? (
//           <div className="text-center py-16 px-4">
//             <div className="relative inline-block mb-8">
//               <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10">
//                 <Palette className="w-16 h-16 text-purple-300 animate-pulse-slow" />
//               </div>
//               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-ping-slow" />
//             </div>
//             <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
//               Your Portfolio Awaits
//             </h3>
//             <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
//               You haven't uploaded any artworks yet. Start showcasing your
//               creative masterpieces!
//             </p>
//             <button
//               onClick={handleUploadArtwork}
//               className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/50"
//             >
//               <Upload className="w-5 h-5" />
//               Upload Your First Artwork
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Artworks Header */}
//             <div className="flex items-center justify-between mb-8">
//               <div className="flex items-center gap-3">
//                 <Palette className="w-8 h-8 text-purple-400" />
//                 <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
//                   My Artworks
//                 </h2>
//               </div>
//               <div className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
//                 <p className="text-white/80 font-semibold">
//                   {artworks.length}{" "}
//                   {artworks.length !== 1 ? "artworks" : "artwork"}
//                 </p>
//               </div>
//             </div>

//             {/* Stunning Artworks Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {artworks.map((artwork) => (
//                 <div
//                   key={artwork._id}
//                   className="group relative rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/30"
//                 >
//                   {/* Shimmer Effect on Hover */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

//                   {/* Artwork Image */}
//                   <div className="relative aspect-[4/5] overflow-hidden">
//                     <img
//                       src={artwork.image_url}
//                       alt={artwork.title}
//                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                     />

//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

//                     {/* Classification Badge */}
//                     <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-full shadow-lg border border-white/20">
//                       <span className="text-white text-xs font-bold">
//                         {artwork.classification_percentage?.toFixed(1)}%
//                       </span>
//                     </div>

//                     {/* Value Badge */}
//                     <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur-md rounded-full shadow-lg border border-white/20">
//                       <span className="text-white text-xs font-bold">
//                         ${artwork.art_value_usd?.toLocaleString()}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Card Content */}
//                   <div className="relative p-5">
//                     <h3 className="text-xl font-bold text-white mb-1 truncate">
//                       {artwork.title}
//                     </h3>
//                     <p className="text-white/60 text-sm mb-1">
//                       {artwork.medium} • {artwork.created_year}
//                     </p>
//                     <p className="text-white/50 text-xs mb-4">
//                       {artwork.classification}
//                     </p>

//                     {/* Tags */}
//                     {artwork.tags && artwork.tags.length > 0 && (
//                       <div className="flex flex-wrap gap-1 mb-4">
//                         {artwork.tags.slice(0, 3).map((tag, idx) => (
//                           <span
//                             key={idx}
//                             className="px-2 py-1 bg-purple-500/20 backdrop-blur-sm text-purple-200 text-xs rounded-lg border border-purple-400/20"
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                         {artwork.tags.length > 3 && (
//                           <span className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white/60 text-xs rounded-lg border border-white/10">
//                             +{artwork.tags.length - 3}
//                           </span>
//                         )}
//                       </div>
//                     )}

//                     {/* Action Buttons */}
//                     <div className="grid grid-cols-3 gap-2">
//                       <button
//                         onClick={() => handleDetailsArtwork(artwork._id)}
//                         className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-all duration-200 text-xs font-medium backdrop-blur-sm border border-blue-400/20"
//                       >
//                         <Eye className="w-3.5 h-3.5" />
//                         View
//                       </button>
//                       <button
//                         onClick={() => handleEditArtwork(artwork)}
//                         className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition-all duration-200 text-xs font-medium backdrop-blur-sm border border-purple-400/20"
//                       >
//                         <Edit3 className="w-3.5 h-3.5" />
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteArtwork(artwork._id)}
//                         className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all duration-200 text-xs font-medium backdrop-blur-sm border border-red-400/20"
//                       >
//                         <Trash2 className="w-3.5 h-3.5" />
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Edit Modal - Stunning Design */}
//       {editModalOpen && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div
//             ref={modalRef}
//             className="relative bg-zinc-900 backdrop-blur-md rounded-2xl p-8 w-full max-w-2xl border border-white/10 shadow-2xl text-white"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between mb-8">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-purple-500/20 rounded-xl">
//                   <Edit3 className="w-6 h-6 text-purple-400" />
//                 </div>
//                 <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
//                   Edit Artwork
//                 </h3>
//               </div>
//               <button
//                 onClick={() => {
//                   setEditModalOpen(false);
//                   setSelectedArtwork(null);
//                   setOriginalArtwork(null);
//                 }}
//                 className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200"
//                 disabled={isUpdatingArtwork}
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
//               {/* Title Input */}
//               <div>
//                 <label className="flex items-center gap-2 text-sm font-semibold text-purple-200 mb-2">
//                   <Sparkles className="w-4 h-4" />
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   value={editForm.title}
//                   onChange={(e) =>
//                     setEditForm((prev) => ({
//                       ...prev,
//                       title: e.target.value,
//                     }))
//                   }
//                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200 backdrop-blur-md"
//                   placeholder="Enter artwork title"
//                   disabled={isUpdatingArtwork}
//                 />
//               </div>

//               {/* Classification Input */}
//               <div>
//                 <label className="flex items-center gap-2 text-sm font-semibold text-purple-200 mb-2">
//                   <Palette className="w-4 h-4" />
//                   Classification
//                 </label>
//                 <input
//                   type="text"
//                   value={editForm.classification}
//                   onChange={(e) =>
//                     setEditForm((prev) => ({
//                       ...prev,
//                       classification: e.target.value,
//                     }))
//                   }
//                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200 backdrop-blur-md"
//                   placeholder="e.g., Abstract, Portrait, Landscape"
//                   disabled={isUpdatingArtwork}
//                 />
//               </div>

//               {/* Grid for Art Value and Year */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="flex items-center gap-2 text-sm font-semibold text-emerald-200 mb-2">
//                     <DollarSign className="w-4 h-4" />
//                     Art Value (USD)
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={editForm.art_value_usd}
//                     onChange={(e) =>
//                       setEditForm((prev) => ({
//                         ...prev,
//                         art_value_usd: e.target.value,
//                       }))
//                     }
//                     className="w-full px-4 py-3 bg-emerald-500/10 border border-emerald-400/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all duration-200 backdrop-blur-md"
//                     placeholder="0.00"
//                     disabled={isUpdatingArtwork}
//                   />
//                 </div>

//                 <div>
//                   <label className="flex items-center gap-2 text-sm font-semibold text-blue-200 mb-2">
//                     <Calendar className="w-4 h-4" />
//                     Year Created
//                   </label>
//                   <input
//                     type="number"
//                     min="1000"
//                     max="9999"
//                     value={editForm.created_year}
//                     onChange={(e) =>
//                       setEditForm((prev) => ({
//                         ...prev,
//                         created_year: e.target.value,
//                       }))
//                     }
//                     className="w-full px-4 py-3 bg-blue-500/10 border border-blue-400/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200 backdrop-blur-md"
//                     placeholder="2024"
//                     disabled={isUpdatingArtwork}
//                   />
//                 </div>
//               </div>

//               {/* Price Per Unit Input */}
//               <div>
//                 <label className="flex items-center gap-2 text-sm font-semibold text-amber-200 mb-2">
//                   <TrendingUp className="w-4 h-4" />
//                   Price Per Unit (ETH)
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.0001"
//                   value={editForm.price_per_unit}
//                   onChange={(e) =>
//                     setEditForm((prev) => ({
//                       ...prev,
//                       price_per_unit: e.target.value,
//                     }))
//                   }
//                   className="w-full px-4 py-3 bg-amber-500/10 border border-amber-400/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all duration-200 backdrop-blur-md"
//                   placeholder="0.0000"
//                   disabled={isUpdatingArtwork}
//                 />
//               </div>

//               {/* Tags Input */}
//               <div>
//                 <label className="flex items-center gap-2 text-sm font-semibold text-pink-200 mb-2">
//                   <Star className="w-4 h-4" />
//                   Tags (comma-separated)
//                 </label>
//                 <input
//                   type="text"
//                   value={editForm.tags}
//                   onChange={(e) =>
//                     setEditForm((prev) => ({ ...prev, tags: e.target.value }))
//                   }
//                   className="w-full px-4 py-3 bg-pink-500/10 border border-pink-400/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30 transition-all duration-200 backdrop-blur-md"
//                   placeholder="abstract, modern, colorful"
//                   disabled={isUpdatingArtwork}
//                 />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
//               <button
//                 onClick={() => {
//                   setEditModalOpen(false);
//                   setSelectedArtwork(null);
//                   setOriginalArtwork(null);
//                 }}
//                 disabled={isUpdatingArtwork}
//                 className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
//                   isUpdatingArtwork
//                     ? "bg-white/5 text-white/40 cursor-not-allowed"
//                     : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
//                 }`}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEditSubmit}
//                 disabled={isUpdatingArtwork}
//                 className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
//                   isUpdatingArtwork
//                     ? "bg-purple-500/50 text-white/70 cursor-not-allowed"
//                     : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 hover:scale-105 shadow-lg shadow-purple-500/30"
//                 }`}
//               >
//                 {isUpdatingArtwork ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-5 h-5" />
//                     Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Details Modal - Stunning Design */}
//       {isDetailsModalOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
//           onClick={() => {
//             setIsDetailsModalOpen(false);
//             setSelectedArtworkDetails(null);
//             setLoadingDetails(false);
//           }}
//         >
//           <div
//             className="relative mx-4 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 p-6 text-white shadow-2xl border border-white/10"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Close Button */}
//             <button
//               className="absolute right-4 top-4 z-10 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200 backdrop-blur-md"
//               onClick={() => {
//                 setIsDetailsModalOpen(false);
//                 setSelectedArtworkDetails(null);
//                 setLoadingDetails(false);
//               }}
//               aria-label="Close"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             {/* Modal Content */}
//             {loadingDetails ? (
//               <div className="flex flex-col items-center justify-center py-20">
//                 <Loader2 className="animate-spin w-12 h-12 text-purple-500 mb-4" />
//                 <span className="text-lg text-white/70">
//                   Loading artwork details...
//                 </span>
//               </div>
//             ) : selectedArtworkDetails ? (
//               <div className="space-y-6">
//                 {/* Header Section */}
//                 <div className="text-center mb-8">
//                   <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3">
//                     {selectedArtworkDetails.title}
//                   </h2>
//                   <p className="text-white/80 text-xl font-medium">
//                     by {selectedArtworkDetails.artist || "Unknown Artist"}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//                   {/* Image Section */}
//                   <div className="overflow-hidden rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 shadow-2xl">
//                     <img
//                       src={selectedArtworkDetails.image_url}
//                       alt={selectedArtworkDetails.title}
//                       className="w-full object-cover"
//                     />
//                   </div>

//                   {/* Details Section */}
//                   <div className="space-y-4">
//                     {/* Art Value Section */}
//                     <div className="p-5 bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 rounded-xl border border-emerald-400/30 backdrop-blur-md">
//                       <h3 className="text-lg font-semibold mb-3 text-emerald-200 flex items-center gap-2">
//                         <DollarSign className="w-5 h-5" />
//                         Artwork Value
//                       </h3>
//                       <div className="text-center">
//                         <p className="text-5xl font-extrabold text-white mb-2">
//                           $
//                           {selectedArtworkDetails.art_value_usd?.toLocaleString()}
//                         </p>
//                         <p className="text-emerald-200/80 text-sm">USD</p>
//                       </div>
//                       {selectedArtworkDetails.price_per_unit > 0 && (
//                         <div className="mt-4 pt-4 border-t border-emerald-400/20 grid grid-cols-2 gap-3 text-sm">
//                           <div>
//                             <span className="text-emerald-200/80">
//                               Price/Unit:
//                             </span>
//                             <p className="text-white font-bold text-lg">
//                               {selectedArtworkDetails.price_per_unit} ETH
//                             </p>
//                           </div>
//                           <div>
//                             <span className="text-emerald-200/80">
//                               Available:
//                             </span>
//                             <p className="text-white font-bold text-lg">
//                               {selectedArtworkDetails.available || 0} units
//                             </p>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {/* Artwork Details */}
//                     <div className="p-5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
//                       <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                         <Palette className="w-5 h-5 text-purple-400" />
//                         Artwork Details
//                       </h3>
//                       <div className="grid grid-cols-2 gap-3 text-sm text-white/90">
//                         <div className="bg-white/5 rounded-lg p-3">
//                           <span className="text-white/60 block mb-1">Year</span>
//                           <span className="font-semibold text-white">
//                             {selectedArtworkDetails.created_year}
//                           </span>
//                         </div>
//                         <div className="bg-white/5 rounded-lg p-3">
//                           <span className="text-white/60 block mb-1">
//                             Medium
//                           </span>
//                           <span className="font-semibold text-white">
//                             {selectedArtworkDetails.medium}
//                           </span>
//                         </div>
//                         <div className="bg-white/5 rounded-lg p-3">
//                           <span className="text-white/60 block mb-1">
//                             Classification
//                           </span>
//                           <span className="font-semibold text-white">
//                             {selectedArtworkDetails.classification}
//                           </span>
//                         </div>
//                         <div className="bg-white/5 rounded-lg p-3">
//                           <span className="text-white/60 block mb-1">
//                             Confidence
//                           </span>
//                           <span className="font-semibold text-white">
//                             {selectedArtworkDetails.classification_percentage?.toFixed(
//                               1
//                             )}
//                             %
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* AI Scores Section */}
//                 {selectedArtworkDetails.scores && (
//                   <div className="p-5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
//                     <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                       <Star className="w-5 h-5 text-yellow-400" />
//                       AI Analysis Scores
//                     </h3>
//                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                       {Object.entries(selectedArtworkDetails.scores).map(
//                         ([key, value]) => (
//                           <div
//                             key={key}
//                             className="relative overflow-hidden group"
//                           >
//                             <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-indigo-500/20 rounded-xl border border-purple-400/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-purple-400/50">
//                               <p className="text-xs text-purple-200 capitalize mb-2 font-medium">
//                                 {key.replace(/_/g, " ")}
//                               </p>
//                               <p className="text-2xl font-extrabold text-white">
//                                 {typeof value === "number"
//                                   ? value.toFixed(2)
//                                   : value}
//                               </p>
//                             </div>
//                             {/* Shimmer effect on hover */}
//                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none rounded-xl" />
//                           </div>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Tags Section */}
//                 {selectedArtworkDetails.tags &&
//                   selectedArtworkDetails.tags.length > 0 && (
//                     <div className="p-5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
//                       <h3 className="text-lg font-semibold mb-4">Tags</h3>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedArtworkDetails.tags.map((tag, idx) => (
//                           <span
//                             key={idx}
//                             className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-200 text-sm rounded-full border border-purple-400/30 hover:border-purple-400/50 transition-all duration-200 hover:scale-105 backdrop-blur-md"
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                 {/* Timeline Section */}
//                 <div className="p-5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <Clock className="w-5 h-5 text-blue-400" />
//                     Timeline
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div className="bg-white/5 rounded-lg p-3">
//                       <span className="text-white/60 block mb-1">Created</span>
//                       <p className="font-medium text-white">
//                         {selectedArtworkDetails.createdAt &&
//                           new Date(
//                             selectedArtworkDetails.createdAt
//                           ).toLocaleDateString("en-US", {
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                       </p>
//                     </div>
//                     <div className="bg-white/5 rounded-lg p-3">
//                       <span className="text-white/60 block mb-1">
//                         Last Updated
//                       </span>
//                       <p className="font-medium text-white">
//                         {selectedArtworkDetails.updatedAt &&
//                           new Date(
//                             selectedArtworkDetails.updatedAt
//                           ).toLocaleDateString("en-US", {
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Metadata Section */}
//                 <div className="p-5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
//                   <h3 className="text-lg font-semibold mb-4">Metadata</h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
//                       <span className="text-white/60">Artwork ID</span>
//                       <span className="font-mono text-xs text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">
//                         {selectedArtworkDetails._id}
//                       </span>
//                     </div>
//                     {selectedArtworkDetails.user && (
//                       <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
//                         <span className="text-white/60">User ID</span>
//                         <span className="font-mono text-xs text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
//                           {selectedArtworkDetails.user}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-20">
//                 <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4 backdrop-blur-md border border-red-400/30">
//                   <X className="w-10 h-10 text-red-400" />
//                 </div>
//                 <span className="text-lg text-white/70">
//                   No artwork details available
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArtistHome;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "../contexts/AuthContext";
import { getAccessToken } from "../utils/auth";
import { useToast } from "../components/Toast";
import Loader from "../components/Loader";
import {
  Upload,
  Palette,
  DollarSign,
  Eye,
  CheckCircle,
  TrendingUp,
  Image as ImageIcon,
  Star,
  Crown,
  Sparkles,
  Edit3,
  Trash2,
  X,
  Loader2,
  Clock,
  Package,
  Calendar,
} from "lucide-react";

const ArtistHome = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // State management
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [originalArtwork, setOriginalArtwork] = useState(null);
  const [selectedArtworkDetails, setSelectedArtworkDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isUpdatingArtwork, setIsUpdatingArtwork] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    artist: "",
    art_value_usd: "",
    created_year: "",
    medium: "",
    price_per_unit: "",
    available: "",
  });

  // Refs for GSAP animations
  const modalRef = useRef(null);

  // Fetch artworks from API
  useEffect(() => {
    const fetchArtworks = async () => {
      if (!isAuthenticated || !user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const accessToken = getAccessToken();
        if (!accessToken) {
          setError("Authentication token not found. Please login again.");
          setLoading(false);
          return;
        }

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
        setError(err.message || "Failed to load artworks");
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [isAuthenticated, user?.email]);

  // Calculate dashboard stats
  const dashboardStats = {
    totalArtworks: artworks.length,
    pendingApprovals: artworks.filter((art) => art.status === "pending").length,
    totalValue: artworks.reduce(
      (sum, art) => sum + (art.art_value_usd || 0),
      0
    ),
    averagePrice:
      artworks.length > 0
        ? artworks.reduce((sum, art) => sum + (art.price_per_unit || 0), 0) /
          artworks.length
        : 0,
  };

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

  // CRUD Handlers
  const handleEditSubmit = async () => {
    if (!selectedArtwork || !originalArtwork) {
      toast.error("No artwork selected for editing");
      return;
    }

    setIsUpdatingArtwork(true);

    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        toast.error("No access token found. Please log in again.");
        return;
      }

      const authToken = accessToken.replace(/^Bearer\s+/i, "");

      // Prepare current form values for comparison
      const currentValues = {
        title: editForm.title.trim(),
        artist: editForm.artist.trim(),
        art_value_usd: parseFloat(editForm.art_value_usd) || 0,
        created_year: editForm.created_year.trim(),
        medium: editForm.medium.trim(),
        price_per_unit: parseFloat(editForm.price_per_unit) || 0,
        available: parseInt(editForm.available) || 0,
      };

      // Prepare original values for comparison
      const originalValues = {
        title: originalArtwork.title || "",
        artist: originalArtwork.artist || "",
        art_value_usd: originalArtwork.art_value_usd || 0,
        created_year: originalArtwork.created_year || "",
        medium: originalArtwork.medium || "",
        price_per_unit: originalArtwork.price_per_unit || 0,
        available: originalArtwork.available || 0,
      };

      // Create update payload with only changed properties
      const updatePayload = {};
      let hasChanges = false;

      if (currentValues.title !== originalValues.title) {
        updatePayload.title = currentValues.title;
        hasChanges = true;
      }

      if (currentValues.artist !== originalValues.artist) {
        updatePayload.artist = currentValues.artist;
        hasChanges = true;
      }

      if (currentValues.art_value_usd !== originalValues.art_value_usd) {
        updatePayload.art_value_usd = currentValues.art_value_usd;
        hasChanges = true;
      }

      if (currentValues.created_year !== originalValues.created_year) {
        updatePayload.created_year = currentValues.created_year;
        hasChanges = true;
      }

      if (currentValues.medium !== originalValues.medium) {
        updatePayload.medium = currentValues.medium;
        hasChanges = true;
      }

      if (currentValues.price_per_unit !== originalValues.price_per_unit) {
        updatePayload.price_per_unit = currentValues.price_per_unit;
        hasChanges = true;
      }

      if (currentValues.available !== originalValues.available) {
        updatePayload.available = currentValues.available;
        hasChanges = true;
      }

      if (!hasChanges) {
        toast.info("No changes detected");
        setEditModalOpen(false);
        setSelectedArtwork(null);
        setOriginalArtwork(null);
        return;
      }

      // Send PATCH request to update artwork
      const response = await fetch(
        `https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/${selectedArtwork._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update artwork in local state
        setArtworks((prev) =>
          prev.map((artwork) =>
            artwork._id === selectedArtwork._id
              ? {
                  ...artwork,
                  ...updatePayload,
                }
              : artwork
          )
        );

        setEditModalOpen(false);
        setSelectedArtwork(null);
        setOriginalArtwork(null);
        toast.success("Artwork updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update artwork");
      }
    } catch {
      toast.error("Failed to update artwork");
    } finally {
      setIsUpdatingArtwork(false);
    }
  };

  const handleDeleteArtwork = async (artworkId) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) {
      return;
    }

    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        toast.error("No access token found. Please log in again.");
        return;
      }

      const authToken = accessToken.replace(/^Bearer\s+/i, "");

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
        toast.success("Artwork deleted successfully!");
        setArtworks((prev) =>
          prev.filter((artwork) => artwork._id !== artworkId)
        );
      } else {
        throw new Error(data.message || "Failed to delete artwork");
      }
    } catch {
      toast.error("Failed to delete artwork");
    }
  };

  const handleEditArtwork = (artwork) => {
    setSelectedArtwork(artwork);
    setOriginalArtwork(artwork);
    setEditForm({
      title: artwork.title || "",
      artist: artwork.artist || "",
      art_value_usd: artwork.art_value_usd?.toString() || "",
      created_year: artwork.created_year?.toString() || "",
      medium: artwork.medium || "",
      price_per_unit: artwork.price_per_unit?.toString() || "",
      available: artwork.available?.toString() || "",
    });
    setEditModalOpen(true);
  };

  const handleDetailsArtwork = async (artworkId) => {
    setLoadingDetails(true);
    setIsDetailsModalOpen(true);

    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        toast.error("No access token found. Please log in again.");
        return;
      }

      const authToken = accessToken.replace(/^Bearer\s+/i, "");

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
        setSelectedArtworkDetails(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch artwork details");
      }
    } catch {
      toast.error("Failed to fetch artwork details");
      setIsDetailsModalOpen(false);
      setSelectedArtworkDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUploadArtwork = () => {
    navigate("/upload");
  };

  if (loading) {
    return <Loader text="Loading your artworks..." />;
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
              <Palette className="w-12 h-12 text-white animate-pulse-slow" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-full blur-xl opacity-50 animate-ping-slow" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse-slow" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Welcome back, {user?.firstName || user?.name || "Artist"}!
            </h1>
            <Sparkles className="w-8 h-8 text-pink-400 animate-pulse-slow" />
          </div>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
            Manage your creative portfolio and track your artistic journey
          </p>

          {/* Upload Button */}
          <button
            onClick={handleUploadArtwork}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/50"
          >
            <Upload className="w-5 h-5" />
            Upload New Artwork
          </button>
        </header>

        {/* Stunning Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1 - Total Artworks */}
          <div className="relative group rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-xl border border-purple-400/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-purple-200/80 text-sm font-medium mb-1">
                  Total Artworks
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

          {/* Card 2 - Pending Approvals */}
          <div className="relative group rounded-2xl bg-gradient-to-br from-amber-600/30 to-orange-600/30 backdrop-blur-xl border border-amber-400/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-amber-200/80 text-sm font-medium mb-1">
                  Pending Approvals
                </p>
                <p className="text-4xl font-extrabold text-white">
                  {dashboardStats.pendingApprovals}
                </p>
              </div>
              <div className="p-4 bg-amber-500/30 rounded-xl">
                <Clock className="w-8 h-8 text-amber-200" />
              </div>
            </div>
          </div>

          {/* Card 3 - Total Value */}
          <div className="relative group rounded-2xl bg-gradient-to-br from-emerald-600/30 to-green-600/30 backdrop-blur-xl border border-emerald-400/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/10 group-hover:to-green-500/10 transition-all duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-emerald-200/80 text-sm font-medium mb-1">
                  Total Value
                </p>
                <p className="text-4xl font-extrabold text-white">
                  ${dashboardStats.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-emerald-500/30 rounded-xl">
                <DollarSign className="w-8 h-8 text-emerald-200" />
              </div>
            </div>
          </div>

          {/* Card 4 - Avg Price */}
          <div className="relative group rounded-2xl bg-gradient-to-br from-pink-600/30 to-rose-600/30 backdrop-blur-xl border border-pink-400/30 p-6 shadow-xl hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/10 group-hover:to-rose-500/10 transition-all duration-300" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-pink-200/80 text-sm font-medium mb-1">
                  Avg. Price
                </p>
                <p className="text-4xl font-extrabold text-white">
                  {dashboardStats.averagePrice.toFixed(3)} ETH
                </p>
              </div>
              <div className="p-4 bg-pink-500/30 rounded-xl">
                <TrendingUp className="w-8 h-8 text-pink-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10">
                <Palette className="w-16 h-16 text-purple-300 animate-pulse-slow" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-ping-slow" />
            </div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Your Portfolio Awaits
            </h3>
            <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
              You haven't uploaded any artworks yet. Start showcasing your
              creative masterpieces!
            </p>
            <button
              onClick={handleUploadArtwork}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/50"
            >
              <Upload className="w-5 h-5" />
              Upload Your First Artwork
            </button>
          </div>
        ) : (
          <>
            {/* Artworks Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Palette className="w-8 h-8 text-purple-400" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  My Artworks
                </h2>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                <p className="text-white/80 font-semibold">
                  {artworks.length}{" "}
                  {artworks.length !== 1 ? "artworks" : "artwork"}
                </p>
              </div>
            </div>

            {/* Stunning Artworks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artworks.map((artwork) => (
                <div
                  key={artwork._id}
                  className="group relative rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/30"
                >
                  {/* Shimmer Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                  {/* Artwork Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {/* Price Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                      <span className="text-white text-xs font-bold">
                        {artwork.price_per_unit} ETH
                      </span>
                    </div>

                    {/* Value Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                      <span className="text-white text-xs font-bold">
                        ${artwork.art_value_usd?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="relative p-5">
                    <h3 className="text-xl font-bold text-white mb-1 truncate">
                      {artwork.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-1">
                      {artwork.artist}
                    </p>
                    <p className="text-white/50 text-xs mb-4">
                      {artwork.medium} • {artwork.created_year}
                    </p>

                    {/* Tags */}
                    {artwork.tags && artwork.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {artwork.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-500/20 backdrop-blur-sm text-purple-200 text-xs rounded-lg border border-purple-400/20"
                          >
                            {tag.class_name?.replace(/_/g, " ")}
                          </span>
                        ))}
                        {artwork.tags.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white/60 text-xs rounded-lg border border-white/10">
                            +{artwork.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Available Units */}
                    <div className="mb-4 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 inline-block">
                      <span className="text-white/60 text-xs">
                        {artwork.available} available
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleDetailsArtwork(artwork._id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-all duration-200 text-xs font-medium backdrop-blur-sm border border-blue-400/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        onClick={() => handleEditArtwork(artwork)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition-all duration-200 text-xs font-medium backdrop-blur-sm border border-purple-400/20"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteArtwork(artwork._id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all duration-200 text-xs font-medium backdrop-blur-sm border border-red-400/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal - Stunning Design */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="relative bg-zinc-900 backdrop-blur-md rounded-2xl p-8 w-full max-w-2xl border border-white/10 shadow-2xl text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Edit3 className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Edit Artwork
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedArtwork(null);
                  setOriginalArtwork(null);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200"
                disabled={isUpdatingArtwork}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* Title Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-purple-200 mb-2">
                  <Sparkles className="w-4 h-4" />
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200 backdrop-blur-md"
                  placeholder="Enter artwork title"
                  disabled={isUpdatingArtwork}
                />
              </div>

              {/* Artist Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-pink-200 mb-2">
                  <Palette className="w-4 h-4" />
                  Artist
                </label>
                <input
                  type="text"
                  value={editForm.artist}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      artist: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-pink-500/10 border border-pink-400/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30 transition-all duration-200 backdrop-blur-md"
                  placeholder="Artist name"
                  disabled={isUpdatingArtwork}
                />
              </div>

              {/* Medium Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-indigo-200 mb-2">
                  <ImageIcon className="w-4 h-4" />
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
                  className="w-full px-4 py-3 bg-indigo-500/10 border border-indigo-400/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition-all duration-200 backdrop-blur-md"
                  placeholder="e.g., Digital, Oil, Acrylic"
                  disabled={isUpdatingArtwork}
                />
              </div>

              {/* Grid for Art Value, Year, and Available */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-emerald-200 mb-2">
                    <DollarSign className="w-4 h-4" />
                    Art Value (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.art_value_usd}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        art_value_usd: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-emerald-500/10 border border-emerald-400/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all duration-200 backdrop-blur-md"
                    placeholder="0.00"
                    disabled={isUpdatingArtwork}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-blue-200 mb-2">
                    <Calendar className="w-4 h-4" />
                    Year Created
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
                    className="w-full px-4 py-3 bg-blue-500/10 border border-blue-400/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200 backdrop-blur-md"
                    placeholder="2024"
                    disabled={isUpdatingArtwork}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-orange-200 mb-2">
                    <Package className="w-4 h-4" />
                    Available
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={editForm.available}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        available: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-orange-500/10 border border-orange-400/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 transition-all duration-200 backdrop-blur-md"
                    placeholder="0"
                    disabled={isUpdatingArtwork}
                  />
                </div>
              </div>

              {/* Price Per Unit Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-amber-200 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  Price Per Unit (ETH)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={editForm.price_per_unit}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      price_per_unit: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-amber-500/10 border border-amber-400/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all duration-200 backdrop-blur-md"
                  placeholder="0.0000"
                  disabled={isUpdatingArtwork}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedArtwork(null);
                  setOriginalArtwork(null);
                }}
                disabled={isUpdatingArtwork}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isUpdatingArtwork
                    ? "bg-white/5 text-white/40 cursor-not-allowed"
                    : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={isUpdatingArtwork}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isUpdatingArtwork
                    ? "bg-purple-500/50 text-white/70 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 hover:scale-105 shadow-lg shadow-purple-500/30"
                }`}
              >
                {isUpdatingArtwork ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal - Stunning Design */}
      {isDetailsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => {
            setIsDetailsModalOpen(false);
            setSelectedArtworkDetails(null);
            setLoadingDetails(false);
          }}
        >
          <div
            className="relative mx-4 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 p-6 text-white shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 z-10 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200 backdrop-blur-md"
              onClick={() => {
                setIsDetailsModalOpen(false);
                setSelectedArtworkDetails(null);
                setLoadingDetails(false);
              }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            {loadingDetails ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin w-12 h-12 text-purple-500 mb-4" />
                <span className="text-lg text-white/70">
                  Loading artwork details...
                </span>
              </div>
            ) : selectedArtworkDetails ? (
              <div className="space-y-6">
                {/* Header Section */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3">
                    {selectedArtworkDetails.title}
                  </h2>
                  <p className="text-white/80 text-xl font-medium">
                    by {selectedArtworkDetails.artist || "Unknown Artist"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Image Section */}
                  <div className="overflow-hidden rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 shadow-2xl">
                    <img
                      src={selectedArtworkDetails.image_url}
                      alt={selectedArtworkDetails.title}
                      className="w-full object-cover"
                    />
                  </div>

                  {/* Details Section */}
                  <div className="space-y-4">
                    {/* Pricing & Availability Section */}
                    <div className="p-5 bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 rounded-xl border border-emerald-400/30 backdrop-blur-md">
                      <h3 className="text-lg font-semibold mb-3 text-emerald-200 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Artwork Value
                      </h3>
                      <div className="text-center">
                        <p className="text-5xl font-extrabold text-white mb-2">
                          $
                          {selectedArtworkDetails.art_value_usd?.toLocaleString()}
                        </p>
                        <p className="text-emerald-200/80 text-sm">USD</p>
                      </div>
                      {selectedArtworkDetails.price_per_unit > 0 && (
                        <div className="mt-4 pt-4 border-t border-emerald-400/20 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-emerald-200/80">
                              Price/Unit:
                            </span>
                            <p className="text-white font-bold text-lg">
                              {selectedArtworkDetails.price_per_unit} ETH
                            </p>
                          </div>
                          <div>
                            <span className="text-emerald-200/80">
                              Available:
                            </span>
                            <p className="text-white font-bold text-lg">
                              {selectedArtworkDetails.available || 0} units
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Artwork Details */}
                    <div className="p-5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-purple-400" />
                        Artwork Details
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm text-white/90">
                        <div className="bg-white/5 rounded-lg p-3">
                          <span className="text-white/60 block mb-1">Year</span>
                          <span className="font-semibold text-white">
                            {selectedArtworkDetails.created_year}
                          </span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <span className="text-white/60 block mb-1">
                            Medium
                          </span>
                          <span className="font-semibold text-white">
                            {selectedArtworkDetails.medium}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags Section */}
                {selectedArtworkDetails.tags &&
                  selectedArtworkDetails.tags.length > 0 && (
                    <div className="p-5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        AI Classification Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedArtworkDetails.tags.map((tag, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-200 text-sm rounded-full border border-purple-400/30 hover:border-purple-400/50 transition-all duration-200 hover:scale-105 backdrop-blur-md flex items-center gap-2"
                          >
                            <span className="font-medium capitalize">
                              {tag.class_name?.replace(/_/g, " ")}
                            </span>
                            <span className="text-xs text-purple-300/80">
                              {(tag.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Timeline Section */}
                <div className="p-5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Timeline
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-white/60 block mb-1">Created</span>
                      <p className="font-medium text-white">
                        {selectedArtworkDetails.createdAt &&
                          new Date(
                            selectedArtworkDetails.createdAt
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-white/60 block mb-1">
                        Last Updated
                      </span>
                      <p className="font-medium text-white">
                        {selectedArtworkDetails.updatedAt &&
                          new Date(
                            selectedArtworkDetails.updatedAt
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata Section */}
                <div className="p-5 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Metadata</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                      <span className="text-white/60">Artwork ID</span>
                      <span className="font-mono text-xs text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">
                        {selectedArtworkDetails._id}
                      </span>
                    </div>
                    {selectedArtworkDetails.user && (
                      <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                        <span className="text-white/60">User ID</span>
                        <span className="font-mono text-xs text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
                          {selectedArtworkDetails.user}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4 backdrop-blur-md border border-red-400/30">
                  <X className="w-10 h-10 text-red-400" />
                </div>
                <span className="text-lg text-white/70">
                  No artwork details available
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistHome;
