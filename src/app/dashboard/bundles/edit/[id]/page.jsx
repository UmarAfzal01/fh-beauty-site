"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { IoIosArrowRoundForward } from "react-icons/io";
import { PiImage, PiCheckCircleFill, PiBox } from "react-icons/pi";
import { MdMedicalServices } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { CldUploadButton } from "next-cloudinary";

const EditBundle = () => {
  const router = useRouter();
  const params = useParams();
  const bundleId = params?.id;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const DUMMY_IMAGE = "https://www.dummyimage.com/1240x800/f3f3f3/000";

  // Fetch bundle details & available services on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch available services list
        const servicesRes = await fetch("/api/services");
        const servicesData = await servicesRes.json();
        if (servicesRes.ok) {
          const formattedServices = (servicesData.data || servicesData.services || []).map((s) => ({
            _id: s._id,
            title: s.hero?.name || s.title || s.name,
            image: s.hero?.image || s.image,
            category: s.category || "Service",
          }));
          setAvailableServices(formattedServices);
        }

        // 2. Fetch specific bundle details
        if (bundleId) {
          const bundleRes = await fetch(`/api/bundles`);
          const bundleData = await bundleRes.json();
          if (bundleRes.ok && bundleData.success) {
            const currentBundle = bundleData.bundles.find((b) => (b._id || b.id) === bundleId);
            if (currentBundle) {
              setName(currentBundle.name || "");
              setSlug(currentBundle.slug || "");
              setShortDesc(currentBundle.shortDesc || "");
              setPrice(currentBundle.price || "");
              setImage(currentBundle.image || "");
              
              // Extract service IDs safely whether they are populated objects or strings
              const serviceIds = (currentBundle.services || []).map((srv) => 
                typeof srv === "object" ? srv._id || srv.id : srv
              );
              setSelectedServices(serviceIds);
            } else {
              toast.error("Bundle not found");
              router.push("/dashboard/bundles");
            }
          }
        }
      } catch (err) {
        console.error("Failed to load edit data:", err);
        toast.error("Failed to load bundle details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bundleId, router]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleServiceToggle = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const submitData = async (e) => {
    e.preventDefault();
    if (!name || !slug || !shortDesc || !price || selectedServices.length === 0) {
      toast.error("Please fill in all mandatory fields and select at least one service.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/bundles/${bundleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, shortDesc, services: selectedServices, price, image }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Bundle updated successfully!");
        router.push("/dashboard/bundles");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48]">
        Loading bundle details...
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-14 px-6 md:px-12 xl:px-20">
        <form onSubmit={submitData} className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#F3EDE2]/60 p-8 rounded-3xl border border-[#E6DEC9] shadow-2xs">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.2em] font-sans text-[#514C48]/60 font-medium">Package Management</span>
              <h1 className="text-3xl lg:text-4xl font-serif font-normal text-[#111]">Edit Bundle</h1>
              <p className="text-sm font-serif text-[#514C48]/70">Update bundle configurations, pricing, and services.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard/bundles")}
                className="bg-white hover:bg-[#E6DEC9]/30 text-[#514C48] border border-[#E6DEC9] px-6 py-3.5 rounded-2xl text-xs font-sans tracking-wider uppercase transition shadow-2xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] px-8 py-3.5 rounded-2xl text-xs font-sans tracking-wider uppercase flex items-center gap-2 transition shadow-md disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Updating..." : "Update Bundle"} <IoIosArrowRoundForward size={18} />
              </button>
            </div>
          </div>

          {/* Form Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Core Info & Media */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* Basic Information Card */}
              <div className="bg-[#F3EDE2]/40 p-8 rounded-3xl border border-[#E6DEC9] space-y-6 shadow-2xs">
                <h2 className="text-xl font-serif text-[#111] border-b border-[#E6DEC9] pb-4">1. General Information</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-sans uppercase tracking-wider text-[#514C48]/70 block mb-2 font-medium">Bundle Name *</label>
                    <input
                      value={name}
                      onChange={handleNameChange}
                      type="text"
                      placeholder="e.g. Complete Anti-Aging Glow Package"
                      required
                      className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-sans uppercase tracking-wider text-[#514C48]/70 block mb-2 font-medium">URL Slug *</label>
                    <input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      type="text"
                      placeholder="complete-anti-aging-glow-package"
                      required
                      className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-sans uppercase tracking-wider text-[#514C48]/70 block mb-2 font-medium">Short Description *</label>
                    <textarea
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      placeholder="Briefly describe what this bundle includes..."
                      rows={4}
                      required
                      className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition resize-none font-serif"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-sans uppercase tracking-wider text-[#514C48]/70 block mb-2 font-medium">Price (PKR) *</label>
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      type="number"
                      placeholder="100000"
                      required
                      className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
                    />
                  </div>
                </div>
              </div>

              {/* Bundle Image Card */}
              <div className="bg-[#F3EDE2]/40 p-8 rounded-3xl border border-[#E6DEC9] space-y-5 shadow-2xs">
                <h2 className="text-xl font-serif text-[#111] border-b border-[#E6DEC9] pb-4">2. Package Feature Image</h2>
                <div className="w-full h-48 rounded-2xl bg-cover bg-center border border-[#E6DEC9] shadow-inner" style={{ backgroundImage: `url(${image || DUMMY_IMAGE})` }} />
                <div className="flex gap-3">
                  <CldUploadButton
                    onSuccess={(e) => setImage(e.info.secure_url)}
                    uploadPreset="Blogs_Images"
                    className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-4 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition w-full cursor-pointer font-sans"
                  >
                    <PiImage size={16} /> Upload Custom Image
                  </CldUploadButton>
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-600 px-4 py-3 rounded-2xl text-xs font-sans transition cursor-pointer shrink-0"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Services Selection Interface */}
            <div className="lg:col-span-6 space-y-8">
              <div className="bg-[#F3EDE2]/40 p-8 rounded-3xl border border-[#E6DEC9] space-y-6 shadow-2xs h-full flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-[#E6DEC9] pb-4">
                    <div>
                      <h2 className="text-xl font-serif text-[#111]">3. Select Services</h2>
                      <p className="text-xs font-serif text-[#514C48]/70">Choose all services included in this package.</p>
                    </div>
                    <span className="text-xs font-sans tracking-widest uppercase bg-white border border-[#E6DEC9] px-3.5 py-1.5 rounded-full text-[#111] font-semibold">
                      {selectedServices.length} Selected
                    </span>
                  </div>

                  {availableServices.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-[#E6DEC9] rounded-2xl">
                      <p className="font-serif text-sm text-[#514C48]/60">No services found. Please add services first.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3.5 max-h-[540px] overflow-y-auto pr-1">
                      {availableServices.map((service) => {
                        const serviceId = service._id;
                        const isSelected = selectedServices.includes(serviceId);
                        return (
                          <div
                            key={serviceId}
                            onClick={() => handleServiceToggle(serviceId)}
                            className={`cursor-pointer border rounded-2xl p-4 flex items-center justify-between transition-all ${
                              isSelected
                                ? "bg-[#111] text-[#FAF7F3] border-[#111] shadow-md scale-[1.01]"
                                : "bg-white border-[#E6DEC9] hover:border-[#514C48]/40 text-[#514C48]"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 overflow-hidden">
                              {service.image ? (
                                <img src={service.image} alt={service.title} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-neutral-300" />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-[#FAF7F3] flex items-center justify-center shrink-0 border border-neutral-300 text-[#111]">
                                  <MdMedicalServices size={20} />
                                </div>
                              )}
                              <div className="overflow-hidden">
                                <h4 className="font-serif font-medium text-sm truncate">{service.title}</h4>
                                <p className={`text-xs truncate ${isSelected ? "text-neutral-300" : "text-[#514C48]/60"}`}>
                                  {service.category}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 pl-2">
                              {isSelected ? (
                                <PiCheckCircleFill size={22} className="text-emerald-400" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-[#E6DEC9]" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-[#E6DEC9]">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium py-4 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer font-sans shadow-md disabled:opacity-50"
                  >
                    {submitting ? "Updating Bundle..." : "Save Bundle Changes"} <IoIosArrowRoundForward size={20} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </form>
      </main>
      <Toaster position="bottom-right" />
    </>
  );
};

export default EditBundle;