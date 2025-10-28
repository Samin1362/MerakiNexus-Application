import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-zinc-900 via-indigo-950 to-black">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl animate-pulse delay-75" />
      </div>

      {/* Loader Container */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Spinning Rings */}
        <div className="relative w-24 h-24">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-indigo-500 animate-spin" />

          {/* Middle Ring */}
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-indigo-400 border-l-purple-400 animate-spin-reverse"
            style={{ animationDuration: "1.5s" }}
          />

          {/* Inner Ring */}
          <div
            className="absolute inset-4 rounded-full border-4 border-transparent border-b-purple-300 border-r-indigo-300 animate-spin"
            style={{ animationDuration: "2s" }}
          />

          {/* Center Glow */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 backdrop-blur-sm animate-pulse" />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-xl font-semibold text-white mb-2 animate-pulse">
            {text}
          </p>
          <div className="flex gap-1.5 justify-center">
            <span
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>

        {/* Glass morphism card */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-64 h-64 bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl shadow-indigo-950/50" />
        </div>
      </div>

      {/* Additional CSS for reverse spin */}
      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
