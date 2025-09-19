// import { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// function GalleryPage() {
//   const [artworks, setArtworks] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const rootRef = useRef(null);
//   const cardsRef = useRef([]);
//   const modalRef = useRef(null);
//   const overlayRef = useRef(null);

//   useEffect(() => {
//     fetch("/art-data.json")
//       .then((res) => res.json())
//       .then((data) => {
//         const list = Array.isArray(data)
//           ? data
//           : Array.isArray(data?.artworks)
//           ? data.artworks
//           : [];
//         setArtworks(list);
//       })
//       .catch(() => setArtworks([]));
//   }, []);

//   useEffect(() => {
//     if (!Array.isArray(artworks) || artworks.length === 0) return;

//     const ctx = gsap.context(() => {
//       // Initial cards stagger-in
//       const cards = cardsRef.current.filter(Boolean);
//       gsap.fromTo(
//         cards,
//         { opacity: 0, scale: 0.96, y: 12 },
//         {
//           opacity: 1,
//           scale: 1,
//           y: 0,
//           duration: 0.5,
//           stagger: 0.06,
//           ease: "power3.out",
//         }
//       );

//       // Scroll reveal as cards enter viewport
//       cards.forEach((card) => {
//         gsap.fromTo(
//           card,
//           { opacity: 0, y: 20 },
//           {
//             opacity: 1,
//             y: 0,
//             duration: 0.6,
//             ease: "power3.out",
//             scrollTrigger: {
//               trigger: card,
//               start: "top 85%",
//               toggleActions: "play none none reverse",
//             },
//           }
//         );
//       });
//     }, rootRef);

//     return () => ctx.revert();
//   }, [artworks]);

//   useEffect(() => {
//     if (!modalRef.current || !overlayRef.current) return;

//     if (isModalOpen) {
//       gsap.set(overlayRef.current, { pointerEvents: "auto" });
//       const tl = gsap.timeline();
//       tl.fromTo(
//         overlayRef.current,
//         { opacity: 0 },
//         { opacity: 1, duration: 0.2, ease: "power2.out" }
//       ).fromTo(
//         modalRef.current,
//         { opacity: 0, scale: 0.95, y: 10 },
//         { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power3.out" },
//         "<"
//       );
//     } else {
//       const tl = gsap.timeline({
//         onComplete: () =>
//           gsap.set(overlayRef.current, { pointerEvents: "none" }),
//       });
//       tl.to(modalRef.current, {
//         opacity: 0,
//         scale: 0.97,
//         y: 8,
//         duration: 0.2,
//         ease: "power2.in",
//       }).to(
//         overlayRef.current,
//         { opacity: 0, duration: 0.2, ease: "power2.in" },
//         "<"
//       );
//     }
//   }, [isModalOpen]);

//   const openModal = (art) => {
//     setSelected(art);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setTimeout(() => setSelected(null), 300);
//   };

//   const items = Array.isArray(artworks) ? artworks : [];

//   return (
//     <div
//       ref={rootRef}
//       className="min-h-screen w-full bg-gradient-to-br md:mt-[50px] from-zinc-900 via-indigo-950 to-black text-white"
//     >
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <header className="mb-6">
//           <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
//             Art Gallery
//           </h1>
//           <p className="mt-2 text-white/70">
//             Explore curated AI art and creative works.
//           </p>
//         </header>

//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//           {items.map((art, i) => (
//             <button
//               key={art.id}
//               ref={(el) => (cardsRef.current[i] = el)}
//               onClick={() => openModal(art)}
//               className="group text-left rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md shadow-xl shadow-indigo-950/20 transition-transform will-change-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/30"
//             >
//               <div className="relative aspect-[3/2] w-full overflow-hidden bg-black">
//                 <img
//                   src={art.image_url}
//                   alt={art.title}
//                   className="h-full w-full object-cover"
//                 />
//                 <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-lg font-bold">{art.title}</h3>
//                 <p className="text-sm text-white/80">{art.artist}</p>
//                 <p className="mt-1 text-xs text-white/70">
//                   {art.classification} •{" "}
//                   {Math.round(art.classification_percentage)}%
//                 </p>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       <div
//         ref={overlayRef}
//         className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${
//           isModalOpen ? "" : "pointer-events-none opacity-0"
//         }`}
//         onClick={closeModal}
//       >
//         <div
//           ref={modalRef}
//           className="relative mx-4 w-full max-w-3xl rounded-2xl bg-zinc-900 p-6 text-white shadow-2xl"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <button
//             className="absolute right-3 top-3 rounded-md p-2 text-white/80 hover:bg-white/10"
//             onClick={closeModal}
//             aria-label="Close"
//           >
//             ×
//           </button>
//           {selected && (
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//               <div className="overflow-hidden rounded-xl bg-black">
//                 <img
//                   src={selected.image_url}
//                   alt={selected.title}
//                   className="w-full object-cover"
//                 />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold">{selected.title}</h2>
//                 <p className="text-white/80">{selected.artist}</p>
//                 <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-white/90">
//                   <div>
//                     <span className="text-white/60">Year:</span>{" "}
//                     {selected.created_year}
//                   </div>
//                   <div>
//                     <span className="text-white/60">Medium:</span>{" "}
//                     {selected.medium}
//                   </div>
//                   <div>
//                     <span className="text-white/60">Class:</span>{" "}
//                     {selected.classification}
//                   </div>
//                   <div>
//                     <span className="text-white/60">Confidence:</span>{" "}
//                     {Math.round(selected.classification_percentage)}%
//                   </div>
//                   <div className="col-span-2">
//                     <span className="text-white/60">Art Value:</span> ${" "}
//                     {Number(selected.art_value_usd).toLocaleString()}
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <h3 className="font-semibold">Scores</h3>
//                   <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-white/90">
//                     {selected.scores &&
//                       Object.entries(selected.scores).map(([key, value]) => (
//                         <li
//                           key={key}
//                           className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
//                         >
//                           <span className="capitalize text-white/70">
//                             {key.replaceAll("_", " ")}
//                           </span>
//                           <span className="font-medium">
//                             {Number(value).toFixed(2)}
//                           </span>
//                         </li>
//                       ))}
//                   </ul>
//                 </div>

