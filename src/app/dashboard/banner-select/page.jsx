'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiCheck, FiRefreshCw, FiTrash2, FiImage } from 'react-icons/fi';

export default function BannerSelectPage() {
  const [bundles, setBundles] = useState([]);
  const [activeBannerImage, setActiveBannerImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Load available bundles and current active banner image on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // Fetch bundles from api/bundles
      const bundleRes = await fetch('/api/bundles');
      const bundleData = await bundleRes.json();

      if (bundleRes.ok && bundleData.success) {
        setBundles(bundleData.bundles || bundleData.data || []);
      }

      // Fetch active banner image setting
      const settingRes = await fetch('/api/banner-setting');
      const settingData = await settingRes.json();

      if (settingRes.ok && settingData.success) {
        setActiveBannerImage(settingData.imageUrl || null);
      }
    } catch (error) {
      console.error('Error loading banner management data:', error);
      setMessage({ type: 'error', text: 'Failed to load bundles or banner settings.' });
    } finally {
      setLoading(false);
    }
  };

  // 2. Function to select a bundle image and save it as active banner
  const handleSelectBundle = async (imageUrl) => {
    if (!imageUrl) return;
    setUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/banner-setting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActiveBannerImage(imageUrl);
        setMessage({ type: 'success', text: 'Appointment banner image updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update banner image.' });
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred while saving.' });
    } finally {
      setUpdating(false);
    }
  };

  // 3. Function to clear/remove the active banner image
  const handleClearBanner = async () => {
    setUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/banner-setting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: '' }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setActiveBannerImage(null);
        setMessage({ type: 'success', text: 'Banner image removed.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to clear banner image.' });
      }
    } catch (error) {
      console.error('Error clearing banner:', error);
      setMessage({ type: 'error', text: 'An error occurred while removing the banner.' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-10 space-y-8 text-[#514C48]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6DEC9] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#111] font-normal">
            Appointment Banner Offer Manager
          </h1>
          <p className="text-sm font-serif text-[#514C48]/80 mt-1">
            Select a bundle from your offerings to display its image at the top of the appointment popup.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading || updating}
          className="self-start md:self-auto flex items-center gap-2 bg-[#FAF7F3] border border-[#E6DEC9] hover:bg-[#F3EDE2] text-[#111] px-4 py-2 rounded-xl text-xs font-sans font-medium transition"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh Bundles
        </button>
      </div>

      {/* Alert Messages */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-sans font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Currently Selected Active Banner Preview */}
      <div className="bg-[#FAF7F3] border border-[#E6DEC9] rounded-[24px] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#111] font-serif font-medium">
            <FiImage size={18} />
            <span>Currently Active Banner Image</span>
          </div>
          {activeBannerImage && (
            <button
              onClick={handleClearBanner}
              disabled={updating}
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 transition font-sans"
            >
              <FiTrash2 size={14} />
              Remove Image
            </button>
          )}
        </div>

        {activeBannerImage ? (
          <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-[#2A2625] border border-[#E6DEC9]">
            <Image
              src={activeBannerImage}
              alt="Active Banner Preview"
              fill
              className="object-cover object-center"
            />
          </div>
        ) : (
          <div className="w-full h-32 rounded-2xl border-2 border-dashed border-[#E6DEC9] flex flex-col items-center justify-center text-xs font-serif text-[#514C48]/60 bg-white/50">
            No active banner image set. Select a bundle below.
          </div>
        )}
      </div>

      {/* Bundles Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif text-[#111]">Select From Available Bundles</h2>

        {loading ? (
          <div className="py-12 text-center text-sm font-serif text-[#514C48]/70">
            Loading bundle offerings...
          </div>
        ) : bundles.length === 0 ? (
          <div className="py-12 text-center text-sm font-serif text-[#514C48]/70 bg-[#FAF7F3] rounded-2xl border border-[#E6DEC9]">
            No bundles found in your database.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle, idx) => {
              // Extract bundle image and title (handles different schema structures)
              const imageUrl = bundle.image || bundle.hero?.image || bundle.imageUrl;
              const title = bundle.title || bundle.name || bundle.hero?.name || `Bundle #${idx + 1}`;
              const isSelected = activeBannerImage && activeBannerImage === imageUrl;

              return (
                <div
                  key={bundle._id || idx}
                  className={`bg-[#FAF7F3] border rounded-[24px] overflow-hidden flex flex-col justify-between transition-all shadow-sm hover:shadow-md ${
                    isSelected ? 'border-[#111] ring-2 ring-[#111]' : 'border-[#E6DEC9]'
                  }`}
                >
                  <div>
                    {/* Bundle Image */}
                    <div className="relative w-full h-40 bg-[#2A2625]">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={title}
                          fill
                          className="object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-white/50 font-serif">
                          No Image Available
                        </div>
                      )}
                    </div>

                    {/* Bundle Details */}
                    <div className="p-5 space-y-1">
                      <h3 className="font-serif font-medium text-[#111] text-base truncate">
                        {title}
                      </h3>
                      {bundle.description && (
                        <p className="text-xs font-serif text-[#514C48]/80 line-clamp-2">
                          {bundle.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Select Action Button */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleSelectBundle(imageUrl)}
                      disabled={updating || !imageUrl || isSelected}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-sans font-medium transition flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-[#111] hover:bg-[#333] text-[#FAF7F3]'
                      } disabled:opacity-50`}
                    >
                      {isSelected ? (
                        <>
                          <FiCheck size={14} />
                          Active Banner
                        </>
                      ) : (
                        'Set as Active Banner'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}