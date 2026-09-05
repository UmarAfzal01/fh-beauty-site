'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function BlogMagazineLayout() {
  const latestPosts = [
    {
      title: 'Creating an Intuitive User Interface (UI) for Your SaaS Product',
      date: 'Aug 10',
      readTime: '10 min read',
      image: '/images/home-1-1.webp',
    },
    {
      title: 'Tips for designing clear and user-friendly navigation menus.',
      date: 'Aug 10',
      readTime: '10 min read',
      image: '/images/home-1-2.webp',
    },
    {
      title: 'Exploring how to establish a visual hierarchy that guides users.',
      date: 'Aug 10',
      readTime: '10 min read',
      image: '/images/home-1-3.webp',
    },
    {
      title: 'How to use color to influence user emotions and actions.',
      date: 'Aug 10',
      readTime: '10 min read',
      image: '/images/home-1-4.webp',
    },
  ];

  const foundersCorner = [
    {
      category: 'Category',
      title: 'Our people make the difference',
      excerpt: 'We’re an extension of your customer service team, and all of our resources are free. Chat to our friendly team 24/7 when you need help.',
      date: 'Aug 10',
      readTime: '10 min read',
      image: '/images/home-1-1.webp',
    },
    {
      category: 'Category',
      title: 'Our people make the difference',
      excerpt: 'We’re an extension of your customer service team, and all of our resources are free. Chat to our friendly team 24/7 when you need help.',
      date: 'Aug 10',
      readTime: '10 min read',
      image: '/images/home-1-2.webp',
    },
    {
      category: 'Category',
      title: 'Our people make the difference',
      excerpt: 'We’re an extension of your customer service team, and all of our resources are free. Chat to our friendly team 24/7 when you need help.',
      date: 'Aug 10',
      readTime: '10 min read',
      image: '/images/home-1-3.webp',
    },
  ];

  return (
    <main className="w-full bg-[#FAF7F3] text-[#514C48] min-h-screen py-16 px-6 md:px-12 xl:px-20">
      <div className="max-w-[1400px] mx-auto space-y-16">
        
        {/* Top Section: Featured Hero Post (Left) & Latest Posts (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Featured Hero Article */}
          <div className="lg:col-span-8 group relative rounded-[32px] overflow-hidden h-[420px] sm:h-[480px] lg:h-[520px] shadow-xl shadow-[#514C48]/10 bg-[#2A2625]">
            <Image 
              src="/images/home-1-1.webp" 
              alt="Featured Hero" 
              fill 
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Smooth Glassmorphism Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end text-white z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full w-fit mb-4 border border-white/30 text-[11px] font-sans uppercase tracking-[0.2em]">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                Category
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal mb-4 leading-snug">
                Enhancing Team Collaboration with SaaS Products: A Game-Changer for Modern Workflows
              </h1>

              <div className="flex items-center gap-3 text-xs font-sans text-white/80">
                <span>Aug 10</span>
                <span>•</span>
                <span>10 min read</span>
              </div>
            </div>
          </div>

          {/* Latest Posts Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-[32px] p-6 sm:p-8 shadow-xl shadow-[#514C48]/5 border border-[#514C48]/10 flex flex-col">
            <h2 className="text-xl font-serif text-[#111] mb-6">Latest post</h2>

            <div className="space-y-6">
              {latestPosts.map((post, index) => (
                <div key={index} className="flex items-center gap-4 group cursor-pointer pb-4 border-b border-[#514C48]/10 last:border-0 last:pb-0">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-200">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-serif text-[#111] group-hover:text-[#7A5C58] transition-colors line-clamp-2 mb-1.5 leading-snug">
                      {post.title}
                    </h3>
                    <div className="text-[11px] font-sans text-[#514C48]/60">
                      {post.date} • {post.readTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Section: Founders Corner Cards */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#111]">
              Founders corner
            </h2>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full border border-[#514C48]/30 flex items-center justify-center text-[#514C48] hover:border-[#111] hover:text-[#111] transition-colors">
                ←
              </button>
              <button className="w-10 h-10 rounded-full border border-[#514C48]/30 flex items-center justify-center text-[#514C48] hover:border-[#111] hover:text-[#111] transition-colors">
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foundersCorner.map((item, index) => (
              <article 
                key={index}
                className="bg-white rounded-[32px] p-6 shadow-xl shadow-[#514C48]/5 border border-[#514C48]/10 group flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:border-[#7A5C58]/30"
              >
                <div>
                  <div className="relative w-full h-[200px] rounded-2xl overflow-hidden mb-6 bg-[#2A2625]">
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="inline-flex items-center gap-2 bg-[#FAF7F3] px-3 py-1 rounded-full text-[10px] font-sans uppercase tracking-[0.2em] text-[#514C48] mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                    {item.category}
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif text-[#111] mb-3 group-hover:text-[#7A5C58] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#514C48]/80 font-light leading-relaxed mb-6">
                    {item.excerpt}
                  </p>
                </div>

                <div className="text-[11px] font-sans text-[#514C48]/60 pt-4 border-t border-[#514C48]/10">
                  {item.date} • {item.readTime}
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}