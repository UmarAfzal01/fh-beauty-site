'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SingleBlogPage() {
  const params = useParams();
  const idOrSlug = params?.id || params?.slug;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idOrSlug) return;

    const fetchSingleBlog = async () => {
      try {
        const res = await fetch(`/api/blogs`);
        const data = await res.json();
        
        if (res.ok) {
          const blogsList = Array.isArray(data) ? data : (data.blogs || []);
          const foundBlog = blogsList.find(
            (b) => b._id === idOrSlug || b.slug === idOrSlug || b.id === idOrSlug
          );

          if (foundBlog) {
            setBlog(foundBlog);
          } else {
            setError("Blog post not found.");
          }
        } else {
          setError("Failed to fetch blog data.");
        }
      } catch (err) {
        console.error("Error fetching single blog:", err);
        setError("An error occurred while loading the blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleBlog();
  }, [idOrSlug]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  const renderBlogDetailItem = (item, index, allDetails) => {
    switch (item.type) {
      case 'Sub':
        return (
          <h2 key={index} className="text-2xl sm:text-3xl font-serif font-normal text-[#111] mt-8 mb-4 leading-snug w-full">
            {item.value}
          </h2>
        );
      case 'description':
        // If the previous item was a single-image and already consumed this description, skip rendering it here individually
        if (index > 0 && allDetails[index - 1]?.type === 'single-image') {
          return null;
        }
        return (
          <p key={index} className="text-base sm:text-lg font-light text-[#514C48]/90 leading-relaxed mb-6 w-full">
            {item.value}
          </p>
        );
      case 'bullet':
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-[#514C48]/90 text-base sm:text-lg font-light w-full">
            <li className="leading-relaxed">{item.value}</li>
          </ul>
        );
      case 'single-image':
        // Look ahead to check if the next item is a description
        const nextItem = allDetails[index + 1];
        const hasAdjacentDescription = nextItem && nextItem.type === 'description';

        if (hasAdjacentDescription) {
          return (
            <div key={index} className="my-8 flex flex-col md:flex-row items-center gap-8 w-full">
              <div className="w-full md:w-1/2 space-y-2 shrink-0">
                <div className="relative w-full h-[500px] sm:h-[630px] rounded-2xl overflow-hidden bg-slate-100 shadow-lg">
                  <Image
                    src={item.imageUrl}
                    alt={item.value || 'Blog Image'}
                    fill
                    className="object-cover"
                  />
                </div>
                {item.value && (
                  <p className="text-center text-xs font-sans text-[#514C48]/60 italic">{item.value}</p>
                )}
              </div>
              <div className="w-full md:w-1/2">
                <p className="text-base sm:text-lg font-light text-[#514C48]/90 leading-relaxed">
                  {nextItem.value}
                </p>
              </div>
            </div>
          );
        }

        // Default layout if no description follows right after
        return (
          <div key={index} className="my-8 space-y-2 w-full">
            <div className="relative w-full h-[500px] sm:h-[450px] rounded-2xl overflow-hidden bg-slate-100 shadow-lg">
              <Image
                src={item.imageUrl}
                alt={item.value || 'Blog Image'}
                fill
                className="object-contain"
              />
            </div>
            {item.value && (
              <p className="text-center text-xs font-sans text-[#514C48]/60 italic">{item.value}</p>
            )}
          </div>
        );
      case 'double-image':
        return (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 w-full">
            {item.imageUrls?.map((url, imgIdx) => (
              <div key={imgIdx} className="space-y-2">
                <div className="relative w-full h-[250px] sm:h-[300px] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                  <Image
                    src={url}
                    alt={item.value?.[imgIdx] || `Gallery Image ${imgIdx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                {item.value?.[imgIdx] && (
                  <p className="text-center text-xs font-sans text-[#514C48]/60 italic">
                    {item.value[imgIdx]}
                  </p>
                )}
              </div>
            ))}
          </div>
        );
      case 'youtube':
        const getEmbedUrl = (urlStr) => {
          try {
            const videoId = urlStr.includes('v=') ? urlStr.split('v=')[1]?.split('&')[0] : urlStr.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
          } catch {
            return urlStr;
          }
        };
        return (
          <div key={index} className="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-black">
            <iframe
              src={getEmbedUrl(item.value)}
              title="YouTube video player"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48]">
        Loading article...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#FAF7F3] flex flex-col items-center justify-center font-serif text-[#514C48] space-y-4 px-6 text-center">
        <h1 className="text-3xl text-[#111]">Article Not Found</h1>
        <p className="text-sm text-[#514C48]/70">{error || "The blog post you're looking for doesn't exist or has been removed."}</p>
        <Link href="/" className="px-6 py-2.5 bg-[#111] text-[#FAF7F3] rounded-xl text-sm font-sans transition hover:bg-[#333]">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F3] text-[#514C48] py-16 px-6 md:px-12 xl:px-20">
      <article className="max-w-4xl mx-auto space-y-10">
        
        {/* Breadcrumb / Category & Date */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-[#F3EDE2] border border-[#E6DEC9] px-3.5 py-1.5 rounded-full text-xs font-sans uppercase tracking-widest text-[#111] capitalize">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              {blog.category || 'General'}
            </span>
            <span className="text-xs font-sans text-[#514C48]/60">•</span>
            <span className="text-xs font-sans text-[#514C48]/70">{formatDate(blog.createdAt)}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#111] leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between border-y border-[#E6DEC9] py-4 text-xs font-sans text-[#514C48]/80">
            <span>By <strong className="text-[#111] font-medium">{blog.postedby || 'Author'}</strong></span>
            {blog.views !== undefined && <span>{blog.views} Views</span>}
          </div>
        </div>

        {/* Featured Image */}
        {blog.img && (
          <div className="relative w-full h-[350px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl bg-slate-200">
            <Image
              src={blog.img}
              alt={blog.imgalt || blog.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Short Description / Excerpt */}
        {blog.description && (
          <p className="text-lg sm:text-xl font-serif italic text-[#111]/80 leading-relaxed bg-[#F3EDE2]/40 border-l-4 border-[#111] p-6 rounded-r-2xl">
            {blog.description}
          </p>
        )}

        {/* Dynamic Blog Details Content */}
        <div className="space-y-6">
          {Array.isArray(blog.blog_detail) && blog.blog_detail.map((detail, index) => renderBlogDetailItem(detail, index, blog.blog_detail))}
        </div>

        {/* Tags Section */}
        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="pt-8 border-t border-[#E6DEC9] flex flex-wrap items-center gap-2">
            <span className="text-xs font-sans uppercase tracking-wider text-[#514C48]/60 mr-2">Tags:</span>
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#F3EDE2] border border-[#E6DEC9] px-3 py-1 rounded-lg font-serif text-[#111]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

      </article>
    </main>
  );
}