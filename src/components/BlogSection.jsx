import Image from 'next/image';

export default function BlogSection() {
  const posts = [
    {
      category: 'AESTHETICS',
      title: '5 Tips on How to Look Younger than Your Age',
      image: '/images/home-1-1.webp',
      link: '#',
    },
    {
      category: 'NEWS',
      title: 'How To Care For Your Skin After Aesthetic Procedures',
      image: '/images/home-1-2.webp',
      link: '#',
    },
    {
      category: 'TIPS',
      title: 'Lip Fillers: the Best Drugs and Brands',
      image: '/images/home-1-4.webp',
      link: '#',
    },
  ];

  return (
    <section className="w-full bg-[#FAF7F3] text-[#514C48] py-24 px-6 md:px-12 xl:px-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-normal text-[#111] text-center mb-16">
          From the Blog
        </h2>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16">
          {posts.map((post, index) => (
            <div 
              key={index}
              className="bg-[#F5EFEA] rounded-[30px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Top Image */}
              <div className="relative w-full h-[220px] sm:h-[240px] rounded-[20px] overflow-hidden mb-6 bg-[#EBE4DE]">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover object-center"
                />
              </div>

              {/* Content Area */}
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#7A5C58] block mb-2">
                    {post.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#111] leading-snug mb-8">
                    {post.title}
                  </h3>
                </div>

                {/* Read More Link */}
                <div className="pt-4 border-t border-[#E5DDD5]">
                  <a 
                    href={post.link} 
                    className="text-xs font-sans uppercase tracking-[0.2em] text-[#111] font-medium hover:text-[#7A5C58] transition-colors inline-flex items-center gap-1.5"
                  >
                    READ MORE <span>↗</span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* View More Posts Button */}
        <button className="bg-[#7A5C58] hover:bg-[#654945] text-white text-xs font-sans tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-lg">
          VIEW MORE POSTS
        </button>

      </div>
    </section>
  );
}