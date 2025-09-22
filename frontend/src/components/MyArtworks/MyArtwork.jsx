import React from "react";
import { Trash2, Edit3, Eye } from "lucide-react";

const MyArtwork = ({ artwork, refEl, onEdit, onDelete, onDetails }) => {
  // Destructure artwork properties
  const {
    _id,
    title,
    medium,
    created_year,
    tags,
    image_url,
    classification,
    classification_percentage,
    art_value_usd,
  } = artwork;

  return (
    <div
      ref={refEl}
      className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/30 hover:border-purple-400/50 transition-all duration-300"
    >
      {/* Artwork Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image_url}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Classification Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white">
          {classification} • {classification_percentage.toFixed(1)}%
        </div>

        {/* Value Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-green-600/80 backdrop-blur-sm rounded-full text-xs text-white">
          ${art_value_usd.toLocaleString()}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <span>{medium}</span>
          <span>•</span>
          <span>{created_year}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
              +{tags.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onDetails(_id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors duration-200 text-sm"
          >
            <Eye className="w-4 h-4" />
            Details
          </button>
          <button
            onClick={() => onEdit(artwork)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 text-sm"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(_id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors duration-200 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyArtwork;
