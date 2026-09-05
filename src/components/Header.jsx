import React from 'react'
import Image from 'next/image';

const Header = () => {
    return (
        <>
            <header className="w-full z-50 flex items-center justify-between px-6 py-5 md:px-12 xl:px-20 border-b border-[#E0DED8] shrink-0 bg-[#FAF7F3] ">
                <div className="hidden md:flex flex-col gap-0.5 text-xs text-[#514C48]/70 font-sans">
                    <p>511 SW 10th Ave 1206, Portland, OR United States</p>
                    <a href="tel:+18001231234" className="hover:text-[#111]">+1 800-123-1234</a>
                </div>

                <div className="flex items-center gap-3">
                    <Image src="/images/favicon-270x270.png" alt="Bella Beauty Logo" width={36} height={36} />
                    <h1 className="text-2xl font-medium tracking-widest text-[#111] font-serif">BELLA BEAUTY</h1>
                </div>

                <div className="flex items-center gap-3">
                    <button className="bg-[#F5E7E4] text-[#514C48] text-xs px-5 py-2.5 rounded-full hover:bg-[#EEDDD9] transition-colors font-sans">
                        BOOK A VISIT
                    </button>
                    <button className="bg-transparent border border-[#514C48] rounded-full p-2.5 group hover:border-black transition-colors">
                        <svg width="14" height="8" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-[#514C48]">
                            <path d="M1 1H15M1 5H15M1 9H15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </header>
        </>
    )
}

export default Header