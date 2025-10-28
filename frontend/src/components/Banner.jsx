import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const bannerRef = useRef(null);
  const slideRef = useRef(null);
  const contentRef = useRef(null);
  const dotsRef = useRef([]);

  const navigate = useNavigate();

  // Banner slides data
  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=2000",
      title: "Discover AI-Generated Art",
      subtitle: "Explore Limitless Creativity",
      description:
        "Immerse yourself in a world where artificial intelligence meets artistic vision. Browse thousands of unique masterpieces.",
      cta: "Explore Gallery",
      ctaLink: "/gallery",
      gradient: "from-purple-600/80 via-pink-600/70 to-indigo-600/80",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=2000",
      title: "Showcase Your Talent",
      subtitle: "Join Our Artist Community",
      description:
        "Upload your AI creations and share them with art enthusiasts worldwide. Start earning from your digital masterpieces.",
      cta: "Start Creating",
      ctaLink: "/upload",
      gradient: "from-indigo-600/80 via-purple-600/70 to-pink-600/80",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=2000",
      title: "Collect Unique NFTs",
      subtitle: "Own Digital Art History",
      description:
        "Purchase exclusive AI-generated artworks as NFTs. Build your digital collection with authenticated pieces.",
      cta: "View Collections",
      ctaLink: "/gallery",
      gradient: "from-pink-600/80 via-indigo-600/70 to-purple-600/80",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=2000",
      title: "AI-Powered Analysis",
      subtitle: "Advanced Art Classification",
      description:
        "Our cutting-edge AI analyzes and classifies artwork with precision. Experience the fusion of technology and art.",
      cta: "Learn More",
      ctaLink: "/about",
      gradient: "from-purple-600/80 via-indigo-600/70 to-pink-600/80",
    },
  ];

  // Initial entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Banner entrance
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // Slide entrance
      gsap.fromTo(
        slideRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }
      );

      // Content staggered entrance
      if (contentRef.current) {
        const elements = contentRef.current.children;
        gsap.fromTo(
          elements,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.3,
          }
        );
      }

      // Dots entrance
      gsap.fromTo(
        dotsRef.current,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.8,
        }
      );
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  // Smooth horizontal swipe transition
  const animateSlideTransition = useCallback(
    (direction) => {
      if (isAnimating) return;
      setIsAnimating(true);

      const timeline = gsap.timeline({
        onComplete: () => setIsAnimating(false),
      });

      const slideDirection = direction === "next" ? 1 : -1;

      // Animate out current content
      timeline.to(contentRef.current.children, {
        opacity: 0,
        x: -50 * slideDirection,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.in",
      });

      // Slide out current image (to left for next, to right for prev)
      timeline.to(
        slideRef.current,
        {
          x: -100 * slideDirection + "%",
          duration: 0.8,
          ease: "power2.inOut",
        },
        "<0.1"
      );

      // Change slide
      timeline.call(() => {
        if (direction === "next") {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
        } else {
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        }
      });

      // Reset position and slide in new image (from right for next, from left for prev)
      timeline.set(slideRef.current, { x: 100 * slideDirection + "%" });
      timeline.to(slideRef.current, {
        x: "0%",
        duration: 0.8,
        ease: "power2.out",
      });

      // Animate in new content
      timeline.fromTo(
        contentRef.current.children,
        { opacity: 0, x: 50 * slideDirection },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "<0.3"
      );
    },
    [isAnimating, slides.length]
  );

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      animateSlideTransition("next");
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [currentSlide, isAnimating, animateSlideTransition]);

  const handleNext = () => {
    animateSlideTransition("next");
  };

  const handlePrev = () => {
    animateSlideTransition("prev");
  };

  const handleDotClick = (index) => {
    if (isAnimating || index === currentSlide) return;

    const timeline = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    setIsAnimating(true);

    const direction = index > currentSlide ? 1 : -1;

    // Animate out current content
    timeline.to(contentRef.current.children, {
      opacity: 0,
      x: -30 * direction,
      duration: 0.4,
      stagger: 0.03,
      ease: "power2.in",
    });

    // Slide out current image
    timeline.to(
      slideRef.current,
      {
        x: -100 * direction + "%",
        duration: 0.7,
        ease: "power2.inOut",
      },
      "<0.1"
    );

    timeline.call(() => setCurrentSlide(index));

    // Reset and slide in new image
    timeline.set(slideRef.current, { x: 100 * direction + "%" });
    timeline.to(slideRef.current, {
      x: "0%",
      duration: 0.7,
      ease: "power2.out",
    });

    // Animate in new content
    timeline.fromTo(
      contentRef.current.children,
      { opacity: 0, x: 30 * direction },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      },
      "<0.2"
    );
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div
      ref={bannerRef}
      className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-gradient-to-br from-zinc-900 via-indigo-950 to-black"
    >
      {/* Background Image with Overlay */}
      <div ref={slideRef} className="absolute inset-0 w-full h-full">
        <img
          src={currentSlideData.image}
          alt={currentSlideData.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.gradient} backdrop-blur-[2px]`}
        />
        {/* Additional Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div ref={contentRef} className="max-w-3xl space-y-6">
          {/* Subtitle with Icon */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-300 animate-pulse-slow" />
            <span className="text-purple-200 text-sm md:text-base font-semibold uppercase tracking-wider">
              {currentSlideData.subtitle}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {currentSlideData.title}
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
            {currentSlideData.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => navigate(currentSlideData.ctaLink)}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              {currentSlideData.cta}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <button
              onClick={() => navigate("/about")}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-semibold rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        disabled={isAnimating}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/30 text-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        disabled={isAnimating}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/30 text-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            ref={(el) => (dotsRef.current[index] = el)}
            onClick={() => handleDotClick(index)}
            disabled={isAnimating}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide
                ? "w-12 h-3 bg-gradient-to-r from-purple-500 to-pink-500"
                : "w-3 h-3 bg-white/40 hover:bg-white/60"
            } disabled:cursor-not-allowed`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            transition: "width 0.5s ease-out",
          }}
        />
      </div>
    </div>
  );
};

export default Banner;
