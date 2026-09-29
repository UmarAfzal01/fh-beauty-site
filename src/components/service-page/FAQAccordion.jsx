'use client';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

export default function FAQAccordion({ faqs }) {
  const [openIdx, setOpenIdx] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIdx(openIdx === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {faqs?.map((faq, idx) => (
        <div 
          key={idx} 
          className="bg-white rounded-2xl border border-[#EBE4DE] overflow-hidden transition-all duration-300"
        >
          <button
            onClick={() => toggleFAQ(idx)}
            className="w-full flex justify-between items-center p-6 text-left font-serif text-lg text-[#2C2623] hover:bg-[#FAF7F3]/50 transition-colors focus:outline-none"
          >
            <span>{faq.question}</span>
            <span className={`transform transition-transform duration-300 text-[#8D4D5D] ${openIdx === idx ? 'rotate-180' : ''}`}>
              <IoIosArrowDown size={20} />
            </span>
          </button>
          
          {openIdx === idx && (
            <div className="px-6 pb-6 text-[#514C48]/80 text-sm font-sans leading-relaxed border-t border-[#FAF7F3] pt-4">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}