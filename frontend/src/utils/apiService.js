// API Service utility for MerakiNexus Application
import { API_CONFIG, buildApiUrl } from "../routes/Routes";
import { getAccessToken } from "./auth";

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @param {Object} params - URL parameters for dynamic endpoints
 * @returns {Promise} - API response
 */
export const apiRequest = async (endpoint, options = {}, params = {}) => {
  const url = buildApiUrl(endpoint, params);
  const accessToken = getAccessToken();

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: accessToken }),
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// ===== AUTHENTICATION API CALLS =====
export const authAPI = {
  login: (credentials) =>
    apiRequest(API_CONFIG.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest(API_CONFIG.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  refreshToken: (refreshToken) =>
    apiRequest(API_CONFIG.AUTH.REFRESH_TOKEN, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  logout: () =>
    apiRequest(API_CONFIG.AUTH.LOGOUT, {
      method: "POST",
    }),

  verifyToken: () =>
    apiRequest(API_CONFIG.AUTH.VERIFY_TOKEN, {
      method: "GET",
    }),
};

// ===== USER API CALLS =====
export const userAPI = {
  getProfile: () =>
    apiRequest(API_CONFIG.USER.PROFILE, {
      method: "GET",
    }),

  updateProfile: (profileData) =>
    apiRequest(API_CONFIG.USER.UPDATE_PROFILE, {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  changePassword: (passwordData) =>
    apiRequest(API_CONFIG.USER.CHANGE_PASSWORD, {
      method: "PUT",
      body: JSON.stringify(passwordData),
    }),

  deleteAccount: () =>
    apiRequest(API_CONFIG.USER.DELETE_ACCOUNT, {
      method: "DELETE",
    }),

  getAllUsers: () =>
    apiRequest(API_CONFIG.USER.GET_ALL_USERS, {
      method: "GET",
    }),
};

// ===== ARTWORK API CALLS =====
export const artworkAPI = {
  getAll: () =>
    apiRequest(API_CONFIG.ARTWORK.GET_ALL, {
      method: "GET",
    }),

  getById: (id) =>
    apiRequest(
      API_CONFIG.ARTWORK.GET_BY_ID,
      {
        method: "GET",
      },
      { id }
    ),

  upload: (artworkData) =>
    apiRequest(API_CONFIG.ARTWORK.UPLOAD, {
      method: "POST",
      body: JSON.stringify(artworkData),
    }),

  update: (id, artworkData) =>
    apiRequest(
      API_CONFIG.ARTWORK.UPDATE,
      {
        method: "PUT",
        body: JSON.stringify(artworkData),
      },
      { id }
    ),

  delete: (id) =>
    apiRequest(
      API_CONFIG.ARTWORK.DELETE,
      {
        method: "DELETE",
      },
      { id }
    ),

  approve: (id) =>
    apiRequest(
      API_CONFIG.ARTWORK.APPROVE,
      {
        method: "PUT",
      },
      { id }
    ),

  reject: (id) =>
    apiRequest(
      API_CONFIG.ARTWORK.REJECT,
      {
        method: "PUT",
      },
      { id }
    ),

  getPending: () =>
    apiRequest(API_CONFIG.ARTWORK.GET_PENDING, {
      method: "GET",
    }),

  getByArtist: (artistId) =>
    apiRequest(
      API_CONFIG.ARTWORK.GET_BY_ARTIST,
      {
        method: "GET",
      },
      { artistId }
    ),
};

// ===== AI API CALLS =====
export const aiAPI = {
  classifyArtwork: (imageData) =>
    apiRequest(API_CONFIG.AI.CLASSIFY_ARTWORK, {
      method: "POST",
      body: JSON.stringify({ image: imageData }),
    }),

  analyzeSentiment: (textData) =>
    apiRequest(API_CONFIG.AI.ANALYZE_SENTIMENT, {
      method: "POST",
      body: JSON.stringify({ text: textData }),
    }),

  evaluateArtwork: (artworkData) =>
    apiRequest(API_CONFIG.AI.EVALUATE_ARTWORK, {
      method: "POST",
      body: JSON.stringify(artworkData),
    }),

  generateTags: (artworkData) =>
    apiRequest(API_CONFIG.AI.GENERATE_TAGS, {
      method: "POST",
      body: JSON.stringify(artworkData),
    }),
};

// ===== TOKEN/BLOCKCHAIN API CALLS =====
export const tokenAPI = {
  mint: (tokenData) =>
    apiRequest(API_CONFIG.TOKEN.MINT, {
      method: "POST",
      body: JSON.stringify(tokenData),
    }),

  transfer: (transferData) =>
    apiRequest(API_CONFIG.TOKEN.TRANSFER, {
      method: "POST",
      body: JSON.stringify(transferData),
    }),

  getBalance: (userId) =>
    apiRequest(
      API_CONFIG.TOKEN.BALANCE,
      {
        method: "GET",
      },
      { userId }
    ),

  getTransactionHistory: (userId) =>
    apiRequest(
      API_CONFIG.TOKEN.TRANSACTION_HISTORY,
      {
        method: "GET",
      },
      { userId }
    ),

  getMarketplace: () =>
    apiRequest(API_CONFIG.TOKEN.MARKETPLACE, {
      method: "GET",
    }),
};

// ===== ANALYTICS API CALLS =====
export const analyticsAPI = {
  getDashboardStats: () =>
    apiRequest(API_CONFIG.ANALYTICS.DASHBOARD_STATS, {
      method: "GET",
    }),

  getUserStats: (userId) =>
    apiRequest(
      API_CONFIG.ANALYTICS.USER_STATS,
      {
        method: "GET",
      },
      { userId }
    ),

  getArtworkStats: (artworkId) =>
    apiRequest(
      API_CONFIG.ANALYTICS.ARTWORK_STATS,
      {
        method: "GET",
      },
      { artworkId }
    ),

  getPlatformMetrics: () =>
    apiRequest(API_CONFIG.ANALYTICS.PLATFORM_METRICS, {
      method: "GET",
    }),
};

// ===== EXTERNAL API CALLS =====
export const externalAPI = {
  callGeminiAI: async (message, apiKey) => {
    const url = `${API_CONFIG.EXTERNAL.GEMINI_AI}?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini."
      );
    } catch (error) {
      console.error("Gemini API error:", error);
      throw error;
    }
  },
};

// ===== LOCAL DATA CALLS =====
export const localAPI = {
  getArtData: async () => {
    try {
      const response = await fetch(API_CONFIG.LOCAL.ART_DATA);
      const data = await response.json();
      return Array.isArray(data)
        ? data
        : Array.isArray(data?.artworks)
        ? data.artworks
        : [];
    } catch (error) {
      console.error("Error loading local art data:", error);
      return [];
    }
  },
};

// Export all API functions
export default {
  auth: authAPI,
  user: userAPI,
  artwork: artworkAPI,
  ai: aiAPI,
  token: tokenAPI,
  analytics: analyticsAPI,
  external: externalAPI,
  local: localAPI,
};
