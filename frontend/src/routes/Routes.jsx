import { createBrowserRouter } from "react-router-dom";

// ===== COMPONENT IMPORTS =====
import Root from "../pages/Root";
import HomePage from "../pages/HomePage";
import GalleryPage from "../pages/GalleryPage";
import UploadPage from "../pages/UploadPage";
import AboutPage from "../pages/AboutPage";
import NotFound from "../pages/NotFound";
import ChatbotApp from "../pages/ChatbotApp";
import LoginForm from "../pages/LoginForm";
import RegistrationForm from "../pages/RegistrationForm";
import OrderPage from "../pages/OrderPage";
import UserDashboard from "../pages/UserDashboard";

// Admin Dashboard Components
import DashboardLayout from "../components/DashboardLayout";
import DashboardHome from "../pages/DashboardHome";
import DashboardArtworks from "../pages/DashboardArtworks";
import DashboardToken from "../pages/DashboardToken";
import DashboardApprovals from "../pages/DashboardApprovals";
import DashboardSettings from "../pages/DashboardSettings";
import DashboardUsers from "../pages/DashboardUsers";

// Artist Dashboard Components
import ArtistHome from "../pages/ArtistHome";

// Protected Route Components
import ProtectedRoute, {
  AdminRoute,
  ArtistRoute,
  UserRoute,
} from "../components/ProtectedRoute";

// ===== API ENDPOINTS CONFIGURATION =====
/* eslint-disable react-refresh/only-export-components */
export const API_CONFIG = {
  // Base URLs
  BASE_URL: "https://meraki-nexus-api.vercel.app/meraki-nexus-api",

  // Authentication Endpoints
  AUTH: {
    LOGIN: "/user/login",
    REGISTER: "/user/register",
    REFRESH_TOKEN: "/user/refresh",
    LOGOUT: "/user/logout",
    VERIFY_TOKEN: "/user/verify",
  },

  // User Management Endpoints
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile/update",
    CHANGE_PASSWORD: "/user/change-password",
    DELETE_ACCOUNT: "/user/delete",
    GET_ALL_USERS: "/user/all", // Admin only
  },

  // Artwork Endpoints
  ARTWORK: {
    GET_ALL: "/nexus/",
    GET_BY_ID: "/nexus/:id",
    UPLOAD: "/nexus/upload",
    UPDATE: "/nexus/update/:id",
    DELETE: "/nexus/delete/:id",
    APPROVE: "/nexus/approve/:id", // Admin only
    REJECT: "/nexus/reject/:id", // Admin only
    GET_PENDING: "/nexus/pending", // Admin only
    GET_BY_ARTIST: "/nexus/artist/:artistId",
  },

  // AI Analysis Endpoints
  AI: {
    CLASSIFY_ARTWORK: "/ai/classify",
    ANALYZE_SENTIMENT: "/ai/sentiment",
    EVALUATE_ARTWORK: "/ai/evaluate",
    GENERATE_TAGS: "/ai/tags",
  },

  // Token/Blockchain Endpoints
  TOKEN: {
    MINT: "/token/mint",
    TRANSFER: "/token/transfer",
    BALANCE: "/token/balance/:userId",
    TRANSACTION_HISTORY: "/token/history/:userId",
    MARKETPLACE: "/token/marketplace",
  },

  // Analytics Endpoints
  ANALYTICS: {
    DASHBOARD_STATS: "/analytics/dashboard",
    USER_STATS: "/analytics/user/:userId",
    ARTWORK_STATS: "/analytics/artwork/:artworkId",
    PLATFORM_METRICS: "/analytics/platform",
  },

  // External APIs
  EXTERNAL: {
    GEMINI_AI:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
  },

  // Local Data
  LOCAL: {
    ART_DATA: "/art-data.json",
  },
};

// ===== UTILITY FUNCTIONS FOR API =====
const getApiUrl = (endpoint) => {
  if (endpoint.startsWith("http")) {
    return endpoint; // External URL
  }
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

const buildApiUrl = (endpoint, params = {}) => {
  let url = getApiUrl(endpoint);

  // Replace URL parameters
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });

  return url;
};

// ===== ROUTE PATHS CONFIGURATION =====
/* eslint-disable react-refresh/only-export-components */
export const ROUTES = {
  // Public Routes
  HOME: "/",
  GALLERY: "/gallery",
  UPLOAD: "/upload",
  ABOUT: "/about",
  CHATBOT: "/chatbot",
  LOGIN: "/login",
  REGISTER: "/register",
  ORDER: "/order",

  // User Dashboard Routes
  USER: {
    DASHBOARD: "/user-dashboard",
  },

  // Admin Dashboard Routes
  ADMIN: {
    DASHBOARD: "/dashboard",
    USERS: "/dashboard/users",
    ARTWORKS: "/dashboard/artworks",
    TOKENS: "/dashboard/tokens",
    APPROVALS: "/dashboard/approvals",
    SETTINGS: "/dashboard/settings",
  },

  // Artist Dashboard Routes
  ARTIST: {
    DASHBOARD: "/artist-dashboard",
  },

  // Error Routes
  NOT_FOUND: "*",
};

// ===== ROUTER CONFIGURATION =====
const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Root />,
    children: [
      // Public Routes
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.GALLERY,
        element: <GalleryPage />,
      },
      {
        path: ROUTES.UPLOAD,
        element: (
          <ProtectedRoute allowedRoles={["Artist", "Admin"]}>
            <UploadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ABOUT,
        element: <AboutPage />,
      },
      {
        path: ROUTES.CHATBOT,
        element: <ChatbotApp />,
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginForm />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegistrationForm />,
      },
      {
        path: ROUTES.ORDER,
        element: <OrderPage />,
      },

      // User Dashboard Routes (Protected)
      {
        path: ROUTES.USER.DASHBOARD,
        element: (
          <UserRoute>
            <UserDashboard />
          </UserRoute>
        ),
      },

      // Admin Dashboard Routes (Protected)
      {
        path: ROUTES.ADMIN.DASHBOARD,
        element: (
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "users",
            element: <DashboardUsers />,
          },
          {
            path: "artworks",
            element: <DashboardArtworks />,
          },
          {
            path: "tokens",
            element: <DashboardToken />,
          },
          {
            path: "approvals",
            element: <DashboardApprovals />,
          },
          {
            path: "settings",
            element: <DashboardSettings />,
          },
        ],
      },

      // Artist Dashboard Route (Protected) - Single Page
      {
        path: ROUTES.ARTIST.DASHBOARD,
        element: (
          <ArtistRoute>
            <ArtistHome />
          </ArtistRoute>
        ),
      },

      // 404 Not Found Route
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFound />,
      },
    ],
  },
]);

// ===== EXPORTS =====
/* eslint-disable react-refresh/only-export-components */
export default router;

// Export individual configurations for easy access
export { API_CONFIG as API };

// Export utility functions
export { getApiUrl, buildApiUrl };
