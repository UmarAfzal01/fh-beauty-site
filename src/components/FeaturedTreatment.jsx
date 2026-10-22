import Image from "next/image";

export default function FeaturedTreatment() {
  return (
    <section className="w-full min-h-[85vh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* Left Column: Full-Height Model Image with Overlay Card */}
      <div className="relative w-full h-[60vh] lg:h-auto min-h-[500px] bg-[#2A2625]">
        <Image
          src="https://res.cloudinary.com/wapixih0/image/upload/v1792669082/Facial-Aesthetics-and-Skin-Treatments-Dr-Warda-Skikandar.webp"
          alt="Featured Treatment Model"
          fill
          className="object-cover object-center"
        />

        {/* Floating Glassmorphism Badge (Top Left) */}
        <div className="absolute top-8 left-8 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 max-w-[240px] text-white shadow-lg">
          <p className="text-xs font-sans tracking-wide mb-3 text-white/90">
            Interested In Our Specials?
          </p>
          <a href="/contact" className="bg-transparent hover:bg-white text-white hover:text-[#111] text-xs font-sans tracking-widest px-5 py-2.5 rounded-full border border-white/60 transition-all duration-300">
            CONTACT US
          </a>
        </div>
      </div>

      {/* Right Column: Content Area with Soft Pink Background */}
      <div className="bg-[#F8EFEA] text-[#514C48] flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20">
        <div className="max-w-xl">
          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[3.3rem] font-serif font-normal leading-[1.2] text-[#111] mb-4">
            Facial Aesthetics and Skin Treatments
          </h2>

          {/* Subtitle Highlight */}
          <p className="text-base sm:text-lg font-serif italic text-[#514C48] mb-8">
            From HydraFacial to PRP, chosen for your skin.
          </p>

          {/* Detailed Paragraph */}
          <p className="text-sm sm:text-base font-sans leading-relaxed text-[#514C48]/80 mb-10">
            Our facial treatment range includes HydraFacial, chemical peels,
            microneedling, PRP and Vampire Facial, and skin boosters. Each is
            recommended only after assessing your skin condition, so you receive
            a treatment that suits you rather than a one-size-fits-all package.
          </p>

          {/* Action Link */}
          <a
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[#111] hover:text-[#8D4D5D] transition-colors group"
          >
            FIND OUT MORE
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              ↘
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
