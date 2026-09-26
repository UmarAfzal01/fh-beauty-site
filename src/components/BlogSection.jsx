"use client"
import React, { useState, useEffect } from "react";
import Image from 'next/image';

export default function BlogSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const DUMMY_IMAGE = "https://www.dummyimage.com/600x400/f3f3f3/000";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (res.ok) {
          // Adjust based on your API response structure (e.g. data.data, data.blogs, or data directly)
          setPosts(data.data || data.blogs || data || []);
        }
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="w-full bg-[#FAF7F3] text-[#514C48] py-24 px-6 md:px-12 xl:px-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-normal text-[#111] text-center mb-16">
          From the Blog
        </h2>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16">
          {loading ? (
            [1, 2, 3].map((n) => (
              <div 
                key={n} 
                className="bg-[#F5EFEA] rounded-[30px] p-6 h-[420px] animate-pulse flex flex-col justify-between"
              >
                <div className="w-full h-[240px] rounded-[20px] bg-[#EBE4DE]"></div>
                <div className="space-y-3 mt-6">
                  <div className="h-3 bg-[#EBE4DE] rounded w-1/4"></div>
                  <div className="h-6 bg-[#EBE4DE] rounded w-3/4"></div>
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-[#F5EFEA] rounded-[30px]">
              <p className="font-serif text-lg text-[#514C48]/60">No blog posts available at the moment.</p>
            </div>
          ) : (
            posts.slice(0, 3).map((post, index) => {
              const postId = post._id || post.id;
              const postImage = post.image || post.img || DUMMY_IMAGE;
              const postCategory = post.category || post.tag || 'AESTHETICS';
              const postTitle = post.title || 'Untitled Post';
              const postLink = post.link || `/blogs/${post.slug}`;

              return (
                <div 
                  key={postId || index}
                  className="bg-[#F5EFEA] rounded-[30px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Top Image */}
                  <div className="relative w-full h-[220px] sm:h-[240px] rounded-[20px] overflow-hidden mb-6 bg-[#EBE4DE]">
                    <Image 
                      src={postImage} 
                      alt={postTitle} 
                      fill 
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Content Area */}
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#8D4D5D] block mb-2">
                        {postCategory}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#111] leading-snug mb-8">
                        {postTitle}
                      </h3>
                    </div>

                    {/* Read More Link */}
                    <div className="pt-4 border-t border-[#E5DDD5]">
                      <a 
                        href={postLink} 
                        className="text-xs font-sans uppercase tracking-[0.2em] text-[#111] font-medium hover:text-[#8D4D5D] transition-colors inline-flex items-center gap-1.5"
                      >
                        READ MORE <span>↗</span>
                      </a>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* View More Posts Button */}
        <a 
          href="/blogs"
          className="bg-[#8D4D5D] hover:bg-[#654945] text-white text-xs font-sans tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-lg text-center inline-block"
        >
          VIEW MORE POSTS
        </a>

      </div>
    </section>
  );
}