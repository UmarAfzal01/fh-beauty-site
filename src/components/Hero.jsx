'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative h-[100svh] w-full bg-[#FAF7F3] text-[#514C48] overflow-hidden flex flex-col justify-between">
      
      {/* Header */}
      <header className="w-full z-50 flex items-center justify-between px-6 py-5 md:px-12 xl:px-20 border-b border-[#E0DED8] shrink-0 bg-[#FAF7F3]/80 backdrop-blur-md">
        <div className="hidden md:flex flex-col gap-0.5 text-xs text-[#514C48]/70 font-sans">
          <p>511 SW 10th Ave 1206, Portland, OR United States</p>
          <a href="tel:+18001231234" className="hover:text-[#111]">+1 800-123-1234</a>
        </div>

        <div className="flex items-center gap-3">
          <Image src="/images/favicon-270x270.png" alt="Bella Beauty Logo" width={36} height={36} />
          <h1 className="text-2xl font-medium tracking-widest text-[#111] font-serif">BELLA BEAUTY</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-[#F5E7E4] text-[#514C48] text-xs px-5 py-2.5 rounded-full hover:bg-[#EEDDD9] transition-colors font-sans">
            BOOK A VISIT
          </button>
          <button className="bg-transparent border border-[#514C48] rounded-full p-2.5 group hover:border-black transition-colors">
             <svg width="14" height="8" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-[#514C48]">
                <path d="M1 1H15M1 5H15M1 9H15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </button>
        </div>
      </header>

      {/* Hero Content Area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-6 md:px-12 xl:px-20">
        
        {/* Large Background Text with Parallax Transform */}
        <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none select-none">
          <span 
            style={{ transform: `translateY(${offsetY * 0.25}px)` }}
            className="text-[13vw] font-serif font-medium text-[#111] whitespace-nowrap leading-none tracking-tight opacity-5 will-change-transform transition-transform duration-75"
          >
            BEAUTY, RESTORE, REJUVENATE
          </span>
        </div>

        {/* Main Content Layout Container */}
        <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
          
          {/* Top Left Heading Text with Playfair/Serif styling */}
          <div className="flex flex-col justify-start items-start lg:absolute lg:top-[-10vh] lg:left-0 z-20">
            <h2 className="text-xl md:text-2xl lg:text-[1.75rem] leading-[1.3] text-[#111] max-w-xs font-serif font-normal">
              Feel Your Best With Advanced Aesthetic Medicine.
            </h2>
          </div>

          {/* Center Image Column */}
          <div className="flex justify-center col-span-1 lg:col-span-3">
            <div className="relative w-[300px] sm:w-[350px] lg:w-[600px] h-[52vh] sm:h-[58vh] lg:h-[67vh] rounded-[40px] overflow-hidden shadow-2xl shadow-[#514C48]/15">
              <Image 
                src="/images/home-1-1.webp" 
                alt="Beautiful woman portrait" 
                fill 
                className="object-cover object-center" 
                priority
              />
            </div>
          </div>

          {/* Right Column (Circle Badge & Footer Text) */}
          <div className="hidden lg:flex flex-col items-end justify-between h-[55vh] py-2 absolute right-0 z-20">
             <div className="relative w-24 h-24 animate-spin-slow">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none"/>
                  <text className="text-[11px] fill-[#111] tracking-widest font-sans uppercase" dy="7">
                    <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
                        BEST SERVICES • BEST SERVICES • 
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#111] rounded-full"></div>
                </div>
             </div>

            <div className="text-xs sm:text-sm text-[#514C48]/90 space-y-1 tracking-wider text-right font-serif">
              <p>BESPOKE TREATMENTS.</p>
              <p>NATURAL RESULTS.</p>
              <p>THE BEST OF YOU.</p>
            </div>
          </div>

        </div>
 
      </div>
    </main>
  );
}