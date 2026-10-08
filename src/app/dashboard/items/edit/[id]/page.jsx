"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  FiArrowLeft, FiTrash2, FiArrowUp, FiArrowDown, 
  FiAlignLeft, FiAlignCenter, FiAlignRight, FiSave, FiPlus, FiLayers, FiBox, FiCheck, FiLoader 
} from "react-icons/fi";
import { CldUploadButton } from "next-cloudinary";
import toast, { Toaster } from "react-hot-toast";

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const SECTION_TYPES = [
  { id: "heading", label: "Heading Block" },
  { id: "description", label: "Description Paragraph" },
  { id: "bullet", label: "Bullet List" },
  { id: "heading_desc", label: "Heading & Description" },
  { id: "image", label: "Image Banner" },
  { id: "image_text", label: "Image with Text Side-by-Side" },
  { id: "how_it_works", label: "How It Works Steps" },
  { id: "candidate_requirements", label: "Candidate Requirements" },
  { id: "quick_questions", label: "Quick Questions (FAQ)" },
  { id: "select_services", label: "Select Services / Addons" },
];

function AlignmentSelector({ align, onChange }) {
  return (
    <div className="flex bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl p-1 gap-1">
      <button
        type="button"
        onClick={() => onChange("left")}
        className={`p-1.5 rounded-lg transition-all ${align === "left" || !align ? "bg-[#111] text-white shadow-xs" : "text-[#514C48] hover:text-[#111]"}`}
        title="Align Left"
      >
        <FiAlignLeft size={13} />
      </button>
      <button
        type="button"
        onClick={() => onChange("center")}
        className={`p-1.5 rounded-lg transition-all ${align === "center" ? "bg-[#111] text-white shadow-xs" : "text-[#514C48] hover:text-[#111]"}`}
        title="Align Center"
      >
        <FiAlignCenter size={13} />
      </button>
      <button
        type="button"
        onClick={() => onChange("right")}
        className={`p-1.5 rounded-lg transition-all ${align === "right" ? "bg-[#111] text-white shadow-xs" : "text-[#514C48] hover:text-[#111]"}`}
        title="Align Right"
      >
        <FiAlignRight size={13} />
      </button>
    </div>
  );
}

