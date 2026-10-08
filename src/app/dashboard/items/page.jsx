"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiExternalLink, FiBox, FiStar, FiX, FiUser } from "react-icons/fi";

export default function DashboardItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedItemReviews, setSelectedItemReviews] = useState(null); // Modal state

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/items");
        if (res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data) ? data : data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard items:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete item.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleDeleteReview = async (itemId, reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/items/${itemId}/reviews/${reviewId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update local items state and modal view state
        setItems((prev) =>
          prev.map((it) => (it._id === itemId ? data.item : it))
        );
        setSelectedItemReviews(data.item);
      } else {
        alert(data.error || "Failed to delete review.");
      }
    } catch (err) {
      console.error("Delete review error:", err);
    }
  };

  // Filter items based on search query and type
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.hero?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || item.type?.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const uniqueTypes = Array.from(new Set(items.map((item) => item.type).filter(Boolean)));
  const displayTypes = ["all", ...(uniqueTypes.length > 0 ? uniqueTypes : ["Service", "Product", "Bundle"])];

  const groupedItems = filteredItems.reduce((acc, item) => {
    const type = item.type || "Service";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  const formatPrice = (price) => {
    if (!price && price !== 0) return "—";
    return `PKR ${Number(price).toLocaleString()}`;
  };

  const renderCard = (item) => {
    const primaryImage = item.images?.[0]?.url || item.hero?.image;
    const itemName = item.name || item.hero?.name;
    const itemType = item.type || "Service";
    const reviewCount = item.reviews?.length || 0;

    return (
      <div 
        key={item._id} 
        className="bg-white rounded-3xl border border-[#E6DEC9] p-6 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
      >
        <div>
          <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#FAF7F3] border border-[#E6DEC9] mb-4">
            {primaryImage ? (
              <img 
                src={primaryImage} 
                alt={itemName} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-[#514C48]/40">
                <FiBox size={32} />
              </div>
            )}
            <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-xs border border-[#E6DEC9] rounded-full text-[10px] font-semibold uppercase tracking-widest text-[#111] shadow-xs">
              {itemType}
            </span>
          </div>

          <h3 className="font-serif font-medium text-lg text-[#111] line-clamp-1 mb-1" title={itemName}>
            {itemName}
          </h3>
          
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="font-serif font-semibold text-[#111]">
              {formatPrice(item.price)}
            </span>
            <span className="font-mono text-xs text-[#514C48]/70 bg-[#FAF7F3] px-2.5 py-1 rounded-xl border border-[#E6DEC9]/60 truncate max-w-[160px]">
              /{itemType.toLowerCase()}/{item.slug}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#E6DEC9]/60 flex items-center justify-between gap-1 flex-wrap">
          <button
            onClick={() => setSelectedItemReviews(item)}
            title="View Reviews"
            className="inline-flex items-center gap-1 px-3 py-2 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-xs font-semibold text-[#111] hover:bg-[#111] hover:text-white transition"
          >
            <FiStar size={13} /> Reviews ({reviewCount})
          </button>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/${itemType.toLowerCase()}/${item.slug}`}
              target="_blank"
              title="View Public Page"
              className="p-2 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-xs font-semibold text-[#111] hover:bg-[#111] hover:text-white transition"
            >
              <FiExternalLink size={13} />
            </Link>
            <Link
              href={`/dashboard/items/edit/${item._id}`}
              title="Edit Item"
              className="p-2 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-xs font-semibold text-[#111] hover:bg-[#111] hover:text-white transition"
            >
              <FiEdit2 size={13} />
            </Link>
            <button
              onClick={() => handleDelete(item._id)}
              title="Delete Item"
              className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition"
            >
              <FiTrash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#FAF7F3] text-[#514C48] p-6 sm:p-10 lg:p-16 font-sans selection:bg-[#111] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E6DEC9]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8D4D5D] font-semibold">Dashboard Management</span>
            <h1 className="text-3xl lg:text-4xl font-serif text-[#111] mt-1">All Catalog Items</h1>
          </div>
          <Link
            href="/dashboard/items/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#111] text-white rounded-2xl text-xs uppercase tracking-widest hover:bg-[#8D4D5D] transition shadow-xs font-semibold"
          >
            <FiPlus size={16} /> Create New Item
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-3xl border border-[#E6DEC9] shadow-2xs">
          <div className="relative w-full md:flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#514C48]/50" size={18} />
            <input
              type="text"
              placeholder="Search by item name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl text-sm text-[#111] focus:outline-none focus:border-[#111] transition"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {displayTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition ${
                  selectedType.toLowerCase() === t.toLowerCase()
                    ? "bg-[#111] text-white" 
                    : "bg-[#FAF7F3] text-[#514C48] border border-[#E6DEC9] hover:bg-[#E6DEC9]/40"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Display */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-[#E6DEC9] p-16 text-center font-serif text-[#514C48]/60 shadow-xs">
            Loading catalog items...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E6DEC9] p-16 text-center space-y-3 shadow-xs">
            <FiBox size={36} className="mx-auto text-[#514C48]/40" />
            <p className="font-serif text-lg text-[#111]">No items found</p>
            <p className="text-xs text-[#514C48]/60">Get started by creating your first catalog item or adjusting your filters.</p>
          </div>
        ) : selectedType === "all" ? (
          <div className="space-y-12">
            {Object.entries(groupedItems).map(([type, typeItems]) => (
              <div key={type} className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b border-[#E6DEC9]">
                  <h2 className="text-xl font-serif text-[#111] capitalize">{type}s</h2>
                  <span className="px-3 py-0.5 bg-white border border-[#E6DEC9] rounded-full text-[10px] font-semibold text-[#514C48]">
                    {typeItems.length} {typeItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {typeItems.map((item) => renderCard(item))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => renderCard(item))}
          </div>
        )}

      </div>

      {/* Reviews Popup Modal */}
      {selectedItemReviews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
          <div className="bg-[#FAF7F3] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#E6DEC9]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-[#E6DEC9] shrink-0">
              <div>
                <h2 className="font-serif text-lg text-[#111]">Customer Reviews</h2>
                <p className="text-xs text-[#514C48]/70 truncate max-w-md">{selectedItemReviews.name}</p>
              </div>
              <button
                onClick={() => setSelectedItemReviews(null)}
                className="p-2 text-[#514C48] hover:text-[#111] rounded-full hover:bg-[#FAF7F3] transition"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!selectedItemReviews.reviews || selectedItemReviews.reviews.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <FiStar size={32} className="mx-auto text-[#514C48]/30" />
                  <p className="font-serif text-base text-[#111]">No reviews for this item yet</p>
                  <p className="text-xs text-[#514C48]/60">Reviews submitted by customers will appear here.</p>
                </div>
              ) : (
                selectedItemReviews.reviews.map((rev) => (
                  <div key={rev._id} className="bg-white p-5 rounded-2xl border border-[#E6DEC9] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {rev.image ? (
                          <img src={rev.image} alt={rev.name} className="w-9 h-9 rounded-full object-cover border border-[#E6DEC9]" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#FAF7F3] flex items-center justify-center border border-[#E6DEC9]">
                            <FiUser size={14} className="text-[#514C48]/50" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-sm text-[#111]">{rev.name}</h4>
                          <p className="text-[11px] text-[#514C48]/60">{rev.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex text-amber-500 text-sm">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleDeleteReview(selectedItemReviews._id, rev._id)}
                          title="Delete Review"
                          className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-[#514C48]/90 pl-12 leading-relaxed">
                      {rev.reviewText}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white border-t border-[#E6DEC9] flex justify-end shrink-0">
              <button
                onClick={() => setSelectedItemReviews(null)}
                className="px-6 py-2.5 bg-[#111] text-white rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition shadow-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}