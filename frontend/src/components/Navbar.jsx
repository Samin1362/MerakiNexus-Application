import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { User } from "lucide-react";
import LogoutButton from "./LogoutButton";

function Navbar() {
  const brandRef = useRef(null);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const underlineRefs = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, role, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .fromTo(
        brandRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
      .fromTo(
        navRef.current?.querySelectorAll("a"),
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
        "-=0.2"
      )
      .fromTo(
        burgerRef.current,
        { rotate: -10, opacity: 0 },
        { rotate: 0, opacity: 1, duration: 0.4 },
        "<"
      );

    const underlineElements = [...underlineRefs.current];
    const hoverHandlers = [];

    underlineElements.forEach((el) => {
      if (!el) return;
      const link = el.parentElement;
      if (!link) return;
      const onEnter = () => {
        gsap.to(el, {
          scaleX: 1,
          transformOrigin: "left",
          duration: 0.25,
          ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(el, {
          scaleX: 0,
          transformOrigin: "right",
          duration: 0.25,
          ease: "power2.in",
        });
      };
      link.addEventListener("mouseenter", onEnter);
      link.addEventListener("mouseleave", onLeave);
      hoverHandlers.push({ link, onEnter, onLeave });
    });

    return () => {
      hoverHandlers.forEach(({ link, onEnter, onLeave }) => {
        link.removeEventListener("mouseenter", onEnter);
        link.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (isOpen) {
      gsap.to(mobileMenuRef.current, {
        y: 0,
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        y: -10,
        opacity: 0,
        pointerEvents: "none",
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Dynamic links based on authentication and user role
  const getNavigationLinks = () => {
    if (!isAuthenticated) {
      // Non-authenticated users see limited links + Login
      return [
        { label: "Home", to: "/" },
        { label: "Art Gallery", to: "/gallery" },
        { label: "About", to: "/about" },
        { label: "Chatbot", to: "/chatbot" },
        { label: "Login", to: "/login" },
      ];
    }

    // Authenticated users see base links + role-specific links
    const authenticatedLinks = [
      { label: "Home", to: "/" },
      { label: "Art Gallery", to: "/gallery" },
    ];

    // Add "Upload Artwork" only for Admin and Artist roles
    if (role === "Admin" || role === "Artist") {
      authenticatedLinks.push({ label: "Upload Artwork", to: "/upload" });
    }

    // Add remaining common links
    authenticatedLinks.push(
      { label: "About", to: "/about" },
      { label: "Chatbot", to: "/chatbot" }
    );

    // Add role-specific dashboard link
    if (role === "Admin") {
      authenticatedLinks.push({ label: "Admin Dashboard", to: "/dashboard" });
    } else if (role === "Artist") {
      authenticatedLinks.push({
        label: "Artist Dashboard",
        to: "/artist-dashboard",
      });
    } else if (role === "User") {
      authenticatedLinks.push({
        label: "User Dashboard",
        to: "/user-dashboard",
      });
    }

    return authenticatedLinks;
  };

  // Check if a link is active
  const isActiveLink = (linkPath) => {
    if (linkPath === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(linkPath);
  };

  const links = getNavigationLinks();

  return (
    <nav className="relative md:fixed md:top-0 md:left-0 md:right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-purple-200/30 shadow-lg shadow-purple-500/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 md:h-16 items-center justify-between">
          <div ref={brandRef} className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                MN
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-indigo-700 transition-all duration-300">
                Meraki Nexus
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8" ref={navRef}>
            {links.map((link, index) => {
              const isActive = isActiveLink(link.to);
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={
                    link.label === "Login"
                      ? "rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white text-sm px-5 py-2 font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
                      : `relative text-sm font-semibold transition-all duration-300 ${
                          isActive
                            ? "text-purple-600"
                            : "text-gray-700 hover:text-purple-600"
                        }`
                  }
                >
                  {link.label}
                  {link.label !== "Login" && (
                    <span
                      ref={(el) => (underlineRefs.current[index] = el)}
                      className={`absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 shadow-sm shadow-purple-500/50 ${
                        isActive ? "scale-x-100" : "scale-x-0 origin-right"
                      }`}
                    />
                  )}
                </Link>
              );
            })}

            {isAuthenticated && (
              <div className="flex items-center gap-3 pl-3 border-l border-purple-200/30">
                <div className="flex flex-col text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-semibold text-gray-700">
                      {user?.email || "User"}
                    </span>
                  </div>
                  <span className="text-purple-600 font-medium ml-6">
                    {role}
                  </span>
                </div>
                <LogoutButton
                  variant="default"
                  className="text-sm px-4 py-2"
                  showIcon={true}
                  showText={false}
                />
              </div>
            )}
          </div>

          <button
            ref={burgerRef}
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute left-0 top-1 block h-0.5 w-6 bg-gradient-to-r from-purple-600 to-pink-600 transform transition-transform duration-300 ${
                  isOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2.5 block h-0.5 w-6 bg-gradient-to-r from-purple-600 to-pink-600 transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-4 block h-0.5 w-6 bg-gradient-to-r from-purple-600 to-pink-600 transform transition-transform duration-300 ${
                  isOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        ref={mobileMenuRef}
        className="md:hidden absolute left-0 right-0 top-full pointer-events-none opacity-0 -translate-y-2 origin-top bg-white/95 backdrop-blur-xl border-b border-purple-200/30 shadow-lg shadow-purple-500/10 z-40"
      >
        <div className="space-y-1 px-4 pb-4 pt-2">
          {links.map((link) => {
            const isActive = isActiveLink(link.to);
            return (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={
                  link.label === "Login"
                    ? "block rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white text-center px-4 py-2.5 text-base font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30"
                    : `block rounded-lg px-4 py-2.5 text-base font-semibold transition-all duration-300 ${
                        isActive
                          ? "text-purple-600 bg-purple-50 border-l-4 border-purple-600"
                          : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                      }`
                }
              >
                {link.label}
              </Link>
            );
          })}
          {isAuthenticated && (
            <div className="mt-3 space-y-2">
              <div className="px-4 py-3 text-sm bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-semibold text-gray-700">
                    {user?.email || "User"}
                  </span>
                </div>
                <span className="text-purple-600 font-medium text-xs">
                  Role: {role}
                </span>
              </div>
              <LogoutButton
                variant="default"
                className="w-full text-base"
                showIcon={true}
                showText={true}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
