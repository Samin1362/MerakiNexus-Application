import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getAccessToken } from "../utils/auth";
import { useAuth } from "../contexts/AuthContext";

const ArtistUpload = () => {
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
      alert(
        "Please fill in all fields including classification percentage and provide an image URL."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Get access token from cookies
      const accessToken = getAccessToken();
      console.log(
        "🔑 Access token retrieved:",
        accessToken ? "✅ Found" : "❌ Not found"
      );

      if (!accessToken) {
        alert("Authentication token not found. Please login again.");
        setIsSubmitting(false);
        return;
      }

      // Remove "Bearer " prefix if it exists, API expects just the token
      const authToken = accessToken.replace(/^Bearer\s+/i, "");
      console.log(
        "🔧 Processed auth token:",
        authToken ? "✅ Processed" : "❌ Empty"
      );

      // Prepare the artwork data
      const artworkData = {
        title: title.trim(),
        artist: artist.trim(),
        created_year: parseInt(year, 10),
        medium: medium.trim(),
        classification: "AI-Generated", // Default classification
        classification_percentage: parseFloat(classificationPercentage),
        image_url: imageUrl.trim(),
        art_value_usd: 1000, // Default value
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        scores: {
          creativity: 0.85,
          technical_skill: 0.9,
          emotional_impact: 0.75,
          originality: 0.8,
          composition: 0.88,
        },
      };

      console.log("📦 Artwork payload:", artworkData);

      const response = await fetch(
        "https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
          body: JSON.stringify(artworkData),
        }
      );

      console.log("📡 Response status:", response.status);
      console.log("📡 Response status text:", response.statusText);

      const data = await response.json();
      console.log("📥 Response data:", data);
      console.log(
        "📥 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

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
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.25,
                ease: "power3.out",
              },
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
    <div ref={rootRef} className="w-full">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Artwork
          </h1>
          <p className="text-gray-600">
            Share your creation. AI insights come after submission.
          </p>
        </header>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-6 overflow-hidden rounded-xl shadow-lg">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full max-h-96 object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </div>
        )}

        {/* Image Error Message */}
        {imageError && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center">
            <p className="text-red-600 text-sm">
              Unable to load image from the provided URL. Please check the URL
              and try again.
            </p>
          </div>
        )}

        {/* Form Card */}
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200"
        >
          <div className="grid grid-cols-1 gap-6">
            <div ref={(el) => (fieldsRef.current[0] = el)}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Artwork Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="e.g., Neon Dreams"
                required
              />
            </div>

            <div ref={(el) => (fieldsRef.current[1] = el)}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Artist Name
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Your name"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div ref={(el) => (fieldsRef.current[2] = el)}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Year Created
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>

              <div ref={(el) => (fieldsRef.current[3] = el)}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Medium
                </label>
                <select
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                >
                  <option value="">Select medium</option>
                  <option value="Digital Art">Digital Art</option>
                  <option value="AI-Generated">AI-Generated</option>
                  <option value="Oil Painting">Oil Painting</option>
                  <option value="Watercolor">Watercolor</option>
                  <option value="Acrylic">Acrylic</option>
                  <option value="Photography">Photography</option>
                  <option value="Mixed Media">Mixed Media</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div ref={(el) => (fieldsRef.current[4] = el)}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="abstract, colorful, modern (comma-separated)"
                required
              />
            </div>

            <div ref={(el) => (fieldsRef.current[5] = el)}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Classification Confidence (%)
              </label>
              <input
                type="number"
                value={classificationPercentage}
                onChange={(e) => setClassificationPercentage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="85"
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>

            <div ref={(el) => (fieldsRef.current[6] = el)}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={onImageUrlChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <button
              ref={submitRef}
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Uploading..." : "Upload Artwork"}
            </button>
          </div>
        </form>

        {/* Success Modal */}
        {showSuccess && (
          <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={closeSuccess}
          >
            <div
              ref={successRef}
              className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Artwork Uploaded!
              </h3>
              <p className="mb-6 text-gray-600">
                Your artwork has been successfully submitted and is now live in
                the gallery.
              </p>
              <button
                onClick={closeSuccess}
                className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistUpload;
