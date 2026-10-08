"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiBox, FiArrowRight, FiCheck } from "react-icons/fi";
import { PiSparkle } from "react-icons/pi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PublicBundlesPage = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const res = await fetch("/api/items");
        if (res.ok) {
          const data = await res.json();
          const allItems = Array.isArray(data) ? data : data.items || [];
          const fetchedBundles = allItems.filter(
            (item) => item.type?.toLowerCase() === "bundle"
          );
          setBundles(fetchedBundles);
        }
      } catch (err) {
        console.error("Failed to load bundles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBundles();
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
      <Header />
      <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-16 px-6 md:px-12 xl:px-24">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Luxury Hero Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
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
            <div className="text-center py-24 bg-white border border-[#E6DEC9] rounded-3xl space-y-4 max-w-xl mx-auto shadow-2xs">
              <div className="w-16 h-16 bg-[#FAF7F3] rounded-2xl border border-[#E6DEC9] flex items-center justify-center mx-auto text-[#514C48]/40">
                <FiBox size={28} />
              </div>
              <h3 className="text-xl font-serif text-[#111]">No Bundles Available</h3>
              <p className="font-serif text-sm text-[#514C48]/60">Check back soon for our upcoming exclusive care packages.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {bundles.map((bundle) => {
                const bundleId = bundle._id || bundle.id;
                const bundleImage = bundle.image || bundle.images?.[0]?.url;
                const bundleName = bundle.name || bundle.hero?.name;
                const bundleDesc = bundle.shortDesc || bundle.description;
                const bundlePrice = bundle.price || 0;
                const includedServices = bundle.services || [];

                return (
                  <div
                    key={bundleId}
                    className="bg-white border border-[#E6DEC9] rounded-3xl p-5 flex flex-col justify-between space-y-5 shadow-2xs transition-all duration-300 hover:shadow-xl hover:border-[#514C48]/30 group"
                  >
                    <div className="space-y-4">
                      
                      {/* Visual Media Showcase */}
                      {bundleImage ? (
                        <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-[#E6DEC9]">
                          <img 
                            src={bundleImage} 
                            alt={bundleName} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md border border-[#E6DEC9] px-3 py-1 rounded-full text-xs font-sans font-medium text-[#111] shadow-xs">
                            {bundlePrice >= 1000 
                              ? `${(bundlePrice / 1000).toFixed(bundlePrice % 1000 !== 0 ? 1 : 0)}k` 
                              : bundlePrice} PKR
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-52 bg-[#FAF7F3] rounded-2xl border border-[#E6DEC9] flex items-center justify-center text-[#514C48]/40">
                          <FiBox size={36} />
                        </div>
                      )}

                      {/* Bundle Title & Short Description */}
                      <div className="space-y-1.5">
                        <h2 className="text-xl font-serif font-normal text-[#111] group-hover:text-black transition leading-snug line-clamp-1">
                          {bundleName}
                        </h2>
                        {bundleDesc && (
                          <p className="text-xs md:text-sm font-serif text-[#514C48]/75 line-clamp-2 leading-relaxed">
                            {bundleDesc}
                          </p>
                        )}
                      </div>

                      {/* Included Services Breakdown */}
                      {includedServices.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-[#E6DEC9]/60">
                          <span className="text-[10px] font-sans uppercase tracking-[0.15em] text-[#514C48]/50 block font-medium">
                            Package Breakdown ({includedServices.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {includedServices.map((srv, i) => {
                              const serviceName = typeof srv === "string" ? srv : (srv.name || srv.hero?.name || "Service");
                              return (
                                <span 
                                  key={i} 
                                  className="inline-flex items-center gap-1.5 bg-[#FAF7F3] border border-[#E6DEC9] text-[#514C48] text-xs font-serif px-2.5 py-1 rounded-xl"
                                >
                                  <FiCheck size={11} className="text-emerald-700 shrink-0" />
                                  {serviceName}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Action Link Footer */}
                    <div className="pt-3 border-t border-[#E6DEC9]/60">
                      <Link
                        href={`/bundle/${bundle.slug}`}
                        className="w-full bg-[#111] hover:bg-[#333] text-[#FAF7F3] py-3 rounded-2xl text-xs font-sans uppercase tracking-widest flex items-center justify-center gap-2 transition shadow-sm"
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
      <Footer />
    </>
  );
};

export default PublicBundlesPage;