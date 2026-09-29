"id client";
import { useState } from "react";
import Image from "next/image";

export default function SuccessStories() {
  const reviews = [
    { name: "Sarah Jenkins", text: "The results are so subtle and natural. Completely exceeded my expectations!", rating: 5 },
    { name: "Amanda Ross", text: "Professional staff and very clean environment. Will definitely be returning.", rating: 5 },
    { name: "Jessica Taylor", text: "Minimal discomfort and zero downtime. My skin looks years younger.", rating: 5 },
  ];

  const [activeStory, setActiveStory] = useState(0);

  return (
    <section className="py-20 px-6 md:px-24 bg-rose-50/50 text-center">
      <h2 className="text-3xl font-serif font-light text-stone-800 mb-12">Success Stories</h2>
      
      {/* Featured Review Spotlight */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm mb-8">
        <p className="text-stone-700 italic text-lg mb-6">&ldquo;{reviews[activeStory].text}&rdquo;</p>
        <h4 className="font-medium text-stone-900">{reviews[activeStory].name}</h4>
        <div className="text-amber-400 text-sm mt-1">★★★★★</div>
      </div>

      {/* Selectors */}
      <div className="flex justify-center gap-4">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStory(idx)}
            className={`h-3 w-3 rounded-full transition-all ${activeStory === idx ? "bg-stone-800 w-6" : "bg-stone-300"}`}
            aria-label={`View story ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}