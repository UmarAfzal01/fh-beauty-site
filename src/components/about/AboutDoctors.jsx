"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function AboutDoctors({ doctorIds = [] }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!doctorIds || doctorIds.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        if (res.ok) {
          const allDocs = data.data || data.doctors || [];
          // Filter only the doctors whose IDs match the selected IDs from the about document
          const filtered = allDocs.filter((doc) =>
            doctorIds.includes(doc._id || doc.id)
          );
          setDoctors(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [doctorIds]);

  if (loading || doctors.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-[#FAF7F3]">
      <div className="max-w-7xl mx-auto text-center space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest font-sans text-[#514C48]/60">
            Meet Our Team
          </span>
          <h2 className="text-4xl font-serif text-[#111] font-normal">
            Our Professional Team
          </h2>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc) => (
            <div
              key={doc._id || doc.id}
              className="bg-[#F3EDE2]/40 border border-[#E6DEC9] rounded-3xl p-8 flex flex-col items-center text-center justify-between shadow-sm transition-all hover:shadow-md"
            >
              <div className="space-y-2 w-full">
                <h3 className="text-2xl font-serif text-[#111]">
                  {doc.name}
                </h3>
                <p className="text-sm font-serif text-[#514C48]/60">
                  {doc.designation || doc.specialty || "Specialist"}
                </p>
              </div>

              {/* Circular Image */}
              <div className="my-6 w-48 h-48 rounded-full overflow-hidden border border-[#E6DEC9] shadow-inner">
                <img
                  src={doc.image || "https://www.dummyimage.com/400x400/f3f3f3/000"}
                  alt={doc.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Footer Actions */}
              <div className="w-full pt-6 border-t border-[#E6DEC9] flex items-center justify-between">
                <Link
                  href={`/doctors/${doc._id || doc.id}`}
                  className="text-xs font-sans uppercase tracking-wider text-[#111] hover:underline flex items-center gap-1 font-medium"
                >
                  Open Profile <IoIosArrowRoundForward size={16} />
                </Link>
                <div className="flex items-center gap-2">
                  {doc.twitter && (
                    <a
                      href={doc.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#E6DEC9]/50 hover:bg-[#E6DEC9] flex items-center justify-center text-[#514C48] transition"
                    >
                      <FaTwitter size={12} />
                    </a>
                  )}
                  {doc.linkedin && (
                    <a
                      href={doc.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#E6DEC9]/50 hover:bg-[#E6DEC9] flex items-center justify-center text-[#514C48] transition"
                    >
                      <FaLinkedinIn size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div>
          <Link
            href="/doctors"
            className="inline-block bg-[#F3EDE2] hover:bg-[#E6DEC9] text-[#514C48] font-sans font-medium px-8 py-4 rounded-2xl transition border border-[#E6DEC9]"
          >
            View All Doctors
          </Link>
        </div>
      </div>
    </section>
  );
}