"use client";
import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AboutReviewSection({ aboutId, reviews = [], onReviewAdded }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      signIn("google");
      return;
    }
    if (!reviewText.trim()) {
      setError("Please write something for your review.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/about/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aboutId,
          rating,
          reviewText,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviewText("");
        setSuccessMsg("Thank you! Your review has been added.");
        if (onReviewAdded) onReviewAdded(data.reviews);
      } else {
        setError(data.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-[#FAF7F3] border-t border-[#E6DEC9]">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest font-sans text-[#514C48]/60">
            Testimonials
          </span>
          <h2 className="text-4xl font-serif text-[#111] font-normal">
            Patient Reviews & Experiences
          </h2>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-center text-[#514C48]/70 font-serif italic py-8">
              No reviews yet. Be the first to share your experience!
            </p>
          ) : (
            reviews.map((rev, index) => (
              <div
                key={rev._id || index}
                className="bg-[#F3EDE2]/40 border border-[#E6DEC9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={rev.image || "https://www.dummyimage.com/100x100/f3f3f3/000"}
                      alt={rev.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#E6DEC9]"
                    />
                    <div>
                      <h4 className="font-serif font-medium text-[#111] text-lg">
                        {rev.name}
                      </h4>
                      <span className="text-xs text-[#514C48]/60 font-sans">
                        {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < rev.rating ? <FaStar size={14} /> : <FaRegStar size={14} />}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[#514C48] font-serif leading-relaxed text-sm sm:text-base">
                  {rev.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Submit Review Box */}
        <div className="bg-[#F3EDE2]/60 border border-[#E6DEC9] rounded-3xl p-8 space-y-6">
          <h3 className="text-2xl font-serif text-[#111]">Leave a Review</h3>

          {!session ? (
            <div className="text-center py-6 space-y-4">
              <p className="text-sm font-serif text-[#514C48]">
                Please sign in with your Google account to leave a verified review.
              </p>
              <button
                onClick={() => signIn("google")}
                className="bg-[#111] text-white font-sans text-xs uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-neutral-800 transition"
              >
                Sign In with Google
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-10 h-10 rounded-full border border-[#E6DEC9]"
                  />
                  <div>
                    <p className="text-sm font-serif font-medium text-[#111]">
                      {session.user.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="text-xs text-red-600 hover:underline font-sans"
                    >
                      Sign out
                    </button>
                  </div>
                </div>

                {/* Interactive Star Picker */}
                <div className="flex items-center gap-1 text-amber-500 cursor-pointer">
                  {[...Array(5)].map((_, i) => {
                    const starVal = i + 1;
                    return (
                      <span
                        key={i}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starVal)}
                      >
                        {starVal <= (hoverRating || rating) ? (
                          <FaStar size={18} />
                        ) : (
                          <FaRegStar size={18} />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your feedback or experience..."
                  className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl p-4 text-sm font-serif text-[#111] focus:outline-none focus:border-[#514C48] transition"
                />
              </div>

              {error && <p className="text-xs text-red-600 font-sans">{error}</p>}
              {successMsg && <p className="text-xs text-green-700 font-sans">{successMsg}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#111] hover:bg-neutral-800 text-white font-sans text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Post Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}