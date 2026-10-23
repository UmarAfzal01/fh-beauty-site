'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function EmbeddedServiceCard({ linkUrl, fallbackText }) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Safely extract slug from links like "services/hydrofacial" or "/service/hydrofacial"
  const cleanUrl = (linkUrl || '').trim();
  const match = cleanUrl.match(/(?:services?\/)([^\/\?\#]+)/i);
  const slug = match ? match[1] : null;

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchServiceBySlug() {
      try {
        const res = await fetch(`/api/items?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          const itemsArray = Array.isArray(data) ? data : data.items || data.services || [];
          
          const matchedItem = itemsArray.find(
            (item) => (item.slug || '').toLowerCase() === slug.toLowerCase()
          ) || itemsArray[0];

          if (isMounted && matchedItem) {
            setService(matchedItem);
          }
        }
      } catch (err) {
        console.error('Failed to fetch embedded service data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchServiceBySlug();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading && slug) {
    return (
      <div className="my-6 w-full max-w-xl h-44 rounded-2xl bg-[#FAF7F3] border border-[#E0DED8] animate-pulse flex items-center justify-center text-xs font-serif text-[#514C48]/60">
        Loading treatment card...
      </div>
    );
  }

  if (service) {
    const imageUrl = service.images?.[0]?.url || '/images/home-1-1.webp';
    const title = service.name || 'Clinical Treatment';
    const description = service.description || 'Professional medical care tailored to your skin and aesthetic goals.';
    const price = service.price ? `PKR ${service.price.toLocaleString()}` : null;
    const targetHref = `/services/${service.slug || slug}`;

    return (
      <div className="my-8 w-full max-w-xl bg-white border border-[#E0DED8] rounded-[24px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex flex-col sm:flex-row items-stretch">
          <div className="relative w-full sm:w-2/5 min-h-[180px] sm:min-h-[200px] bg-[#2A2625] overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, 40vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 bg-[#111]/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-sans tracking-widest uppercase text-white font-medium">
              TREATMENT
            </div>
          </div>

          <div className="w-full sm:w-3/5 p-5 sm:p-6 flex flex-col justify-between bg-[#FAF7F3]">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="text-lg font-serif font-medium text-[#111] group-hover:text-[#8D4D5D] transition-colors leading-snug">
                  {title}
                </h4>
                {price && (
                  <span className="text-xs font-sans font-semibold text-[#8D4D5D] whitespace-nowrap bg-[#F8EFEA] px-2.5 py-1 rounded-lg border border-[#8D4D5D]/20">
                    {price}
                  </span>
                )}
              </div>

              <p className="text-xs font-sans text-[#514C48]/80 leading-relaxed line-clamp-2 mb-4">
                {description}
              </p>
            </div>

            <Link
              href={targetHref}
              className="inline-flex items-center justify-between w-full bg-[#111] hover:bg-[#333] text-white text-[11px] font-sans font-medium uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <span>Explore Treatment</span>
              <span className="text-sm">↗</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 w-full flex">
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-6 py-3.5 rounded-xl transition inline-flex items-center gap-2 font-sans text-sm shadow-md"
      >
        <span>{fallbackText || linkUrl}</span>
        <span className="text-xs opacity-75 ml-1">↗</span>
      </a>
    </div>
  );
}