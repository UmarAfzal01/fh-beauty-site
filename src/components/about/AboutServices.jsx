"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function AboutServices({ serviceIds = [] }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      if (!serviceIds || serviceIds.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (res.ok) {
          const allServices = data.data || data.services || [];
          // Filter matching the selected service IDs
          const filtered = allServices.filter((s) =>
            serviceIds.includes(s._id || s.id)
          );
          setServices(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [serviceIds]);

  if (loading || services.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-[#8D4D5D]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header with Carousel Control Mock */}
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-serif text-[#FAF7F3] font-normal">
            Our Services
          </h2>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 transition">
              <IoIosArrowBack size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 transition">
              <IoIosArrowForward size={18} />
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const serviceId = service._id || service.id;
            const title = service.hero?.name || service.title || service.name;
            const image = service.hero?.image || service.image;
            const category = service.category || "Treatment";
            const slug = service.slug || serviceId;

            return (
              <div
                key={serviceId}
                className="relative h-[420px] rounded-3xl overflow-hidden group shadow-lg flex flex-col justify-between p-6 bg-neutral-900 border border-white/10"
              >
                {/* Background Image with Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
                </div>

                {/* Top Category Badge */}
                <div className="relative z-10">
                  <span className="text-[10px] uppercase tracking-widest font-sans text-white/80 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                    {category}
                  </span>
                </div>

                {/* Bottom Content & View Details Button */}
                <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-serif text-white font-normal leading-snug">
                    {title}
                  </h3>
                  <Link
                    href={`/services/${slug}`}
                    className="inline-block border border-white/40 hover:border-white text-white text-xs font-sans uppercase tracking-wider px-5 py-2.5 rounded-full backdrop-blur-sm transition bg-white/10"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}