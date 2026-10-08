"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { FiStar, FiUser, FiSend } from "react-icons/fi";

export default function ProductReviews({ itemId, initialReviews = [] }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!session) return;
    if (!reviewText.trim()) {
      setError("Please write something for your review.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/items/${itemId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          reviewText,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setReviewText("");
        setRating(5);
      } else {
        setError(data.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-6 lg:px-32 bg-[#FAF7F3] border-t border-[#E6DEC9] font-sans">
      <div className="max-w-4xl mx-auto space-y-10">        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-serif text-[#111]">Customer Reviews</h2>
            <p className="text-sm text-[#514C48]/70 mt-1">
              {reviews.length} review{reviews.length === 1 ? "" : "s"} for this item
            </p>
          </div>
        </div>
        {/* Review Submission Form / Prompt */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6DEC9] shadow-2xs">
          {session ? (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E6DEC9]"
                />
                <div>
                  <h4 className="font-medium text-sm text-[#111]">{session.user.name}</h4>
                  <p className="text-xs text-[#514C48]/60">Posting via Google account</p>
                </div>
              </div>

              {/* Star Rating Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#514C48]/70 font-semibold">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-lg transition ${star <= rating ? "text-amber-500" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this item..."
                className="w-full p-4 bg-[#FAF7F3] text-[#514C48] border border-[#E6DEC9] rounded-2xl text-sm focus:outline-none focus:border-[#E6DEC9]"
              />

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#111] text-white rounded-2xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition shadow-xs"
                >
                  <FiSend size={14} /> {submitting ? "Submitting..." : "Post Review"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-sm text-[#514C48]">Please sign in with your Google account to leave a review.</p>
              <button
                onClick={() => signIn("google")}
                className="px-6 py-3 bg-[#111] text-white rounded-2xl text-xs uppercase tracking-widest font-semibold hover:bg-[#8D4D5D] transition shadow-xs"
              >
                Sign In with Google
              </button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-center py-10 text-sm text-[#514C48]/60 font-serif italic">
              No reviews yet. Be the first to review this item!
            </p>
          ) : (
            reviews.map((rev, idx) => (
              <div key={rev._id || idx} className="bg-white p-6 rounded-3xl border border-[#E6DEC9] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {rev.image ? (
                      <img src={rev.image} alt={rev.name} className="w-10 h-10 rounded-full object-cover border border-[#E6DEC9]" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#FAF7F3] flex items-center justify-center border border-[#E6DEC9]">
                        <FiUser size={16} className="text-[#514C48]/50" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif font-medium text-sm text-[#111]">{rev.name}</h4>
                      <p className="text-[11px] text-[#514C48]/50">
                        {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-amber-500 text-sm">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#514C48]/90 font-sans leading-relaxed pl-13">
                  {rev.reviewText}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}