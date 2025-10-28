// Mock data for dashboard home page

// User growth chart data
export const userGrowthData = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1890 },
  { month: "Mar", users: 2300 },
  { month: "Apr", users: 2780 },
  { month: "May", users: 3200 },
  { month: "Jun", users: 3890 },
];

// Artwork categories distribution
export const artworkCategoriesData = [
  { name: "Digital Art", value: 35, color: "#8B5CF6" },
  { name: "Photography", value: 28, color: "#3B82F6" },
  { name: "Paintings", value: 20, color: "#06B6D4" },
  { name: "Sculptures", value: 12, color: "#10B981" },
  { name: "Mixed Media", value: 5, color: "#A855F7" },
];

// Recent activities
export const recentActivities = [
  {
    id: 1,
    time: "2 min ago",
    action: "Artwork Approved",
    status: "Success",
    user: "Alice Johnson",
  },
  {
    id: 2,
    time: "15 min ago",
    action: "New User Registered",
    status: "Success",
    user: "Bob Smith",
  },
  {
    id: 3,
    time: "1 hour ago",
    action: "Token Transaction",
    status: "Success",
    user: "Carol Davis",
  },
  {
    id: 4,
    time: "2 hours ago",
    action: "Artwork Pending Review",
    status: "Pending",
    user: "David Wilson",
  },
  {
    id: 5,
    time: "3 hours ago",
    action: "Revenue Generated",
    status: "Success",
    user: "Emma Brown",
  },
];

// Dashboard metrics
export const dashboardMetrics = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12%",
  },
  {
    title: "Total Artists",
    value: "3,264",
    change: "+8%",
  },
  {
    title: "Total Artworks",
    value: "18,562",
    change: "+15%",
  },
  {
    title: "Platform Revenue",
    value: "$124,590",
    change: "+23%",
  },
  {
    title: "Pending Approvals",
    value: "47",
    change: "-5%",
  },
  {
    title: "Active Tokens",
    value: "8,934",
    change: "+18%",
  },
];
