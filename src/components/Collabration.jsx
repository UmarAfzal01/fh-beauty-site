"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function CollaborationsPage() {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCollaborator, setActiveCollaborator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Fetch collaborations
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/collaborations", { signal: controller.signal });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load collaborations");
        }
        setCollaborators(data.collaborations || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError("Unable to load collaborations right now.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  // Slides for the active collaborator, falling back to the cover image
  const slides = useMemo(() => {
    if (!activeCollaborator) return [];
    const gallery = (activeCollaborator.images || []).filter(
      (url) => url && url.trim() !== ""
    );
    if (gallery.length > 0) return gallery;
    return activeCollaborator.coverImage ? [activeCollaborator.coverImage] : [];
  }, [activeCollaborator]);

  const openModal = (collaborator) => {
    setActiveCollaborator(collaborator);
    setCurrentSlideIndex(0);
    requestAnimationFrame(() => setIsModalOpen(true));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setActiveCollaborator(null), 300);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    if (slides.length === 0) return;
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    if (slides.length === 0) return;
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Close on Escape
  useEffect(() => {
    if (!activeCollaborator) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeCollaborator]);

  return (
    <main className="min-h-screen bg-[#FAF7F3] text-[#514C48] py-10 px-6 sm:px-12 lg:px-24">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
        <span className="text-xs uppercase tracking-[0.2em] text-[#8D4D5D] font-sans font-semibold">
          STRATEGIC PARTNERSHIPS
        </span>
        <h1 className="text-4xl lg:text-5xl font-normal font-serif text-[#2C2623] leading-tight">
          Our Valued Collaborations
        </h1>
        <p className="text-sm lg:text-base font-sans text-[#514C48]/80 leading-relaxed max-w-xl mx-auto">
          Collaborating with premier television networks, luxury brands, and industry leaders to advance holistic health and modern aesthetics.
        </p>
      </div>

      {/* States */}
      {loading ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-[16/10] rounded-[28px] bg-[#EBE4DE]/60 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-sm text-rose-600">{error}</p>
      ) : collaborators.length === 0 ? (
        <p className="text-center text-sm text-[#514C48]/70">No collaborations to show yet.</p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collaborators.map((collab) => (
            <div
              key={collab._id}
              onClick={() => openModal(collab)}
              className="bg-white rounded-[28px] overflow-hidden border border-[#EBE4DE] shadow-xs hover:shadow-2xl transition-all duration-300 cursor-pointer group relative flex flex-col aspect-[16/10]"
            >
              <div className="relative w-full h-full overflow-hidden bg-[#F4F0EC]">
                {collab.coverImage && (
                  <img
                    src={collab.coverImage}
                    alt={collab.name}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                )}

                {collab.logo && (
                  <div className="absolute top-4 right-4 z-20 w-16 h-16 rounded-2xl bg-white/95 backdrop-blur-md p-0.5 shadow-lg border border-[#EBE4DE]/60 overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <img
                        src={collab.logo}
                        alt={`${collab.name} logo`}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[10px] uppercase font-sans tracking-widest text-[#FAF7F3]/80 font-medium mb-1 block">
                      {collab.role}
                    </span>
                    <h3 className="text-lg font-serif font-medium leading-snug">{collab.name}</h3>
                    <p className="text-xs font-sans text-white/90 line-clamp-2 mt-1.5 font-light">
                      {collab.shortDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal with Slider */}
      {activeCollaborator && (
        <div
          onClick={closeModal}
          className={`fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ease-out ${
            isModalOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white w-full max-w-3xl rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] transition-all duration-300 ease-out transform ${
              isModalOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-6"
            }`}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition"
              aria-label="Close modal"
            >
              <FiX size={20} />
            </button>

            {/* Slider */}
            <div className="relative w-full h-[320px] sm:h-[450px] bg-[#111]">
              {slides[currentSlideIndex] && (
                <img
                  src={slides[currentSlideIndex]}
                  alt={`${activeCollaborator.name} slide ${currentSlideIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300"
                />
              )}

              {slides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111] flex items-center justify-center transition shadow-md"
                    aria-label="Previous slide"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#111] flex items-center justify-center transition shadow-md"
                    aria-label="Next slide"
                  >
                    <FiChevronRight size={20} />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentSlideIndex === idx ? "bg-white w-5" : "bg-white/50"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Details */}
            {/* <div className="p-8 bg-[#FAF7F3] flex flex-col justify-between overflow-y-auto">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-widest text-[#8D4D5D] font-semibold block mb-1">
                  {activeCollaborator.role}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#2C2623] mb-3">
                  {activeCollaborator.name}
                </h2>
                <p className="text-sm sm:text-base font-sans text-[#514C48]/80 leading-relaxed">
                  {activeCollaborator.shortDesc}
                </p>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </main>
  );
} 