"use client";
import React, { useState } from "react";
import { FiPlay, FiExternalLink, FiVideo } from "react-icons/fi";

const parseVideoUrl = (urlStr) => {
  if (!urlStr) return { type: "unknown", embedUrl: urlStr, thumbnail: null };

  // 1. YouTube Parser
  const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const ytMatch = urlStr.match(youtubeRegex);
  if (ytMatch && ytMatch[2].length === 11) {
    const videoId = ytMatch[2];
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // 2. Instagram Reels / Posts Parser
  if (urlStr.includes("instagram.com")) {
    const cleanUrl = urlStr.split("?")[0]; // remove query params
    const isReel = cleanUrl.includes("/reel/");
    const isPost = cleanUrl.includes("/p/");
    
    if (isReel || isPost) {
      const parts = cleanUrl.split("/");
      const idIndex = parts.indexOf(isReel ? "reel" : "p") + 1;
      const mediaId = parts[idIndex];

      if (mediaId) {
        return {
          type: "instagram",
          embedUrl: `https://www.instagram.com/${isReel ? "reel" : "p"}/${mediaId}/embed/`,
          platform: "Instagram",
        };
      }
    }
  }

  // 3. TikTok Parser
  if (urlStr.includes("tiktok.com")) {
    const match = urlStr.match(/\/video\/(\d+)/);
    if (match && match[1]) {
      const videoId = match[1];
      return {
        type: "tiktok",
        embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
        platform: "TikTok",
      };
    }
  }

  // 4. Vimeo Parser
  if (urlStr.includes("vimeo.com")) {
    const vimeoId = urlStr.split("/").pop();
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
    };
  }

  // 5. Direct Video Files (.mp4, .webm, .mov)
  if (urlStr.match(/\.(mp4|webm|mov|ogg)($|\?)/i)) {
    return {
      type: "direct",
      embedUrl: urlStr,
    };
  }

  // 6. Fallback for other links
  let platformName = "Video";
  if (urlStr.includes("facebook.com") || urlStr.includes("fb.watch")) platformName = "Facebook";
  else if (urlStr.includes("twitter.com") || urlStr.includes("x.com")) platformName = "X (Twitter)";

  return {
    type: "social",
    embedUrl: urlStr,
    platform: platformName,
  };
};

export default function VideoRenderer({ url, index }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoInfo = parseVideoUrl(url);

  // YouTube Player with Thumbnail Preview
  if (videoInfo.type === "youtube") {
    return (
      <div
        key={index}
        className="my-8 aspect-video w-full rounded-3xl overflow-hidden shadow-md border border-[#E6DEC9] bg-[#111] relative group"
      >
        {!isPlaying && videoInfo.thumbnail ? (
          <div
            className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black"
            onClick={() => setIsPlaying(true)}
          >
            <img
              src={videoInfo.thumbnail}
              alt="YouTube Video Thumbnail"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-95"
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/95 backdrop-blur-md text-[#111] flex items-center justify-center shadow-xl transform group-hover:scale-110 transition">
                <FiPlay size={24} className="ml-0.5 text-[#111]" />
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={videoInfo.embedUrl}
            title="YouTube video player"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    );
  }

  // Instagram Reel / Post Embed (Optimized vertical container for Reels)
  if (videoInfo.type === "instagram") {
    return (
      <div
        key={index}
        className="my-8 w-full max-w-md mx-auto aspect-[9/16] sm:h-[580px] rounded-3xl overflow-hidden shadow-md border border-[#E6DEC9] bg-white flex justify-center"
      >
        <iframe
          src={videoInfo.embedUrl}
          title="Instagram Embed"
          className="w-full h-full border-0 overflow-hidden"
          allowTransparency="true"
          allow="encrypted-media"
        />
      </div>
    );
  }

  // TikTok Embed
  if (videoInfo.type === "tiktok") {
    return (
      <div
        key={index}
        className="my-8 w-full max-w-md mx-auto h-[580px] rounded-3xl overflow-hidden shadow-md border border-[#E6DEC9] bg-white flex justify-center"
      >
        <iframe
          src={videoInfo.embedUrl}
          title="TikTok Embed"
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    );
  }

  // Direct Video Files (.mp4, etc.)
  if (videoInfo.type === "direct") {
    return (
      <div
        key={index}
        className="my-8 aspect-video w-full rounded-3xl overflow-hidden shadow-md border border-[#E6DEC9] bg-black"
      >
        <video controls className="w-full h-full object-cover" src={videoInfo.embedUrl} />
      </div>
    );
  }

  // Vimeo Embed
  if (videoInfo.type === "vimeo") {
    return (
      <div
        key={index}
        className="my-8 aspect-video w-full rounded-3xl overflow-hidden shadow-md border border-[#E6DEC9] bg-black"
      >
        <iframe
          src={videoInfo.embedUrl}
          title="Vimeo video player"
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Fallback card for unsupported links
  return (
    <div
      key={index}
      className="my-8 p-6 bg-white border border-[#E6DEC9] rounded-3xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF7F3] border border-[#E6DEC9] flex items-center justify-center text-[#111] shrink-0">
          <FiVideo size={22} className="text-[#514C48]" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-sans tracking-widest text-[#8D4D5D] font-semibold">
            {videoInfo.platform} Media Link
          </span>
          <h4 className="font-serif text-base text-[#111] truncate max-w-xs sm:max-w-md">
            Watch on {videoInfo.platform}
          </h4>
          <p className="text-xs text-[#514C48]/60 truncate max-w-xs sm:max-w-sm font-mono">
            {url}
          </p>
        </div>
      </div>
      <a
        href={videoInfo.embedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto px-6 py-3.5 bg-[#111] hover:bg-[#8D4D5D] text-white rounded-xl text-xs uppercase tracking-widest font-semibold transition shadow-xs shrink-0 flex items-center justify-center gap-2"
      >
        Open Link <FiExternalLink size={14} />
      </a>
    </div>
  );
}