import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

function UploadPage() {
  const rootRef = useRef(null);
  const formRef = useRef(null);
  const fieldsRef = useRef([]);
  const submitRef = useRef(null);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [medium, setMedium] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview("");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!title || !artist || !year || !medium || !tags || !imageFile) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    // Simulate AI processing by logging
    const payload = {
      title,
      artist,
      created_year: year,
      medium,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      imageFileName: imageFile?.name,
    };
    console.log("Submitted artwork:", payload);

    // Success animation modal
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
            />
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
                Image Upload
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="w-full rounded-lg border border-white/20 bg-white/10 file:mr-4 file:rounded-md file:border-0 file:bg-white/20 file:px-3 file:py-2 file:text-white file:hover:bg-white/30 focus:border-white/40"
                required
              />
            </div>

            <div className="pt-2">
              <button
                ref={submitRef}
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-900/30 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                Submit Artwork
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
