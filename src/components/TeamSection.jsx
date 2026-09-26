"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        if (res.ok) {
          // Limit to 3 or show all depending on preference (e.g., first 3 for homepage)
          setTeamMembers(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch team members:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  // If loading or empty, you can display placeholders or nothing; here we gracefully fall back or show skeletons
  if (loading) {
    return (
      <section className="w-full bg-[#FAF7F3] text-[#514C48] py-24 px-6 md:px-12 xl:px-20 text-center">
        <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#8D4D5D] mb-3 block">
          MEET OUR TEAM
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-normal text-[#111] mb-16">
          Friendly Faces, Personalized Care
        </h2>
        <div className="font-sans text-sm text-[#514C48]/60 py-12">Loading team members...</div>
      </section>
    );
  }

  // If no doctors are in the database yet, you can hide the section or show a fallback
  if (teamMembers.length === 0) return null;

  return (
    <section className="w-full bg-[#FAF7F3] text-[#514C48] py-24 px-6 md:px-12 xl:px-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Subheading & Title */}
        <span className="text-xs font-sans uppercase tracking-[0.25em] text-[#8D4D5D] mb-3">
          MEET OUR TEAM
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-normal text-[#111] text-center mb-16">
          Friendly Faces, Personalized Care
        </h2>

        {/* Team Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16">
          {teamMembers.slice(0, 3).map((member) => (
            <div 
              key={member._id}
              className="bg-[#F5EFEA] rounded-[30px] p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Card Top: Name & Role */}
              <div>
                <h3 className="text-2xl font-serif text-[#111] mb-1">
                  {member.name}
                </h3>
                <p className="text-xs font-sans tracking-wide text-[#514C48]/70 uppercase">
                  {member.designation}
                </p>
              </div>

              {/* Card Middle: Circular Image */}
              <div className="my-8 flex justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-inner bg-[#EBE4DE]">
                  <Image 
                    src={member.image || "/images/home-1-1.webp"} 
                    alt={member.name} 
                    fill 
                    className="object-cover object-center"
                  />
                </div>
              </div>

              {/* Card Bottom: Open Profile Link & Social Icons */}
              <div className="pt-4 border-t border-[#E5DDD5] flex items-center justify-between">
                <Link 
                  href={`/doctors/${member.slug}`} 
                  className="text-xs font-sans uppercase tracking-[0.15em] text-[#111] font-medium hover:text-[#8D4D5D] transition-colors flex items-center gap-1"
                >
                  OPEN PROFILE <span>↗</span>
                </Link>

                <div className="flex items-center gap-2">
                  {/* Twitter / X Icon Button */}
                  {member.socialLinks?.twitter && (
                    <a 
                      href={member.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Twitter profile"
                      className="w-8 h-8 rounded-full bg-[#EBE4DE] hover:bg-[#8D4D5D] hover:text-white flex items-center justify-center text-xs text-[#514C48] transition-colors"
                    >
                      ✕
                    </a>
                  )}
                  {/* LinkedIn Icon Button */}
                  {member.socialLinks?.linkedin && (
                    <a 
                      href={member.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="LinkedIn profile"
                      className="w-8 h-8 rounded-full bg-[#EBE4DE] hover:bg-[#8D4D5D] hover:text-white flex items-center justify-center text-xs text-[#514C48] transition-colors font-serif italic"
                    >
                      in
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* View All Doctors Button */}
        <Link 
          href="/doctors"
          className="bg-[#8D4D5D] hover:bg-[#654945] text-white text-xs font-sans tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-lg inline-block text-center"
        >
          VIEW ALL DOCTORS
        </Link>

      </div>
    </section>
  );
}