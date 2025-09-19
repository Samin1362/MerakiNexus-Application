import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getAccessToken } from "../utils/auth";
import { useAuth } from "../contexts/AuthContext";

function UploadPage() {
  const rootRef = useRef(null);
  const formRef = useRef(null);
  const fieldsRef = useRef([]);
  const submitRef = useRef(null);
  const { isAuthenticated, user } = useAuth();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [medium, setMedium] = useState("");
  const [tags, setTags] = useState("");
  const [classificationPercentage, setClassificationPercentage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const successRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fields fade + slide in
      const items = fieldsRef.current.filter(Boolean);
      gsap.fromTo(
        items,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }
      );

      // Subtle pulsing on submit button
      if (submitRef.current) {
        gsap.to(submitRef.current, {
          scale: 1.03,
          duration: 1.4,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        });
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
      !classificationPercentage
    ) {
      alert("Please fill in all fields including classification percentage and provide an image URL.");
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
        created_year: year,
        medium,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
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
      console.log("📥 Response headers:", Object.fromEntries(response.headers.entries()));
  
      if (response.ok && data.success === true && data.statusCode === 201) {
        console.log("✅ Artwork created successfully!");
        console.log("🎨 Artwork ID:", data.data._id);
  
        setShowSuccess(true);
        requestAnimationFrame(() => {
          const tl = gsap.timeline();
          tl.set(overlayRef.current, { pointerEvents: "auto" })
            .fromTo(
              overlayRef.current,
              { opacity: 0 },
              { opacity: 1, duration: 0.2, ease: "power2.out" }
            )
            .fromTo(
              successRef.current,
              { opacity: 0, scale: 0.96, y: 8 },
              { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power3.out" },
              "<"
            );
        });
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
  

  const closeSuccess = () => {
    const tl = gsap.timeline({
      onComplete: () => setShowSuccess(false),
    });
    tl.to(successRef.current, {
      opacity: 0,
      scale: 0.97,
      y: 8,
      duration: 0.2,
      ease: "power2.in",
    }).to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () =>
          gsap.set(overlayRef.current, { pointerEvents: "none" }),
      },
      "<"
    );
  };

  return (
    <div
      ref={rootRef}
      className="min-h-screen w-full bg-gradient-to-br md:mt-[50px] from-purple-600 via-indigo-700 to-black text-white"
    >
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Upload Artwork
          </h1>
          <p className="mt-2 text-white/80">
            Share your creation. AI insights come after submission.
          </p>
        </header>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-6 overflow-hidden rounded-xl shadow-lg shadow-indigo-900/30">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </div>
        )}

        {/* Image Error Message */}
        {imageError && (
          <div className="mb-6 rounded-xl bg-red-500/20 border border-red-500/30 p-4 text-center">
            <p className="text-red-200 text-sm">
              Unable to load image from the provided URL. Please check the URL
              and try again.
            </p>
          </div>
        )}

        {/* Form Card */}
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="rounded-2xl bg-white/10 p-6 backdrop-blur-md shadow-lg shadow-indigo-950/20"
        >
          <div className="grid grid-cols-1 gap-4">
            <div ref={(el) => (fieldsRef.current[0] = el)}>
              <label className="mb-1 block text-sm text-white/80">
                Artwork Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none placeholder-white/60 focus:border-white/40 focus:bg-white/15"
                placeholder="e.g., Neon Dreams"
                required
              />
            </div>

            <div ref={(el) => (fieldsRef.current[1] = el)}>
              <label className="mb-1 block text-sm text-white/80">
                Artist Name
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none placeholder-white/60 focus:border-white/40 focus:bg-white/15"
                placeholder="Your name"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div ref={(el) => (fieldsRef.current[2] = el)}>
                <label className="mb-1 block text-sm text-white/80">
                  Created Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none placeholder-white/60 focus:border-white/40 focus:bg-white/15"
                  placeholder="2024"
                  required
                  min="1000"
                  max="2100"
                />
              </div>

              <div ref={(el) => (fieldsRef.current[3] = el)}>
                <label className="mb-1 block text-sm text-white/80">
                  Medium
                </label>
                <select
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none focus:border-white/40 focus:bg-white/15"
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

            <div ref={(el) => (fieldsRef.current[4] = el)}>
              <label className="mb-1 block text-sm text-white/80">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none placeholder-white/60 focus:border-white/40 focus:bg-white/15"
                placeholder="comma,separated,tags"
                required
              />
            </div>

            <div ref={(el) => (fieldsRef.current[5] = el)}>
              <label className="mb-1 block text-sm text-white/80">
                Classification Percentage
              </label>
              <input
                type="number"
                value={classificationPercentage}
                onChange={(e) => setClassificationPercentage(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none placeholder-white/60 focus:border-white/40 focus:bg-white/15"
                placeholder="85.5"
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>

            <div ref={(el) => (fieldsRef.current[6] = el)}>
              <label className="mb-1 block text-sm text-white/80">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={onImageUrlChange}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none placeholder-white/60 focus:border-white/40 focus:bg-white/15"
                placeholder="https://example.com/your-image.jpg"
                required
              />
            </div>

            <div className="pt-2">
              <button
                ref={submitRef}
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-900/30 transition-transform focus:outline-none focus:ring-2 focus:ring-white/40 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:scale-[1.02]"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Artwork"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Success overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${
          showSuccess ? "" : "pointer-events-none opacity-0"
        }`}
        onClick={closeSuccess}
      >
        <div
          ref={successRef}
          className="relative mx-4 w-full max-w-md rounded-2xl bg-zinc-900 p-6 text-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute right-3 top-3 rounded-md p-2 text-white/80 hover:bg-white/10"
            onClick={closeSuccess}
            aria-label="Close"
          >
            ×
          </button>
          <h3 className="text-2xl font-bold">Submitted!</h3>
          <p className="mt-2 text-white/80">
            Your artwork has been received. AI insights will appear soon.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