function ImageUploadField({ label, url, alt, onChange }) {
  return (
    <div className="p-5 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl space-y-3">
      <label className="text-xs font-serif uppercase tracking-wider text-[#514C48]/75 font-semibold">{label}</label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-2 space-y-2.5">
          <input
            type="text"
            value={url || ""}
            onChange={(e) => onChange({ url: e.target.value, alt: alt || "" })}
            placeholder="Paste Cloudinary URL or upload below..."
            className="w-full bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 font-serif text-xs text-[#111] focus:outline-none focus:ring-2 focus:ring-[#111]/20 transition"
          />
          <input
            type="text"
            value={alt || ""}
            onChange={(e) => onChange({ url, alt: e.target.value })}
            placeholder="Alt text description for accessibility"
            className="w-full bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 font-serif text-xs text-[#111] focus:outline-none focus:ring-2 focus:ring-[#111]/20 transition"
          />
          <CldUploadButton
            onSuccess={(result) => {
              const secureUrl = result?.info?.secure_url;
              if (secureUrl) {
                onChange({ url: secureUrl, alt: alt || "" });
                toast.success("Image uploaded successfully!");
              }
            }}
            uploadPreset="Blogs_Images"
            className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition w-full cursor-pointer font-sans shadow-xs"
          >
            Upload via Cloudinary
          </CldUploadButton>
        </div>

        <div className="flex flex-col items-center justify-center border border-[#E6DEC9] rounded-xl p-3 bg-white text-center relative overflow-hidden min-h-[110px] shadow-2xs">
          {url ? (
            <div className="relative w-full h-24 rounded-lg overflow-hidden bg-black/5">
              <img src={url} alt={alt || "Preview"} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="space-y-1 py-4">
              <FiBox className="mx-auto text-[#514C48]/40" size={20} />
              <p className="text-[10px] font-serif text-[#514C48]/60">No image preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params?.id;

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [itemType, setItemType] = useState("Service");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(true);
  const [images, setImages] = useState([]);
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [cutPrice, setCutPrice] = useState("");
  const [sku, setSku] = useState("");
  const [options, setOptions] = useState([]);
  const [sections, setSections] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  // Fetch item data and available services on mount
  useEffect(() => {
    if (!itemId) return;

    const loadData = async () => {
      try {
        setFetching(true);
        const [itemRes, servicesRes] = await Promise.all([
          fetch(`/api/items/${itemId}`),
          fetch("/api/services")
        ]);

        const itemData = await itemRes.json();
        const servicesData = await servicesRes.json();

        if (itemRes.ok) {
          const item = itemData.item || itemData;
          setItemType(item.type || "Service");
          setName(item.name || "");
          setSlug(item.slug || "");
          setImages(item.images || []);
          setDesc(item.description || "");
          setPrice(item.price !== undefined ? item.price : "");
          setCutPrice(item.cutPrice !== undefined ? item.cutPrice : "");
          setSku(item.sku || "");
          setOptions(item.options || []);
          setSections(item.sections || []);
        } else {
          toast.error(itemData.message || "Failed to load item details");
        }

        if (servicesRes.ok) {
          setAvailableServices(Array.isArray(servicesData) ? servicesData : servicesData.services || []);
        }
      } catch (err) {
        console.error("Error fetching edit data:", err);
        toast.error("An error occurred while loading item data.");
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, [itemId]);

  useEffect(() => {
    if (!slugManuallyEdited && name) {
      setSlug(slugify(name));
    }
  }, [name, slugManuallyEdited]);

  const handleAddSection = (typeId) => {
    let newSection = { id: Date.now(), type: typeId };

    switch (typeId) {
      case "heading":
      case "description":
        newSection = { ...newSection, text: "", align: "left" };
        break;
      case "bullet":
        newSection = { ...newSection, items: [""] };
        break;
      case "heading_desc":
        newSection = { ...newSection, heading: "", description: "", align: "left" };
        break;
      case "image":
        newSection = { ...newSection, imageUrl: "", alt: "", caption: "" };
        break;
      case "image_text":
        newSection = { ...newSection, imageUrl: "", alt: "", imagePosition: "left", heading: "", description: "" };
        break;
      case "how_it_works":
        newSection = { ...newSection, heading: "", imageUrl: "", alt: "", points: [{ heading: "", description: "" }] };
        break;
      case "candidate_requirements":
        newSection = { ...newSection, heading: "", description: "", imageUrl: "", alt: "", points: [{ heading: "" }] };
        break;
      case "quick_questions":
        newSection = { ...newSection, heading: "", points: [{ heading: "", description: "" }] };
        break;
      case "select_services":
        newSection = { ...newSection, selectedServiceIds: [] };
        break;
      default:
        break;
    }

    setSections([...sections, newSection]);
  };

  const handleRemoveSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleMoveSection = (index, direction) => {
    const updated = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSections(updated);
  };

  const updateSection = (id, field, value) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, [field]: value } : sec));
  };

  const updateSectionMultiple = (id, updates) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, ...updates } : sec));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    setLoading(true);
    const payload = {
      type: itemType,
      name,
      slug,
      images,
      description: desc,
      price: price !== "" ? Number(price) : undefined,
      cutPrice: cutPrice !== "" ? Number(cutPrice) : undefined,
      sku: itemType === "Product" ? sku : undefined,
      options: itemType === "Product" ? options.map(opt => ({
        name: opt.name,
        price: opt.price !== "" ? Number(opt.price) : undefined,
        cutPrice: opt.cutPrice !== "" ? Number(opt.cutPrice) : undefined
      })) : [],
      sections
    };

    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Item updated successfully!");
        router.push("/dashboard");
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to update item");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving changes.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#FAF7F3] flex flex-col items-center justify-center space-y-3 text-[#514C48]">
        <FiLoader className="animate-spin text-[#111]" size={32} />
        <p className="font-serif text-sm">Loading item data for editing...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-12 px-4 sm:px-8 md:px-12 xl:px-20 selection:bg-[#111] selection:text-white">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Header Navigation Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl border border-[#E6DEC9] shadow-xs">
            <div className="flex items-center gap-4">
              <Link className="p-3 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl text-[#111] hover:bg-[#111] hover:text-white transition shadow-2xs" href="/dashboard/items">
                <FiArrowLeft size={18} />
              </Link>
              <div>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#514C48]/60 font-semibold">Catalog Management</span>
                <h1 className="text-2xl md:text-3xl font-serif font-normal text-[#111]">Edit Item</h1>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto bg-[#111] hover:bg-[#333] text-[#FAF7F3] px-7 py-3.5 rounded-2xl text-xs font-sans tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <FiSave size={16} /> {loading ? "Updating Item..." : "Save Changes"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Details Card */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#E6DEC9] shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-[#E6DEC9]/60 pb-4">
                <div className="p-2.5 bg-[#FAF7F3] rounded-xl border border-[#E6DEC9] text-[#111]">
                  <FiLayers size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-medium text-[#111]">Basic Details & Pricing</h2>
                  <p className="text-xs font-serif text-[#514C48]/70">Modify item classification, naming, and slug URL</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-serif uppercase tracking-wider text-[#514C48]/75 font-semibold">Item Type *</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl px-4 py-3.5 font-serif text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#111]/20 transition cursor-pointer"
                  >
                    <option value="Service">Service</option>
                    <option value="Bundle">Bundle</option>
                    <option value="Product">Product</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-serif uppercase tracking-wider text-[#514C48]/75 font-semibold">Item Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Advanced Consultation or Skincare Kit"
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl px-4 py-3.5 font-serif text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#111]/20 transition"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-serif uppercase tracking-wider text-[#514C48]/75 font-semibold">Slug *</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugManuallyEdited(true);
                    }}
                    placeholder="e.g. advanced-consultation"
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl px-4 py-3.5 font-serif text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#111]/20 transition"
                    required
                  />
                </div>

                {itemType === "Product" && (
                  <div className="space-y-2">
                    <label className="text-xs font-serif uppercase tracking-wider text-[#514C48]/75 font-semibold">SKU *</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g. PROD-SKU-001"
                      className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl px-4 py-3.5 font-serif text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#111]/20 transition"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-serif uppercase tracking-wider text-[#514C48]/75 font-semibold">General Price (Optional)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl px-4 py-3.5 font-serif text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#111]/20 transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-serif uppercase tracking-wider text-[#514C48]/75 font-semibold">Original / Cut Price (Optional)</label>
                  <input
                    type="number"
                    value={cutPrice}
                    onChange={(e) => setCutPrice(e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl px-4 py-3.5 font-serif text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#111]/20 transition"
                  />
                </div>

                {/* Product Options / Variants */}
                {itemType === "Product" && (
                  <div className="md:col-span-2 space-y-4 border-t border-[#E6DEC9]/60 pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-serif font-medium text-[#111]">Product Variants & Options</h3>
                        <p className="text-xs font-serif text-[#514C48]/70">Define sizes or options with individual pricing attributes</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOptions([...options, { name: "", price: "", cutPrice: "" }])}
                        className="bg-[#FAF7F3] hover:bg-[#E6DEC9]/50 border border-[#E6DEC9] px-4 py-2 rounded-xl text-xs font-sans text-[#111] flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <FiPlus size={13} /> Add Variant
                      </button>
                    </div>

                    {options.length === 0 && (
                      <div className="p-6 bg-[#FAF7F3] border border-dashed border-[#E6DEC9] rounded-2xl text-center text-xs font-serif text-[#514C48]/60">
                        No product options added. General price will apply automatically.
                      </div>
                    )}

                    <div className="space-y-3">
                      {options.map((opt, optIdx) => (
                        <div key={optIdx} className="p-4 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl flex flex-col md:flex-row gap-3 items-center relative shadow-2xs">
                          <input
                            type="text"
                            value={opt.name}
                            onChange={(e) => {
                              const updated = [...options];
                              updated[optIdx].name = e.target.value;
                              setOptions(updated);
                            }}
                            placeholder="Variant Name (e.g. 250ML)"
                            className="w-full md:w-1/3 bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#111]"
                          />
                          <input
                            type="number"
                            value={opt.price}
                            onChange={(e) => {
                              const updated = [...options];
                              updated[optIdx].price = e.target.value;
                              setOptions(updated);
                            }}
                            placeholder="Price"
                            className="w-full md:w-1/3 bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#111]"
                          />
                          <input
                            type="number"
                            value={opt.cutPrice}
                            onChange={(e) => {
                              const updated = [...options];
                              updated[optIdx].cutPrice = e.target.value;
                              setOptions(updated);
                            }}
                            placeholder="Cut Price (Optional)"
                            className="w-full md:w-1/3 bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#111]"
                          />
                          <button
                            type="button"
                            onClick={() => setOptions(options.filter((_, i) => i !== optIdx))}
                            className="p-2.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition cursor-pointer"
                            title="Remove Option"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Gallery */}
                <div className="md:col-span-2 space-y-4 border-t border-[#E6DEC9]/60 pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-serif font-medium text-[#111]">Gallery Images</h3>
                      <p className="text-xs font-serif text-[#514C48]/70">Upload banners or thumbnails for showcase</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImages([...images, { url: "", alt: "" }])}
                      className="bg-[#FAF7F3] hover:bg-[#E6DEC9]/50 border border-[#E6DEC9] px-4 py-2 rounded-xl text-xs font-sans text-[#111] flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FiPlus size={13} /> Add Image
                    </button>
                  </div>

                  {images.length === 0 && (
                    <div className="p-8 bg-[#FAF7F3] border border-dashed border-[#E6DEC9] rounded-2xl text-center text-xs font-serif text-[#514C48]/60">
                      No images added yet. Click "+ Add Image" above to upload via Cloudinary.
                    </div>
                  )}

                  <div className="space-y-4">
                    {images.map((imgObj, imgIdx) => (
                      <div key={imgIdx} className="relative">
                        <ImageUploadField
                          label={`Image #${imgIdx + 1}`}
                          url={imgObj.url}
                          alt={imgObj.alt}
                          onChange={(updated) => {
                            const updatedList = [...images];
                            updatedList[imgIdx] = updated;
                            setImages(updatedList);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== imgIdx))}
                          className="absolute top-5 right-5 p-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-100 transition cursor-pointer shadow-xs"
                          title="Remove Image"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2 border-t border-[#E6DEC9]/60 pt-6">
                  <label className="text-xs font-serif uppercase tracking-wider text-[#514C48]/75 font-semibold">Short Description</label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={3}
                    placeholder="Provide a concise summary overview..."
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl px-4 py-3.5 font-serif text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-[#111]/20 transition"
                  />
                </div>

              </div>
            </div>

            {/* Sections Builder Card */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#E6DEC9] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E6DEC9]/60 pb-6">
                <div>
                  <h2 className="text-lg font-serif font-medium text-[#111]">Detail Sections Builder</h2>
                  <p className="text-xs font-serif text-[#514C48]/70">Construct rich modular page body layouts dynamically</p>
                </div>
                
                <div className="w-full sm:w-auto">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddSection(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    defaultValue=""
                    className="w-full sm:w-auto bg-[#FAF7F3] hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] rounded-2xl px-5 py-3 font-serif text-xs font-semibold text-[#111] focus:outline-none cursor-pointer transition shadow-xs"
                  >
                    <option value="" disabled>+ Add Section Block</option>
                    {SECTION_TYPES.map(st => (
                      <option key={st.id} value={st.id}>{st.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6 pt-2">
                {sections.length === 0 && (
                  <div className="text-center py-16 border-2 border-dashed border-[#E6DEC9] rounded-3xl bg-[#FAF7F3]/50 space-y-2">
                    <FiLayers className="mx-auto text-[#514C48]/30" size={32} />
                    <p className="font-serif text-sm text-[#514C48]/60">No detail sections added yet.</p>
                    <p className="text-xs font-serif text-[#514C48]/40">Select a block type from the dropdown above to start crafting your page.</p>
                  </div>
                )}

                {sections.map((sec, idx) => (
                  <div key={sec.id || idx} className="p-6 md:p-7 bg-[#FAF7F3] border border-[#E6DEC9] rounded-3xl space-y-5 relative shadow-2xs transition hover:border-[#111]/30">
                    
                    <div className="flex justify-between items-center border-b border-[#E6DEC9] pb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-white border border-[#E6DEC9] flex items-center justify-center text-xs font-serif font-bold text-[#111] shadow-2xs">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-sans uppercase font-bold tracking-wider text-[#111]">
                          {SECTION_TYPES.find(st => st.id === sec.type)?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button 
                          type="button" 
                          onClick={() => handleMoveSection(idx, "up")}
                          disabled={idx === 0}
                          className="p-2 bg-white border border-[#E6DEC9] rounded-xl text-[#514C48] hover:text-[#111] disabled:opacity-30 cursor-pointer transition shadow-2xs"
                          title="Move Up"
                        >
                          <FiArrowUp size={14} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleMoveSection(idx, "down")}
                          disabled={idx === sections.length - 1}
                          className="p-2 bg-white border border-[#E6DEC9] rounded-xl text-[#514C48] hover:text-[#111] disabled:opacity-30 cursor-pointer transition shadow-2xs"
                          title="Move Down"
                        >
                          <FiArrowDown size={14} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSection(sec.id)}
                          className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 hover:bg-rose-100 cursor-pointer ml-1 transition shadow-2xs"
                          title="Remove Section"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* 1. Heading */}
                    {sec.type === "heading" && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-serif text-[#514C48] font-semibold">Heading Text</label>
                          <AlignmentSelector align={sec.align} onChange={(val) => updateSection(sec.id, "align", val)} />
                        </div>
                        <input
                          type="text"
                          value={sec.text || ""}
                          onChange={(e) => updateSection(sec.id, "text", e.target.value)}
                          placeholder="Enter section heading..."
                          className={`w-full bg-white border border-[#E6DEC9] rounded-2xl px-4 py-3 font-serif text-sm text-[#111] text-${sec.align || "left"} focus:outline-none focus:ring-2 focus:ring-[#111]/20 transition`}
                        />
                      </div>
                    )}

                    {/* 2. Description */}
                    {sec.type === "description" && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-serif text-[#514C48] font-semibold">Description Paragraph</label>
                          <AlignmentSelector align={sec.align} onChange={(val) => updateSection(sec.id, "align", val)} />
                        </div>
                        <textarea
                          value={sec.text || ""}
                          onChange={(e) => updateSection(sec.id, "text", e.target.value)}
                          rows={3}
                          placeholder="Enter paragraph description..."
                          className={`w-full bg-white border border-[#E6DEC9] rounded-2xl px-4 py-3 font-serif text-sm text-[#111] text-${sec.align || "left"} focus:outline-none focus:ring-2 focus:ring-[#111]/20 transition`}
                        />
                      </div>
                    )}

                    {/* 3. Bullet List */}
                    {sec.type === "bullet" && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-serif text-[#514C48] font-semibold">Bullet Points</label>
                          <button
                            type="button"
                            onClick={() => updateSection(sec.id, "items", [...(sec.items || []), ""])}
                            className="bg-white hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] px-3 py-1.5 rounded-xl text-xs font-sans text-[#111] flex items-center gap-1 transition cursor-pointer"
                          >
                            <FiPlus size={12} /> Add Bullet
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(sec.items || []).map((item, pIdx) => (
                            <div key={pIdx} className="flex gap-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const updatedItems = [...sec.items];
                                  updatedItems[pIdx] = e.target.value;
                                  updateSection(sec.id, "items", updatedItems);
                                }}
                                placeholder={`Bullet item #${pIdx + 1}`}
                                className="w-full bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#111]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedItems = sec.items.filter((_, i) => i !== pIdx);
                                  updateSection(sec.id, "items", updatedItems);
                                }}
                                className="p-2.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition cursor-pointer"
                              >
                                <FiTrash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Heading & Description */}
                    {sec.type === "heading_desc" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-serif text-[#514C48] font-semibold">Heading & Description</label>
                          <AlignmentSelector align={sec.align} onChange={(val) => updateSection(sec.id, "align", val)} />
                        </div>
                        <input
                          type="text"
                          value={sec.heading || ""}
                          onChange={(e) => updateSection(sec.id, "heading", e.target.value)}
                          placeholder="Section Heading..."
                          className={`w-full bg-white border border-[#E6DEC9] rounded-2xl px-4 py-3 font-serif text-sm text-[#111] text-${sec.align || "left"} focus:outline-none`}
                        />
                        <textarea
                          value={sec.description || ""}
                          onChange={(e) => updateSection(sec.id, "description", e.target.value)}
                          rows={3}
                          placeholder="Section Description..."
                          className={`w-full bg-white border border-[#E6DEC9] rounded-2xl px-4 py-3 font-serif text-sm text-[#111] text-${sec.align || "left"} focus:outline-none`}
                        />
                      </div>
                    )}

                    {/* 5. Image Banner */}
                    {sec.type === "image" && (
                      <div className="space-y-4">
                        <ImageUploadField
                          label="Banner Image"
                          url={sec.imageUrl}
                          alt={sec.alt}
                          onChange={(upd) => updateSectionMultiple(sec.id, { imageUrl: upd.url, alt: upd.alt })}
                        />
                        <input
                          type="text"
                          value={sec.caption || ""}
                          onChange={(e) => updateSection(sec.id, "caption", e.target.value)}
                          placeholder="Image caption (Optional)"
                          className="w-full bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#111]"
                        />
                      </div>
                    )}

                    {/* 6. Image with Text Side-by-Side */}
                    {sec.type === "image_text" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-serif text-[#514C48] font-semibold">Image Position</label>
                          <select
                            value={sec.imagePosition || "left"}
                            onChange={(e) => updateSection(sec.id, "imagePosition", e.target.value)}
                            className="bg-white border border-[#E6DEC9] rounded-xl px-3 py-1.5 text-xs font-serif text-[#111]"
                          >
                            <option value="left">Image on Left</option>
                            <option value="right">Image on Right</option>
                          </select>
                        </div>
                        <ImageUploadField
                          label="Side Image"
                          url={sec.imageUrl}
                          alt={sec.alt}
                          onChange={(upd) => updateSectionMultiple(sec.id, { imageUrl: upd.url, alt: upd.alt })}
                        />
                        <input
                          type="text"
                          value={sec.heading || ""}
                          onChange={(e) => updateSection(sec.id, "heading", e.target.value)}
                          placeholder="Heading..."
                          className="w-full bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#111]"
                        />
                        <textarea
                          value={sec.description || ""}
                          onChange={(e) => updateSection(sec.id, "description", e.target.value)}
                          rows={3}
                          placeholder="Description..."
                          className="w-full bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#111]"
                        />
                      </div>
                    )}

                    {/* 7. How It Works Steps */}
                    {sec.type === "how_it_works" && (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={sec.heading || ""}
                          onChange={(e) => updateSection(sec.id, "heading", e.target.value)}
                          placeholder="Section Main Heading (e.g. How It Works)"
                          className="w-full bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#111]"
                        />
                        <ImageUploadField
                          label="Section Featured Image (Optional)"
                          url={sec.imageUrl}
                          alt={sec.alt}
                          onChange={(upd) => updateSectionMultiple(sec.id, { imageUrl: upd.url, alt: upd.alt })}
                        />
                        <div className="flex justify-between items-center pt-2">
                          <label className="text-xs font-serif text-[#514C48] font-semibold">Steps</label>
                          <button
                            type="button"
                            onClick={() => updateSection(sec.id, "points", [...(sec.points || []), { heading: "", description: "" }])}
                            className="bg-white hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] px-3 py-1.5 rounded-xl text-xs font-sans text-[#111] flex items-center gap-1 cursor-pointer"
                          >
                            <FiPlus size={12} /> Add Step
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(sec.points || []).map((pt, pIdx) => (
                            <div key={pIdx} className="p-4 bg-white border border-[#E6DEC9] rounded-2xl space-y-2.5 relative">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={pt.heading || ""}
                                  onChange={(e) => {
                                    const pts = [...sec.points];
                                    pts[pIdx].heading = e.target.value;
                                    updateSection(sec.id, "points", pts);
                                  }}
                                  placeholder={`Step ${pIdx + 1} Title`}
                                  className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs font-serif text-[#111]"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const pts = sec.points.filter((_, i) => i !== pIdx);
                                    updateSection(sec.id, "points", pts);
                                  }}
                                  className="p-2 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition cursor-pointer"
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </div>
                              <textarea
                                value={pt.description || ""}
                                onChange={(e) => {
                                  const pts = [...sec.points];
                                  pts[pIdx].description = e.target.value;
                                  updateSection(sec.id, "points", pts);
                                }}
                                rows={2}
                                placeholder="Step description..."
                                className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs font-serif text-[#111]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 8. Candidate Requirements */}
                    {sec.type === "candidate_requirements" && (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={sec.heading || ""}
                          onChange={(e) => updateSection(sec.id, "heading", e.target.value)}
                          placeholder="Main Heading..."
                          className="w-full bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#111]"
                        />
                        <textarea
                          value={sec.description || ""}
                          onChange={(e) => updateSection(sec.id, "description", e.target.value)}
                          rows={2}
                          placeholder="Overview description..."
                          className="w-full bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#111]"
                        />
                        <ImageUploadField
                          label="Requirements Image"
                          url={sec.imageUrl}
                          alt={sec.alt}
                          onChange={(upd) => updateSectionMultiple(sec.id, { imageUrl: upd.url, alt: upd.alt })}
                        />
                        <div className="flex justify-between items-center pt-2">
                          <label className="text-xs font-serif text-[#514C48] font-semibold">Requirement Points</label>
                          <button
                            type="button"
                            onClick={() => updateSection(sec.id, "points", [...(sec.points || []), { heading: "" }])}
                            className="bg-white hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] px-3 py-1.5 rounded-xl text-xs font-sans text-[#111] flex items-center gap-1 cursor-pointer"
                          >
                            <FiPlus size={12} /> Add Point
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(sec.points || []).map((pt, pIdx) => (
                            <div key={pIdx} className="flex gap-2">
                              <input
                                type="text"
                                value={pt.heading || ""}
                                onChange={(e) => {
                                  const pts = [...sec.points];
                                  pts[pIdx].heading = e.target.value;
                                  updateSection(sec.id, "points", pts);
                                }}
                                placeholder={`Requirement #${pIdx + 1}`}
                                className="w-full bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#111]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const pts = sec.points.filter((_, i) => i !== pIdx);
                                  updateSection(sec.id, "points", pts);
                                }}
                                className="p-2.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition cursor-pointer"
                              >
                                <FiTrash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 9. Quick Questions (FAQ) */}
                    {sec.type === "quick_questions" && (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={sec.heading || ""}
                          onChange={(e) => updateSection(sec.id, "heading", e.target.value)}
                          placeholder="FAQ Section Heading (e.g. Quick Questions)"
                          className="w-full bg-white border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#111]"
                        />
                        <div className="flex justify-between items-center pt-2">
                          <label className="text-xs font-serif text-[#514C48] font-semibold">Questions & Answers</label>
                          <button
                            type="button"
                            onClick={() => updateSection(sec.id, "points", [...(sec.points || []), { heading: "", description: "" }])}
                            className="bg-white hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] px-3 py-1.5 rounded-xl text-xs font-sans text-[#111] flex items-center gap-1 cursor-pointer"
                          >
                            <FiPlus size={12} /> Add FAQ
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(sec.points || []).map((pt, pIdx) => (
                            <div key={pIdx} className="p-4 bg-white border border-[#E6DEC9] rounded-2xl space-y-2.5 relative">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={pt.heading || ""}
                                  onChange={(e) => {
                                    const pts = [...sec.points];
                                    pts[pIdx].heading = e.target.value;
                                    updateSection(sec.id, "points", pts);
                                  }}
                                  placeholder="Question..."
                                  className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs font-serif text-[#111]"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const pts = sec.points.filter((_, i) => i !== pIdx);
                                    updateSection(sec.id, "points", pts);
                                  }}
                                  className="p-2 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition cursor-pointer"
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </div>
                              <textarea
                                value={pt.description || ""}
                                onChange={(e) => {
                                  const pts = [...sec.points];
                                  pts[pIdx].description = e.target.value;
                                  updateSection(sec.id, "points", pts);
                                }}
                                rows={2}
                                placeholder="Answer..."
                                className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs font-serif text-[#111]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 10. Select Services / Addons */}
                    {sec.type === "select_services" && (
                      <div className="space-y-3">
                        <label className="text-xs font-serif text-[#514C48] font-semibold">Select Services / Addons to Attach</label>
                        {availableServices.length === 0 ? (
                          <p className="text-xs font-serif text-[#514C48]/60 italic">No available services found in catalog.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-2 bg-white border border-[#E6DEC9] rounded-2xl">
                            {availableServices.map((srv) => {
                              const srvId = srv._id || srv.id;
                              const isSelected = (sec.selectedServiceIds || []).includes(srvId);
                              return (
                                <div
                                  key={srvId}
                                  onClick={() => {
                                    const currentIds = sec.selectedServiceIds || [];
                                    const updatedIds = isSelected
                                      ? currentIds.filter(id => id !== srvId)
                                      : [...currentIds, srvId];
                                    updateSection(sec.id, "selectedServiceIds", updatedIds);
                                  }}
                                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${isSelected ? "bg-[#111] text-white border-[#111]" : "bg-[#FAF7F3] text-[#111] border-[#E6DEC9] hover:border-[#111]/40"}`}
                                >
                                  <span className="text-xs font-serif font-medium truncate">{srv.name}</span>
                                  {isSelected && <FiCheck size={14} className="text-white shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>

          </form>
        </div>
      </main>
    </>
  );
}