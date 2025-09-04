import { useEffect, useRef, useState, memo } from "react";
import { useNavigate } from "react-router-dom";

// Memoized Artwork Card
const ArtCard = memo(({ art }) => (
  <a
    key={art.id}
    href="/gallery"
    className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl shadow-indigo-950/20 transform transition-transform duration-300 hover:scale-105"
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
));

function HomePage() {
  const [artworks, setArtworks] = useState([]);
  const rootRef = useRef(null);
  const navigate = useNavigate();

  const heroTitleRef = useRef(null);
  const heroTaglineRef = useRef(null);
  const ctaRef = useRef(null);
  const heroMediaRef = useRef(null);

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
      className="relative min-h-screen w-full md:mt-[50px] overflow-x-hidden overflow-y-auto bg-gradient-to-br from-purple-500 via-indigo-600 to-indigo-700 text-white"
    >
      {/* Light gradient overlays constrained to viewport */}
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-2xl hidden md:block" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-2xl hidden md:block" />

      {/* Grid wrapper */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:px-8 md:gap-12 md:py-16">
        {/* Hero Section */}
        <section className="relative grid items-center gap-8 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1
              ref={heroTitleRef}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow"
            >
              Welcome
            </h1>
            <p
              ref={heroTaglineRef}
              className="mt-4 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto md:mx-0"
            >
              <span className="font-bold">MerakiNexus</span> is where AI-driven
              creativity meets Web3. Artists can showcase their work while AI
              evaluates its style and value, and blockchain enables secure,
              transparent ownership and trading of digital art.
            </p>
            <div className="mt-8">
              <button
                ref={ctaRef}
                className="rounded-2xl bg-white/10 px-6 py-3 sm:px-8 text-white backdrop-blur-md shadow-lg shadow-indigo-900/20 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40 transition-transform transform hover:scale-105"
                onClick={() => navigate("/gallery")}
              >
                Explore Now
              </button>
            </div>
          </div>

          {/* Hero Media replaced with video for smoothness */}
          <div
            ref={heroMediaRef}
            className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-fuchsia-400/10 via-cyan-300/10 to-indigo-400/10 blur-xl" />
            <img
              src="https://images.unsplash.com/photo-1752649935031-7c35f43b24b0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fGNyZWF0aXZlJTIwYXJ0d29ya3xlbnwwfHwwfHx8MA%3D%3D"
              alt="AI creativity animation"
              className="relative w-full h-full object-cover rounded-2xl"
            />
          </div>
        </section>

        {/* About Section */}
        <section className="relative rounded-2xl bg-white/10 p-6 sm:p-8 backdrop-blur-md shadow-xl shadow-indigo-950/10">
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
              <ArtCard key={art.id} art={art} />
            ))}
          </div>
          <div className="mt-4">
            <a
              href="/gallery"
              className="inline-block rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold shadow-lg shadow-black/10 transition-transform transform hover:scale-105"
            >
              Browse Full Gallery
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative">
          <h2 className="mb-6 text-2xl sm:text-3xl font-bold">Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group rounded-2xl bg-white/10 p-6 backdrop-blur-md shadow-xl shadow-indigo-950/10 transition-transform transform hover:-translate-y-1 duration-300"
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
