"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function TopTreatments() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const treatmentsLeft = [
    "Botox and dermal fillers",
    "HydraFacial and medical facials",
    "Laser hair reduction",
  ];

  const treatmentsRight = [
    "PRP and Vampire Facial",
    "Skin biostimulators and skin boosters",
    "Body contouring (cryolipolysis, HIFU, EMS/HIFEM)",
  ];

  return (
    <section className="w-full bg-[#FAF7F3] text-[#514C48] py-24 px-6 md:px-12 xl:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
        {/* Left Column: Content & Checkmark Grid */}
        <div className="flex flex-col items-start max-w-xl">
          {/* Top Subtitle */}
          <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#514C48]/60 mb-4">
            OUR TREATMENTS
          </span>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-normal leading-[1.2] text-[#111] mb-6">
            A Complete Range of Non-Surgical Aesthetic Care
          </h2>

          {/* Descriptive Paragraph */}
          <p className="text-sm sm:text-base text-[#514C48]/80 font-sans leading-relaxed mb-8">
            Pakistan Wellness Center brings aesthetic, laser and body-contouring
            services under one roof, guided by a doctor-led consultation.
          </p>

          {/* Two-Column List with Checkmarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 w-full mb-10 text-sm font-sans text-[#111]">
            <div className="space-y-3">
              {treatmentsLeft.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-4 h-4 text-[#8D4D5D] text-xs">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {treatmentsRight.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-4 h-4 text-[#8D4D5D] text-xs">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <a href="/doctors" className="bg-[#F5E7E4] text-[#514C48] text-xs font-sans tracking-widest px-8 py-4 rounded-full hover:bg-[#EEDDD9] transition-colors shadow-sm">
            MEET OUR TEAM
          </a>
        </div>

        {/* Right Column: Image Display with Parallax */}
        <div className="relative flex justify-center lg:justify-end">
          <div
            style={{ transform: `translateY(${scrollY * 0.03}px)` }}
            className="relative w-full max-w-lg aspect-[4/4.5] rounded-[30px] overflow-hidden shadow-xl shadow-[#514C48]/10 bg-[#EFECE6] will-change-transform transition-transform duration-75"
          >
            <Image
              src="https://res.cloudinary.com/wapixih0/image/upload/v1792669081/A-Complete-Range-of-Non-Surgical-Aesthetic-Care-Dr-Warda-Skikandar.webp"
              alt="Renew your confidence treatment"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