//                 {selected.tags && selected.tags.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="font-semibold">Tags</h3>
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {selected.tags.map((t) => (
//                         <span
//                           key={t}
//                           className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
//                         >
//                           {t}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GalleryPage;


import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAccessToken } from "../utils/auth";

gsap.registerPlugin(ScrollTrigger);

function GalleryPage() {
  const [artworks, setArtworks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const rootRef = useRef(null);
  const cardsRef = useRef([]);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // 🔑 Replace with how you store/retrieve your token
  const accessToken = getAccessToken();
  const authToken = accessToken.replace(/^Bearer\s+/i, "");

  // Fetch artworks from API (POST + Auth header)
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        console.log("check: ", accessToken);
        const res = await fetch(
          "https://meraki-nexus-api.vercel.app/meraki-nexus-api/nexus/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            }// in case API expects an empty payload
          }
        );

        const data = await res.json();

        if (res.ok && data.success) {
          setArtworks(Array.isArray(data.data) ? data.data : []);
        } else {
          setError(data.message || "Failed to load artworks.");
        }
      } catch (err) {
        console.log("error: ", err);
        setError("Unable to fetch artworks. Please try again later.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [accessToken]);

  // Card animations
  useEffect(() => {
    if (!Array.isArray(artworks) || artworks.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);

      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.96, y: 12 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
        }
      );

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [artworks]);

  // Modal animations
  useEffect(() => {
    if (!modalRef.current || !overlayRef.current) return;

    if (isModalOpen) {
      gsap.set(overlayRef.current, { pointerEvents: "auto" });
      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      ).fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power3.out" },
        "<"
      );
    } else {
      const tl = gsap.timeline({
        onComplete: () =>
          gsap.set(overlayRef.current, { pointerEvents: "none" }),
      });
      tl.to(modalRef.current, {
        opacity: 0,
        scale: 0.97,
        y: 8,
        duration: 0.2,
        ease: "power2.in",
      }).to(
        overlayRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        "<"
      );
    }
  }, [isModalOpen]);

  const openModal = (art) => {
    setSelected(art);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelected(null), 300);
  };

  const items = Array.isArray(artworks) ? artworks : [];

  return (
    <div
      ref={rootRef}
      className="min-h-screen w-full bg-gradient-to-br md:mt-[50px] from-zinc-900 via-indigo-950 to-black text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Art Gallery
          </h1>
          <p className="mt-2 text-white/70">
            Explore curated AI art and creative works.
          </p>
        </header>

        {/* Loading */}
        {loading && (
          <p className="text-center text-white/70">Loading artworks...</p>
        )}

        {/* Error */}
        {error && !loading && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((art, i) => (
            <button
              key={art._id}
              ref={(el) => (cardsRef.current[i] = el)}
              onClick={() => openModal(art)}
              className="group text-left rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md shadow-xl shadow-indigo-950/20 transition-transform will-change-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-black">
                <img
                  src={art.image_url}
                  alt={art.title}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{art.title}</h3>
                <p className="text-sm text-white/80">{art.artist}</p>
                <p className="mt-1 text-xs text-white/70">
                  {art.classification} •{" "}
                  {Math.round(art.classification_percentage)}%
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${
          isModalOpen ? "" : "pointer-events-none opacity-0"
        }`}
        onClick={closeModal}
      >
        <div
          ref={modalRef}
          className="relative mx-4 w-full max-w-3xl rounded-2xl bg-zinc-900 p-6 text-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute right-3 top-3 rounded-md p-2 text-white/80 hover:bg-white/10"
            onClick={closeModal}
            aria-label="Close"
          >
            ×
          </button>
          {selected && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl bg-black">
                <img
                  src={selected.image_url}
                  alt={selected.title}
                  className="w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selected.title}</h2>
                <p className="text-white/80">{selected.artist}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-white/90">
                  <div>
                    <span className="text-white/60">Year:</span>{" "}
                    {selected.created_year}
                  </div>
                  <div>
                    <span className="text-white/60">Medium:</span>{" "}
                    {selected.medium}
                  </div>
                  <div>
                    <span className="text-white/60">Class:</span>{" "}
                    {selected.classification}
                  </div>
                  <div>
                    <span className="text-white/60">Confidence:</span>{" "}
                    {Math.round(selected.classification_percentage)}%
                  </div>
                  <div className="col-span-2">
                    <span className="text-white/60">Art Value:</span> ${" "}
                    {Number(selected.art_value_usd).toLocaleString()}
                  </div>
                  {selected.user && (
                    <div className="col-span-2 text-xs text-white/70">
                      Uploaded by: {selected.user.name} ({selected.user.email})
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold">Scores</h3>
                  <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-white/90">
                    {selected.scores &&
                      Object.entries(selected.scores).map(([key, value]) => (
                        <li
                          key={key}
                          className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                        >
                          <span className="capitalize text-white/70">
                            {key.replaceAll("_", " ")}
                          </span>
                          <span className="font-medium">
                            {Number(value).toFixed(2)}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>

                {selected.tags && selected.tags.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold">Tags</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selected.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GalleryPage;
