"use client";

import { useState, useEffect } from "react";
import { FiCalendar, FiX, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AppointmentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Check if user already dismissed it
    const isDismissed = localStorage.getItem("appointment_modal_dismissed");
    if (!isDismissed) {
      setIsVisible(true);
    }

    // 2. Fetch the selected banner image from the API
    const fetchBannerImage = async () => {
      try {
        const res = await fetch("/api/banner-setting");
        const data = await res.json();
        if (data.success && data.imageUrl) {
          setBannerImage(data.imageUrl);
        }
      } catch (err) {
        console.error("Failed to load banner image", err);
      }
    };

    fetchBannerImage();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("appointment_modal_dismissed", "true");
  };

  const handleBookNow = () => {
    setIsVisible(false);
    localStorage.setItem("appointment_modal_dismissed", "true");
    router.push("/appointment");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      {/* Centered Large Card */}
      <div className="bg-[#FAF7F3] border border-[#E6DEC9] max-w-lg w-full rounded-[32px] shadow-2xl relative text-[#514C48] animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Top Image Preview (If available from selected bundle) */}
        {bannerImage && (
          <div className="relative w-full h-70 sm:h-83 bg-[#2A2625]">
            <Image
              src={bannerImage}
              alt="Special Offer Bundle"
              fill
              className="object-cover object-center"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F3] via-transparent to-black/30" /> */}
          </div>
        )}

        {/* Content Container */}
        <div
          className={`p-8 sm:p-10 ${bannerImage ? "pt-4" : "pt-10"} space-y-6 relative`}
        >
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/80 hover:bg-white text-[#111] shadow-sm transition z-10"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>

          {!bannerImage && (
            <div className="w-14 h-14 rounded-2xl bg-[#111] text-[#FAF7F3] flex items-center justify-center shadow-md">
              <FiCalendar size={26} />
            </div>
          )}

          {/* Title & Description */}
          <div className="space-y-2">
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#514C48]/70 block">
              Exclusive Special Offer
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#111] font-normal">
              Book Your Appointment Today
            </h3>
            <p className="text-sm font-serif text-[#514C48]/80 leading-relaxed pt-1">
              Secure your slot for our featured treatment bundle and experience
              premium medical care with our experts.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleBookNow}
              className="w-full bg-[#111] hover:bg-[#333] text-[#FAF7F3] py-3.5 px-6 rounded-2xl font-sans text-xs sm:text-sm font-medium transition shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Booking</span>
              <FiArrowRight
                className="transition-transform group-hover:translate-x-1"
                size={16}
              />
            </button>

            <button
              onClick={handleDismiss}
              className="w-full sm:w-auto bg-[#F3EDE2] hover:bg-[#E6DEC9] text-[#111] py-3.5 px-6 rounded-2xl font-sans text-xs sm:text-sm font-medium border border-[#E6DEC9] transition"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
