"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function PopularTreatmentsSlider() {
  const sliderRef = useRef(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch treatments from your /api/services endpoint on mount
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (res.ok && data.success && data.services?.length > 0) {
          setTreatments(data.services);
        } else {
          // Fallback items if API returns empty
          setTreatments([
            { hero: { name: "Hydrofacial", image: "/images/home-1-1.webp" } },
            {
              hero: {
                name: "Laser Hair Removal",
                image: "/images/home-1-2.webp",
              },
            },
            {
              hero: {
                name: "Breast Augmentation",
                image: "/images/home-1-3.webp",
              },
            },
            {
              hero: {
                name: "Botulinum Therapy",
                image: "/images/home-1-4.webp",
              },
            },
            {
              hero: {
                name: "Advanced Chemical Peel",
                image: "/images/home-1-5.webp",
              },
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollAmount = clientWidth * 0.75;
      sliderRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-[#FAF7F3] text-[#514C48] py-16 sm:py-24 overflow-hidden">
      {/* Header Container */}
      <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12 xl:px-20 mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-normal text-[#111]">
          Popular Treatments
        </h2>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#514C48]/30 flex items-center justify-center text-[#514C48] hover:border-[#111] hover:text-[#111] transition-colors"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#514C48]/30 flex items-center justify-center text-[#514C48] hover:border-[#111] hover:text-[#111] transition-colors"
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </div>

      {/* Slider Track Container */}
      <div className="max-w-[1600px] mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center h-[420px] font-serif text-sm text-[#514C48]/70">
            Loading treatments...
          </div>
        ) : (
          <div
            ref={sliderRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-8 pt-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div
              className="flex-shrink-0 w-6 md:w-12 xl:w-20"
              aria-hidden="true"
            />

            {treatments.map((item, index) => (
              <div
                key={item._id || index}
                className="flex-shrink-0 w-[260px] sm:w-[300px] lg:w-[350px] h-[420px] sm:h-[460px] lg:h-[480px] rounded-[24px] sm:rounded-[30px] overflow-hidden relative snap-start shadow-xl shadow-[#514C48]/10 group bg-[#2A2625]"
              >
                <Image
                  src={item.hero?.image || "/images/home-1-1.webp"}
                  alt={item.hero?.name || "Treatment"}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 pointer-events-none" />

                <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-7">
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-white/80">
                    TREATMENTS
                  </span>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif text-white mb-0 sm:mb-2">
                      {item.hero?.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-serif text-white/90 mb-4 line-clamp-2">
                      {item.hero.shortDesc.length > 90
                        ? `${item.hero.shortDesc.substring(0, 90)}...`
                        : item.hero.shortDesc}
                    </p>
                    <button className="w-full bg-white/15 backdrop-blur-md hover:bg-white hover:text-[#111] text-white text-[11px] sm:text-xs font-sans tracking-[0.2em] uppercase py-3 rounded-full border border-white/30 transition-all duration-300">
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div
              className="flex-shrink-0 w-6 md:w-12 xl:w-20"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </section>
  );
}
