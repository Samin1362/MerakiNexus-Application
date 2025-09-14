import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

function Navbar() {
  const brandRef = useRef(null);
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const underlineRefs = useRef([]);
  const [isOpen, setIsOpen] = useState(false);

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

  const links = [
    { label: "Home", to: "/" },
    { label: "Art Gallery", to: "/gallery" },
    { label: "Upload Artwork", to: "/upload" },
    { label: "About", to: "/about" },
    { label: "Chatbot", to: "/chatbot"},
    { label: "Admin DashBoard", to: "/dashboard"},
    { label: "Artist DashBoard", to: "/artist-dashboard"}
  ];

  return (
    <nav className="relative md:fixed md:top-0 md:left-0 md:right-0 z-50 backdrop-blur bg-white/60 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 md:h-16 items-center justify-between">
          <div ref={brandRef} className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center font-semibold">
                MN
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Meraki Nexus
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8" ref={navRef}>
            {links.map((link, index) => (
              <Link
                key={link.label}
                to={link.to}
                className="relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {link.label}
                <span
                  ref={(el) => (underlineRefs.current[index] = el)}
                  className="absolute left-0 -bottom-1 h-0.5 w-full bg-gray-900 scale-x-0 origin-right"
                />
              </Link>
            ))}

            <Link
              to="/login"
              className="rounded-full bg-gray-900 text-white text-sm px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
            >
              Login
            </Link>
          </div>

          <button
            ref={burgerRef}
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute left-0 top-1 block h-0.5 w-6 bg-gray-900 transform transition-transform duration-300 ${
                  isOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2.5 block h-0.5 w-6 bg-gray-900 transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-4 block h-0.5 w-6 bg-gray-900 transform transition-transform duration-300 ${
                  isOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        ref={mobileMenuRef}
        className="md:hidden absolute left-0 right-0 top-full pointer-events-none opacity-0 -translate-y-2 origin-top bg-white/90 backdrop-blur border-b border-black/5 z-40"
      >
        <div className="space-y-1 px-4 pb-4 pt-2">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="mt-2 block rounded-md bg-gray-900 text-white text-center px-3 py-2 text-base font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
