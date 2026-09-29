'use client';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function ReviewSection({ serviceSlug, initialReviews }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please sign in with Google to submit a review');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please write a review text');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/services/${serviceSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          reviewText,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Review added successfully!');
        setReviews(data.reviews);
        setReviewText('');
        setRating(5);
      } else {
        toast.error(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    } finally {
      setSubmitting(false);
    }
  };

  // Google Sign-In with callback URL directing back precisely to this section anchor
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: `${window.location.pathname}#reviews` });
  };

  return (
    <section id="reviews" className="py-24 px-6 lg:px-32 bg-white text-center scroll-mt-12">
      <h2 className="text-3xl font-normal text-[#2C2623] mb-12">Success Stories & Reviews</h2>
      
      {/* Existing Reviews Grid */}
      {reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-[#FAF7F3] p-8 rounded-2xl border border-[#EBE4DE] text-left flex flex-col justify-between shadow-sm">
              <div>
                <div className="text-amber-400 text-sm mb-3">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <p className="text-[#514C48] italic text-sm mb-6 font-sans">&ldquo;{review.reviewText}&rdquo;</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-[#EBE4DE]">
                {review.image && (
                  <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                )}
                <div>
                  <h4 className="font-medium text-sm text-[#2C2623]">{review.name}</h4>
                  <span className="text-xs text-[#514C48]/60 font-sans">Verified Patient</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#514C48]/60 font-sans mb-16">No reviews submitted yet for this service. Be the first!</p>
      )}

      {/* Review Submission Form Container */}
      <div className="max-w-xl mx-auto bg-[#FAF7F3] p-8 rounded-3xl border border-[#EBE4DE] text-left shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-[#EBE4DE] pb-4">
          <h3 className="text-xl font-normal text-[#2C2623]">Leave Your Review</h3>
          {session && (
            <button
              onClick={() => signOut()}
              className="text-xs text-red-600 hover:text-red-800 font-sans font-medium transition underline"
            >
              Sign Out
            </button>
          )}
        </div>
        
        {session ? (
          <form onSubmit={handleReviewSubmit} className="space-y-5">
            <div className="flex items-center gap-3">
              <img src={session.user.image} alt={session.user.name} className="w-10 h-10 rounded-full object-cover border border-[#EBE4DE]" />
              <div>
                <p className="text-sm font-medium text-[#2C2623]">{session.user.name}</p>
                <p className="text-xs text-[#514C48]/60">{session.user.email}</p>
              </div>
            </div>

            {/* Interactive Star Selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-sans text-[#514C48]/70 mb-2">Select Rating</label>
              <div className="flex gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`transition-transform hover:scale-110 focus:outline-none ${star <= rating ? 'text-amber-400' : 'text-stone-300'}`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-xs font-sans text-[#514C48]/60 self-center ml-2">({rating}/5)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-sans text-[#514C48]/70 mb-1">Your Review</label>
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this treatment..."
                required
                className="w-full bg-white border border-[#EBE4DE] rounded-xl p-4 text-sm font-sans focus:outline-none focus:border-[#2C2623] resize-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#2C2623] hover:bg-[#8D4D5D] text-white py-4 rounded-xl text-xs uppercase tracking-widest font-sans transition-colors shadow-sm"
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-[#514C48]/80 mb-5 font-sans">You must be logged in with Google to post a review.</p>
            <button
              onClick={handleGoogleSignIn}
              className="bg-white border border-[#EBE4DE] hover:bg-stone-50 text-[#2C2623] px-6 py-3.5 rounded-xl text-sm font-sans font-medium transition shadow-sm inline-flex items-center gap-2"
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </section>
  );
}