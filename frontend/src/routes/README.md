# Centralized Router & API Configuration

This directory contains the centralized routing and API configuration for the MerakiNexus application.

## 📁 Files Overview

### `Routes.jsx`

The main configuration file containing:

- **Router Configuration**: All application routes using React Router v6
- **API Endpoints**: Centralized API endpoint definitions
- **Route Constants**: Reusable route path constants
- **Utility Functions**: Helper functions for API URL building

### `../utils/apiService.js`

Service layer for API calls:

- **Typed API Functions**: Pre-configured API call functions
- **Error Handling**: Consistent error handling across all API calls
- **Authentication**: Automatic token injection
- **Request Utilities**: Common request patterns

### `../examples/RouterUsageExample.jsx`

Usage examples and migration guide:

- **Navigation Examples**: How to use route constants
- **API Examples**: How to use the API service
- **Migration Guide**: Before/after comparison

## 🏗️ Application Structure

### Layout Architecture

The application now uses a clean layout structure:

```
Root.jsx (Layout Component)
├── AuthProvider & ToastProvider
├── Navbar (persistent)
├── <Outlet /> ← All pages render here
└── Footer (persistent)
```

**Benefits:**

- ✅ Consistent Navbar/Footer across all pages
- ✅ Clean separation of layout and page content
- ✅ Context providers wrap the entire app
- ✅ Automatic layout inheritance for all routes

## 🚀 Key Features

### 1. Centralized Route Management

```jsx
// Instead of hardcoded strings
navigate("/dashboard");

// Use route constants
navigate(ROUTES.ADMIN.DASHBOARD);
```

### 2. Structured API Configuration

```jsx
export const API_CONFIG = {
  BASE_URL: "https://meraki-nexus-api.vercel.app/meraki-nexus-api",
  AUTH: {
    LOGIN: "/user/login",
    REGISTER: "/user/register",
    // ... more endpoints
  },
  ARTWORK: {
    GET_ALL: "/nexus/",
    UPLOAD: "/nexus/upload",
    // ... more endpoints
  },
  // ... more categories
};
```

### 3. Utility Functions

```jsx
// Build dynamic URLs
const url = buildApiUrl(API_CONFIG.ARTWORK.GET_BY_ID, { id: "123" });
// Result: "https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/123"

// Get full API URL
const url = getApiUrl(API_CONFIG.AUTH.LOGIN);
// Result: "https://meraki-nexus-api.vercel.app/meraki-nexus-api/user/login"
```

### 4. Service Layer API Calls

```jsx
// Clean, consistent API calls
const artworks = await apiService.artwork.getAll();
const user = await apiService.auth.login(credentials);
const stats = await apiService.analytics.getDashboardStats();
```

## 📋 API Categories

### Authentication (`AUTH`)

- Login, Register, Logout
- Token refresh and verification

### User Management (`USER`)

- Profile management
- Password changes
- User administration

### Artwork Management (`ARTWORK`)

- CRUD operations
- Approval workflow
- Artist-specific queries

### AI Services (`AI`)

- Artwork classification
- Sentiment analysis
- Tag generation

### Token/Blockchain (`TOKEN`)

- Minting and transfers
- Balance queries
- Transaction history

### Analytics (`ANALYTICS`)

- Dashboard statistics
- User metrics
- Platform insights

### External APIs (`EXTERNAL`)

- Gemini AI integration
- Third-party services

### Local Data (`LOCAL`)

- Static JSON files
- Fallback data

## 🛠️ Usage Patterns

### Navigation

```jsx
import { ROUTES } from "../routes/Routes";
import { useNavigate, Link } from "react-router-dom";

const navigate = useNavigate();

// Programmatic navigation
navigate(ROUTES.GALLERY);
navigate(ROUTES.ADMIN.DASHBOARD);

// Link components
<Link to={ROUTES.ARTIST.MY_ARTWORKS}>My Artworks</Link>;
```

### API Calls

```jsx
import apiService from "../utils/apiService";

// Recommended approach - using service layer
const fetchData = async () => {
  try {
    const artworks = await apiService.artwork.getAll();
    const profile = await apiService.user.getProfile();
  } catch (error) {
    console.error("API Error:", error);
  }
};

// Direct API config usage (when needed)
import { API_CONFIG, buildApiUrl } from "../routes/Routes";

const url = buildApiUrl(API_CONFIG.ARTWORK.GET_BY_ID, { id: artworkId });
```

## 🔧 Configuration Updates

### Adding New Routes

1. Add route constant to `ROUTES` object in `Routes.jsx`
2. Add route configuration to router array
3. Import and use the new route constant

### Adding New API Endpoints

1. Add endpoint to appropriate category in `API_CONFIG`
2. Add corresponding function to `apiService.js`
3. Use the new API function in components

### Updating Base URLs

- Update `API_CONFIG.BASE_URL` in `Routes.jsx`
- All API calls will automatically use the new base URL

## 🎯 Benefits

1. **Maintainability**: Single source of truth for routes and APIs
2. **Type Safety**: Consistent naming and structure
3. **Reusability**: Shared constants across components
4. **Error Handling**: Centralized error management
5. **Testing**: Easier to mock and test API calls
6. **Documentation**: Self-documenting API structure
7. **Scalability**: Easy to add new routes and endpoints

## 🚨 Important Notes

- The Fast Refresh warnings in `Routes.jsx` are expected for configuration files
- Always use the service layer (`apiService`) for API calls when possible
- Route constants should be used instead of hardcoded strings
- API endpoints support parameter substitution using `buildApiUrl()`

## 📖 Migration Guide

See `../examples/RouterUsageExample.jsx` for detailed before/after examples and migration patterns.
