"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductsSlider() {
  const sliderRef = useRef(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch items from your API endpoint on mount
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/items");
        if (res.ok) {
          const data = await res.json();
          const itemsArray = Array.isArray(data) ? data : data.items || data.services || [];
          
          // Filter only items of type "Service" or use all if type isn't restricted
          const servicesOnly = itemsArray.filter(
            (item) => !item.type || item.type.toLowerCase() === "product"
          );

          setTreatments(servicesOnly.length > 0 ? servicesOnly : itemsArray);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard items:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
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
          Our Products
        </h2>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#514C48]/30 flex items-center justify-center text-[#514C48] hover:border-[#111] hover:text-[#111] transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#514C48]/30 flex items-center justify-center text-[#514C48] hover:border-[#111] hover:text-[#111] transition-colors cursor-pointer"
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
        ) : treatments.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] font-serif text-sm text-[#514C48]/70">
            No treatments available.
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

            {treatments.map((item, index) => {
              // Extract image from images array or use fallback
              const imageUrl = item.images?.[0]?.url || "/images/home-1-1.webp";
              const title = item.name || "Treatment";
              const description = item.description || "Experience premium medical care and aesthetic excellence.";

              return (
                <div
                  key={item._id || index}
                  className="flex-shrink-0 w-[260px] sm:w-[300px] lg:w-[350px] h-[420px] sm:h-[460px] lg:h-[480px] rounded-[24px] sm:rounded-[30px] overflow-hidden relative snap-start shadow-xl shadow-[#514C48]/10 group bg-[#2A2625]"
                >
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 pointer-events-none" />

                  <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-7">
                    <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-white/80">
                      .
                    </span>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm font-serif text-white/90 mb-6 line-clamp-2">
                        {description.length > 90
                          ? `${description.substring(0, 90)}...`
                          : description}
                      </p>
                      <Link
                        href={`/product/${item.slug || encodeURIComponent(title.toLowerCase())}`}
                        className="w-full inline-flex items-center justify-center bg-white/15 backdrop-blur-md hover:bg-white hover:text-[#111] text-white text-[11px] sm:text-xs font-sans tracking-[0.2em] uppercase py-3 rounded-full border border-white/30 transition-all duration-300"
                      >
                        BUY NOW
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

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