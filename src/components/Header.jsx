"use client";
import React from "react";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

export default function Header() {
  return (
    <header className="w-full bg-[#FAF7F3] border-b border-[#E6DEC9] py-5 px-8 md:px-16 flex items-center justify-between">
      {/* Left: Brand Logo & Name */}
      <Link href="/" className="flex items-center gap-3.5 group">
        <div className="w-10 h-10 border border-[#8C6D6B] flex items-center justify-center text-[#8C6D6B] font-serif text-lg">
          WS
        </div>
        <span className="font-serif tracking-[0.2em] text-[#111] text-xl font-normal">
          DR WARDA SIKANDER
        </span>
      </Link>

      {/* Center: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-8 text-xs font-sans tracking-[0.15em] text-[#514C48]">
        <div className="flex items-center gap-1 cursor-pointer hover:text-[#111] transition">
          <span>HOME</span>
          <IoIosArrowDown size={12} />
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-[#111] transition">
          <span>SERVICES</span>
          <IoIosArrowDown size={12} />
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-[#111] transition">
          <span>PAGES</span>
          <IoIosArrowDown size={12} />
        </div>
        <Link href="/blog" className="hover:text-[#111] transition">
          BLOG
        </Link>
        <Link href="/contacts" className="hover:text-[#111] transition">
          CONTACTS
        </Link>
      </nav>

      {/* Right: Phone & CTA Button */}
      <div className="flex items-center gap-8">
        <a
          href="tel:+18001231234"
          className="hidden xl:block font-sans text-xs tracking-wider text-[#111] font-medium"
        >
          +1 800-123-1234
        </a>
        <Link
          href="/appointment"
          className="bg-[#F2E5E3] hover:bg-[#E8D5D3] text-[#514C48] font-sans text-xs tracking-[0.15em] font-medium px-6 py-3.5 rounded-xl transition"
        >
          BOOK A VISIT
        </Link>
      </div>
    </header>
  );
}