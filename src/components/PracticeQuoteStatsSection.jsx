'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

// Helper component for animated stats counter
function CounterNumber({ end, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 } // Triggers when 30% of the element is in view
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Smooth easeOutExpo formula
      const easeOut = 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeOut * end);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function PracticeQuoteStatsSection() {
  const stats = [
    { targetNumber: 10, suffix: '+', label: 'Personalized assessment' },
    { targetNumber: 25, suffix: '+', label: 'Doctor-led care' },
    { targetNumber: 8, suffix: '+', label: 'Preventive approach' },
    { targetNumber: 15, suffix: 'K+', label: 'Realistic expectations' },
  ];

  return (
    <section className="w-full bg-[#8D4D5D] text-white overflow-hidden">
      
      {/* Top Image Banner with Floating Quote */}
      <div className="relative w-full py-24 px-6 md:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto relative">
          
          {/* Main Background Image Container */}
          <div className="relative w-full h-[450px] sm:h-[520px] lg:h-[580px] rounded-[40px] overflow-hidden shadow-2xl bg-[#3A3230]">
            <Image 
              src="/images/home-1-8.webp" 
              alt="Cosmetic treatment care" 
              fill 
              className="object-cover object-center opacity-60 brightness-105"
            />
            {/* Gentle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

            {/* Floating Glassmorphism Quote Card */}
            <div className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-12 z-20 bg-white/15 backdrop-blur-md border border-white/30 p-8 sm:p-10 rounded-3xl max-w-lg shadow-2xl text-white">
              {/* Decorative Icon */}
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>

              {/* Quote Text */}
              <p className="font-serif text-lg sm:text-xl italic leading-relaxed mb-6 text-white/95">
                “Every treatment plan starts with understanding you: your skin, your health and your goals.”
              </p>

              {/* Author */}
              <span className="text-xs font-sans tracking-[0.2em] uppercase text-white/75 font-medium">
                Dr. Warda Sikander
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Animated Statistics Bar */}
      <div className="w-full border-t border-white/15 py-12 px-6 md:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/15">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center lg:items-start text-center lg:text-left ${
                index !== 0 ? 'pt-6 lg:pt-0 lg:pl-8' : ''
              }`}
            >
              <div className="text-4xl sm:text-5xl font-serif font-normal text-white mb-2">
                <CounterNumber 
                  end={stat.targetNumber} 
                  suffix={stat.suffix} 
                  duration={2200} 
                />
              </div>
              <p className="text-xs font-sans uppercase tracking-[0.15em] text-white/75">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}