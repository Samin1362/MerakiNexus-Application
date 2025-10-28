import React from "react";
import { Search, ImageOff, RefreshCw } from "lucide-react";

/**
 * ArtNotFound Component
 * Displays when no artworks match the search criteria
 * @param {string} searchTerm - The search term that returned no results
 * @param {function} onClear - Callback to clear search
 */
const ArtNotFound = ({ searchTerm = "", onClear }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Animated Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-black/20 backdrop-blur-md p-8 rounded-full border border-indigo-500/30">
          <ImageOff className="w-16 h-16 text-indigo-400" />
        </div>
      </div>

      {/* Main Message */}
      <h2 className="text-3xl font-bold text-white mb-3 text-center">
        No Artworks Found
      </h2>

      {/* Search Term Display */}
      {searchTerm && (
        <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <Search className="w-4 h-4 text-indigo-400" />
          <p className="text-white/70 text-sm">
            No results for{" "}
            <span className="font-semibold text-white">"{searchTerm}"</span>
          </p>
        </div>
      )}

      {/* Suggestions */}
      <div className="max-w-md text-center mb-8">
        <p className="text-white/60 mb-4">Try adjusting your search:</p>
        <ul className="space-y-2 text-sm text-white/50">
          <li className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
            Check your spelling
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
            Try different keywords
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
            Search by artist name or category
          </li>
        </ul>
      </div>

      {/* Action Button */}
      {onClear && (
        <button
          onClick={onClear}
          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-105"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Clear Search & View All
        </button>
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default ArtNotFound;
