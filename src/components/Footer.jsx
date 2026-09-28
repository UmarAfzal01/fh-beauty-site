import Image from 'next/image';
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-[#FAF7F3] text-[#514C48] pt-20 pb-10 px-6 md:px-12 xl:px-20 border-t border-[#E5DDD5]">
      <div className=" mx-auto">
        
        {/* Top Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#E5DDD5]">
          
          {/* Left Column: Logo & Brand Name */}
          <div className="lg:col-span-5 flex items-center gap-4">
            {/* <Image 
              src="/images/favicon-270x270.png" 
              alt="Dr Warda Sikander Logo" 
              width={48} 
              height={48} 
              className="object-contain"
            /> */}
            <span className="text-2xl sm:text-3xl font-serif tracking-widest text-[#111] uppercase font-normal">
              Dr Warda Sikander
            </span>
          </div>

          {/* Middle Column: Address & Hours */}
          <div className="lg:col-span-4 flex flex-col">
            <h3 className="font-serif text-xl text-[#111] mb-4">
              Address
            </h3>
            <p className="text-xs font-sans text-[#514C48]/90 leading-relaxed mb-4">
              High Q Tower, Gulberg V, <br/> Lahore, 54000, Pakistan
            </p>
            <p className="text-xs font-sans text-[#514C48]/75 leading-relaxed">
              Mon - Sat (9:00 AM - 9:00 PM) By<br />
              Dr Warda Sikander
            </p>
          </div>

          {/* Right Column: Say Hello / Contact & Socials */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="font-serif text-xl text-[#111] mb-4">
              Say Hello
            </h3>
            <div className="space-y-2 mb-6 text-xs font-sans">
              <p className="flex items-center gap-2 text-[#514C48]/90 font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8D4D5D]"></span>
                +92 325 4777981
              </p>
              <p className="flex items-center gap-2 text-[#514C48]/90 font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8D4D5D]"></span>
                drwardasikander@gmail.com
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a 
                href="#facebook" 
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#F5EFEA] hover:bg-[#8D4D5D] hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
               <FaFacebook/>
              </a>
              <a 
                href="#instagram" 
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#F5EFEA] hover:bg-[#8D4D5D] hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <AiFillInstagram/>
              </a>
              <a 
                href="#twitter" 
                aria-label="X / Twitter"
                className="w-9 h-9 rounded-full bg-[#F5EFEA] hover:bg-[#8D4D5D] hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <FaSquareXTwitter/>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Footer: Navigation Links & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#514C48]/70">
          
          {/* Footer Nav Links */}
          <div className="flex items-center gap-6">
            <a href="/" className="hover:text-[#8D4D5D] transition-colors">Home</a>
            <a href="/about" className="hover:text-[#8D4D5D] transition-colors">About</a>
            <a href="/blogs" className="hover:text-[#8D4D5D] transition-colors">Blogs</a>
            <a href="/contact" className="hover:text-[#8D4D5D] transition-colors">Contacts</a>
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