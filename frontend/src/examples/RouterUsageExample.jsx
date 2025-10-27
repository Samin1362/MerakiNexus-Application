// ===== USAGE EXAMPLES FOR CENTRALIZED ROUTER & API SYSTEM =====
// This file demonstrates how to use the new centralized routing and API configuration
// NOTE: This component would render inside Root.jsx layout (with Navbar and Footer)

import React from "react";
import { useNavigate, Link } from "react-router-dom";

// Import the centralized configurations
import { ROUTES, API_CONFIG, getApiUrl, buildApiUrl } from "../routes/Routes";
import apiService from "../utils/apiService";

const RouterUsageExample = () => {
  const navigate = useNavigate();

  // ===== ROUTE USAGE EXAMPLES =====

  // 1. Using ROUTES constants for navigation
  const handleNavigation = () => {
    // Instead of hardcoded strings like "/dashboard"
    navigate(ROUTES.ADMIN.DASHBOARD);

    // Or for artist dashboard
    navigate(ROUTES.ARTIST.DASHBOARD);

    // Or for public routes
    navigate(ROUTES.GALLERY);
  };

  // 2. Using ROUTES constants in Link components
  const NavigationLinks = () => (
    <div>
      <Link to={ROUTES.HOME}>Home</Link>
      <Link to={ROUTES.GALLERY}>Gallery</Link>
      <Link to={ROUTES.ABOUT}>About</Link>
      <Link to={ROUTES.ADMIN.DASHBOARD}>Admin Dashboard</Link>
      <Link to={ROUTES.ARTIST.MY_ARTWORKS}>My Artworks</Link>
    </div>
  );

  // ===== API USAGE EXAMPLES =====

  // 3. Using API_CONFIG for direct fetch calls
  const fetchArtworksDirectly = async () => {
    try {
      const url = getApiUrl(API_CONFIG.ARTWORK.GET_ALL);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add auth token if needed
        },
      });
      const data = await response.json();
      console.log("Artworks:", data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  // 4. Using buildApiUrl for dynamic endpoints
  const fetchArtworkById = async (artworkId) => {
    try {
      const url = buildApiUrl(API_CONFIG.ARTWORK.GET_BY_ID, { id: artworkId });
      const response = await fetch(url);
      const data = await response.json();
      console.log("Artwork:", data);
    } catch (error) {
      console.error("Error fetching artwork:", error);
    }
  };

  // 5. Using the apiService utility (RECOMMENDED APPROACH)
  const fetchArtworksWithService = async () => {
    try {
      const artworks = await apiService.artwork.getAll();
      console.log("Artworks from service:", artworks);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  // 6. Authentication examples
  const handleLogin = async (credentials) => {
    try {
      const response = await apiService.auth.login(credentials);
      console.log("Login successful:", response);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // 7. User management examples
  const fetchUserProfile = async () => {
    try {
      const profile = await apiService.user.getProfile();
      console.log("User profile:", profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // 8. AI service examples
  const classifyArtwork = async (imageData) => {
    try {
      const classification = await apiService.ai.classifyArtwork(imageData);
      console.log("AI Classification:", classification);
    } catch (error) {
      console.error("Error classifying artwork:", error);
    }
  };

  // 9. Token/Blockchain examples
  const getUserTokenBalance = async (userId) => {
    try {
      const balance = await apiService.token.getBalance(userId);
      console.log("Token balance:", balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // 10. Analytics examples
  const getDashboardStats = async () => {
    try {
      const stats = await apiService.analytics.getDashboardStats();
      console.log("Dashboard stats:", stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // 11. External API examples (Gemini AI)
  const chatWithAI = async (message) => {
    try {
      const response = await apiService.external.callGeminiAI(
        message,
        "your-api-key-here"
      );
      console.log("AI Response:", response);
    } catch (error) {
      console.error("Error calling AI:", error);
    }
  };

  // 12. Local data examples
  const loadLocalArtData = async () => {
    try {
      const artData = await apiService.local.getArtData();
      console.log("Local art data:", artData);
    } catch (error) {
      console.error("Error loading local data:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Router & API Usage Examples</h1>

      <div className="space-y-8">
        {/* Navigation Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Navigation Examples</h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate(ROUTES.GALLERY)}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Go to Gallery
            </button>
            <button
              onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
              className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
            >
              Go to Admin Dashboard
            </button>
          </div>
          <NavigationLinks />
        </section>

        {/* API Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">API Examples</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={fetchArtworksWithService}
              className="bg-indigo-500 text-white px-4 py-2 rounded"
            >
              Fetch Artworks
            </button>
            <button
              onClick={() => fetchArtworkById("123")}
              className="bg-teal-500 text-white px-4 py-2 rounded"
            >
              Fetch Artwork by ID
            </button>
            <button
              onClick={fetchUserProfile}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Fetch User Profile
            </button>
            <button
              onClick={getDashboardStats}
              className="bg-pink-500 text-white px-4 py-2 rounded"
            >
              Get Dashboard Stats
            </button>
            <button
              onClick={loadLocalArtData}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Load Local Art Data
            </button>
            <button
              onClick={() => chatWithAI("Hello, how are you?")}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Chat with AI
            </button>
          </div>
        </section>

        {/* Configuration Display */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Available Routes</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(ROUTES, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Available API Endpoints
          </h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(API_CONFIG, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
};

export default RouterUsageExample;

// ===== MIGRATION GUIDE =====
/*

BEFORE (Old way):
```jsx
// Hardcoded routes
navigate('/dashboard');
<Link to="/artist-dashboard/my-artworks">My Artworks</Link>

// Hardcoded API URLs
fetch('https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/');
fetch(`https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/${id}`);
```

AFTER (New centralized way):
```jsx
// Using route constants
navigate(ROUTES.ADMIN.DASHBOARD);
<Link to={ROUTES.ARTIST.MY_ARTWORKS}>My Artworks</Link>

// Using API service
apiService.artwork.getAll();
apiService.artwork.getById(id);

// Or using API config directly
const url = buildApiUrl(API_CONFIG.ARTWORK.GET_BY_ID, { id });
```

BENEFITS:
1. ✅ Centralized configuration - easy to update URLs
2. ✅ Type safety and autocomplete
3. ✅ Consistent API calling patterns
4. ✅ Better error handling
5. ✅ Easier testing and mocking
6. ✅ Reduced code duplication
7. ✅ Better maintainability

*/
