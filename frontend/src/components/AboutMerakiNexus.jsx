import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Target, Zap, Sparkles } from "lucide-react";

const AboutMerakiNexus = () => {
  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const visionRef = useRef(null);
  const missionRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation timeline
      const tl = gsap.timeline();

      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
      )
        .fromTo(
          headerRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(
          [visionRef.current, missionRef.current],
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .fromTo(
          footerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power1.out" },
          "-=0.2"
        );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 p-6 shadow-2xl"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-indigo-600/10 opacity-50" />

      {/* Decorative blur orbs */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />

      {/* Header Section */}
      <div
        ref={headerRef}
        className="relative z-10 border-b border-white/10 pb-5 mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          <h3 className="text-2xl font-extrabold text-center bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent uppercase tracking-wide">
            About MerakiNexus
          </h3>
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
        </div>
        <p className="text-center text-white/60 text-xs font-medium">
          Pioneering Digital Art Innovation
        </p>
      </div>

      {/* Content Sections */}
      <div className="relative z-10 space-y-5">
        {/* Vision Section */}
        <div
          ref={visionRef}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-md p-4 border border-purple-400/20 transition-all duration-300 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/20"
        >
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          <div className="relative flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-xl shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                Our Vision
                <div className="h-px flex-1 bg-gradient-to-r from-purple-400/50 to-transparent" />
              </h4>
              <p className="text-white/85 text-sm leading-relaxed">
                Democratize creative expression where AI insight and
                decentralized ownership help every creator find value,
                recognition, and community in the digital renaissance.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div
          ref={missionRef}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 via-pink-500/10 to-indigo-500/10 backdrop-blur-md p-4 border border-indigo-400/20 transition-all duration-300 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/20"
        >
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          <div className="relative flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                Our Mission
                <div className="h-px flex-1 bg-gradient-to-r from-indigo-400/50 to-transparent" />
              </h4>
              <p className="text-white/85 text-sm leading-relaxed">
                Build revolutionary tools that analyze, enhance, and tokenize
                creative work using machine learning and Web3 primitives to
                reward artistic excellence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        ref={footerRef}
        className="relative z-10 mt-6 pt-5 border-t border-white/10"
      >
        <div className="flex items-center justify-center gap-2 text-white/50 text-xs">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-400/50" />
          <span className="font-medium">Est. 2024</span>
          <span>•</span>
          <span>AI-Powered</span>
          <span>•</span>
          <span>Blockchain-Verified</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-400/50" />
        </div>
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-purple-400/10 rounded-tr-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-indigo-400/10 rounded-bl-2xl pointer-events-none" />
    </div>
  );
};

export default AboutMerakiNexus;
