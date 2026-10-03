"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiBox, FiArrowRight, FiCheck } from "react-icons/fi";
import { PiSparkle } from "react-icons/pi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PublicBundlesPage = () => {
  const [bundles, setBundles] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [bundlesRes, servicesRes] = await Promise.all([
          fetch("/api/bundles"),
          fetch("/api/services")
        ]);

        const bundlesData = await bundlesRes.json();
        const servicesData = await servicesRes.json();

        if (bundlesRes.ok && bundlesData.success) {
          setBundles(bundlesData.bundles || []);
        }

        const map = {};
        const serviceList = servicesData.data || servicesData.services || [];
        serviceList.forEach((s) => {
          map[s._id] = s;
        });
        setServicesMap(map);
      } catch (err) {
        console.error("Failed to load bundles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48] tracking-widest text-sm uppercase">
        Curating Luxury Packages...
      </div>
    );
  }

  return (
    <>
    <Header/>
    <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-20 px-6 md:px-12 xl:px-24">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Luxury Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#F3EDE2] border border-[#E6DEC9] px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] text-[#514C48]">
            <PiSparkle size={14} /> Exclusive Collections
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-normal text-[#111] leading-tight">
            Curated Treatment Bundles
          </h1>
          <p className="text-sm md:text-base font-serif text-[#514C48]/75 leading-relaxed">
            Experience synergy in skincare and wellness. We have thoughtfully combined our signature treatments into cohesive regimens designed to maximize results and elevate your personal care journey.
          </p>
        </div>

        {/* Bundles Grid */}
        {bundles.length === 0 ? (
          <div className="text-center py-28 bg-white border border-[#E6DEC9] rounded-3xl space-y-4 max-w-xl mx-auto shadow-2xs">
            <div className="w-16 h-16 bg-[#FAF7F3] rounded-2xl border border-[#E6DEC9] flex items-center justify-center mx-auto text-[#514C48]/40">
              <FiBox size={28} />
            </div>
            <h3 className="text-xl font-serif text-[#111]">No Bundles Available</h3>
            <p className="font-serif text-sm text-[#514C48]/60">Check back soon for our upcoming exclusive care packages.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {bundles.map((bundle) => {
              const bundleId = bundle._id || bundle.id;
              const resolvedServices = (bundle.services || []).map((servId) => {
                return servicesMap[servId] || { _id: servId, hero: { name: "Service", image: "" } };
              });

              return (
                <div
                  key={bundleId}
                  className="bg-white border border-[#E6DEC9] rounded-3xl p-7 flex flex-col justify-between space-y-8 shadow-2xs transition-all duration-300 hover:shadow-xl hover:border-[#514C48]/30 group"
                >
                  <div className="space-y-6">
                    
                    {/* Visual Media Showcase */}
                 {bundle.image ? (
  <div className="relative w-full h-60 rounded-2xl overflow-hidden border border-[#E6DEC9]">
    <img 
      src={bundle.image} 
      alt={bundle.name} 
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
    />
    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md border border-[#E6DEC9] px-3.5 py-1 rounded-full text-xs font-sans font-medium text-[#111] shadow-xs">
      {bundle.price >= 1000 
        ? `${(bundle.price / 1000).toFixed(bundle.price % 1000 !== 0 ? 1 : 0)}k` 
        : bundle.price} PKR
    </div>
  </div>
) : resolvedServices.length > 0 ? (
  <div className="space-y-3">
    <div 
      className="w-full h-60 rounded-2xl border border-[#E6DEC9] overflow-hidden grid bg-[#FAF7F3] shadow-inner" 
      style={{
        gridTemplateColumns: resolvedServices.length === 3 ? "1fr 1fr" : resolvedServices.length === 2 ? "1fr 1fr" : "repeat(2, 1fr)",
        gridTemplateRows: resolvedServices.length === 3 ? "1fr 1fr" : resolvedServices.length <= 2 ? "1fr" : "repeat(2, 1fr)"
      }}
    >
      {resolvedServices.slice(0, 4).map((srv, idx) => {
        const imgUrl = srv.hero?.image || srv.image;
        const serviceName = srv.hero?.name || srv.title || "Service";

        // If there are 3 services, make the first card span across both columns (full width)
        const isFirstOfThree = resolvedServices.length === 3 && idx === 0;

        return (
          <div 
            key={idx} 
            className="relative w-full h-full overflow-hidden border-[0.5px] border-[#E6DEC9]"
            style={isFirstOfThree ? { gridColumn: "1 / -1" } : {}}
          >
            {imgUrl ? (
              <img 
                src={imgUrl} 
                alt={serviceName} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full bg-[#F3EDE2] flex items-center justify-center text-[#514C48]/40">
                <FiBox size={22} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-3.5">
              <span className="text-xs font-serif text-white truncate font-medium drop-shadow-sm">
                {serviceName}
              </span>
            </div>
          </div>
        );
      })}
    </div>
    <div className="flex justify-between items-center px-1">
      <span className="text-[11px] font-sans uppercase tracking-widest text-[#514C48]/60 font-semibold">
        {resolvedServices.length} Treatments Included
      </span>
      <span className="text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-sans font-medium">
        {bundle.price >= 1000 
          ? `${(bundle.price / 1000).toFixed(bundle.price % 1000 !== 0 ? 1 : 0)}k` 
          : bundle.price} PKR
      </span>
    </div>
  </div>
) : (
  <div className="w-full h-60 bg-[#FAF7F3] rounded-2xl border border-[#E6DEC9] flex items-center justify-center text-[#514C48]/40">
    <FiBox size={36} />
  </div>
)}

                    {/* Bundle Title & Short Description */}
                    <div className="space-y-2.5">
                      <h2 className="text-2xl font-serif font-normal text-[#111] group-hover:text-black transition">
                        {bundle.name}
                      </h2>
                      <p className="text-xs md:text-sm font-serif text-[#514C48]/75 line-clamp-2 leading-relaxed">
                        {bundle.shortDesc}
                      </p>
                    </div>

                    {/* Included Service Name Pills */}
                    <div className="space-y-2 pt-2 border-t border-[#E6DEC9]">
                      <span className="text-[10px] font-sans uppercase tracking-[0.15em] text-[#514C48]/50 block font-medium">
                        Package Breakdown
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {resolvedServices.map((srv, i) => {
                          const name = srv.hero?.name || srv.title || "Service";
                          return (
                            <span 
                              key={i} 
                              className="inline-flex items-center gap-1.5 bg-[#FAF7F3] border border-[#E6DEC9] text-[#514C48] text-xs font-serif px-3 py-1 rounded-xl"
                            >
                              <FiCheck size={11} className="text-emerald-700 shrink-0" />
                              {name}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Action Link Footer */}
                  <div className="pt-4 border-t border-[#E6DEC9]">
                    <Link
                      href={`/bundles/${bundle.slug}`}
                      className="w-full bg-[#111] hover:bg-[#333] text-[#FAF7F3] py-3.5 rounded-2xl text-xs font-sans uppercase tracking-widest flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      Explore Package <FiArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
    <Footer/>
    </>
  );
};

export default PublicBundlesPage;