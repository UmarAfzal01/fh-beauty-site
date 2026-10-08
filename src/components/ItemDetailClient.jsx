"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingBag, FiCalendar } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// Currency formatter for PKR
const formatPKR = (amount) => {
  if (amount === undefined || amount === null) return "";
  return `Rs. ${Number(amount).toLocaleString()}`;
};

export default function ItemDetailClient({ item }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const itemTypeLower = item.type?.toLowerCase() || "";
  const [primaryImage, setPrimaryImage] = useState(item?.images?.[0]?.url || "");

  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(item.options?.[0] || null);

  // Calculate pricing based on selected variant option
  const currentPrice = selectedOption ? selectedOption.price : item.price || 0;
  const currentCutPrice = selectedOption ? selectedOption.cutPrice : item.cutPrice || item.compareAtPrice || null;

  const handleAddToCart = () => {
    // Pass arguments cleanly matching CartContext: (product, quantity, selectedOption, price)
    addToCart(
      item,
      quantity,
      selectedOption ? selectedOption.name : "Standard",
      currentPrice
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* <Header /> */}
      <main className="min-h-screen bg-[#FAF7F3] text-[#514C48] overflow-hidden font-serif">
        
        {/* 1. Hero Section (60% Image / 40% Content Split) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
          {/* Image Display Section */}
          <div className="relative w-full lg:col-span-7 bg-[#E6DEC9]/20 p-4 lg:p-6 flex flex-col sm:flex-row gap-4 items-center">
            
            {/* Vertical Thumbnails Column */}
            {item.images && item.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[650px] w-full sm:w-auto shrink-0 scrollbar-none order-2 sm:order-1">
                {item.images.map((imgObj, idx) => (
                  <button
                    key={imgObj._id || idx}
                    type="button"
                    onClick={() => setPrimaryImage(imgObj.url)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition shrink-0 bg-white ${
                      primaryImage === imgObj.url 
                        ? "border-[#111] shadow-sm scale-[1.02]" 
                        : "border-[#E6DEC9] hover:border-[#111]/50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img 
                      src={imgObj.url} 
                      alt={imgObj.alt || `${item.name || "Item"} thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Large Image Display */}
            <div className="relative flex-1 w-full h-[500px] lg:h-[650px] rounded-2xl overflow-hidden bg-[#FAF7F3] border border-[#E6DEC9]/40 order-1 sm:order-2 shadow-xs">
              {primaryImage ? (
                <img src={primaryImage} alt={item.name || "Item Image"} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-[#514C48]/40">No Image Available</div>
              )}
            </div>
          </div>

          {/* Details & Actions Panel */}
          <div className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:col-span-5 bg-[#FAF7F3]">
            <div className="mb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#514C48]/60 hover:text-[#111] transition font-sans mb-6"
              >
                <FiArrowLeft size={14} /> Back to Catalog
              </Link>
              <span className="block text-xs uppercase tracking-widest text-[#8D4D5D] font-sans font-semibold mb-3">
                {item.type || "Catalog Item"}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-normal text-[#2C2623] mb-4 font-serif">
              {item.name}
            </h1>

            {item.description && (
              <p className="text-[#514C48]/80 leading-relaxed text-base font-sans mb-6">
                {item.description}
              </p>
            )}

            {/* Price Display */}
            <div className="flex items-baseline gap-4 py-4 border-t border-b border-[#EBE4DE] mb-6">
              <span className="text-3xl font-serif font-medium text-[#2C2623]">
                {formatPKR(currentPrice)}
              </span>
              {currentCutPrice && (
                <span className="text-lg font-serif text-[#514C48]/40 line-through">
                  {formatPKR(currentCutPrice)}
                </span>
              )}
            </div>

            {/* PRODUCT SPECIFIC: Options & Quantity */}
            {itemTypeLower === "product" && (
              <div className="space-y-6 mb-8">
                {item.options && item.options.length > 0 && (
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold mb-2">
                      Select Option / Variant
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {item.options.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedOption(opt)}
                          className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition border ${
                            selectedOption?.name === opt.name
                              ? "bg-[#111] text-white border-[#111]"
                              : "bg-white text-[#514C48] border-[#E6DEC9] hover:border-[#111]"
                          }`}
                        >
                          {opt.name} ({formatPKR(opt.price)})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold mb-2">
                    Quantity
                  </label>
                  <div className="inline-flex items-center bg-white border border-[#E6DEC9] rounded-2xl p-1 shadow-2xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-[#514C48] hover:text-[#111] transition"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="w-12 text-center font-serif font-medium text-lg text-[#111]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-[#514C48] hover:text-[#111] transition"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                </div>

                {/* Product Purchase Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border border-[#111] text-[#111] rounded-2xl text-xs uppercase tracking-widest font-semibold hover:bg-[#FAF7F3] transition shadow-xs"
                  >
                    <FiShoppingBag size={16} /> Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#111] text-white rounded-2xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition shadow-xs"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* SERVICE SPECIFIC BUTTON */}
            {itemTypeLower === "service" && (
              <div className="pt-2">
                <Link
                  href={`/appointment?service=${encodeURIComponent(item.name)}`}
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#111] text-white rounded-2xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition shadow-xs"
                >
                  <FiCalendar size={16} /> Get this Service
                </Link>
              </div>
            )}

            {/* BUNDLE SPECIFIC BUTTON */}
            {itemTypeLower === "bundle" && (
              <div className="pt-2">
                <Link
                  href={`/appointment?bundle=${encodeURIComponent(item.name)}`}
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#111] text-white rounded-2xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition shadow-xs"
                >
                  <FiCalendar size={16} /> Get this Bundle
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Sections Renderer */}
        {item.sections && item.sections.map((sec, idx) => {
          if (sec.type === "heading_desc" || sec.type === "heading" || sec.type === "description") {
            const alignClass = sec.align === "center" ? "text-center" : sec.align === "right" ? "text-right" : "text-left";
            return (
              <section key={sec.id || idx} className="py-24 px-6 lg:px-32 bg-white text-center border-t border-[#EBE4DE]">
                <div className="max-w-4xl mx-auto space-y-6">
                  {sec.heading && (
                    <h2 className={`text-4xl lg:text-5xl font-normal text-[#2C2623] ${alignClass}`}>
                      {sec.heading}
                    </h2>
                  )}
                  {(sec.description || sec.text) && (
                    <p className={`text-[#514C48]/80 leading-relaxed text-base lg:text-lg whitespace-pre-line font-sans ${alignClass}`}>
                      {sec.description || sec.text}
                    </p>
                  )}
                </div>
              </section>
            );
          }

          if (sec.type === "how_it_works") {
            return (
              <section key={sec.id || idx} className="min-h-[800px] grid grid-cols-1 lg:grid-cols-2 bg-[#6b3846] text-white">
                <div className="p-12 lg:p-24 flex flex-col justify-center space-y-8">
                  <h2 className="text-4xl lg:text-5xl font-normal font-serif">{sec.heading || "How It Works"}</h2>
                  <div className="space-y-6">
                    {sec.points?.map((pt, pIdx) => (
                      <div key={pIdx} className="space-y-2 border-b border-white/10 pb-6">
                        <span className="text-[10px] uppercase font-sans tracking-widest text-white/60 font-bold">Step 0{pIdx + 1}</span>
                        <h3 className="text-xl font-serif font-medium">{pt.heading}</h3>
                        <p className="text-sm font-sans text-white/80 leading-relaxed">{pt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative min-h-[400px] lg:min-h-full">
                  <Image
                    src={sec.imageUrl || primaryImage}
                    alt={sec.alt || "How it works"}
                    fill
                    className="object-cover opacity-90"
                  />
                </div>
              </section>
            );
          }

          if (sec.type === "candidate_requirements") {
            return (
              <section key={sec.id || idx} className="py-24 px-6 lg:px-32 bg-[#FAF7F3] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-b border-[#EBE4DE]">
                <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-sm border border-[#EBE4DE]">
                  <Image
                    src={sec.imageUrl || primaryImage}
                    alt={sec.alt || "Candidates"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-normal text-[#2C2623] mb-6">
                    {sec.heading || `Candidates for ${item.name}`}
                  </h2>
                  {sec.description && (
                    <p className="text-[#514C48]/80 mb-8 leading-relaxed font-sans">
                      {sec.description}
                    </p>
                  )}
                  <ul className="space-y-4 font-sans">
                    {sec.points?.map((req, rIdx) => (
                      <li key={rIdx} className="flex items-start text-[#514C48]">
                        <span className="h-2 w-2 rounded-full bg-[#8D4D5D] mt-2 mr-3 shrink-0" />
                        <span className="text-sm font-serif">{req.heading}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          }

          if (sec.type === "quick_questions") {
            return (
              <section key={sec.id || idx} className="py-24 px-6 lg:px-32 bg-[#FAF7F3] max-w-4xl mx-auto">
                <h2 className="text-3xl font-normal text-[#2C2623] text-center mb-12">
                  {sec.heading || "Quick answers to questions you may have"}
                </h2>
                <div className="space-y-6">
                  {sec.points?.map((faq, fIdx) => (
                    <div key={fIdx} className="bg-white p-8 rounded-2xl border border-[#EBE4DE] shadow-2xs space-y-3">
                      <h3 className="text-lg font-serif font-medium text-[#2C2623]">{faq.heading}</h3>
                      <p className="text-sm font-sans text-[#514C48]/80 leading-relaxed">{faq.description}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-12">
                  <a
                    href="/contact"
                    className="inline-block bg-[#2C2623] text-white px-8 py-4 rounded-2xl text-xs uppercase font-sans tracking-widest hover:bg-[#8D4D5D] transition-colors shadow-sm"
                  >
                    Book a Treatment
                  </a>
                </div>
              </section>
            );
          }

          return null;
        })}

      </main>
    </>
  );
}