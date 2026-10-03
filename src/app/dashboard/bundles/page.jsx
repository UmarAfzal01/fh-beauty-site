"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlusCircle, FiTrash2, FiBox, FiEdit3 } from "react-icons/fi";
import { MdMedicalServices } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";

const ManageBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // 1. Fetch bundles and services in parallel
      const [bundlesRes, servicesRes] = await Promise.all([
        fetch("/api/bundles"),
        fetch("/api/services")
      ]);

      const bundlesData = await bundlesRes.json();
      const servicesData = await servicesRes.json();

      let fetchedBundles = [];
      if (bundlesRes.ok && bundlesData.success) {
        fetchedBundles = bundlesData.bundles || [];
      }

      // 2. Build a lookup dictionary map for services (ID -> Service Object)
      const map = {};
      const serviceList = servicesData.data || servicesData.services || [];
      serviceList.forEach((s) => {
        map[s._id] = s;
      });
      setServicesMap(map);
      setBundles(fetchedBundles);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      toast.error("Failed to load bundles or services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (bundleId) => {
    if (!confirm("Are you sure you want to delete this bundle?")) return;

    try {
      const res = await fetch(`/api/bundles/${bundleId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBundles(bundles.filter((b) => (b._id || b.id) !== bundleId));
        toast.success("Bundle deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete bundle");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while deleting");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48]">
        Loading bundles...
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-12 px-6 md:px-12 xl:px-20">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E6DEC9] pb-6">
            <div>
              <h1 className="text-3xl font-serif font-normal text-[#111]">Manage Bundles</h1>
              <p className="text-sm font-serif text-[#514C48]/70 mt-1">View, manage, and delete your treatment packages.</p>
            </div>
            <Link
              href="/dashboard/bundles/add"
              className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] px-5 py-2.5 rounded-xl text-sm font-sans flex items-center gap-2 transition"
            >
              <FiPlusCircle size={16} /> Create New Bundle
            </Link>
          </div>

          {/* Bundles Grid */}
          {bundles.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#E6DEC9] rounded-3xl space-y-3">
              <FiBox size={40} className="mx-auto text-[#514C48]/40" />
              <p className="font-serif text-[#514C48]/60">No bundles created yet.</p>
              <Link
                href="/dashboard/bundles/add"
                className="inline-block text-xs font-sans uppercase tracking-wider text-[#111] font-semibold underline pt-2"
              >
                Create your first bundle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map((bundle) => {
                const bundleId = bundle._id || bundle.id;
                
                // Map raw service IDs back to actual service objects using the servicesMap
                const resolvedServices = (bundle.services || []).map((servId) => {
                  return servicesMap[servId] || { _id: servId, hero: { name: "Unknown Service", image: "" } };
                });

                return (
                  <div
                    key={bundleId}
                    className="bg-white border border-[#E6DEC9] rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-2xs transition hover:shadow-md"
                  >
                    <div className="space-y-4">
                      
                      {/* Bundle Image / Dynamic Service Split Box */}
                      {bundle.image ? (
                        <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-[#E6DEC9]">
                          <img
                            src={bundle.image}
                            alt={bundle.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : resolvedServices.length > 0 ? (
                        <div 
                          className="w-full h-40 rounded-2xl border border-[#E6DEC9] overflow-hidden grid bg-[#FAF7F3]" 
                          style={{
                            gridTemplateColumns: resolvedServices.length === 1 ? "1fr" : resolvedServices.length === 2 ? "1fr 1fr" : "repeat(2, 1fr)",
                            gridTemplateRows: resolvedServices.length <= 2 ? "1fr" : "repeat(2, 1fr)"
                          }}
                        >
                          {resolvedServices.slice(0, 4).map((srv, idx) => {
                            const imgUrl = srv.hero?.image || srv.image;
                            const serviceName = srv.hero?.name || srv.title || "Service";

                            return (
                              <div key={idx} className="relative w-full h-full overflow-hidden border-[0.5px] border-[#E6DEC9]">
                                {imgUrl ? (
                                  <img
                                    src={imgUrl}
                                    alt={serviceName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-[#F3EDE2] flex items-center justify-center text-[#514C48]/40">
                                    <FiBox size={20} />
                                  </div>
                                )}
                                {/* Dark Gradient Overlay for Name Readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2.5">
                                  <span className="text-[11px] font-serif text-white truncate font-medium drop-shadow-sm">
                                    {serviceName}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-[#FAF7F3] rounded-2xl border border-[#E6DEC9] flex items-center justify-center text-[#514C48]/40">
                          <FiBox size={32} />
                        </div>
                      )}

                      {/* Bundle Header & Description */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xl font-serif font-normal text-[#111]">{bundle.name}</h3>
                          <span className="text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-sans font-medium shrink-0">
                            {bundle.price >= 1000 
                              ? `${(bundle.price / 1000).toFixed(bundle.price % 1000 !== 0 ? 1 : 0)}k` 
                              : bundle.price} PKR
                          </span>
                        </div>
                        <p className="text-xs font-serif text-[#514C48]/70 line-clamp-2 pt-1">
                          {bundle.shortDesc}
                        </p>
                      </div>

                    </div>

                    {/* Actions Footer */}
                    <div className="pt-4 border-t border-[#E6DEC9] flex items-center justify-between">
                      <Link
                        href={`/dashboard/bundles/edit/${bundleId}`}
                        className="bg-[#FAF7F3] hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] text-[#514C48] px-4 py-2 rounded-xl text-xs font-sans uppercase tracking-wider flex items-center gap-1.5 transition"
                      >
                        <FiEdit3 size={14} /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(bundleId)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-600 px-4 py-2 rounded-xl text-xs font-sans uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
      <Toaster position="bottom-right" />
    </>
  );
};

export default ManageBundles;