// Mock data for pending artwork approvals
export const mockPendingArtworks = [
  {
    id: "ART-001",
    title: "Cosmic Dreams",
    artist: {
      name: "Luna Martinez",
      email: "luna@example.com",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop",
    dateSubmitted: "2024-09-12",
    status: "Pending Review",
    category: "Digital Art",
    description:
      "A mesmerizing digital artwork exploring cosmic themes and celestial beauty.",
  },
  {
    id: "ART-002",
    title: "Urban Symphony",
    artist: {
      name: "Carlos Rivera",
      email: "carlos@example.com",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=150&fit=crop",
    dateSubmitted: "2024-09-11",
    status: "Under Review",
    category: "Street Art",
    description:
      "Vibrant street art capturing the rhythm and energy of urban life.",
  },
  {
    id: "ART-003",
    title: "Nature's Embrace",
    artist: {
      name: "Emma Thompson",
      email: "emma@example.com",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop",
    dateSubmitted: "2024-09-10",
    status: "Pending Review",
    category: "Photography",
    description:
      "Stunning nature photography showcasing the raw beauty of wilderness.",
  },
  {
    id: "ART-004",
    title: "Abstract Emotions",
    artist: {
      name: "David Chen",
      email: "david@example.com",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=150&fit=crop",
    dateSubmitted: "2024-09-09",
    status: "Under Review",
    category: "Abstract",
    description:
      "An abstract composition exploring human emotions through color and form.",
  },
];

// Mock data for user requests
export const mockUserRequests = [
  {
    id: "USER-001",
    user: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face",
    },
    requestType: "Artist Verification",
    date: "2024-09-12",
    status: "Pending",
    details:
      "Requesting verification as a professional artist with portfolio review.",
  },
  {
    id: "USER-002",
    user: {
      name: "Michael Brown",
      email: "michael@example.com",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    requestType: "Profile Update",
    date: "2024-09-11",
    status: "Under Review",
    details:
      "Requesting approval for updated profile information and credentials.",
  },
  {
    id: "USER-003",
    user: {
      name: "Lisa Garcia",
      email: "lisa@example.com",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    },
    requestType: "Premium Account",
    date: "2024-09-10",
    status: "Pending",
    details: "Application for premium account upgrade with enhanced features.",
  },
];

// Mock recent activities
export const mockRecentActivities = [
  {
    id: 1,
    type: "approved",
    item: "Sunset Serenity",
    user: {
      name: "Alice Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face",
    },
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "rejected",
    item: "Digital Chaos",
    user: {
      name: "Bob Smith",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    type: "approved",
    item: "Artist Verification",
    user: {
      name: "Carol Davis",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    timestamp: "6 hours ago",
  },
  {
    id: 4,
    type: "approved",
    item: "Premium Upgrade",
    user: {
      name: "Alex Thompson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    timestamp: "8 hours ago",
  },
];
