"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiExternalLink, FiBox, FiStar, FiX,
  FiUser, FiGrid, FiList, FiChevronLeft, FiChevronRight,
} from "react-icons/fi";

const PAGE_SIZES = [10, 20, 50];

const SORTS = {
  newest: "Newest first",
  name: "Name (A–Z)",
  priceAsc: "Price (low to high)",
  priceDesc: "Price (high to low)",
  reviews: "Most reviews",
};

export default function DashboardItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState("table");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItemReviews, setSelectedItemReviews] = useState(null);

  // Restore saved view after mount (avoids hydration mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("itemsView");
      if (saved === "grid" || saved === "table") setView(saved);
    } catch {}
  }, []);

  const changeView = (v) => {
    setView(v);
    try { localStorage.setItem("itemsView", v); } catch {}
  };

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

  // Back to page 1 whenever the result set changes shape
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedType, sortBy, pageSize]);

  // Close reviews modal with Escape
  useEffect(() => {
    if (!selectedItemReviews) return;
    const onKey = (e) => e.key === "Escape" && setSelectedItemReviews(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedItemReviews]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
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
        setItems((prev) => prev.map((it) => (it._id === itemId ? data.item : it)));
        setSelectedItemReviews(data.item);
      } else {
        alert(data.error || "Failed to delete review.");
      }
    } catch (err) {
      console.error("Delete review error:", err);
    }
  };

  const getName = (item) => item.name || item.hero?.name || "Untitled";
  const getType = (item) => item.type || "Service";
  const getImage = (item) => item.images?.[0]?.url || item.hero?.image;

  const formatPrice = (price) => {
    if (!price && price !== 0) return "—";
    return `PKR ${Number(price).toLocaleString()}`;
  };

  // Type tabs with counts
  const typeCounts = useMemo(() => {
    const counts = {};
    items.forEach((it) => {
      const t = getType(it);
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [items]);

  const displayTypes = ["all", ...Object.keys(typeCounts)];

  // Filter + sort
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = items.filter((item) => {
      const matchesSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.slug?.toLowerCase().includes(q) ||
        item.hero?.name?.toLowerCase().includes(q);
      const matchesType =
        selectedType === "all" || getType(item).toLowerCase() === selectedType.toLowerCase();
      return matchesSearch && matchesType;
    });

    const sorted = [...list];
    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => getName(a).localeCompare(getName(b)));
        break;
      case "priceAsc":
        sorted.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "priceDesc":
        sorted.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "reviews":
        sorted.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
        break;
      default:
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return sorted;
  }, [items, searchQuery, selectedType, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const pageItems = filteredItems.slice(startIdx, startIdx + pageSize);

  const typeBadge = (type) => (
    <span className="inline-block px-2.5 py-0.5 bg-[#FAF7F3] border border-[#E6DEC9] rounded-full text-[10px] font-semibold uppercase tracking-widest text-[#111]">
      {type}
    </span>
  );

  const ActionButtons = ({ item }) => {
    const itemType = getType(item);
    const reviewCount = item.reviews?.length || 0;
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setSelectedItemReviews(item)}
          title="View Reviews"
          className="inline-flex items-center gap-1 px-2.5 py-2 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-xs font-semibold text-[#111] hover:bg-[#111] hover:text-white transition cursor-pointer"
        >
          <FiStar size={13} /> {reviewCount}
        </button>
        <Link
          href={`/${itemType.toLowerCase()}/${item.slug}`}
          target="_blank"
          title="View Public Page"
          className="p-2 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-[#111] hover:bg-[#111] hover:text-white transition"
        >
          <FiExternalLink size={13} />
        </Link>
        <Link
          href={`/dashboard/items/edit/${item._id}`}
          title="Edit Item"
          className="p-2 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-[#111] hover:bg-[#111] hover:text-white transition"
        >
          <FiEdit2 size={13} />
        </Link>
        <button
          onClick={() => handleDelete(item._id)}
          title="Delete Item"
          className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
        >
          <FiTrash2 size={13} />
        </button>
      </div>
    );
  };

  const renderRow = (item) => {
    const img = getImage(item);
    const name = getName(item);
    const type = getType(item);
    const reviewCount = item.reviews?.length || 0;
    const hasCut = Number(item.cutPrice) > 0;

    return (
      <tr key={item._id} className="border-b border-[#E6DEC9]/60 last:border-0 hover:bg-[#FAF7F3]/70 transition">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3 min-w-[220px]">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF7F3] border border-[#E6DEC9] shrink-0 flex items-center justify-center">
              {img ? (
                <img src={img} alt={name} loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <FiBox size={18} className="text-[#514C48]/40" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-serif font-medium text-sm text-[#111] truncate max-w-[260px]" title={name}>
                {name}
              </p>
              <p className="font-mono text-[11px] text-[#514C48]/60 truncate max-w-[260px]">
                /{type.toLowerCase()}/{item.slug}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">{typeBadge(type)}</td>
        <td className="px-4 py-3 whitespace-nowrap">
          <p className="font-serif font-semibold text-sm text-[#111]">{formatPrice(item.price)}</p>
          {hasCut && (
            <p className="text-[11px] text-[#514C48]/50 line-through">{formatPrice(item.cutPrice)}</p>
          )}
        </td>
        <td className="px-4 py-3 hidden md:table-cell text-sm text-[#514C48]">
          {reviewCount > 0 ? `${reviewCount} review${reviewCount === 1 ? "" : "s"}` : "—"}
        </td>
        <td className="px-4 py-3">
          <div className="flex justify-end">
            <ActionButtons item={item} />
          </div>
        </td>
      </tr>
    );
  };

  const renderCard = (item) => {
    const img = getImage(item);
    const name = getName(item);
    const type = getType(item);

    return (
      <div
        key={item._id}
        className="bg-white rounded-2xl border border-[#E6DEC9] p-4 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
      >
        <div>
          <div className="relative h-36 w-full rounded-xl overflow-hidden bg-[#FAF7F3] border border-[#E6DEC9] mb-3">
            {img ? (
              <img
                src={img}
                alt={name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-[#514C48]/40">
                <FiBox size={28} />
              </div>
            )}
            <span className="absolute top-2 right-2">{typeBadge(type)}</span>
          </div>
          <h3 className="font-serif font-medium text-base text-[#111] line-clamp-1" title={name}>
            {name}
          </h3>
          <p className="font-mono text-[11px] text-[#514C48]/60 truncate mb-2">/{type.toLowerCase()}/{item.slug}</p>
          <p className="font-serif font-semibold text-sm text-[#111] mb-3">{formatPrice(item.price)}</p>
        </div>
        <div className="pt-3 border-t border-[#E6DEC9]/60">
          <ActionButtons item={item} />
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#FAF7F3] text-[#514C48] p-4 sm:p-8 lg:p-12 font-sans selection:bg-[#111] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E6DEC9]">
          <div>
            {/* <span className="text-xs uppercase tracking-widest text-[#8D4D5D] font-semibold">Dashboard Management</span> */}
            <h1 className="text-3xl lg:text-4xl font-serif text-[#111] mt-1">
              All Catalog Items
              {!loading && (
                <span className="ml-3 align-middle text-sm font-sans text-[#514C48]/60">{items.length} total</span>
              )}
            </h1>
          </div>
          <Link
            href="/dashboard/items/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#111] text-white rounded-2xl text-xs uppercase tracking-widest hover:bg-[#8D4D5D] transition shadow-xs font-semibold"
          >
            <FiPlus size={16} /> Create New Item
          </Link>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-3xl border border-[#E6DEC9] shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative w-full md:flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#514C48]/50" size={18} />
              <input
                type="text"
                placeholder="Search by item name or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl text-sm text-[#111] focus:outline-none focus:border-[#111] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#514C48]/60 hover:text-[#111] cursor-pointer"
                  aria-label="Clear search"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl text-sm text-[#111] focus:outline-none focus:border-[#111] cursor-pointer"
            >
              {Object.entries(SORTS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <div className="inline-flex p-1 bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl self-start md:self-auto">
              <button
                onClick={() => changeView("table")}
                title="Table view"
                className={`p-2.5 rounded-xl transition cursor-pointer ${view === "table" ? "bg-[#111] text-white" : "text-[#514C48] hover:bg-[#E6DEC9]/40"}`}
              >
                <FiList size={16} />
              </button>
              <button
                onClick={() => changeView("grid")}
                title="Grid view"
                className={`p-2.5 rounded-xl transition cursor-pointer ${view === "grid" ? "bg-[#111] text-white" : "text-[#514C48] hover:bg-[#E6DEC9]/40"}`}
              >
                <FiGrid size={16} />
              </button>
            </div>
          </div>

          {/* Type tabs with counts */}
          <div className="flex items-center gap-2 flex-wrap">
            {displayTypes.map((t) => {
              const count = t === "all" ? items.length : typeCounts[t];
              const active = selectedType.toLowerCase() === t.toLowerCase();
              return (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-semibold transition cursor-pointer ${
                    active
                      ? "bg-[#111] text-white"
                      : "bg-[#FAF7F3] text-[#514C48] border border-[#E6DEC9] hover:bg-[#E6DEC9]/40"
                  }`}
                >
                  {t}
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${active ? "bg-white/20" : "bg-white"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-[#E6DEC9] p-16 text-center font-serif text-[#514C48]/60 shadow-xs">
            Loading catalog items...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E6DEC9] p-16 text-center space-y-3 shadow-xs">
            <FiBox size={36} className="mx-auto text-[#514C48]/40" />
            <p className="font-serif text-lg text-[#111]">No items found</p>
            <p className="text-xs text-[#514C48]/60">Adjust your search or filters, or create a new item.</p>
            {(searchQuery || selectedType !== "all") && (
              <button
                onClick={() => { setSearchQuery(""); setSelectedType("all"); }}
                className="text-xs uppercase tracking-widest text-[#8D4D5D] font-semibold underline cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {view === "table" ? (
              <div className="bg-white rounded-3xl border border-[#E6DEC9] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF7F3] border-b border-[#E6DEC9]">
                      <tr className="text-[11px] uppercase tracking-widest text-[#514C48]/70">
                        <th className="px-4 py-3 font-semibold">Item</th>
                        <th className="px-4 py-3 font-semibold">Type</th>
                        <th className="px-4 py-3 font-semibold">Price</th>
                        <th className="px-4 py-3 font-semibold hidden md:table-cell">Reviews</th>
                        <th className="px-4 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>{pageItems.map(renderRow)}</tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {pageItems.map(renderCard)}
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <p className="text-[#514C48]/70">
                Showing {startIdx + 1}–{Math.min(startIdx + pageSize, filteredItems.length)} of {filteredItems.length}
              </p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-[#514C48]/70">
                  Per page
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="px-2 py-1.5 bg-white border border-[#E6DEC9] rounded-lg text-[#111] cursor-pointer"
                  >
                    {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(safePage - 1)}
                    disabled={safePage <= 1}
                    className="p-2 bg-white border border-[#E6DEC9] rounded-lg disabled:opacity-40 hover:bg-[#E6DEC9]/40 transition cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <FiChevronLeft size={14} />
                  </button>
                  <span className="px-3 text-[#111] font-semibold">{safePage} / {totalPages}</span>
                  <button
                    onClick={() => setPage(safePage + 1)}
                    disabled={safePage >= totalPages}
                    className="p-2 bg-white border border-[#E6DEC9] rounded-lg disabled:opacity-40 hover:bg-[#E6DEC9]/40 transition cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <FiChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Reviews Popup Modal */}
      {selectedItemReviews && (
        <div
          onClick={() => setSelectedItemReviews(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF7F3] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#E6DEC9]"
          >
            <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-[#E6DEC9] shrink-0">
              <div>
                <h2 className="font-serif text-lg text-[#111]">Customer Reviews</h2>
                <p className="text-xs text-[#514C48]/70 truncate max-w-md">{getName(selectedItemReviews)}</p>
              </div>
              <button
                onClick={() => setSelectedItemReviews(null)}
                className="p-2 text-[#514C48] hover:text-[#111] rounded-full hover:bg-[#FAF7F3] transition cursor-pointer"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>

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
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {rev.image ? (
                          <img src={rev.image} alt={rev.name} className="w-9 h-9 rounded-full object-cover border border-[#E6DEC9]" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#FAF7F3] flex items-center justify-center border border-[#E6DEC9] shrink-0">
                            <FiUser size={14} className="text-[#514C48]/50" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-medium text-sm text-[#111] truncate">{rev.name}</h4>
                          <p className="text-[11px] text-[#514C48]/60 truncate">{rev.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex text-amber-500 text-sm">
                          {Array.from({ length: rev.rating || 0 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleDeleteReview(selectedItemReviews._id, rev._id)}
                          title="Delete Review"
                          className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-[#514C48]/90 pl-12 leading-relaxed">{rev.reviewText}</p>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#E6DEC9] flex justify-end shrink-0">
              <button
                onClick={() => setSelectedItemReviews(null)}
                className="px-6 py-2.5 bg-[#111] text-white rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition shadow-xs cursor-pointer"
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