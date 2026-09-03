'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TransformSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="w-full bg-[#FAF7F3] text-[#514C48] py-24 px-6 md:px-12 xl:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
        
        {/* Left Column: Text & CTA */}
        <div className="flex flex-col items-start max-w-xl">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-normal leading-[1.2] text-[#111] mb-6">
            Transform Your Look with Expert Aesthetic Procedures
          </h2>
          
          <p className="text-sm sm:text-base text-[#514C48]/80 font-sans leading-relaxed mb-10">
            Under Dr. Lanna's guidance, our expert injection specialists can revitalize your appearance through minimally invasive treatments. As one of the most sought-after names in non-invasive rejuvenation, our clients come from all over the world seeking the transformative work of Dr. Lanna and her skilled team.
          </p>

          <button className="bg-[#6B4C4C] text-white text-xs font-sans tracking-widest px-8 py-4 rounded-full hover:bg-[#583D3D] transition-colors shadow-sm">
            LEARN MORE ABOUT US
          </button>
        </div>

        {/* Right Column: Layered Images Grid with Parallax */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg">
            
            {/* Main Large Portrait Image (Slight Parallax Move) */}
            <div 
              style={{ transform: `translateY(${scrollY * 0.03}px)` }}
              className="relative w-full aspect-[4/5] max-w-[420px] ml-auto rounded-[30px] overflow-hidden shadow-xl shadow-[#514C48]/10 bg-[#EFECE6] will-change-transform transition-transform duration-75"
            >
              <Image 
                src="/images/home-1-2.webp" 
                alt="Expert aesthetic procedures portrait" 
                fill 
                className="object-cover object-center"
              />
            </div>

            {/* Overlapping Smaller Square Image (Distinct Counter Parallax Move) */}
            <div 
              style={{ transform: `translateY(${scrollY * -0.05}px)` }}
              className="absolute -bottom-8 left-4 sm:left-0 w-44 sm:w-56 aspect-[3/3] rounded-[24px] overflow-hidden shadow-2xl border-4 border-[#FAF7F3] bg-[#EFECE6] will-change-transform transition-transform duration-75 z-10"
            >
              <Image 
                src="/images/home-1-3.webp" 
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