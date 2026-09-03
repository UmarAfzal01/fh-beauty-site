import Image from 'next/image';

export default function InstagramFeedSection() {
  const feedImages = [
    { src: '/images/instagram-1.webp', alt: 'Instagram aesthetic treatment 1' },
    { src: '/images/instagram-2.webp', alt: 'Instagram aesthetic treatment 2' },
    { src: '/images/instagram-3.webp', alt: 'Instagram aesthetic treatment 3' },
    { src: '/images/instagram-4.webp', alt: 'Instagram aesthetic treatment 4' },
    { src: '/images/instagram-5.webp', alt: 'Instagram aesthetic treatment 5' },
    { src: '/images/instagram-6.webp', alt: 'Instagram aesthetic treatment 6' },
  ];

  return (
    <section className="w-full bg-[#FAF7F3] py-16 px-6 md:px-12 xl:px-20 overflow-hidden">
      <div className="max-w mx-auto flex flex-col items-center">
        
        {/* Instagram Handle Header */}
        <div className="w-full flex justify-center md:justify-start mb-8">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#514C48] hover:text-[#7A5C58] transition-colors"
          >
            INSTAGRAM <span className="text-[#7A5C58] font-medium">@FHBEAUTY</span>
          </a>
        </div>

        {/* 6-Column Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 w-full">
          {feedImages.map((item, index) => (
            <a 
              key={index} 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative w-full aspect-square rounded-[24px] overflow-hidden bg-[#EBE4DE] shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Image 
                src={item.src} 
                alt={item.alt} 
                fill 
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-serif opacity-90">↗</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}