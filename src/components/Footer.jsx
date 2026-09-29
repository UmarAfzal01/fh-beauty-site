import Image from 'next/image';
import Link from 'next/link';
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full relative overflow-hidden bg-gradient-to-b from-[#FAF7F3] via-[#F4EFEB] to-[#EBE4DE] text-[#514C48] pt-24 pb-12 px-6 md:px-12 xl:px-20 border-t border-[#E5DDD5]">
      
      {/* Decorative Luxury Glow/Gradient Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Top Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#E5DDD5]/80">
          
          {/* Left Column: Logo & Brand Name */}
          <div className="lg:col-span-5 flex items-center gap-4">
            <span className="text-2xl sm:text-3xl font-serif tracking-[0.18em] text-[#111] uppercase font-normal">
              Dr Warda Sikander
            </span>
          </div>

          {/* Middle Column: Address & Hours */}
          <div className="lg:col-span-4 flex flex-col">
            <h3 className="font-serif text-xl text-[#111] mb-4 tracking-wide">
              Address
            </h3>
            <p className="text-xs font-sans text-[#514C48]/90 leading-relaxed mb-4">
              High Q Tower, Gulberg V, <br/> Lahore, 54000, Pakistan
            </p>
            <p className="text-xs font-sans text-[#514C48]/75 leading-relaxed">
              Mon - Sat (9:00 AM - 9:00 PM) By<br />
              Appointment Only
            </p>
          </div>

          {/* Right Column: Say Hello / Contact & Socials */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="font-serif text-xl text-[#111] mb-4 tracking-wide">
              Say Hello
            </h3>
            <div className="space-y-2 mb-6 text-xs font-sans">
              <a href="tel:+923254777981" className="flex items-center gap-2 text-[#514C48]/90 hover:text-[#111] font-medium tracking-wide transition">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8D4D5D]"></span>
                +92 325 4777981
              </a>
              <a href="mailto:drwardasikander@gmail.com" className="flex items-center gap-2 text-[#514C48]/90 hover:text-[#111] font-medium tracking-wide transition">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8D4D5D]"></span>
                drwardasikander@gmail.com
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a 
                href="https://www.facebook.com/pakistanobesitycenter" 
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-[#8D4D5D] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-[#EBE4DE]"
              >
                <FaFacebook size={16} />
              </a>
              <a 
                href="https://www.instagram.com/drwardasikandar" 
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-[#8D4D5D] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-[#EBE4DE]"
              >
                <AiFillInstagram size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/dr-warda-sikandar-" 
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-[#8D4D5D] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-[#EBE4DE]"
              >
                <FaLinkedin size={16} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Footer: Navigation Links & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#514C48]/70">
          
          {/* Footer Nav Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#8D4D5D] transition-colors">Home</Link>
            <Link href="/services" className="hover:text-[#8D4D5D] transition-colors">Services</Link>
            <Link href="/blogs" className="hover:text-[#8D4D5D] transition-colors">Blogs</Link>
            <Link href="/contacts" className="hover:text-[#8D4D5D] transition-colors">Contacts</Link>
          </div>

          {/* Copyright Text */}
          <p className="text-[11px] text-[#514C48]/60 text-center sm:text-right">
            Dr Warda Sikander &copy; 2026 - All Rights Reserved
          </p>

        </div>

      </div>
    </footer>
  );
}