import React from "react";
import { Eye, Check, X, Star, Trash2 } from "lucide-react";

const ArtworkActions = ({ artwork, onView, onAction, variant = "compact" }) => {
  if (variant === "compact") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => onView(artwork)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => onAction("approve", artwork.id)}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
          title="Approve"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={() => onAction("reject", artwork.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
          title="Reject"
        >
          <X className="h-4 w-4" />
        </button>
        <button
          onClick={() => onAction("feature", artwork.id)}
          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
          title="Feature"
        >
          <Star className="h-4 w-4" />
        </button>
        <button
          onClick={() => onAction("delete", artwork.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 hover:shadow-sm"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Full buttons for modal
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => onAction("approve", artwork.id)}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
      >
        <Check className="h-4 w-4" />
        Approve
      </button>
      <button
        onClick={() => onAction("reject", artwork.id)}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
      >
        <X className="h-4 w-4" />
        Reject
      </button>
      <button
        onClick={() => onAction("feature", artwork.id)}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
      >
        <Star className="h-4 w-4" />
        Feature
      </button>
    </div>
  );
};

export default ArtworkActions;
