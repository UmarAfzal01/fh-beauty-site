import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="w-full bg-[#FAF7F3] text-[#514C48] py-24 px-6 md:px-12 xl:px-20 border-t border-[#E0DED8]">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Small Subtitle */}
        <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#514C48]/60 mb-6">
          ADVANCED AESTHETIC MEDICINE
        </span>

        {/* Main Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-serif font-normal leading-[1.35] text-[#111] max-w-4xl mb-10">
          We help you be the best version of yourself by delivering bespoke treatment plans featuring the world's best beauty products backed by scientific data to ensure natural-looking, gorgeous results.
        </h2>

        {/* Discover More Button */}
        <Link href="/appointment" className="bg-[#F5E7E4] text-[#514C48] text-xs font-sans tracking-widest px-8 py-3.5 rounded-full hover:bg-[#EEDDD9] transition-colors mb-24">
          BOOK AN APPOINTMENT
        </Link>

        {/* Three Columns Features Grid with Dividers */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 items-center">
          
          {/* Feature 1: Safety and hygiene */}
          <div className="flex flex-col items-center justify-center px-4 md:border-r border-[#E0DED8]">
            <div className="h-14 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[#7A5C58]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <h3 className="font-serif text-lg text-[#111]">Safety and hygiene</h3>
          </div>

          {/* Feature 2: Top-quality products */}
          <div className="flex flex-col items-center justify-center px-4 md:border-r border-[#E0DED8]">
            <div className="h-14 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[#7A5C58]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v3m0 14v3M2 12h3m14 0h3m-3.17-6.83l-2.12 2.12M7.29 16.71l-2.12 2.12m0-11.34l2.12 2.12m9.42 9.42l2.12 2.12" />
              </svg>
            </div>
            <h3 className="font-serif text-lg text-[#111]">Top-quality products</h3>
          </div>

          {/* Feature 3: Professional devices */}
          <div className="flex flex-col items-center justify-center px-4">
            <div className="h-14 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[#7A5C58]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h2m3 0h5" />
              </svg>
            </div>
            <h3 className="font-serif text-lg text-[#111]">Professional devices</h3>
          </div>

        </div>

      </div>
    </section>
  );
}