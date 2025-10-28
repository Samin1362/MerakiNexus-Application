// Mock data for tokens
export const mockTokens = [
  {
    id: "TKN-001",
    owner: {
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face",
    },
    value: 2.5,
    status: "Active",
    createdDate: "2024-09-01",
    metadata: {
      type: "Art Token",
      artwork: "Digital Sunset",
      rarity: "Rare",
    },
    history: [
      {
        date: "2024-09-01",
        action: "Minted",
        details: "Token created for Digital Sunset artwork",
      },
      {
        date: "2024-09-05",
        action: "Transfer",
        details: "Transferred to current owner",
      },
    ],
  },
  {
    id: "TKN-002",
    owner: {
      name: "Bob Smith",
      email: "bob@example.com",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    value: 1.8,
    status: "Pending",
    createdDate: "2024-09-10",
    metadata: {
      type: "Utility Token",
      artwork: "Abstract Mind",
      rarity: "Common",
    },
    history: [
      {
        date: "2024-09-10",
        action: "Minted",
        details: "Token created and pending approval",
      },
    ],
  },
  {
    id: "TKN-003",
    owner: {
      name: "Carol Davis",
      email: "carol@example.com",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    value: 5.2,
    status: "Locked",
    createdDate: "2024-08-25",
    metadata: {
      type: "Premium Token",
      artwork: "Golden Horizon",
      rarity: "Legendary",
    },
    history: [
      {
        date: "2024-08-25",
        action: "Minted",
        details: "Premium token created",
      },
      {
        date: "2024-09-01",
        action: "Locked",
        details: "Token locked for staking rewards",
      },
    ],
  },
  {
    id: "TKN-004",
    owner: {
      name: "David Wilson",
      email: "david@example.com",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    value: 0.9,
    status: "Burned",
    createdDate: "2024-07-15",
    metadata: {
      type: "Art Token",
      artwork: "Destroyed Canvas",
      rarity: "Common",
    },
    history: [
      { date: "2024-07-15", action: "Minted", details: "Token created" },
      {
        date: "2024-08-20",
        action: "Burned",
        details: "Token permanently destroyed",
      },
    ],
  },
  {
    id: "TKN-005",
    owner: {
      name: "Emma Brown",
      email: "emma@example.com",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    },
    value: 3.7,
    status: "Active",
    createdDate: "2024-09-08",
    metadata: {
      type: "Art Token",
      artwork: "Ocean Dreams",
      rarity: "Rare",
    },
    history: [
      {
        date: "2024-09-08",
        action: "Minted",
        details: "Token created for Ocean Dreams artwork",
      },
    ],
  },
  {
    id: "TKN-006",
    owner: {
      name: "Frank Miller",
      email: "frank@example.com",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    value: 7.1,
    status: "Active",
    createdDate: "2024-08-30",
    metadata: {
      type: "Premium Token",
      artwork: "Masterpiece Collection",
      rarity: "Legendary",
    },
    history: [
      {
        date: "2024-08-30",
        action: "Minted",
        details: "Premium token created",
      },
    ],
  },
];

// Mock chart data
export const circulationData = [
  { month: "Jan", tokens: 120 },
  { month: "Feb", tokens: 145 },
  { month: "Mar", tokens: 167 },
  { month: "Apr", tokens: 189 },
  { month: "May", tokens: 234 },
  { month: "Jun", tokens: 267 },
  { month: "Jul", tokens: 298 },
  { month: "Aug", tokens: 324 },
  { month: "Sep", tokens: 356 },
];

export const distributionData = [
  { name: "Active", value: 65, color: "#10B981" },
  { name: "Locked", value: 20, color: "#8B5CF6" },
  { name: "Pending", value: 10, color: "#F59E0B" },
  { name: "Burned", value: 5, color: "#EF4444" },
];

export const tokenStatuses = ["All", "Active", "Pending", "Locked", "Burned"];
