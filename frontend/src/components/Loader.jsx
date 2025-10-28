import React from "react";
import { Sparkles } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-zinc-900 via-indigo-950 to-black overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        {/* Floating Gradient Orbs */}
        <div className="orb-1 absolute w-96 h-96 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-3xl" />
        <div className="orb-2 absolute w-80 h-80 bg-gradient-to-br from-pink-500/25 to-transparent rounded-full blur-3xl" />
        <div className="orb-3 absolute w-64 h-64 bg-gradient-to-br from-indigo-500/25 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main Loader Container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Orbital Loader System */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Central Core */}
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 animate-pulse shadow-2xl shadow-purple-500/50">
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm" />
            <div className="absolute inset-0 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>

          {/* Orbit Ring 1 */}
          <div className="orbit-1 absolute inset-0 rounded-full border-2 border-dashed border-purple-400/30">
            <div className="planet-1 absolute w-6 h-6 -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/50" />
          </div>

          {/* Orbit Ring 2 */}
          <div className="orbit-2 absolute inset-0 rounded-full border-2 border-dashed border-pink-400/30">
            <div className="planet-2 absolute w-5 h-5 top-1/2 -right-2.5 -translate-y-1/2 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg shadow-pink-500/50" />
          </div>

          {/* Orbit Ring 3 */}
          <div className="orbit-3 absolute inset-0 rounded-full border-2 border-dashed border-indigo-400/30">
            <div className="planet-3 absolute w-4 h-4 -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-500/50" />
          </div>

          {/* Outer Glow Ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500/50 border-r-pink-500/50 animate-spin opacity-40"
            style={{ animationDuration: "3s" }}
          />
        </div>

        {/* Loading Text with Glass Card */}
        <div className="relative">
          {/* Glass Background */}
          <div className="absolute inset-0 -inset-x-8 -inset-y-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl" />

          {/* Content */}
          <div className="relative text-center px-8 py-4">
            <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {text}
            </h3>
            <div className="flex gap-2 justify-center items-center">
              <div className="dot-1 w-2.5 h-2.5 bg-purple-400 rounded-full shadow-lg shadow-purple-500/50" />
              <div className="dot-2 w-2.5 h-2.5 bg-pink-400 rounded-full shadow-lg shadow-pink-500/50" />
              <div className="dot-3 w-2.5 h-2.5 bg-indigo-400 rounded-full shadow-lg shadow-indigo-500/50" />
            </div>
            <p className="text-white/60 text-sm mt-2">Please wait...</p>
          </div>
        </div>

        {/* Sparkle Effects */}
        <div className="sparkle-1 absolute w-1 h-1 bg-white rounded-full shadow-lg shadow-white" />
        <div className="sparkle-2 absolute w-1 h-1 bg-purple-300 rounded-full shadow-lg shadow-purple-300" />
        <div className="sparkle-3 absolute w-1 h-1 bg-pink-300 rounded-full shadow-lg shadow-pink-300" />
        <div className="sparkle-4 absolute w-1 h-1 bg-indigo-300 rounded-full shadow-lg shadow-indigo-300" />
      </div>

      {/* Animations */}
      <style>{`
        /* Floating Orbs */
        .orb-1 {
          top: -10%;
          left: -10%;
          animation: float1 20s ease-in-out infinite;
        }
        .orb-2 {
          top: 50%;
          right: -10%;
          animation: float2 15s ease-in-out infinite;
        }
        .orb-3 {
          bottom: -10%;
          left: 30%;
          animation: float3 18s ease-in-out infinite;
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(50px, 80px);
          }
        }
        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-60px, -70px);
          }
        }
        @keyframes float3 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(70px, -50px);
          }
        }

        /* Orbital Animations */
        .orbit-1 {
          animation: rotate 4s linear infinite;
        }
        .orbit-2 {
          animation: rotate 3s linear infinite reverse;
        }
        .orbit-3 {
          animation: rotate 5s linear infinite;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Planet Pulsing */
        .planet-1,
        .planet-2,
        .planet-3 {
          animation: pulse-scale 2s ease-in-out infinite;
        }
        .planet-2 {
          animation-delay: 0.3s;
        }
        .planet-3 {
          animation-delay: 0.6s;
        }

        @keyframes pulse-scale {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        /* Dot Wave Animation */
        .dot-1 {
          animation: wave 1.5s ease-in-out infinite;
        }
        .dot-2 {
          animation: wave 1.5s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        .dot-3 {
          animation: wave 1.5s ease-in-out infinite;
          animation-delay: 0.4s;
        }

        @keyframes wave {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        /* Sparkles */
        .sparkle-1 {
          top: 20%;
          right: 25%;
          animation: sparkle 3s ease-in-out infinite;
        }
        .sparkle-2 {
          top: 70%;
          left: 20%;
          animation: sparkle 2.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .sparkle-3 {
          top: 40%;
          right: 15%;
          animation: sparkle 3.5s ease-in-out infinite;
          animation-delay: 1s;
        }
        .sparkle-4 {
          bottom: 25%;
          left: 30%;
          animation: sparkle 2.8s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
