'use client';
import { useState, useEffect, useRef } from 'react';

export default function BlogViewTracker({ blogId, initialViews }) {
  const [views, setViews] = useState(initialViews || 0);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent double-fetching in React Strict Mode (development)
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Optional: Prevent counting the same page reload session repeatedly
    const viewedKey = `viewed_${blogId}`;
    if (sessionStorage.getItem(viewedKey)) {
      return; // Already counted for this browser session
    }

    const incrementView = async () => {
      try {
        const res = await fetch(`/api/blogs/${blogId}/views`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.views !== undefined) {
            setViews(data.views);
            sessionStorage.setItem(viewedKey, 'true'); // Mark as viewed this session
          }
        }
      } catch (err) {
        console.error("Failed to increment views:", err);
      }
    };

    if (blogId) {
      incrementView();
    }
  }, [blogId]);

  return <span>{views} Views</span>;
}