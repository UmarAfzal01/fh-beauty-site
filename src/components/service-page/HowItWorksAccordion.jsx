'use client';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

export default function HowItWorksAccordion({ steps }) {
  const [openIdx, setOpenIdx] = useState(0); // Default first item open, or set to null if all closed initially

  const toggleStep = (index) => {
    setOpenIdx(openIdx === index ? null : index);
  };

  return (
    <div className="space-y-4 font-sans">
      {steps?.map((step, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div 
            key={idx} 
            className="border-b border-white/20 pb-4 transition-all duration-300"
          >
            <button
              onClick={() => toggleStep(idx)}
              className="w-full flex justify-between items-center text-left py-2 focus:outline-none group"
            >
              <div className="flex items-center gap-4">
                <span className="text-rose-200 text-xs font-mono">0{idx + 1}</span>
                <h3 className="text-lg font-medium group-hover:text-rose-200 transition-colors">
                  {step.title}
                </h3>
              </div>
              <span className={`transform transition-transform duration-300 text-rose-200 ${isOpen ? 'rotate-180' : ''}`}>
                <IoIosArrowDown size={18} />
              </span>
            </button>
            
            {isOpen && (
              <div className="pt-3 pb-2 pl-7 text-rose-100/80 text-sm font-serif leading-relaxed animate-fadeIn">
                {step.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}