import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [artworks, setArtworks] = useState([]);
  const rootRef = useRef(null);
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroTaglineRef = useRef(null);
  const ctaRef = useRef(null);
  const heroMediaRef = useRef(null);

  const aboutRef = useRef(null);
  const featuresRef = useRef(null);

  const featureCardRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero intro animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        heroTitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
        .fromTo(
          heroTaglineRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.3"
        )
        .fromTo(
          ctaRef.current,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.2"
        )
        .fromTo(
          heroMediaRef.current,
          { y: 12, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7 },
          "-=0.2"
        );

      // CTA hover scale using GSAP
      if (ctaRef.current) {
        const onEnter = () =>
          gsap.to(ctaRef.current, {
            scale: 1.05,
            duration: 0.15,
            ease: "power2.out",
          });
        const onLeave = () =>
          gsap.to(ctaRef.current, {
            scale: 1.0,
            duration: 0.2,
            ease: "power2.inOut",
          });
        ctaRef.current.addEventListener("mouseenter", onEnter);
        ctaRef.current.addEventListener("mouseleave", onLeave);
        // cleanup
        return () => {
          ctaRef.current?.removeEventListener("mouseenter", onEnter);
          ctaRef.current?.removeEventListener("mouseleave", onLeave);
        };
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Load a few artworks for homepage preview
  useEffect(() => {
    fetch("/art-data.json")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.artworks)
          ? data.artworks
          : [];
        setArtworks(list.slice(0, 4));
      })
      .catch(() => setArtworks([]));
  }, []);

  const features = [
    {
      title: "AI Art",
      desc: "Generative artworks powered by state-of-the-art models.",
    },
    {
      title: "Sentiment Analysis",
      desc: "Understand audience emotion across creative content.",
    },
    {
      title: "Aesthetic Scoring",
      desc: "Quantify visual appeal with learned aesthetics metrics.",
    },
    {
      title: "Web3 Collectibles",
      desc: "Mint, trade, and showcase on-chain creative assets.",
    },
  ];

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen w-full md:mt-[50px] overflow-x-hidden bg-gradient-to-br from-purple-500 via-indigo-600 to-indigo-700 text-white"
    >
      {/* Artistic gradient overlays / shapes (tamed on small screens) */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 sm:h-72 sm:w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-32 w-32 sm:h-40 sm:w-40 rounded-2xl bg-cyan-300/10 rotate-12 blur-xl" />

      {/* Grid wrapper for balance */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:px-8 md:gap-12 md:py-16">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative grid items-center gap-8 md:grid-cols-2"
        >
          <div className="text-center md:text-left">
            <h1
              ref={heroTitleRef}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow"
            >
              Meraki Nexus
            </h1>
            <p
              ref={heroTaglineRef}
              className="mt-4 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto md:mx-0"
            >
              Where AI Meets Creativity & Web3
            </p>
            <div className="mt-8">
              <button
                ref={ctaRef}
                className="rounded-2xl bg-white/10 px-6 py-3 sm:px-8 text-white backdrop-blur-md shadow-lg shadow-indigo-900/20 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40"
                onClick={() => navigate("/gallery")}
              >
                Explore Now
              </button>
            </div>
          </div>

          {/* Animated media panel (GIF) */}
          <div
            ref={heroMediaRef}
            className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-fuchsia-400/20 via-cyan-300/10 to-indigo-400/20 blur-xl" />
            <div className="relative">
              <img
                src="https://media.giphy.com/media/QTfX9Ejfra3ZmNxh6B/giphy.gif"
                alt="AI creativity animation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Transparent card overlays for depth (hidden on very small) */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-4 mx-auto hidden h-24 max-w-2xl rounded-2xl bg-white/5 blur-sm sm:block" />
        </section>

        {/* About Section (condensed from About page) */}
        <section
          ref={aboutRef}
          className="relative rounded-2xl bg-white/10 p-6 sm:p-8 backdrop-blur-md shadow-xl shadow-indigo-950/10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">About</h2>
          <div className="mt-3 space-y-3 text-sm sm:text-base text-white/90">
            <p>
              <strong>Vision:</strong> Democratize creative expression where AI
              insight and decentralized ownership help every creator find value
              and community.
            </p>
            <p>
              <strong>Mission:</strong> Build tools that analyze, enhance, and
              tokenize creative work — using machine learning to measure
              aesthetics, sentiment, and memorability, and Web3 primitives to
              reward and track provenance.
            </p>
          </div>
        </section>

        {/* Featured Artworks */}
        <section className="relative">
          <h2 className="mb-4 text-2xl sm:text-3xl font-bold">
            Featured Artworks
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {artworks.map((art) => (
              <a
                key={art.id}
                href="/gallery"
                className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl shadow-indigo-950/20 transition-transform hover:scale-[1.02]"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-black">
                  <img
                    src={art.image_url}
                    alt={art.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{art.title}</h3>
                  <p className="text-sm text-white/80">{art.artist}</p>
                  {art.classification && (
                    <p className="mt-1 text-xs text-white/70">
                      {art.classification}
                      {typeof art.classification_percentage === "number" &&
                        ` • ${Math.round(art.classification_percentage)}%`}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
          <div className="mt-4">
            <a
              href="/gallery"
              className="inline-block rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]"
            >
              Browse Full Gallery
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="relative">
          <h2 className="mb-6 text-2xl sm:text-3xl font-bold">Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                ref={(el) => (featureCardRefs.current[i] = el)}
                className="group rounded-2xl bg-white/10 p-6 backdrop-blur-md shadow-xl shadow-indigo-950/10 transition-transform will-change-transform hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
                  <span className="text-lg font-semibold">{i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-white/90">{f.desc}</p>
                <div className="mt-4 h-1 w-10 scale-x-0 rounded-full bg-white/60 transition-transform duration-300 group-hover:scale-x-100" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
