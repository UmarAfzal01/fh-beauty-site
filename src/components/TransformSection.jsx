"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function TransformSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full bg-[#FAF7F3] text-[#514C48] py-24 px-6 md:px-12 xl:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 items-center gap-16">
        {/* Left Column: Text & CTA — Appears SECOND on mobile/tablet (order-2), FIRST on desktop (lg:order-1) */}
        <div className="flex flex-col items-start max-w-xl order-2 lg:order-1">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-serif font-normal leading-[1.2] text-[#111] mb-6">
            Aesthetic Treatments Tailored to Your Skin and Goals
          </h2>

          <p className="text-sm sm:text-base text-[#514C48]/80 font-sans leading-relaxed mb-10">
            Pakistan Wellness Center offers facial aesthetics, laser treatments
            and injectables, selected after a professional skin assessment.
            Whether your concern is dullness, acne scars, pigmentation, fine
            lines or facial volume, your treatment is chosen around your skin
            type and goals. Results vary from person to person, and your doctor
            will explain the options, limitations and aftercare before you
            decide.
          </p>

          <a
            href="/about"
            className="bg-[#8D4D5D] text-white text-xs font-sans tracking-widest px-8 py-4 rounded-full hover:bg-[#583D3D] transition-colors shadow-sm"
          >
            LEARN MORE ABOUT US
          </a>
        </div>

        {/* Right Column: Layered Images Grid — Appears FIRST on mobile/tablet (order-1), SECOND on desktop (lg:order-2) */}
        <div className="relative flex justify-center lg:justify-end w-full order-1 lg:order-2">
          <div className="relative w-full max-w-lg">
            {/* Main Large Portrait Image */}
            <div
              style={{ transform: `translateY(${scrollY * 0.03}px)` }}
              className="relative w-full aspect-[4/5] max-w-[420px] ml-auto rounded-[30px] overflow-hidden shadow-xl shadow-[#514C48]/10 bg-[#EFECE6] will-change-transform transition-transform duration-75"
            >
              <Image
                src="https://res.cloudinary.com/wapixih0/image/upload/v1792669081/Aesthetic-Treatments-Tailored-2-Dr-Warda-Skikandar.webp"
                alt="Expert aesthetic procedures portrait"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Overlapping Smaller Square Image */}
            <div
              style={{ transform: `translateY(${scrollY * -0.05}px)` }}
              className="absolute -bottom-8 left-4 sm:left-0 w-44 sm:w-56 aspect-[3/3] rounded-[24px] overflow-hidden shadow-2xl border-4 border-[#FAF7F3] bg-[#EFECE6] will-change-transform transition-transform duration-75 z-10"
            >
              <Image
                src="https://res.cloudinary.com/wapixih0/image/upload/v1792669082/Aesthetic-Treatments-Tailored-Dr-Warda-Skikandar.webp"
                alt="Treatment procedure in session"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
