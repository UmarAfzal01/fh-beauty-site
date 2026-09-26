"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function DoctorDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  const router = useRouter();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`/api/doctors/${slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch doctor details");
        setDoctor(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20 font-sans text-sm text-[#514C48]/60 bg-[#FAF7F3] min-h-screen">Loading doctor profile...</div>;
  }

  if (error || !doctor) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center font-serif text-[#514C48] bg-[#FAF7F3] min-h-screen">
        <h1 className="text-2xl font-normal text-[#111] mb-4">Doctor Not Found</h1>
        <p className="font-sans text-sm text-red-600 mb-6">{error || "The requested doctor profile does not exist."}</p>
        <button
          onClick={() => router.back()}
          className="bg-[#111] text-[#FAF7F3] font-sans text-xs tracking-wider px-6 py-3 rounded-xl transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
    
<Header/>

    <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 py-12 font-serif text-[#514C48] bg-white min-h-screen space-y-16">
      
      {/* Top Banner Hero Card */}
      <div className="bg-[#F7ECE9] mx-auto max-w-7xl rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row items-stretch justify-between shadow-sm">
        
        {/* Left Metadata Content */}
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
          <div>
            <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-[#514C48]/70 block mb-2">
              {doctor.designation}
            </span>
            <h1 className="text-4xl sm:text-5xl font-normal text-[#111] tracking-tight">
              {doctor.name}
            </h1>
          </div>

          {/* Contact Details Stack */}
          <div className="space-y-3 pt-2 font-sans text-sm text-[#514C48]">
            {doctor.phone && (
              <div className="flex items-center gap-2 border-b border-[#EEDCD8] pb-2">
                <span className="text-xs uppercase tracking-wider text-[#514C48]/60 w-20">Phone:</span>
                <a href={`tel:${doctor.phone}`} className="hover:text-[#111] transition">{doctor.phone}</a>
              </div>
            )}
            {doctor.officePhone && (
              <div className="flex items-center gap-2 border-b border-[#EEDCD8] pb-2">
                <span className="text-xs uppercase tracking-wider text-[#514C48]/60 w-20">Office:</span>
                <span className="text-[#514C48]">{doctor.officePhone}</span>
              </div>
            )}
            {doctor.email && (
              <div className="flex items-center gap-2 pb-1">
                <span className="text-xs uppercase tracking-wider text-[#514C48]/60 w-20">Email:</span>
                <a href={`mailto:${doctor.email}`} className="hover:text-[#111] transition">{doctor.email}</a>
              </div>
            )}
          </div>

          {/* Social Icon Circles */}
          {doctor.socialLinks && Object.values(doctor.socialLinks).some(Boolean) && (
            <div className="flex items-center gap-3 pt-2">
              {doctor.socialLinks.facebook && (
                <a href={doctor.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#B8867B] text-white flex items-center justify-center hover:opacity-90 transition">
                  <FaFacebookF size={13} />
                </a>
              )}
              {doctor.socialLinks.insta && (
                <a href={doctor.socialLinks.insta} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#B8867B] text-white flex items-center justify-center hover:opacity-90 transition">
                  <FaInstagram size={13} />
                </a>
              )}
              {doctor.socialLinks.pinterest && (
                <a href={doctor.socialLinks.pinterest} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#B8867B] text-white flex items-center justify-center hover:opacity-90 transition">
                  <FaPinterestP size={13} />
                </a>
              )}
              {doctor.socialLinks.linkedin && (
                <a href={doctor.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#B8867B] text-white flex items-center justify-center hover:opacity-90 transition">
                  <FaLinkedinIn size={13} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right Doctor Image (Flush fit on large screens) */}
        <div className="lg:w-[42%] min-h-[350px] lg:min-h-full bg-[#EFE3E0] relative">
          {doctor.image ? (
            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 font-sans">No Image</div>
          )}
        </div>
      </div>

      {/* Short Biography Section */}
      {(doctor.shortBiography || doctor.shortBiographyDescription) && (
        <div className="max-w-4xl mx-auto space-y-6 pt-6">
          {/* <h2 className="text-3xl font-normal text-[#111] text-center">Short Biography</h2> */}
          <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed text-[#514C48]/80 text-center sm:text-left">
            {doctor.shortBiography && (
              <p className="font-serif text-lg text-[#111]/90 italic text-center">
                {doctor.shortBiography}
              </p>
            )}
            {doctor.shortBiographyDescription && (
              <p className="whitespace-pre-line pt-2 text-justify">
                {doctor.shortBiographyDescription}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Education & Experience Section */}
      {doctor.educationExperience && (
        <div className="max-w-4xl mx-auto space-y-8 pt-8 border-t border-neutral-100">
          <h2 className="text-3xl font-normal text-[#111] text-center">Education & Experience</h2>
          
          <div className="divide-y divide-[#EEDCD8] font-sans text-sm">
            
            {/* Education Row */}
            {doctor.educationExperience.education?.length > 0 && doctor.educationExperience.education[0] !== "" && (
              <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <span className="font-semibold uppercase tracking-wider text-xs text-[#514C48]/70">Education</span>
                <div className="md:col-span-2 space-y-1 text-[#514C48]">
                  {doctor.educationExperience.education.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Board Certification Row */}
            {doctor.educationExperience.boardCertification?.length > 0 && doctor.educationExperience.boardCertification[0] !== "" && (
              <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <span className="font-semibold uppercase tracking-wider text-xs text-[#514C48]/70">Board certification</span>
                <div className="md:col-span-2 space-y-1 text-[#514C48]">
                  {doctor.educationExperience.boardCertification.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Field of Expertise Row */}
            {doctor.educationExperience.fieldOfExpertise?.length > 0 && doctor.educationExperience.fieldOfExpertise[0] !== "" && (
              <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <span className="font-semibold uppercase tracking-wider text-xs text-[#514C48]/70">Field of expertise</span>
                <div className="md:col-span-2 space-y-1 text-[#514C48]">
                  {doctor.educationExperience.fieldOfExpertise.map((item, idx) => (
                    <p key={idx}>{item}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Years of Practice Row */}
            {doctor.educationExperience.yearsOfPractice && (
              <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <span className="font-semibold uppercase tracking-wider text-xs text-[#514C48]/70">Years of practice</span>
                <div className="md:col-span-2 text-[#514C48]">
                  <p>{doctor.educationExperience.yearsOfPractice}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="max-w-4xl mx-auto pt-6">
        <button
          onClick={() => router.back()}
          className="px-8 py-3.5 rounded-xl border border-[#E6DEC9] text-xs font-sans tracking-widest uppercase hover:bg-neutral-50 transition"
        >
          ← Back
        </button>
      </div>

    </div>
    <Footer/>
    </>
  );
}