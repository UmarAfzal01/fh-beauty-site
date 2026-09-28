import Image from 'next/image';

// Get the base site URL for server-side fetching
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getInstagramPosts() {
  try {
    const res = await fetch(`${BASE_URL}/api/instagram`, { 
      next: { revalidate: 3600 } // Revalidates cache every 1 hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.posts : [];
  } catch (err) {
    console.error("Error loading Instagram feed:", err);
    return [];
  }
}

export default async function InstagramFeedSection() {
  const livePosts = await getInstagramPosts();

  // Fallback placeholder images if API credentials are blank or fail
  const fallbackImages = [
    { src: '/images/instagram-1.webp', alt: 'Instagram aesthetic treatment 1', permalink: 'https://instagram.com' },
    { src: '/images/instagram-2.webp', alt: 'Instagram aesthetic treatment 2', permalink: 'https://instagram.com' },
    { src: '/images/instagram-3.webp', alt: 'Instagram aesthetic treatment 3', permalink: 'https://instagram.com' },
    { src: '/images/instagram-4.webp', alt: 'Instagram aesthetic treatment 4', permalink: 'https://instagram.com' },
    { src: '/images/instagram-5.webp', alt: 'Instagram aesthetic treatment 5', permalink: 'https://instagram.com' },
    { src: '/images/instagram-6.webp', alt: 'Instagram aesthetic treatment 6', permalink: 'https://instagram.com' },
  ];

  const feedImages = livePosts.length > 0 ? livePosts : fallbackImages;

  return (
    <section className="w-full bg-[#FAF7F3] py-16 px-6 md:px-12 xl:px-20 overflow-hidden">
      <div className="max-w mx-auto flex flex-col items-center">
        
        {/* Instagram Handle Header */}
        <div className="w-full flex justify-center md:justify-start mb-8">
          <a 
            href="https://instagram.com/drwardasikandar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#514C48] hover:text-[#8D4D5D] transition-colors"
          >
            INSTAGRAM <span className="text-[#8D4D5D] font-medium">@DrWardaSikander</span>
          </a>
        </div>

        {/* 6-Column Responsive Grid with Portrait/Rectangular Aspect Ratio */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 w-full">
          {feedImages.map((item, index) => (
            <a 
              key={item.id || index} 
              href={item.permalink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative w-full aspect-[4/7] rounded-[24px] overflow-hidden bg-[#EBE4DE] shadow-sm hover:shadow-md transition-all duration-300 block"
            >
              <Image 
                src={item.src} 
                alt={item.alt} 
                fill 
                className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
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