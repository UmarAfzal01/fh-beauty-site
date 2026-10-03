"use client";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { FiArrowLeft, FiBox } from "react-icons/fi";
import { PiSparkle } from "react-icons/pi";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const SingleBundlePage = ({ params }) => {
  // Unwrap params using React.use() for Next.js app router compatibility
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [bundle, setBundle] = useState(null);
  const [resolvedServices, setResolvedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBundleDetails = async () => {
      try {
        const [bundlesRes, servicesRes] = await Promise.all([
          fetch("/api/bundles"),
          fetch("/api/services")
        ]);

        const bundlesData = await bundlesRes.json();
        const servicesData = await servicesRes.json();

        if (!bundlesRes.ok || !bundlesData.success) {
          setError(true);
          return;
        }

        const foundBundle = (bundlesData.bundles || []).find(
          (b) => b.slug === slug
        );

        if (!foundBundle) {
          setError(true);
          return;
        }

        setBundle(foundBundle);

        const serviceList = servicesData.data || servicesData.services || [];
        const serviceMap = {};
        serviceList.forEach((s) => {
          serviceMap[s._id] = s;
        });

        const detailedServices = (foundBundle.services || []).map((servId) => {
          return serviceMap[servId] || { _id: servId, hero: { name: "Included Service", description: "", image: "" } };
        });

        setResolvedServices(detailedServices);
      } catch (err) {
        console.error("Failed to load bundle details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBundleDetails();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] w-full bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48] tracking-widest text-sm uppercase">
        Loading bundle information...
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <>
        <Header />
        <div className="min-h-[50vh] w-full bg-[#FAF7F3] flex flex-col items-center justify-center space-y-3 text-center px-6">
          <h1 className="text-2xl font-serif text-[#111]">Bundle Not Found</h1>
          <p className="text-xs font-serif text-[#514C48]/75">The treatment package you are looking for does not exist or has been removed.</p>
          <Link
            href="/bundles"
            className="bg-[#111] text-[#FAF7F3] px-5 py-2.5 rounded-xl text-xs font-sans uppercase tracking-wider transition hover:bg-[#333]"
          >
            Back to All Bundles
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="w-full bg-[#FAF7F3] text-[#514C48] py-4 px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-4">
          
          {/* Back Link */}
          <Link
            href="/bundles"
            className="inline-flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-widest text-[#514C48]/70 hover:text-[#111] transition"
          >
            <FiArrowLeft size={14} /> Back to Bundles
          </Link>

          {/* Main Card Wrapper: Flex-row layout with matched, controlled height */}
          <div className="bg-white border border-[#E6DEC9] rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* LEFT COLUMN: Service Images Grid with Fixed Controlled Height */}
            <div className="lg:col-span-7 bg-[#FAF7F3] border-b lg:border-b-0 lg:border-r border-[#E6DEC9] flex flex-col h-[420px] lg:h-auto">
              {bundle.image ? (
                <div className="relative w-full h-full">
                  <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover" />
                </div>
              ) : resolvedServices.length > 0 ? (
                <div 
                  className="w-full h-full overflow-hidden grid bg-[#FAF7F3]" 
                  style={{
                    gridTemplateColumns: resolvedServices.length === 3 ? "1fr 1fr" : resolvedServices.length === 2 ? "1fr 1fr" : "repeat(2, 1fr)",
                    gridTemplateRows: resolvedServices.length === 3 ? "1.2fr 1fr" : resolvedServices.length <= 2 ? "1fr" : "repeat(2, 1fr)"
                  }}
                >
                  {resolvedServices.slice(0, 4).map((srv, idx) => {
                    const imgUrl = srv.hero?.image || srv.image;
                    const serviceName = srv.hero?.name || srv.title || "Service";
                    const isFirstOfThree = resolvedServices.length === 3 && idx === 0;

                    return (
                      <div 
                        key={idx} 
                        className="relative w-full h-full overflow-hidden border-[0.5px] border-[#E6DEC9] group"
                        style={isFirstOfThree ? { gridColumn: "1 / -1" } : {}}
                      >
                        {imgUrl ? (
                          <img 
                            src={imgUrl} 
                            alt={serviceName} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="w-full h-full bg-[#F3EDE2] flex items-center justify-center text-[#514C48]/40">
                            <FiBox size={24} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-3.5">
                          <span className="text-xs md:text-sm font-serif text-white tracking-wide drop-shadow-sm">
                            {serviceName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full h-full bg-[#FAF7F3] flex items-center justify-center text-[#514C48]/40">
                  <FiBox size={32} />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Bundle Name, Desc, Price, and Button */}
            <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-6 bg-white">
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-[#FAF7F3] border border-[#E6DEC9] px-3 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-[0.15em] text-[#514C48]">
                  <PiSparkle size={12} /> Exclusive Package
                </div>
                
                <h1 className="text-2xl md:text-3xl font-serif font-normal text-[#111] leading-snug">
                  {bundle.name}
                </h1>
                
                <p className="text-xs md:text-sm font-serif text-[#514C48]/80 leading-relaxed">
                  {bundle.shortDesc}
                </p>

                <div className="pt-3 border-t border-[#E6DEC9]">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#514C48]/60 block mb-0.5">Package Price</span>
                  <div className="text-2xl font-serif font-semibold text-emerald-700">
                    {bundle.price >= 1000 
                      ? `${(bundle.price / 1000).toFixed(bundle.price % 1000 !== 0 ? 1 : 0)}k` 
                      : bundle.price} PKR
                  </div>
                </div>
              </div>

              {/* Action Link to Appointment Page */}
              <div className="pt-4 border-t border-[#E6DEC9]">
                <Link
                  href={`/appointment?bundle=${bundle.name}`}
                  className="w-full block bg-[#111] hover:bg-[#333] text-[#FAF7F3] py-3.5 rounded-xl text-xs font-sans uppercase tracking-[0.15em] transition shadow-xs text-center cursor-pointer"
                >
                  Get This Bundle
                </Link>
              </div>

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default SingleBundlePage;