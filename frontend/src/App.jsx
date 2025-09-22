import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import GalleryPage from "./pages/GalleryPage";
import UploadPage from "./pages/UploadPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import ChatbotApp from "./pages/ChatbotApp";
import LoginForm from "./pages/LoginForm";

// ✅ Admin Dashboard Imports
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import DashboardArtworks from "./pages/DashboardArtworks";
import DashboardToken from "./pages/DashboardToken";
import DashboardApprovals from "./pages/DashboardApprovals";
import DashboardSettings from "./pages/DashboardSettings";

// ✅ Artist Dashboard Imports
import ArtistDashboardLayout from "./components/ArtistDashboardLayout";
import ArtistHome from "./pages/ArtistHome";
import MyArtworks from "./components/MyArtworks";
import ArtistEarnings from "./pages/ArtistEarnings";
import ArtistSettings from "./pages/ArtistSettings";

// ✅ Authentication & Protection
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute, {
  AdminRoute,
  ArtistRoute,
} from "./components/ProtectedRoute";

// ✅ Toast System
import { ToastProvider } from "./components/Toast";

import ScrollToTop from "./components/ScrollToTop";
import RegistrationForm from "./pages/RegistrationForm";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar />
        <ScrollToTop />
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/chatbot" element={<ChatbotApp />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="*" element={<NotFound />} />

          {/* 🛠️ Admin Dashboard Routes - Protected */}
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <DashboardLayout />
              </AdminRoute>
            }
          >
            <Route index element={<DashboardHome />} /> {/* /dashboard */}
            <Route path="users" element={<div>Users Management</div>} />
            <Route path="artworks" element={<DashboardArtworks />} />
            <Route path="tokens" element={<DashboardToken />} />
            <Route path="approvals" element={<DashboardApprovals />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>

          {/* 🎨 Artist Dashboard Routes - Protected */}
          <Route
            path="/artist-dashboard"
            element={
              <ArtistRoute>
                <ArtistDashboardLayout />
              </ArtistRoute>
            }
          >
            <Route index element={<ArtistHome />} /> {/* /artist-dashboard */}
            <Route path="my-artworks" element={<MyArtworks />} />
            <Route path="earnings" element={<ArtistEarnings />} />
            <Route path="settings" element={<ArtistSettings />} />
          </Route>
        </Routes>
        <Footer />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
