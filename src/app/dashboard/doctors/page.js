"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoMdAdd, IoMdMail, IoMdCall } from "react-icons/io";

export default function DoctorsListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch doctors");
      setDoctors(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-serif text-[#514C48] bg-[#FAF7F3] min-h-screen">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between border-b border-[#E6DEC9] pb-6">
        <div>
          <h1 className="text-3xl font-normal text-[#111]">
            Doctors Management
          </h1>
          <p className="text-sm font-sans tracking-wide text-[#514C48]/70 mt-1">
            View, manage, and oversee all registered medical professionals.
          </p>
        </div>
        <Link
          href="/dashboard/doctors/add"
          className="bg-[#111] hover:bg-black text-[#FAF7F3] font-sans text-xs tracking-[0.15em] font-medium px-6 py-3.5 rounded-xl transition flex items-center gap-2"
        >
          <IoMdAdd size={16} /> ADD NEW DOCTOR
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-sans">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20 font-sans text-sm text-[#514C48]/60">
          Loading doctors directory...
        </div>
      ) : doctors.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E6DEC9] space-y-4">
          <p className="font-sans text-sm text-[#514C48]/70">
            No doctors added yet.
          </p>
          <Link
            href="/dashboard/doctors/add"
            className="inline-block bg-[#F2E5E3] hover:bg-[#E8D5D3] text-[#514C48] font-sans text-xs tracking-wider px-6 py-3 rounded-xl transition"
          >
            Add Your First Doctor
          </Link>
        </div>
      ) : (
        /* Doctors Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Link
              href={`/dashboard/doctors/edit/${doctor._id}`}
              key={doctor._id}
              className="bg-white rounded-3xl border border-[#E6DEC9] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                {/* Doctor Image Header */}
                <div className="relative h-64 w-full bg-neutral-100">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  <span className="absolute bottom-4 left-4 right-4 text-white font-sans text-xs bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg truncate">
                    {doctor.designation}
                  </span>
                </div>

                {/* Details Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-normal text-[#111]">
                      {doctor.name}
                    </h2>
                    <p className="font-sans text-xs text-[#514C48]/70 mt-1 line-clamp-2">
                      {doctor.shortBiography || "No summary provided."}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 font-sans text-xs text-[#514C48]/80 border-t border-[#E6DEC9]/50 pt-4">
                    <div className="flex items-center gap-2 truncate">
                      <IoMdMail size={14} className="text-[#111] shrink-0" />
                      <span className="truncate">{doctor.email}</span>
                    </div>
                    {doctor.phone && (
                      <div className="flex items-center gap-2">
                        <IoMdCall size={14} className="text-[#111] shrink-0" />
                        <span>{doctor.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Badge / Actions */}
              <div className="px-6 py-4 bg-[#FAF7F3]/50 border-t border-[#E6DEC9] flex items-center justify-between font-sans text-xs">
                <span className="text-[#514C48]/70">
                  {doctor.educationExperience?.yearsOfPractice || "Experienced"}
                </span>
                <span className="text-[#111] font-medium">
                  {doctor.educationExperience?.fieldOfExpertise?.length || 0}{" "}
                  Specialties
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
