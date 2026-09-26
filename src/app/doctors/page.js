"use client"
import React, { useState, useEffect } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const DUMMY_IMAGE = "https://www.dummyimage.com/600x600/f3f3f3/000";

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        if (res.ok) {
          setDoctors(data.data || data.doctors || []);
        }
      } catch (err) {
        console.error("Failed to fetch doctors list", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <>

    <Header/>
    <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] pb-24">
      {/* Hero Banner Section */}
      <section className="relative w-full h-[320px] md:h-[380px] bg-[#111] overflow-hidden flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://res.cloudinary.com/wapixih0/image/upload/v1790430819/doctors-1-1.webp')` }}
        ></div>
        
        {/* Uniform Dark Tint Layer */}
        <div className="absolute inset-0 bg-black/35"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 w-full flex flex-col justify-end h-full pb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-normal text-white tracking-tight mb-2">
            Doctors
          </h1>
          <p className="text-sm md:text-base font-serif text-neutral-200 max-w-xl">
            Experience the Best Plastic Surgery and Skincare Studio in Portland.
          </p>
        </div>
      </section>

      {/* Doctors Grid Section (Fixed spacing and solid background) */}
      <section className="max-w-7xl mx-auto px-6 pt-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#F3EDE2] border border-[#E6DEC9] rounded-3xl p-8 h-[400px] animate-pulse"></div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20 bg-[#F3EDE2] border border-[#E6DEC9] rounded-3xl">
            <p className="font-serif text-lg text-[#514C48]/60">No doctors available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc) => {
              const docId = doc._id || doc.id;
              return (
                <div 
                  key={docId}
                  className="bg-[#F3EDE2] hover:shadow-xl border border-[#E6DEC9] rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 shadow-md shadow-[#514C48]/5 group"
                >
                  {/* Doctor Name & Designation */}
                  <h3 className="font-serif font-normal text-xl text-[#111] mb-1">
                    {doc.name}
                  </h3>
                  <p className="text-xs font-serif text-[#514C48]/70 tracking-wide uppercase mb-6">
                    {doc.designation || "Cosmetologist"}
                  </p>

                  {/* Circular Image Container */}
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-[#E6DEC9] mb-8 shadow-inner bg-[#FAF7F3]">
                    <img
                      src={doc.image || DUMMY_IMAGE}
                      alt={doc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Card Footer Links / Action Bar */}
                  <div className="w-full flex items-center justify-between pt-6 border-t border-[#E6DEC9]/60 mt-auto">
                    <a
                      href={`/doctors/${doc.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-sans font-medium text-[#111] hover:text-[#514C48] transition"
                    >
                      OPEN PROFILE <IoIosArrowRoundForward size={18} />
                    </a>

                    <div className="flex items-center gap-2">
                      <a
                        href={doc.twitterUrl || "#"}
                        aria-label="Twitter Profile"
                        className="w-7 h-7 rounded-full bg-[#FAF7F3] border border-[#E6DEC9] flex items-center justify-center text-[#514C48] hover:bg-[#111] hover:text-[#FAF7F3] transition text-xs"
                      >
                        <FaTwitter size={11} />
                      </a>
                      <a
                        href={doc.linkedinUrl || "#"}
                        aria-label="LinkedIn Profile"
                        className="w-7 h-7 rounded-full bg-[#FAF7F3] border border-[#E6DEC9] flex items-center justify-center text-[#514C48] hover:bg-[#111] hover:text-[#FAF7F3] transition text-xs"
                      >
                        <FaLinkedinIn size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
    <Footer/>
    </>
  );
};

export default DoctorsList;