"use client";

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function BlogComments({ blogId, initialComments = [] }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reply states
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // Pre-fill name and email from Google session
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          img: session.user.image, // Pass user Google profile image
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to post comment');
      }

      setComments(data.comments || [...comments, data.comment]);
      setMessage('');
      setSuccess('Comment posted successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!session) return;
    setReplyLoading(true);

    try {
      const res = await fetch(`/api/blogs/${blogId}/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
          message: replyMessage,
          img: session.user.image, // Pass user Google profile image
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to post reply');
      }

      setComments((prevComments) =>
        prevComments.map((c) => {
          if (c._id === commentId) {
            return {
              ...c,
              replies: [...(c.replies || []), data.reply || data],
            };
          }
          return c;
        })
      );

      setReplyMessage('');
      setReplyingTo(null);
    } catch (err) {
      alert(err.message || 'Error posting reply');
    } finally {
      setReplyLoading(false);
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

      {/* Conditional Comment Form or Google Sign-In Prompt */}
      {session ? (
        <form onSubmit={handleCommentSubmit} className="bg-[#F3EDE2]/60 border border-[#E6DEC9] p-6 sm:p-8 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-lg font-serif text-[#111]">Leave a Comment</h4>
            <div className="flex items-center gap-3">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span className="text-xs text-[#7A5C58] font-sans">
                Signed in as {session.user.email}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-xs text-rose-600 hover:underline font-sans cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
          
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
              <label className="block text-xs font-sans uppercase tracking-wider text-[#514C48]/70 mb-1">Email (Non-editable)</label>
              <input
                type="email"
                required
                value={email}
                readOnly
                disabled
                className="w-full bg-gray-100 border border-[#E6DEC9] rounded-xl px-4 py-3 text-sm text-[#514C48]/75 cursor-not-allowed select-none"
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
            className="px-6 py-3 bg-[#111] text-[#FAF7F3] rounded-xl text-sm font-sans tracking-wide hover:bg-[#333] transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="bg-[#F3EDE2]/60 border border-[#E6DEC9] p-6 sm:p-8 rounded-2xl text-center space-y-4 shadow-sm">
          <p className="text-sm font-serif text-[#111]">
            Please sign in with Google to post a comment.
          </p>
          <button
            type="button"
            onClick={() => signIn('google')}
            className="inline-flex items-center justify-center gap-3 bg-white hover:bg-[#F8F9FA] text-[#1F1F1F] border border-[#DADCE0] hover:shadow-md px-6 py-3 rounded-xl text-xs sm:text-sm font-sans font-medium transition-all duration-200 cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
              <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.69 6.62z" />
              <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" />
              <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.07-1.94-4.78-3.13-8.02-3.13-4.67 0-8.72 2.7-10.69 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      )}

      {/* Display Comments List */}
      <div className="space-y-4">
        {comments.filter(c => c.status === 'Active').length === 0 ? (
          <p className="text-sm font-light text-[#514C48]/70 italic">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments
            .filter((c) => c.status === 'Active')
            .map((comment, idx) => {
              const commentId = comment._id || idx;
              const isReplying = replyingTo === commentId;

              return (
                <div key={commentId} className="bg-white border border-[#E6DEC9] p-6 rounded-2xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {comment.img ? (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#E6DEC9] shrink-0">
                          <Image
                            src={comment.img}
                            alt={comment.name || 'User'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#F3EDE2] border border-[#E6DEC9] flex items-center justify-center text-xs font-serif font-medium text-[#111] shrink-0">
                          {comment.name ? comment.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <h5 className="text-sm font-serif font-medium text-[#111]">{comment.name}</h5>
                        <span className="text-[10px] font-sans text-[#514C48]/60">{formatDate(comment.postedAt)}</span>
                      </div>
                    </div>

                    {/* Reply Toggle Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!session) {
                          signIn('google');
                          return;
                        }
                        setReplyingTo(isReplying ? null : commentId);
                        setReplyMessage('');
                      }}
                      className="text-xs font-sans text-[#514C48] hover:text-[#111] underline cursor-pointer"
                    >
                      {isReplying ? 'Cancel' : 'Reply'}
                    </button>
                  </div>

                  <p className="text-sm font-light text-[#514C48]/90 pl-12 leading-relaxed">
                    {comment.message}
                  </p>

                  {/* Inline Reply Form */}
                  {isReplying && session && (
                    <form
                      onSubmit={(e) => handleReplySubmit(e, comment._id)}
                      className="pl-12 mt-3 space-y-3 pt-3 border-t border-[#FAF7F3]"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#7A5C58]">
                        <span>Replying as <strong>{session.user.name}</strong> ({session.user.email})</span>
                      </div>
                      <textarea
                        required
                        rows={2}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs text-[#111] focus:outline-none focus:border-[#111] transition resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          disabled={replyLoading}
                          className="px-4 py-2 bg-[#111] text-[#FAF7F3] rounded-lg text-xs font-sans tracking-wide hover:bg-[#333] transition disabled:opacity-50 cursor-pointer"
                        >
                          {replyLoading ? 'Sending...' : 'Post Reply'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Nested Replies Rendering */}
                  {comment.replies && comment.replies.filter(r => r.status === 'Active').length > 0 && (
                    <div className="pl-12 mt-4 space-y-3 pt-3 border-t border-[#FAF7F3]">
                      {comment.replies
                        .filter((r) => r.status === 'Active')
                        .map((reply, rIdx) => (
                          <div key={reply._id || rIdx} className="bg-[#FAF7F3] p-4 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {reply.img ? (
                                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#E6DEC9] shrink-0">
                                    <Image
                                      src={reply.img}
                                      alt={reply.name || 'User'}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-white border border-[#E6DEC9] flex items-center justify-center text-[10px] font-serif font-medium text-[#111] shrink-0">
                                    {reply.name ? reply.name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                )}
                                <span className="text-xs font-serif font-medium text-[#111]">{reply.name}</span>
                              </div>
                              <span className="text-[10px] font-sans text-[#514C48]/60">{formatDate(reply.postedAt)}</span>
                            </div>
                            <p className="text-xs font-light text-[#514C48]/90 pl-8">{reply.message}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>
    </section>
  );
}