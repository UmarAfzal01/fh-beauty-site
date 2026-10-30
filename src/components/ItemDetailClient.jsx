"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiCalendar,
  FiCheck,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";

// Currency formatter for PKR
const formatPKR = (amount) => {
  if (amount === undefined || amount === null || amount === "") return "";
  return `Rs. ${Number(amount).toLocaleString()}`;
};

const getAlignClass = (align) =>
  align === "center"
    ? "text-center"
    : align === "right"
      ? "text-right"
      : "text-left";

/* ------------------------------------------------------------------ */
/* Individual Accordion Item for "How It Works" Steps                */
/* ------------------------------------------------------------------ */
function HowItWorksStepItem({ pt, pIdx }) {
  const [isOpen, setIsOpen] = useState(pIdx === 0); // First step open by default

  return (
    <div className="border-b border-white/10 pb-4 transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left py-2 group cursor-pointer focus:outline-none"
      >
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-sans tracking-widest text-white/60 font-bold block">
            Step {String(pIdx + 1).padStart(2, "0")}
          </span>
          {pt.heading && (
            <h3 className="text-xl font-serif font-medium group-hover:text-white/80 transition">
              {pt.heading}
            </h3>
          )}
        </div>
        <span
          className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold transition-transform duration-300 ${isOpen ? "rotate-180 bg-white/20" : ""}`}
        >
          ↓
        </span>
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 pt-3"
            : "grid-rows-[0fr] opacity-0 pt-0"
        }`}
      >
        <div className="overflow-hidden">
          {pt.description && (
            <p className="text-sm font-sans text-white/80 leading-relaxed whitespace-pre-line pb-2">
              {pt.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Individual Accordion Item for Quick Questions FAQ                 */
/* ------------------------------------------------------------------ */
function QuickQuestionFaqItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false); // All closed by default

  return (
    <div className="bg-white px-8 py-6 rounded-2xl border border-[#EBE4DE] shadow-2xs transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
      >
        <h3 className="text-lg font-serif font-medium text-[#2C2623] group-hover:text-[#8D4D5D] transition">
          {faq.heading}
        </h3>
        <span
          className={`w-8 h-8 rounded-full bg-[#FAF7F3] border border-[#EBE4DE] flex items-center justify-center text-xs font-bold text-[#2C2623] transition-transform duration-300 ml-4 shrink-0 ${isOpen ? "rotate-180 bg-[#2C2623] text-white" : ""}`}
        >
          ↓
        </span>
      </button>

      {/* Collapsible Answer */}
      <div
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 pt-4 border-t border-[#EBE4DE] mt-4"
            : "grid-rows-[0fr] opacity-0 pt-0"
        }`}
      >
        <div className="overflow-hidden">
          {faq.description && (
            <p className="text-sm font-sans text-[#514C48]/80 leading-relaxed whitespace-pre-line">
              {faq.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dynamic section renderer                                            */
/* ------------------------------------------------------------------ */
function SectionRenderer({ sec, idx, item, fallbackImage, services }) {
  const key = sec.id || idx;

  switch (sec.type) {
    /* ---------- Heading Block ---------- */
    case "heading": {
      const text = sec.text || sec.heading;
      if (!text) return null;
      return (
        <section
          key={key}
          className="pt-20 pb-4 px-6 lg:px-32 bg-white border-t border-[#EBE4DE]"
        >
          <div className="max-w-4xl mx-auto">
            <h2
              className={`text-4xl lg:text-5xl font-normal text-[#2C2623] ${getAlignClass(sec.align)}`}
            >
              {text}
            </h2>
          </div>
        </section>
      );
    }

    /* ---------- Description Paragraph ---------- */
    case "description": {
      const text = sec.text || sec.description;
      if (!text) return null;
      return (
        <section key={key} className="py-6 px-6 lg:px-32 bg-white">
          <div className="max-w-4xl mx-auto">
            <p
              className={`text-[#514C48]/80 leading-relaxed text-base lg:text-lg whitespace-pre-line font-sans ${getAlignClass(sec.align)}`}
            >
              {text}
            </p>
          </div>
        </section>
      );
    }

    /* ---------- Heading & Description ---------- */
    case "heading_desc": {
      if (!sec.heading && !sec.description) return null;
      return (
        <section
          key={key}
          className="py-20 px-6 lg:px-32 bg-white border-t border-[#EBE4DE]"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {sec.heading && (
              <h2
                className={`text-4xl lg:text-5xl font-normal text-[#2C2623] ${getAlignClass(sec.align)}`}
              >
                {sec.heading}
              </h2>
            )}
            {sec.description && (
              <p
                className={`text-[#514C48]/80 leading-relaxed text-base lg:text-lg whitespace-pre-line font-sans ${getAlignClass(sec.align)}`}
              >
                {sec.description}
              </p>
            )}
          </div>
        </section>
      );
    }

    /* ---------- Bullet List ---------- */
    case "bullet": {
      const items = (sec.items || []).filter((i) => i && i.trim());
      if (items.length === 0) return null;
      return (
        <section key={key} className="pt-2 pb-12 px-6 lg:px-32 bg-white">
          <ul className="max-w-4xl mx-auto space-y-4 font-sans">
            {items.map((text, bIdx) => (
              <li key={bIdx} className="flex items-start gap-3 text-[#514C48]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8D4D5D]/10 text-[#8D4D5D]">
                  <FiCheck size={12} />
                </span>
                <span className="text-base leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </section>
      );
    }

    /* ---------- Image Banner ---------- */
    case "image": {
      if (!sec.imageUrl) return null;
      return (
        <section key={key} className="py-12 px-6 lg:px-32 bg-white">
          <figure className="max-w-6xl mx-auto">
            <div className="w-full overflow-hidden rounded-3xl border border-[#EBE4DE] shadow-sm bg-[#FAF7F3]">
              <img
                src={sec.imageUrl}
                alt={sec.alt || item.name || "Banner"}
                className="w-full h-auto max-h-[640px] object-cover"
              />
            </div>
            {sec.caption && (
              <figcaption className="mt-4 text-center text-xs font-sans text-[#514C48]/60 italic">
                {sec.caption}
              </figcaption>
            )}
          </figure>
        </section>
      );
    }

    /* ---------- Image with Text Side-by-Side ---------- */
    case "image_text": {
      const imageRight = sec.imagePosition === "right";
      const hasImage = !!sec.imageUrl;
      if (!hasImage && !sec.heading && !sec.description) return null;
      return (
        <section
          key={key}
          className="py-24 px-6 lg:px-32 bg-white border-t border-[#EBE4DE]"
        >
          <div
            className={`max-w-6xl mx-auto grid grid-cols-1 ${hasImage ? "lg:grid-cols-2" : ""} gap-12 items-center`}
          >
            {hasImage && (
              <div className={`${imageRight ? "lg:order-2" : "lg:order-1"}`}>
                <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#EBE4DE] shadow-sm bg-[#FAF7F3]">
                  <img
                    src={sec.imageUrl}
                    alt={sec.alt || sec.heading || "Feature"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <div
              className={`space-y-5 ${imageRight ? "lg:order-1" : "lg:order-2"}`}
            >
              {sec.heading && (
                <h2 className="text-3xl lg:text-4xl font-normal text-[#2C2623] leading-tight">
                  {sec.heading}
                </h2>
              )}
              {sec.description && (
                <p className="text-[#514C48]/80 leading-relaxed text-base lg:text-lg whitespace-pre-line font-sans">
                  {sec.description}
                </p>
              )}
            </div>
          </div>
        </section>
      );
    }

    /* ---------- How It Works ---------- */
    case "how_it_works": {
      const img = sec.imageUrl || fallbackImage;
      return (
        <section
          key={key}
          className={`grid grid-cols-1 ${img ? "lg:grid-cols-2" : ""} bg-[#6b3846] text-white`}
        >
          {/* Image Column - First on mobile/tablet (order-1), second on desktop (lg:order-2) */}
          {img && (
            <div className="relative min-h-[400px] lg:min-h-full order-1 lg:order-2">
              <img
                src={img}
                alt={sec.alt || "How it works"}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
            </div>
          )}

          {/* Content Column - Second on mobile/tablet (order-2), first on desktop (lg:order-1) */}
          <div className="p-12 lg:p-24 flex flex-col justify-center space-y-8 order-2 lg:order-1">
            <h2 className="text-4xl lg:text-5xl font-normal font-serif">
              {sec.heading || "How It Works"}
            </h2>
            <div className="space-y-4">
              {sec.points?.map((pt, pIdx) => (
                <HowItWorksStepItem key={pIdx} pt={pt} pIdx={pIdx} />
              ))}
            </div>
          </div>
        </section>
      );
    }

    /* ---------- Candidate Requirements ---------- */
    case "candidate_requirements": {
      const img = sec.imageUrl || fallbackImage;
      return (
        <section
          key={key}
          className={`py-24 px-6 lg:px-32 bg-[#FAF7F3] grid grid-cols-1 ${img ? "lg:grid-cols-2" : ""} gap-12 items-center border-b border-[#EBE4DE]`}
        >
          {img && (
            <div className="relative h-[420px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-sm border border-[#EBE4DE]">
              <img
                src={img}
                alt={sec.alt || "Candidates"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h2 className="text-3xl lg:text-4xl font-normal text-[#2C2623] mb-6">
              {sec.heading || `Candidates for ${item.name}`}
            </h2>
            {sec.description && (
              <p className="text-[#514C48]/80 mb-8 leading-relaxed font-sans whitespace-pre-line">
                {sec.description}
              </p>
            )}
            <ul className="space-y-4 font-sans">
              {sec.points
                ?.filter((req) => req.heading)
                .map((req, rIdx) => (
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

    /* ---------- Quick Questions (FAQ) ---------- */
    case "quick_questions": {
      return (
        <section key={key} className="py-24 px-6 lg:px-32 bg-[#FAF7F3]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-normal text-[#2C2623] text-center mb-12">
              {sec.heading || "Quick answers to questions you may have"}
            </h2>
            <div className="space-y-4">
              {sec.points?.map((faq, fIdx) => (
                <QuickQuestionFaqItem key={fIdx} faq={faq} />
              ))}
            </div>
            <div className="text-center mt-12">
              <a
                href="/contact"
                className="inline-block bg-[#2C2623] text-white px-8 py-4 rounded-2xl text-xs uppercase font-sans tracking-widest hover:bg-[#8D4D5D] transition-colors shadow-sm"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      );
    }

    /* ---------- Select Services / Addons ---------- */
    case "select_services": {
      const ids = (sec.selectedServiceIds || []).map(String);
      const selected = ids
        .map((id) => services.find((s) => String(s._id || s.id) === id))
        .filter(Boolean);
      if (selected.length === 0) return null;

      return (
        <section
          key={key}
          className="py-24 px-6 lg:px-32 bg-white border-t border-[#EBE4DE]"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-normal text-[#2C2623] text-center mb-12">
              {sec.heading || "Select Services"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selected.map((srv) => {
                const thumb = srv.images?.[0]?.url;
                return (
                  <div
                    key={srv._id || srv.id}
                    className="flex flex-col bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition"
                  >
                    {thumb && (
                      <div className="aspect-[4/3] w-full overflow-hidden bg-white">
                        <img
                          src={thumb}
                          alt={srv.images?.[0]?.alt || srv.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 p-6 space-y-3">
                      <h3 className="text-lg font-serif font-medium text-[#2C2623]">
                        {srv.name}
                      </h3>
                      {srv.description && (
                        <p className="text-sm font-sans text-[#514C48]/80 leading-relaxed line-clamp-3">
                          {srv.description}
                        </p>
                      )}
                      <div className="flex items-baseline gap-3 mt-auto pt-2">
                        {srv.price !== undefined &&
                          srv.price !== null &&
                          srv.price !== "" && (
                            <span className="text-lg font-serif font-medium text-[#2C2623]">
                              {formatPKR(srv.price)}
                            </span>
                          )}
                        {srv.cutPrice && (
                          <span className="text-sm font-serif text-[#514C48]/40 line-through">
                            {formatPKR(srv.cutPrice)}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/appointment?service=${encodeURIComponent(srv.name)}`}
                        className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-[#111] text-white rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition"
                      >
                        <FiCalendar size={14} /> Get this Service
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

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function ItemDetailClient({ item }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const itemTypeLower = item.type?.toLowerCase() || "";
  const [primaryImage, setPrimaryImage] = useState(
    item?.images?.[0]?.url || "",
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(
    item.options?.[0] || null,
  );

  // Services are only needed when a "select_services" block exists
  const [services, setServices] = useState([]);
  const hasServiceSection = item.sections?.some(
    (s) => s.type === "select_services",
  );

  useEffect(() => {
    if (!hasServiceSection) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (res.ok && !cancelled) {
          setServices(Array.isArray(data) ? data : data.services || []);
        }
      } catch (err) {
        console.error("Failed to load services", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasServiceSection]);

  // Pricing based on selected variant option
  const currentPrice = selectedOption ? selectedOption.price : item.price || 0;
  const currentCutPrice = selectedOption
    ? selectedOption.cutPrice
    : item.cutPrice || item.compareAtPrice || null;

  const handleAddToCart = () => {
    addToCart(
      item,
      quantity,
      selectedOption ? selectedOption.name : "Standard",
      currentPrice,
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };
  const priceNum = Number(currentPrice);
  const cutNum = Number(currentCutPrice);

  // Works whichever way the two prices are entered: the higher one is the
  // "original" and the lower one is what the customer pays
  const hasDiscount = priceNum > 0 && cutNum > 0 && priceNum !== cutNum;
  const highPrice = Math.max(priceNum, cutNum);
  const lowPrice = Math.min(priceNum, cutNum);
  const discountPercent = hasDiscount
    ? Math.round(((highPrice - lowPrice) / highPrice) * 100)
    : 0;
  const savings = highPrice - lowPrice;
  return (
    <main className="min-h-screen bg-[#FAF7F3] text-[#514C48] overflow-hidden font-serif">
      {/* 1. Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[85vh] items-center">
        {/* Images */}
        <div className="w-full lg:col-span-6 bg-[#E6DEC9]/15 p-6 lg:p-12 flex flex-col sm:flex-row gap-6 items-center justify-center">
          {item.images && item.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[550px] w-full sm:w-auto shrink-0 scrollbar-none order-2 sm:order-1">
              {item.images.map((imgObj, idx) => (
                <button
                  key={imgObj._id || idx}
                  type="button"
                  onClick={() => setPrimaryImage(imgObj.url)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition shrink-0 bg-white ${
                    primaryImage === imgObj.url
                      ? "border-[#111] shadow-sm scale-105"
                      : "border-[#E6DEC9] hover:border-[#111]/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgObj.url}
                    alt={
                      imgObj.alt ||
                      `${item.name || "Item"} thumbnail ${idx + 1}`
                    }
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="relative w-full max-w-[560px] lg:max-w-[620px] aspect-square rounded-3xl overflow-hidden bg-white border border-[#E6DEC9]/60 order-1 sm:order-2 shadow-xl shadow-[#514C48]/5">
            {/* Blink animation */}
            <style>{`
  @keyframes badgeRing {
    0%   { box-shadow: 0 0 0 0 rgba(141, 77, 93, 0.55); }
    70%  { box-shadow: 0 0 0 14px rgba(141, 77, 93, 0); }
    100% { box-shadow: 0 0 0 0 rgba(141, 77, 93, 0); }
  }
`}</style>

            {primaryImage ? (
              <img
                src={primaryImage}
                alt={item.name || "Item Image"}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-[#514C48]/40 font-serif">
                No Image Available
              </div>
            )}

            {/* Big blinking discount badge */}
            {discountPercent > 0 && (
              <div
                className="absolute top-4 left-4 z-10 flex flex-col items-center justify-center bg-[#8D4D5D] text-white rounded-2xl px-5 py-3 border-2 border-white/80 motion-reduce:!animate-none"
                style={{ animation: "badgeRing 2.4s ease-out infinite" }}
              >
                <span className="text-3xl sm:text-4xl font-serif font-bold leading-none">
                  {discountPercent}%
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold mt-1">
                  OFF
                </span>
                <span className="text-[10px] font-sans mt-1.5 pt-1.5 border-t border-white/40 whitespace-nowrap">
                  Save {formatPKR(savings)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details & Actions */}
        <div className="flex flex-col justify-center px-8 py-12 lg:px-16 lg:col-span-6 bg-[#FAF7F3]">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#514C48]/60 hover:text-[#111] transition font-sans mb-4"
            >
              <FiArrowLeft size={14} /> Back to Catalog
            </Link>
            <span className="block text-xs uppercase tracking-[0.2em] text-[#8D4D5D] font-sans font-semibold mb-2">
              {item.type || "Catalog Item"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#2C2623] mb-4 font-serif leading-tight">
            {item.name}
          </h1>

          {item.description && (
            <p className="text-[#514C48]/80 leading-relaxed text-sm sm:text-base font-sans mb-6 whitespace-pre-line">
              {item.description}
            </p>
          )}

          {/* Price */}
          {(currentPrice || currentCutPrice) && (
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
          )}

          {/* PRODUCT: options & quantity */}
          {itemTypeLower === "product" && (
            <div className="space-y-6 mb-6">
              {item.options && item.options.length > 0 && (
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold mb-2 font-sans">
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
                        {opt.name}{" "}
                        {opt.price !== undefined && opt.price !== null
                          ? `(${formatPKR(opt.price)})`
                          : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#514C48]/70 font-semibold mb-2 font-sans">
                  Quantity
                </label>
                <div className="inline-flex items-center bg-white border border-[#E6DEC9] rounded-2xl p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-[#514C48] hover:text-[#111] transition"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="w-12 text-center font-serif font-medium text-lg text-[#111]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-[#514C48] hover:text-[#111] transition"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border border-[#111] text-[#111] rounded-2xl text-xs uppercase tracking-widest font-semibold hover:bg-[#FAF7F3] transition shadow-xs"
                >
                  <FiShoppingBag size={16} /> Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#111] text-white rounded-2xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition shadow-xs"
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}

          {/* SERVICE button */}
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

          {/* BUNDLE button */}
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

      {/* 2. Dynamic Sections (rendered in the order set in the builder) */}
      {item.sections?.map((sec, idx) => (
        <SectionRenderer
          key={sec.id || idx}
          sec={sec}
          idx={idx}
          item={item}
          fallbackImage={primaryImage}
          services={services}
        />
      ))}
    </main>
  );
}
