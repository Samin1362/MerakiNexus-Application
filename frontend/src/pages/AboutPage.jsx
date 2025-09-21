import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import model training images
import model21 from "../assets/images/model-training-images/21.png";
import model22 from "../assets/images/model-training-images/22.png";
import model23 from "../assets/images/model-training-images/23.png";
import model24 from "../assets/images/model-training-images/24.png";
import model25 from "../assets/images/model-training-images/25.png";

gsap.registerPlugin(ScrollTrigger);

function AboutPage() {
  // Reduced motion preference
  const [reduceMotion, setReduceMotion] = useState(false);

  // Gallery artworks state
  const [galleryArtworks, setGalleryArtworks] = useState([]);

  // Page refs
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroCtasRef = useRef(null);
  const visionRef = useRef(null);
  const buildRef = useRef(null);
  const howRef = useRef(null);
  const researchRef = useRef(null);
  const galleryPreviewRef = useRef(null);
  const teamRef = useRef(null);
  const roadmapRef = useRef(null);
  const faqRef = useRef(null);
  const contactRef = useRef(null);

  // Collections for staggered animations
  const featureCardsRef = useRef([]);
  const timelineStepsRef = useRef([]);
  const previewCardsRef = useRef([]);
  const teamCardsRef = useRef([]);
  const roadmapItemsRef = useRef([]);

  useEffect(() => {
    // Document title for SEO hint
    document.title = "About — Meraki Nexus";

    // Respect prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener?.("change", onChange);

    return () => {
      mq.removeEventListener?.("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      // Hero mount animations
      const tlHero = gsap.timeline({ defaults: { ease: "power3.out" } });
      tlHero
        .fromTo(
          heroTitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
        .fromTo(
          heroSubtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.25"
        )
        .fromTo(
          heroCtasRef.current?.querySelectorAll("a,button"),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
          "-=0.2"
        );

      // Vision card reveal
      if (visionRef.current) {
        gsap.fromTo(
          visionRef.current,
          { opacity: 0, scale: 0.98, y: 18 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: visionRef.current, start: "top 80%" },
          }
        );
      }

      // Feature cards stagger
      if (featureCardsRef.current.length) {
        const cards = featureCardsRef.current.filter(Boolean);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 16, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: buildRef.current, start: "top 80%" },
          }
        );
      }

      // How it works timeline
      if (timelineStepsRef.current.length) {
        const steps = timelineStepsRef.current.filter(Boolean);
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: howRef.current, start: "top 80%" },
        });
        steps.forEach((step, idx) => {
          tl.fromTo(
            step,
            { opacity: 0, x: idx % 2 === 0 ? -20 : 20, scale: 0.98 },
            { opacity: 1, x: 0, scale: 1, duration: 0.4 },
            idx * 0.12
          );
        });
      }

      // Research paragraph reveals
      if (researchRef.current) {
        const items = researchRef.current.querySelectorAll(
          "[data-research-item]"
        );
        gsap.fromTo(
          items,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: researchRef.current, start: "top 85%" },
          }
        );
      }

      // Gallery preview parallax / reveal
      if (previewCardsRef.current.length) {
        const cards = previewCardsRef.current.filter(Boolean);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: galleryPreviewRef.current,
              start: "top 85%",
            },
          }
        );
        cards.forEach((card, i) => {
          gsap.to(card, {
            yPercent: -3 - i,
            ease: "none",
            scrollTrigger: {
              trigger: galleryPreviewRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.2,
            },
          });
        });
      }

      // Team cards pop-in
      if (teamCardsRef.current.length) {
        const items = teamCardsRef.current.filter(Boolean);
        gsap.fromTo(
          items,
          { opacity: 0, y: 14, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: teamRef.current, start: "top 85%" },
          }
        );
      }

      // Roadmap alternating slide
      if (roadmapItemsRef.current.length) {
        const items = roadmapItemsRef.current.filter(Boolean);
        items.forEach((item, idx) => {
          gsap.fromTo(
            item,
            { opacity: 0, x: idx % 2 === 0 ? -18 : 18 },
            {
              opacity: 1,
              x: 0,
              duration: 0.45,
              ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 90%" },
            }
          );
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  // Fetch gallery artworks data
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await fetch("/art-data.json");
        const data = await response.json();
        // Get first 6 artworks for preview
        const artworks = Array.isArray(data)
          ? data
          : Array.isArray(data?.artworks)
          ? data.artworks
          : [];
        setGalleryArtworks(artworks.slice(0, 6));
      } catch (error) {
        console.error("Error fetching gallery data:", error);
        setGalleryArtworks([]);
      }
    };

    fetchGalleryData();
  }, []);

  // Helpers: focus ring classes
  const focusRing =
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white/70";

  return (
    <div
      ref={rootRef}
      className="min-h-screen w-full bg-gradient-to-br mt-[30px] from-purple-600 via-indigo-700 to-black text-white"
    >
      {/* Hero Section: full-width with gradient and abstract shape */}
      <header ref={heroRef} className="relative overflow-hidden">
        {/* Decorative abstract shape (accessible role="img") */}
        <svg
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 text-white/10 blur-3xl"
          viewBox="0 0 200 200"
          xmlns="https://i.postimg.cc/6qsJFhZh/temp-Imagej0by-Qj.avif"
          role="img"
          aria-label="Abstract blurred shape"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>
          </defs>
          <path
            d="M40,60 C65,20 135,20 160,60 C185,100 135,160 100,160 C65,160 15,100 40,60 Z"
            fill="url(#g1)"
          />
        </svg>

        {/* Layout: center on mobile, left-aligned on lg+ */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-2 lg:items-center">
            <div>
              {/* Hero Title */}
              <h1
                ref={heroTitleRef}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
              >
                Meraki Nexus — Where AI Meets Creativity & Web3
              </h1>
              {/* Hero Subtitle */}
              <p
                ref={heroSubtitleRef}
                className="mt-4 text-base sm:text-lg text-white/90"
              >
                Empowering creators and collectors by combining generative AI,
                aesthetic insight, and decentralized ownership. Craft. Score.
                Own.
              </p>
              {/* Hero CTAs */}
              <div
                ref={heroCtasRef}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <a
                  href="#gallery"
                  aria-label="Explore Gallery"
                  className={`rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] ${focusRing}`}
                >
                  Explore Gallery
                </a>
              </div>
            </div>
            {/* Hero visual: local image placeholder */}
            <div className="relative mt-10 lg:mt-0">
              <img
                src="https://i.postimg.cc/Z5CMrM0D/temp-Image-ABECt9.avif"
                alt="Abstract AI art composition"
                loading="lazy"
                className="w-full rounded-2xl border border-white/10 bg-white/5 object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Vision & Mission: two-column card on desktop */}
        <section
          ref={visionRef}
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          {/* Card */}
          <article className=" rounded-2xl bg-white/10 p-6 backdrop-blur-md shadow-xl shadow-black/20 md:grid-cols-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Vision & Mission
              </h2>
              <p className="mt-4 text-white/90">
                <strong>Vision:</strong> To democratize creative expression by
                powering a new web of art discovery where AI insight and
                decentralized ownership help every creator find value and
                community.
              </p>
              <p className="mt-3 text-white/90">
                <strong>Mission:</strong> We build tools that analyze, enhance,
                and tokenize creative work — using machine learning to measure
                aesthetics, sentiment, and memorability, and Web3 primitives to
                reward and track provenance.
              </p>
            </div>
          </article>
        </section>

        {/* What We Build: feature cards */}
        <section
          ref={buildRef}
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">What We Build</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "AI-powered aesthetic & sentiment scoring to surface meaningful artworks.",
              "Generative tools and rewards that encourage creative experimentation (GAN-based pipelines).",
              "A valuation engine that estimates art price using visual features and market signals.",
              "Web3 integration for minting, ownership, and DeFi-enabled art economies.",
            ].map((text, i) => (
              <article
                key={i}
                ref={(el) => (featureCardsRef.current[i] = el)}
                className="rounded-2xl bg-white/10 p-6 backdrop-blur-md shadow-lg shadow-black/20"
              >
                <p className="text-white/90">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How It Works: horizontal timeline on desktop, stacked on mobile */}
        <section
          ref={howRef}
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">How It Works</h2>
          <ol className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
            {[
              { title: "Create", text: "Artists create or upload artwork." },
              {
                title: "Analyze",
                text: "Our models extract visual features and run aesthetic, sentiment, and memorability analyses.",
              },
              {
                title: "Score & Value",
                text: "We compute classification, classification percentage, art evaluation score, and estimate art value.",
              },
              {
                title: "Collect & Reward",
                text: "Creators can tokenize work on-chain, participate in DeFi reward systems, and connect with collectors.",
              },
            ].map((step, i) => (
              <li
                key={step.title}
                ref={(el) => (timelineStepsRef.current[i] = el)}
                className="relative rounded-2xl bg-white/10 p-6 backdrop-blur-md shadow-lg shadow-black/20"
              >
                <div className="mb-2 text-sm text-white/70">Step {i + 1}</div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-white/90">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Models & Research: technical overview */}
        <section
          ref={researchRef}
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">Models & Research</h2>
          <div className="mt-4 space-y-4">
            <p data-research-item className="text-white/90">
              We combine state-of-the-art vision models (EfficientNet-derived
              classifiers, position-aware transformers such as PIT, and GANs for
              generation) to understand style and aesthetics.
            </p>
            <p data-research-item className="text-white/90">
              Aesthetic scoring uses color distribution, contrast, composition,
              and learned perceptual features; memorability and sentiment are
              predicted with specialized classifiers fine-tuned on curated art
              datasets.
            </p>
            <p data-research-item className="text-white/90">
              Our valuation model synthesizes visual features with historical
              market signals and community metrics to propose an estimated art
              value.
            </p>
          </div>

          {/* Model Training Images */}
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold text-white">
              Model Training Process
            </h3>

            {/* Image 21 */}
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md shadow-lg shadow-black/20">
              <img
                src={model21}
                alt="Model training process - Step 1"
                className="w-full h-auto rounded-xl border border-white/10"
                loading="lazy"
              />
            </div>

            {/* Images 22 and 23 side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md shadow-lg shadow-black/20">
                <img
                  src={model22}
                  alt="Model training process - Step 2"
                  className="w-full h-auto rounded-xl border border-white/10"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md shadow-lg shadow-black/20">
                <img
                  src={model23}
                  alt="Model training process - Step 3"
                  className="w-full h-auto rounded-xl border border-white/10"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Image 24 */}
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md shadow-lg shadow-black/20">
              <img
                src={model24}
                alt="Model training process - Step 4"
                className="w-full h-auto rounded-xl border border-white/10"
                loading="lazy"
              />
            </div>

            {/* Image 25 */}
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md shadow-lg shadow-black/20">
              <img
                src={model25}
                alt="Model training process - Step 5"
                className="w-full h-auto rounded-xl border border-white/10"
                loading="lazy"
              />
            </div>
          </div>

          {/* GitHub Repository Button */}
          <div className="mt-6 flex justify-center">
            <a
              href="https://github.com/Samin1362/MerakiNexus-V2/tree/main/art_classification_model/subject-2%20(CSE499-B)"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Model Research on GitHub"
              className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:from-purple-500 hover:to-indigo-500 ${focusRing}`}
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              View Research Repository
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </section>

        {/* Gallery Preview + CTA: horizontal scroll on mobile */}
        <section
          ref={galleryPreviewRef}
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">Gallery Preview</h2>
          <p className="mt-2 text-white/90">
            A snapshot of works scored and showcased by Meraki Nexus. Explore
            the full collection to see evaluations, value estimations, and
            tokenization options.
          </p>
          <p className="mt-1 text-sm text-white/60 sm:hidden">
            ← Swipe to explore more artworks →
          </p>

          {/* Horizontal scroll container for mobile, grid for desktop */}
          <div
            className="mt-6 overflow-x-auto sm:overflow-x-visible scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 min-w-max sm:min-w-0 pb-2">
              {galleryArtworks.length > 0
                ? galleryArtworks.map((artwork, i) => (
                    <article
                      key={artwork.id || i}
                      ref={(el) => (previewCardsRef.current[i] = el)}
                      className="flex-shrink-0 w-80 sm:w-auto overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300"
                    >
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        loading="lazy"
                        className="h-40 w-full object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {artwork.title}
                        </h3>
                        <p className="text-sm text-white/70 mb-2">
                          by {artwork.artist}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
                            {artwork.classification}
                          </span>
                          <span className="text-sm font-semibold text-green-400">
                            ${artwork.art_value_usd?.toLocaleString() || "N/A"}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 bg-white/10 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full"
                              style={{
                                width: `${
                                  artwork.classification_percentage || 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-white/60">
                            {artwork.classification_percentage?.toFixed(1) || 0}
                            %
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                : // Loading placeholder
                  Array.from({ length: 3 }).map((_, i) => (
                    <article
                      key={`loading-${i}`}
                      className="flex-shrink-0 w-80 sm:w-auto overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 animate-pulse"
                    >
                      <div className="h-40 w-full bg-white/10"></div>
                      <div className="p-4">
                        <div className="h-5 bg-white/10 rounded mb-2"></div>
                        <div className="h-4 bg-white/10 rounded w-2/3 mb-2"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-6 bg-white/10 rounded-full w-20"></div>
                          <div className="h-4 bg-white/10 rounded w-16"></div>
                        </div>
                      </div>
                    </article>
                  ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/gallery"
              aria-label="Open Gallery"
              className={`inline-block rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold shadow-lg shadow-black/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${focusRing}`}
            >
              Explore Full Gallery →
            </a>
          </div>
        </section>

        {/* Team & Contributors */}
        <section
          ref={teamRef}
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">
            Team & Contributors
          </h2>
          <p className="mt-2 text-white/90">
            A small team of ML researchers, product designers, and blockchain
            engineers bringing Meraki Nexus to life.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                name: "Samin Israk",
                role: "Project Lead, Frontend Developer, and Blockchain Engineer",
                university: "North South University",
                bio: "Oversees the project development, implements frontend solutions, and integrates blockchain functionalities for secure and decentralized workflows.",
                image: "https://i.postimg.cc/kG86dwpM/temp-Image-Kjgh-C9.avif",
              },
              {
                name: "A.F.M. Khairul Amin",
                role: "Data Engineer & Project Manager",
                university: "North South University",
                bio: "Manages the project timeline, coordinates the team, and ensures smooth data pipeline operations for reliable analytics and system performance.",
                image: "https://avatars.githubusercontent.com/u/197520522?v=4",
              },
              {
                name: "Md. Shahporan Hosen Shanto",
                role: "Backend Developer",
                university: "North South University",
                bio: "Designs and develops backend systems, manages databases, and implements server-side logic to support the platform's functionalities.",
                image: "https://avatars.githubusercontent.com/u/121654189?v=4",
              },
              {
                name: "Md. Razwanul Islam Tanvir",
                role: "Research & Development",
                university: "North South University",
                bio: "Leads experimental workflows, explores new algorithms and AI models, and drives research initiatives to enhance the project's technical capabilities.",
                image: "https://avatars.githubusercontent.com/u/90282182?v=4",
              },
              {
                name: "Dr. Mohammad Abdul Qayum",
                role: "Faculty Advisor, Research & Development",
                university: "North South University",
                bio: "Provides academic guidance, reviews research methodologies, and advises on innovative solutions and technical strategies for the project.",
                image:
                  "https://ece.northsouth.edu/wp-content/uploads/2025/01/ResumePic3.jpg",
              },
            ].map((m, i) => (
              <article
                key={m.name}
                ref={(el) => (teamCardsRef.current[i] = el)}
                className="flex flex-col items-center rounded-2xl bg-white/10 p-6 text-center backdrop-blur-md shadow-lg shadow-black/20"
              >
                <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border border-white/20 bg-white/10">
                  <img
                    src={m.image}
                    alt={`${m.name} portrait`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">{m.name}</h3>
                <p className="text-sm text-white/80">{m.role}</p>
                {m.university && (
                  <div className="mt-2 inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1">
                    <p className="text-xs font-medium text-white">
                      {m.university}
                    </p>
                  </div>
                )}
                <p className="mt-2 text-sm text-white/90">{m.bio}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section
          ref={roadmapRef}
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">Roadmap</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                title: "Phase 1 — Research & Prototype",
                text: "Foundational research on models and early prototypes for aesthetic, sentiment, and valuation pipelines.",
              },
              {
                title: "Phase 2 — Alpha: Scoring + Gallery",
                text: "Launch internal alpha for scoring pipeline and a curated gallery for early feedback.",
              },
              {
                title: "Phase 3 — Beta: Tokenization & Rewards",
                text: "Enable minting, provenance tracking, and community rewards through Web3 integrations.",
              },
              {
                title: "Phase 4 — Public Launch & Partnerships",
                text: "Open platform with ecosystem partners, creator programs, and collector tools.",
              },
            ].map((r, i) => (
              <article
                key={r.title}
                ref={(el) => (roadmapItemsRef.current[i] = el)}
                className="rounded-2xl bg-white/10 p-6 backdrop-blur-md shadow-lg shadow-black/20"
              >
                <h3 className="text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 text-white/90">{r.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section
          ref={faqRef}
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">FAQ</h2>
          <div className="mt-6 space-y-4">
            <article className="rounded-2xl bg-white/10 p-6 backdrop-blur-md shadow-lg shadow-black/20">
              <h3 className="text-lg font-semibold">
                Q: How is the art value estimated?
              </h3>
              <p className="mt-2 text-white/90">
                A: We combine visual feature scores, historical sales data, and
                community signals to give a data-informed estimate. It’s a
                starting point, not a guarantee.
              </p>
            </article>
            <article className="rounded-2xl bg-white/10 p-6 backdrop-blur-md shadow-lg shadow-black/20">
              <h3 className="text-lg font-semibold">
                Q: Can I mint artwork on Meraki Nexus?
              </h3>
              <p className="mt-2 text-white/90">
                A: Yes — once artwork is analyzed, creators can opt to mint and
                list works for collectors using our Web3 tools.
              </p>
            </article>
            <article className="rounded-2xl bg-white/10 p-6 backdrop-blur-md shadow-lg shadow-black/20">
              <h3 className="text-lg font-semibold">
                Q: How does the scoring handle AI-generated art?
              </h3>
              <p className="mt-2 text-white/90">
                A: Our models analyze visual features regardless of creation
                method. We surface provenance and generation metadata so
                collectors can make informed choices.
              </p>
            </article>
          </div>
        </section>

        {/* Call to Action & Contact */}
        <section
          ref={contactRef}
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">Join the Nexus</h2>
          <p className="mt-2 text-white/90">
            Explore the gallery, or join our research
            community.
          </p>
          <div className="mt-3 items-center">
            
            <a
              href="mailto:hello@merakinexus.example"
              aria-label="Contact Us"
              className={`rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] ${focusRing}`}
            >
              Contact Us
            </a>
          </div>
          <p className="mt-4 text-sm text-white/80">
            Contact: saminisrak1991@gmail.com
          </p>
        </section>
      </main>
    </div>
  );
}

export default AboutPage;
