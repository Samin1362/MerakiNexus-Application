import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

// ✅ Authentication & Toast Providers
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../components/Toast";

const Root = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          {/* Navigation - Fixed at top */}
          <Navbar />

          {/* Scroll to top functionality */}
          <ScrollToTop />

          {/* Main content area - All pages render here */}
          <main className="flex-1">
            <Outlet />
          </main>

          {/* Footer - Always at bottom */}
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
};

export default Root;
