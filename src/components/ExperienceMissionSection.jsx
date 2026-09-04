import Image from 'next/image';

export default function ExperienceMissionSection() {
  return (
    <section className="w-full bg-[#8D4D5D] text-white overflow-hidden">
      
      {/* PART 1: Stats & Image Showcase */}
      <div className="relative w-full py-28 px-6 md:px-12 xl:px-20">
        <div className="max-w-7xl mx-auto relative">
          
          {/* Main Background Image Container with Lighter Opacity */}
          <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[640px] rounded-[40px] overflow-hidden shadow-2xl bg-[#3A3230]">
            <Image 
              src="/images/home-1-6.webp" 
              alt="Experienced medical aesthetic treatment" 
              fill 
              className="object-cover object-center opacity-65 brightness-105"
            />
            {/* Soft, gentle vignette overlay so cards pop clearly without crushing shadows */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

            {/* Floating Stat Card 1: Top Right */}
            <div className="absolute top-8 right-8 z-20 bg-white/95 backdrop-blur-md text-[#514C48] p-6 sm:p-8 rounded-3xl max-w-[280px] shadow-2xl hidden lg:block">
              <div className="text-4xl font-serif text-[#8D4D5D] mb-2 font-medium">25</div>
              <h4 className="text-xs font-sans uppercase tracking-widest font-semibold text-[#111] mb-2">
                Years of combined experience
              </h4>
              <p className="text-xs font-sans text-[#514C48]/80 leading-relaxed">
                Our experienced team strives to provide a positive, stress-free experience.
              </p>
            </div>

            {/* Bottom Stat Cards: Bottom Left */}
            <div className="absolute bottom-8 left-8 right-8 lg:right-auto z-20 flex flex-wrap gap-4 items-end">
              
              {/* Stat Card 2: Convenient locations */}
              <div className="bg-white/15 backdrop-blur-md border border-white/30 p-6 sm:p-7 rounded-3xl w-full sm:w-[220px] shadow-xl text-white">
                <div className="text-3xl sm:text-4xl font-serif mb-2">3</div>
                <p className="text-xs font-sans tracking-wide text-white/90">
                  Convenient locations across the city
                </p>
              </div>

              {/* Stat Card 3: Experienced doctors */}
              <div className="bg-[#6B4C4C] text-white p-6 sm:p-7 rounded-3xl w-full sm:w-[240px] shadow-xl border border-white/20">
                <div className="text-3xl sm:text-4xl font-serif mb-2">15</div>
                <p className="text-xs font-sans tracking-wide text-white/90">
                  Experienced doctors at your service
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* PART 2: Leader Quote & Rating Section */}
      <div className="w-full py-20 px-6 md:px-12 text-center border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          {/* Star Rating Icons */}
          <div className="flex justify-center gap-1.5 mb-6 text-[#F5E7E4]">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Main Statement */}
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal italic text-white mb-6 leading-snug">
            “Leader in the field of cosmetic laser and medicine since 2008.”
          </h3>

          {/* Review Stats Subtitle */}
          <p className="text-xs font-sans tracking-[0.2em] uppercase text-white/75">
            4.8 rating based on 1000+ reviews
          </p>
        </div>
      </div>

      {/* PART 3: Our Mission Section */}
      <div className="w-full py-24 px-6 md:px-12 xl:px-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Mission Content & Signature */}
          <div className="flex flex-col items-start max-w-xl">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-white/70 mb-4">
              OUR MISSION
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-normal leading-[1.2] text-white mb-6">
              Our Goal is to Provide the Highest Quality Service
            </h2>

            <p className="text-sm sm:text-base text-white/85 font-sans leading-relaxed mb-10">
              Dr. Grobman believes that every patient should love how they look and feel. Our treatment plans are always updated to help reflect the latest cosmetic trends. Call or text (516) 399-2270 to contact our office.
            </p>

            {/* Signature Graphic Mockup */}
            <div className="text-white/85 font-serif italic text-2xl tracking-widest opacity-90 select-none">
              Grobman M.D.
            </div>
          </div>

          {/* Right Column: Mission Portrait Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-[4/4.5] rounded-[30px] overflow-hidden shadow-2xl bg-[#5E4441]">
              <Image 
                src="/images/home-1-4.webp" 
                alt="Our mission aesthetic model" 
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