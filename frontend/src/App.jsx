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
import DashboardHome from "./pages/DashboardHome";
import DashboardLayout from "./components/DashboardLayout";
import ScrollToTop from "./components/ScrollToTop";
import DashboardArtworks from "./pages/DashboardArtworks";
import DashboardToken from "./pages/DashboardToken";

function App() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/chatbot" element={<ChatbotApp />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<NotFound />} />

        {/* Dashboard Routes (nested) */}
        <Route path="/dashboardHome" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} /> {/* /dashboard */}
          <Route path="users" element={<div>Users Management</div>} />
          <Route path="artworks" element={<DashboardArtworks />} />
          <Route path="tokens" element={<DashboardToken />} />
          <Route path="approvals" element={<div>Approvals</div>} />
          <Route path="settings" element={<div>Admin Settings</div>} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
