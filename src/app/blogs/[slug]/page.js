import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogComments from "@/components/BlogComments";

// Optional: Base URL for absolute Open Graph image paths
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

// 1. Generate Dynamic Metadata for SEO & Social Sharing
async function getBlogData(idOrSlug) {
  try {
    const res = await fetch(`${BASE_URL}/api/blogs`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const blogsList = Array.isArray(data) ? data : data.blogs || [];
    return (
      blogsList.find(
        (b) => b._id === idOrSlug || b.slug === idOrSlug || b.id === idOrSlug,
      ) || null
    );
  } catch (err) {
    console.error("Error fetching blog for metadata:", err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const idOrSlug = resolvedParams?.id || resolvedParams?.slug;
  const blog = await getBlogData(idOrSlug);

  if (!blog) {
    return {
      title: "Article Not Found | My Blog",
      description: "The blog post you are looking for does not exist.",
    };
  }

  const seoTitle = blog.title || "Blog Post";
  const seoDescription = blog.description || seoTitle;
  const seoImage = blog.img
    ? blog.img.startsWith("http")
      ? blog.img
      : `${BASE_URL}${blog.img}`
    : `${BASE_URL}/default-og-image.jpg`;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${BASE_URL}/blogs/${idOrSlug}`,
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: blog.imgalt || seoTitle,
        },
      ],
      type: "article",
      publishedTime: blog.createdAt,
      authors: [blog.postedby || "Author"],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
    },
  };
}

// 2. Client Component UI for Rendering the Blog Content
export default async function SingleBlogPage({ params }) {
  const resolvedParams = await params;
  const idOrSlug = resolvedParams?.id || resolvedParams?.slug;
  const blog = await getBlogData(idOrSlug);

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#FAF7F3] flex flex-col items-center justify-center font-serif text-[#514C48] space-y-4 px-6 text-center">
        <h1 className="text-3xl text-[#111]">Article Not Found</h1>
        <p className="text-sm text-[#514C48]/70">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-[#111] text-[#FAF7F3] rounded-xl text-sm font-sans transition hover:bg-[#333]"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  const renderBlogDetailItem = (item, index, allDetails) => {
    switch (item.type) {
      case "Sub":
        return (
          <h2
            key={index}
            className="text-2xl sm:text-3xl font-serif font-normal text-[#111] mt-8 mb-4 leading-snug w-full"
          >
            {item.value}
          </h2>
        );
      case "description":
        if (index > 0 && allDetails[index - 1]?.type === "single-image") {
          return null;
        }
        return (
          <p
            key={index}
            className="text-base sm:text-lg font-light text-[#514C48]/90 leading-relaxed mb-6 w-full"
          >
            {item.value}
          </p>
        );
      case "bullet":
        return (
          <ul
            key={index}
            className="list-disc list-inside space-y-2 mb-6 text-[#514C48]/90 text-base sm:text-lg font-light w-full"
          >
            <li className="leading-relaxed">{item.value}</li>
          </ul>
        );
      case "single-image":
        const nextItem = allDetails[index + 1];
        const hasAdjacentDescription =
          nextItem && nextItem.type === "description";

        if (hasAdjacentDescription) {
          return (
            <div
              key={index}
              className="my-8 flex flex-col md:flex-row items-center gap-8 w-full"
            >
              <div className="w-full md:w-1/2 space-y-2 shrink-0">
                <div className="relative w-full h-[500px] sm:h-[670px] rounded-2xl overflow-hidden bg-slate-100 shadow-lg">
                  <Image
                    src={item.imageUrl}
                    alt={item.value || "Blog Image"}
                    fill
                    className="object-contain"
                  />
                </div>
                {/* {item.value && (
                  <p className="text-center text-xs font-sans text-[#514C48]/60 italic">{item.value}</p>
                )} */}
              </div>
              <div className="w-full md:w-1/2">
                <p className="text-base sm:text-lg font-light text-[#514C48]/90 leading-relaxed">
                  {nextItem.value}
                </p>
              </div>
            </div>
          );
        }

        return (
          <div key={index} className="my-8 space-y-2 w-full">
            <div className="relative w-full h-[500px] sm:h-[450px] rounded-2xl overflow-hidden bg-slate-100 shadow-lg">
              <Image
                src={item.imageUrl}
                alt={item.value || "Blog Image"}
                fill
                className="object-contain"
              />
            </div>
            {item.value && (
              <p className="text-center text-xs font-sans text-[#514C48]/60 italic">
                {item.value}
              </p>
            )}
          </div>
        );
      case "double-image":
        return (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 w-full"
          >
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
                {/* {item.value?.[imgIdx] && (
                  <p className="text-center text-xs font-sans text-[#514C48]/60 italic">
                    {item.value[imgIdx]}
                  </p>
                )} */}
              </div>
            ))}
          </div>
        );
      case "youtube":
        const getEmbedUrl = (urlStr) => {
          try {
            const videoId = urlStr.includes("v=")
              ? urlStr.split("v=")[1]?.split("&")[0]
              : urlStr.split("/").pop();
            return `https://www.youtube.com/embed/${videoId}`;
          } catch {
            return urlStr;
          }
        };
        return (
          <div
            key={index}
            className="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-black"
          >
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

  return (
    <main className="min-h-screen bg-[#FAF7F3] text-[#514C48] py-16 px-6 md:px-12 xl:px-20">
      <article className="max-w-4xl mx-auto space-y-10">
        {/* Breadcrumb / Category & Date */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-[#F3EDE2] border border-[#E6DEC9] px-3.5 py-1.5 rounded-full text-xs font-sans uppercase tracking-widest text-[#111] capitalize">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              {blog.category || "General"}
            </span>
            <span className="text-xs font-sans text-[#514C48]/60">•</span>
            <span className="text-xs font-sans text-[#514C48]/70">
              {formatDate(blog.createdAt)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#111] leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between border-y border-[#E6DEC9] py-4 text-xs font-sans text-[#514C48]/80">
            <span>
              By{" "}
              <strong className="text-[#111] font-medium">
                {blog.postedby || "Author"}
              </strong>
            </span>
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
          {Array.isArray(blog.blog_detail) &&
            blog.blog_detail.map((detail, index) =>
              renderBlogDetailItem(detail, index, blog.blog_detail),
            )}
        </div>

        {/* Tags Section */}
        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="pt-8 border-t border-[#E6DEC9] flex flex-wrap items-center gap-2">
            <span className="text-xs font-sans uppercase tracking-wider text-[#514C48]/60 mr-2">
              Tags:
            </span>
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
        {/* Comment Section Component */}
        <BlogComments
          blogId={blog._id.toString()}
          initialComments={blog.comments || []}
        />
      </article>
    </main>
  );
}
