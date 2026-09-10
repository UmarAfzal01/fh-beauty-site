"use client";

import { useState } from 'react';

export default function BlogComments({ blogId, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to post comment');
      }

      setComments(data.comments);
      setMessage('');
      setName('');
      setEmail('');
      setSuccess('Comment posted successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Just now';
    }
  };

  return (
    <section className="pt-12 border-t border-[#E6DEC9] space-y-8 mt-12">
      <h3 className="text-2xl font-serif font-normal text-[#111]">
        Comments ({comments.filter(c => c.status === 'Active').length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="bg-[#F3EDE2]/60 border border-[#E6DEC9] p-6 sm:p-8 rounded-2xl space-y-4 shadow-sm">
        <h4 className="text-lg font-serif text-[#111]">Leave a Comment</h4>
        
        {error && <p className="text-xs text-rose-600 font-sans">{error}</p>}
        {success && <p className="text-xs text-emerald-600 font-sans">{success}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-[#514C48]/70 mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-white border border-[#E6DEC9] rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-[#514C48]/70 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white border border-[#E6DEC9] rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-sans uppercase tracking-wider text-[#514C48]/70 mb-1">Message</label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-white border border-[#E6DEC9] rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#111] text-[#FAF7F3] rounded-xl text-sm font-sans tracking-wide hover:bg-[#333] transition disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Display Comments List */}
      <div className="space-y-4">
        {comments.filter(c => c.status === 'Active').length === 0 ? (
          <p className="text-sm font-light text-[#514C48]/70 italic">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments
            .filter((c) => c.status === 'Active')
            .map((comment, idx) => (
              <div key={comment._id || idx} className="bg-white border border-[#E6DEC9] p-6 rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#F3EDE2] border border-[#E6DEC9] flex items-center justify-center text-xs font-serif font-medium text-[#111]">
                      {comment.name ? comment.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h5 className="text-sm font-serif font-medium text-[#111]">{comment.name}</h5>
                      <span className="text-[10px] font-sans text-[#514C48]/60">{formatDate(comment.postedAt)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-light text-[#514C48]/90 pl-12 leading-relaxed">
                  {comment.message}
                </p>

                {/* Nested Replies Rendering */}
                {comment.replies && comment.replies.filter(r => r.status === 'Active').length > 0 && (
                  <div className="pl-12 mt-4 space-y-3 pt-3 border-t border-[#FAF7F3]">
                    {comment.replies
                      .filter((r) => r.status === 'Active')
                      .map((reply, rIdx) => (
                        <div key={reply._id || rIdx} className="bg-[#FAF7F3] p-4 rounded-xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-serif font-medium text-[#111]">{reply.name}</span>
                            <span className="text-[10px] font-sans text-[#514C48]/60">{formatDate(reply.postedAt)}</span>
                          </div>
                          <p className="text-xs font-light text-[#514C48]/90">{reply.message}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </section>
  );
}