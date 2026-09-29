"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export default function Header() {
  const [services, setServices] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  // Fetch services for the dropdown and mobile drawer list
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (Array.isArray(data)) {
          setServices(data);
        } else if (data.services && Array.isArray(data.services)) {
          setServices(data.services);
        }
      } catch (err) {
        console.error("Failed to fetch services for header dropdown:", err);
      }
    }
    fetchServices();
  }, []);

  return (
    <header className="w-full bg-[#FAF7F3] border-b border-[#E6DEC9] py-5 px-6 md:px-16 flex items-center justify-between relative z-50">
      {/* Left: Brand Logo & Name */}
      <Link href="/" className="flex items-center gap-3.5 group">
        <div className="w-20 h-20 flex items-center justify-center text-[#8C6D6B] font-serif text-lg">
          <img className="w-full h-full object-cover" src="https://res.cloudinary.com/wapixih0/image/upload/v1790707283/Logo.png" alt="" />
        </div>
        <span className="font-serif tracking-[0.2em] text-[#111] text-lg sm:text-xl font-normal">
          DR WARDA SIKANDER
        </span>
      </Link>

      {/* Center: Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-8 text-xs font-sans tracking-[0.15em] text-[#514C48]">
        <Link href="/" className="hover:text-[#111] transition">
          HOME
        </Link>

        {/* Services Dropdown with Hover */}
        <div 
          className="relative py-2"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <div className="flex items-center gap-1 cursor-pointer hover:text-[#111] transition">
            <span>SERVICES</span>
            <IoIosArrowDown size={12} className={`transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu Box */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-64 bg-white border border-[#EBE4DE] shadow-xl rounded-2xl py-3 mt-1 flex flex-col transition-all animate-fadeIn">
              {services.length > 0 ? (
                services.map((service) => (
                  <Link
                    key={service._id || service.slug}
                    href={`/services/${service.slug}`}
                    className="px-5 py-2.5 text-xs tracking-wider text-[#514C48] hover:bg-[#FAF7F3] hover:text-[#2C2623] transition-colors truncate"
                  >
                    {service.hero?.name || service.name}
                  </Link>
                ))
              ) : (
                <span className="px-5 py-2 text-xs text-[#514C48]/60 font-sans">Loading services...</span>
              )}
            </div>
          )}
        </div>

        <Link href="/blogs" className="hover:text-[#111] transition">
          BLOGS
        </Link>
        <Link href="/contacts" className="hover:text-[#111] transition">
          CONTACTS
        </Link>
      </nav>

      {/* Right: Phone, CTA Button & Mobile Hamburger Toggle */}
      <div className="flex items-center gap-6">
        <a
          href="tel:+923254777981"
          className="hidden xl:block font-sans text-xs tracking-wider text-[#111] font-medium"
        >
          +923254777981
        </a>
        <Link
          href="/appointment"
          className="hidden sm:inline-block bg-[#F2E5E3] hover:bg-[#E8D5D3] text-[#514C48] font-sans text-xs tracking-[0.15em] font-medium px-6 py-3.5 rounded-xl transition"
        >
          BOOK A VISIT
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden text-[#2C2623] p-1 focus:outline-none"
          aria-label="Open Menu"
        >
          <HiMenuAlt3 size={28} />
        </button>
      </div>

      {/* Mobile Slide-out Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-xs bg-[#FAF7F3] h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-[#E6DEC9]">
              <span className="font-serif tracking-widest text-[#111] text-sm uppercase font-normal">
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#514C48] hover:text-[#111] p-1 focus:outline-none"
                aria-label="Close Menu"
              >
                <HiX size={24} />
              </button>
            </div>

            {/* Drawer Nav Links */}
            <nav className="flex flex-col gap-5 py-6 text-xs font-sans tracking-[0.15em] text-[#514C48]">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#111] transition border-b border-[#E6DEC9]/40"
              >
                HOME
              </Link>

              {/* Mobile Services Accordion */}
              <div className="border-b border-[#E6DEC9]/40 pb-2">
                <div 
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex items-center justify-between py-2 cursor-pointer hover:text-[#111] transition"
                >
                  <span>SERVICES</span>
                  <IoIosArrowDown size={14} className={`transform transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </div>

                {mobileServicesOpen && (
                  <div className="flex flex-col pl-4 py-2 space-y-3 bg-[#F4EFEB] rounded-xl mt-2">
                    <Link
                      href="/services"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[11px] font-medium tracking-wider text-[#8D4D5D] hover:text-[#111]"
                    >
                      View All Services →
                    </Link>
                    {services.map((service) => (
                      <Link
                        key={service._id || service.slug}
                        href={`/services/${service.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[11px] tracking-wider text-[#514C48] hover:text-[#111] truncate"
                      >
                        {service.hero?.name || service.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/blogs" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#111] transition border-b border-[#E6DEC9]/40"
              >
                BLOGS
              </Link>
              <Link 
                href="/contacts" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#111] transition border-b border-[#E6DEC9]/40"
              >
                CONTACTS
              </Link>
            </nav>

            {/* Drawer Footer Contact & CTA */}
            <div className="mt-auto pt-6 border-t border-[#E6DEC9] flex flex-col gap-4">
              <a 
                href="tel:+923254777981" 
                className="text-xs font-sans font-medium text-[#111] tracking-wider"
              >
                +92 325 4777981
              </a>
              <Link
                href="/appointment"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#2C2623] text-white py-3.5 rounded-xl text-xs uppercase tracking-widest font-sans shadow-sm"
              >
                Book A Visit
              </Link>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}