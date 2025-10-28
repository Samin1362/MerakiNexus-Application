import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Image as ImageIcon,
  User,
  Calendar,
  Palette,
  Tag,
  TrendingUp,
  DollarSign,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { getAccessToken } from "../utils/auth";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/Toast/useToast";

function UploadPage() {
  const rootRef = useRef(null);
  const formRef = useRef(null);
  const fieldsRef = useRef([]);
  const submitRef = useRef(null);
  const headerRef = useRef(null);
  const imagePreviewRef = useRef(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [medium, setMedium] = useState("");
  const [tags, setTags] = useState("");
  const [classificationPercentage, setClassificationPercentage] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }

      // Image preview entrance (if exists)
      if (imagePreviewRef.current) {
        gsap.fromTo(
          imagePreviewRef.current,
          { opacity: 0, scale: 0.95, x: -30 },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power3.out",
          }
        );
      }

      // Fields fade + slide in with enhanced animation
      const items = fieldsRef.current.filter(Boolean);
      gsap.fromTo(
        items,
        { opacity: 0, y: 20, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.4,
          ease: "power3.out",
        }
      );

      // Submit button entrance with bounce
      if (submitRef.current) {
        gsap.fromTo(
          submitRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.8,
            ease: "back.out(1.7)",
          }
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const onImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageError(false);

    // Update preview if URL appears to be valid
    if (url && (url.startsWith("http") || url.startsWith("https"))) {
      setImagePreview(url);
    } else {
      setImagePreview("");
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImagePreview("");
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 UPLOAD STARTED - Debug Information:");
    console.log("📊 isAuthenticated:", isAuthenticated);
    console.log("👤 user from AuthContext:", user);

    if (!isAuthenticated) {
      alert("You must be logged in to upload artwork. Please login first.");
      return;
    }

    // Basic validation
    if (
      !title ||
      !artist ||
      !year ||
      !medium ||
      !tags ||
      !imageUrl ||
      !classificationPercentage ||
      !pricePerUnit
    ) {
      alert(
        "Please fill in all fields including classification percentage, price per unit, and provide an image URL."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Get access token from cookies
      const accessToken = getAccessToken();

      console.log("🔑 Raw Access Token from cookies:", accessToken);

      if (!accessToken) {
        alert("Authentication token not found. Please login again.");
        setIsSubmitting(false);
        return;
      }

      // Normalize Bearer prefix
      const authToken = accessToken.replace(/^Bearer\s+/i, "");

      console.log("✅ Authorization Token (final):", authToken);

      // Construct payload
      let finalUserId = user?.id || user?._id || "68ccd9d5135eaf14c9360e0e";

      const payload = {
        title,
        artist,
        image_url: imageUrl,
        classification: "Manual Upload",
        classification_percentage: parseFloat(classificationPercentage),
        scores: {
          aesthetic_score: 0.0,
          sentiment_score: 0.0,
          memorability_score: 0.0,
          art_evaluation_score: 0.0,
        },
        art_value_usd: 0,
        available: 1,
        price_per_unit: parseFloat(pricePerUnit),
        created_year: year,
        medium,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        user: finalUserId,
      };

      console.log("📤 Payload being sent:", payload);
      console.log("check: ", authToken);

      // Make API request
      const response = await fetch(
        "https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log("📥 API Response JSON:", data);
      console.log("📥 Response status:", response.status);
      console.log(
        "📥 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok && data.success === true && data.statusCode === 201) {
        console.log("✅ Artwork created successfully!");
        console.log("🎨 Artwork ID:", data.data._id);

        // Show success toast
        toast.success("🎨 Artwork uploaded successfully!", 4000);

        // Redirect to gallery page after a short delay
        setTimeout(() => {
          navigate("/gallery");
        }, 500);
      } else {
        console.error("❌ API Error Response:", data);

        if (response.status === 401) {
          console.error("❌ 401 Unauthorized - Token is invalid or expired");
          alert("Your session is invalid or expired. Please login again.");
        } else if (response.status === 403) {
          console.error("❌ 403 Forbidden - Insufficient permissions");
          alert("You don't have permission to upload artwork.");
        } else if (data.message?.includes("invalid token")) {
          console.error("❌ Invalid token error");
          alert("Authentication token is invalid. Please login again.");
        } else {
          alert(`Failed to submit artwork: ${data.message || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error("❌ Network/API Error:", error);
      alert("Unable to connect to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className="min-h-screen w-full bg-gradient-to-br md:mt-[50px] from-zinc-900 via-indigo-950 to-black text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header ref={headerRef} className="mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Upload className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Upload Artwork
            </h1>
            <Sparkles className="w-8 h-8 text-pink-400 animate-pulse-slow" />
          </div>
          <p className="text-center text-lg text-white/80 max-w-2xl mx-auto">
            Share your creation with the world. AI insights and classification
            will be generated after submission.
          </p>
        </header>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Preview (Sticky on large screens) */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div
              ref={imagePreviewRef}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/10 shadow-2xl shadow-purple-900/30"
            >
              {imagePreview ? (
                <>
                  {/* Image with overlay */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  {/* Image info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <ImageIcon className="w-4 h-4" />
                      <span>Preview</span>
                    </div>
                    {title && (
                      <h3 className="text-xl font-bold text-white mt-2 line-clamp-1">
                        {title}
                      </h3>
                    )}
                    {artist && <p className="text-white/70 mt-1">{artist}</p>}
                  </div>
                </>
              ) : (
                /* Placeholder when no image */
                <div className="aspect-[4/5] flex flex-col items-center justify-center p-8 text-center">
                  <div className="relative mb-6">
                    <ImageIcon className="w-24 h-24 text-white/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse-slow" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white/80 mb-2">
                    No Image Yet
                  </h3>
                  <p className="text-white/60 max-w-xs">
                    Enter an image URL in the form to see a preview of your
                    artwork here.
                  </p>
                </div>
              )}
            </div>

            {/* Image Error Message */}
            {imageError && (
              <div className="mt-4 rounded-xl bg-red-500/20 border border-red-500/30 p-4 flex items-start gap-3 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-200 mb-1">
                    Image Load Error
                  </h4>
                  <p className="text-red-200/80 text-sm">
                    Unable to load image from the provided URL. Please check the
                    URL and try again.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          <div className="space-y-6">
            <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/10 p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Basic Information
                </h2>
                <div className="space-y-4">
                  {/* Artwork Title */}
                  <div ref={(el) => (fieldsRef.current[0] = el)}>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Artwork Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-white/40 transition-all duration-300 focus:border-purple-400 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20"
                      placeholder="e.g., Neon Dreams"
                      required
                    />
                  </div>

                  {/* Artist Name */}
                  <div ref={(el) => (fieldsRef.current[1] = el)}>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                      <User className="w-4 h-4 text-pink-400" />
                      Artist Name
                    </label>
                    <input
                      type="text"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-white/40 transition-all duration-300 focus:border-pink-400 focus:bg-white/10 focus:shadow-lg focus:shadow-pink-500/20"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  {/* Year and Medium */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div ref={(el) => (fieldsRef.current[2] = el)}>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        Created Year
                      </label>
                      <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-white/40 transition-all duration-300 focus:border-indigo-400 focus:bg-white/10 focus:shadow-lg focus:shadow-indigo-500/20"
                        placeholder="2024"
                        required
                        min="1000"
                        max="2100"
                      />
                    </div>

                    <div ref={(el) => (fieldsRef.current[3] = el)}>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                        <Palette className="w-4 h-4 text-purple-400" />
                        Medium
                      </label>
                      <select
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition-all duration-300 focus:border-purple-400 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20"
                        required
                      >
                        <option value="" disabled>
                          Select medium
                        </option>
                        <option>Oil</option>
                        <option>Acrylic</option>
                        <option>Digital</option>
                        <option>Watercolor</option>
                        <option>Mixed Media</option>
                        <option>Charcoal</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/10 p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-pink-400" />
                  Details & Metadata
                </h2>
                <div className="space-y-4">
                  {/* Tags */}
                  <div ref={(el) => (fieldsRef.current[4] = el)}>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                      <Tag className="w-4 h-4 text-pink-400" />
                      Tags
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-white/40 transition-all duration-300 focus:border-pink-400 focus:bg-white/10 focus:shadow-lg focus:shadow-pink-500/20"
                      placeholder="abstract, digital, modern"
                      required
                    />
                    <p className="mt-1 text-xs text-white/50">
                      Separate tags with commas
                    </p>
                  </div>

                  {/* Image URL */}
                  <div ref={(el) => (fieldsRef.current[5] = el)}>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                      <ImageIcon className="w-4 h-4 text-indigo-400" />
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={onImageUrlChange}
                      className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-white/40 transition-all duration-300 focus:border-indigo-400 focus:bg-white/10 focus:shadow-lg focus:shadow-indigo-500/20"
                      placeholder="https://example.com/your-image.jpg"
                      required
                    />
                    <p className="mt-1 text-xs text-white/50">
                      Direct link to your artwork image
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/10 p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Pricing & Classification
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Classification Percentage */}
                  <div ref={(el) => (fieldsRef.current[6] = el)}>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      Classification %
                    </label>
                    <input
                      type="number"
                      value={classificationPercentage}
                      onChange={(e) =>
                        setClassificationPercentage(e.target.value)
                      }
                      className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-white/40 transition-all duration-300 focus:border-purple-400 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20"
                      placeholder="85.5"
                      min="0"
                      max="100"
                      step="0.1"
                      required
                    />
                  </div>

                  {/* Price Per Unit */}
                  <div ref={(el) => (fieldsRef.current[7] = el)}>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      Price (ETH)
                    </label>
                    <input
                      type="number"
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(e.target.value)}
                      className="w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-white/40 transition-all duration-300 focus:border-emerald-400 focus:bg-white/10 focus:shadow-lg focus:shadow-emerald-500/20"
                      placeholder="0.01"
                      min="0"
                      step="0.001"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                ref={submitRef}
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:scale-[1.02] hover:shadow-purple-500/50 active:scale-[0.98]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Uploading Artwork...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Submit Artwork</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
