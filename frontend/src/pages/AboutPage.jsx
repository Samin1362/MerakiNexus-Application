import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AboutPage() {
  // Reduced motion preference
  const [reduceMotion, setReduceMotion] = useState(false);

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
          xmlns="http://www.w3.org/2000/svg"
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
                <a
                  href="#upload"
                  aria-label="Upload Artwork"
                  className={`rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] ${focusRing}`}
                >
                  Upload Artwork
                </a>
              </div>
            </div>
            {/* Hero visual: local image placeholder */}
            <div className="relative mt-10 lg:mt-0">
              <img
                src="/images/about-hero.jpg"
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
          <article className="grid grid-cols-1 gap-6 rounded-2xl bg-white/10 p-6 backdrop-blur-md shadow-xl shadow-black/20 md:grid-cols-2">
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
            <div className="relative">
              {/* Illustration placeholder */}
              <img
                src="/images/about-hero.jpg"
                alt="AI-inspired illustration"
                loading="lazy"
                className="h-full w-full rounded-xl border border-white/10 bg-white/5 object-cover"
              />
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
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              "/images/about-hero.jpg",
              "/images/about-hero.jpg",
              "/images/about-hero.jpg",
            ].map((src, i) => (
              <article
                key={i}
                ref={(el) => (previewCardsRef.current[i] = el)}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20"
              >
                <img
                  src={src}
                  alt={`Preview artwork ${i + 1}`}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    Featured Artwork {i + 1}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    AI-evaluated • Tokenizable
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <a
              href="#gallery"
              aria-label="Open Gallery"
              className={`inline-block rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] ${focusRing}`}
            >
              Open Gallery
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
                role: "Founder & ML Engineer",
                bio: "Building aesthetic and valuation models.",
              },
              {
                name: "Maya Kapoor",
                role: "Product & Design",
                bio: "Shapes the creative UX and on-chain flows.",
              },
              {
                name: "Kenji Tanaka",
                role: "Blockchain Engineer",
                bio: "Leads smart-contract integration and token design.",
              },
            ].map((m, i) => (
              <article
                key={m.name}
                ref={(el) => (teamCardsRef.current[i] = el)}
                className="flex flex-col items-center rounded-2xl bg-white/10 p-6 text-center backdrop-blur-md shadow-lg shadow-black/20"
              >
                <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border border-white/20 bg-white/10">
                  <img
                    src={`/images/team-${m.name
                      .split(" ")[0]
                      .toLowerCase()}.jpg`}
                    alt={`${m.name} portrait`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">{m.name}</h3>
                <p className="text-sm text-white/80">{m.role}</p>
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
            Upload your work, explore the gallery, or join our research
            community.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#upload"
              aria-label="Upload Artwork"
              className={`rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] ${focusRing}`}
            >
              Upload Artwork
            </a>
            <a
              href="mailto:hello@merakinexus.example"
              aria-label="Contact Us"
              className={`rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] ${focusRing}`}
            >
              Contact Us
            </a>
          </div>
          <p className="mt-4 text-sm text-white/80">
            Contact: hello@merakinexus.example
          </p>
        </section>
      </main>


    </div>
  );
}

export default AboutPage;
