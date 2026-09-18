"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import { IoMdTrash, IoMdAdd } from "react-icons/io";

export default function AddDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State matching the schema requirements
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    designation: "",
    phone: "",
    officePhone: "",
    email: "",
    socialLinks: {
      facebook: "",
      insta: "",
      pinterest: "",
      linkedin: "",
    },
    shortBiography: "",
    shortBiographyDescription: "",
    educationExperience: {
      education: [""],
      boardCertification: [""],
      fieldOfExpertise: [""],
      yearsOfPractice: "",
    },
  });

  // Handle standard input updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle nested social links updates
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  // Dynamic Array Fields Handlers (Education, Certifications, Expertise)
  const handleArrayChange = (category, index, value) => {
    const updatedList = [...formData.educationExperience[category]];
    updatedList[index] = value;
    setFormData((prev) => ({
      ...prev,
      educationExperience: {
        ...prev.educationExperience,
        [category]: updatedList,
      },
    }));
  };

  const addArrayItem = (category) => {
    setFormData((prev) => ({
      ...prev,
      educationExperience: {
        ...prev.educationExperience,
        [category]: [...prev.educationExperience[category], ""],
      },
    }));
  };

  const removeArrayItem = (category, index) => {
    const updatedList = formData.educationExperience[category].filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      educationExperience: {
        ...prev.educationExperience,
        [category]: updatedList,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add doctor");

      router.push("/dashboard/doctors");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 font-serif text-[#514C48] bg-[#FAF7F3] min-h-screen">
      <div className="mb-8 flex items-center justify-between border-b border-[#E6DEC9] pb-6">
        <div>
          <h1 className="text-3xl font-normal text-[#111]">Add New Doctor</h1>
          <p className="text-sm font-sans tracking-wide text-[#514C48]/70 mt-1">
            Fill in the professional details and background information.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details Section */}
        <div className="bg-white p-8 rounded-3xl border border-[#E6DEC9] shadow-sm space-y-6">
          <h2 className="text-xl font-normal text-[#111] border-b pb-3">
            General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Jane Doe"
                className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">
                Designation / Specialty *
              </label>
              <input
                type="text"
                name="designation"
                required
                value={formData.designation}
                onChange={handleChange}
                placeholder="Senior Aesthetic Dermatologist"
                className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane.doe@bellabeauty.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">
                  Phone (Opt.)
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2831"
                  className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">
                  Office Phone (Opt.)
                </label>
                <input
                  type="text"
                  name="officePhone"
                  value={formData.officePhone}
                  onChange={handleChange}
                  placeholder="+1 (800) 123-4567"
                  className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
                />
              </div>
            </div>
          </div>
         {/* Image Upload Widget */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">
              Doctor Image (Recommended: 1024 × 1024 px)
            </label>
            <div className="flex items-center gap-6">
              {formData.image ? (
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-[#E6DEC9]">
                  <img
                    src={formData.image}
                    alt="Doctor preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full text-xs hover:bg-black"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-neutral-100 border border-dashed border-neutral-300 flex items-center justify-center text-xs text-neutral-400 font-sans">
                  1024x1024
                </div>
              )}
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_DOCTOR_UPLOAD_PRESET}
                onSuccess={(result) => {
                  // next-cloudinary v5+ uses onSuccess or provides secure_url directly in info
                  const secureUrl = result?.info?.secure_url || result?.secure_url;
                  if (secureUrl) {
                    setFormData((prev) => ({ ...prev, image: secureUrl }));
                  }
                }}
                options={{ maxFiles: 1 }}
                className="bg-[#F2E5E3] hover:bg-[#E8D5D3] text-[#514C48] font-sans text-xs tracking-wider px-6 py-3 rounded-xl transition"
              >
                Upload Image
              </CldUploadButton>
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-white p-8 rounded-3xl border border-[#E6DEC9] shadow-sm space-y-6">
          <h2 className="text-xl font-normal text-[#111] border-b pb-3">
            Social Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["facebook", "insta", "pinterest", "linkedin"].map((platform) => (
              <div key={platform}>
                <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80 capitalize">
                  {platform === "insta" ? "Instagram" : platform} Profile URL
                </label>
                <input
                  type="url"
                  name={platform}
                  value={formData.socialLinks[platform]}
                  onChange={handleSocialChange}
                  placeholder={`https://${platform}.com/username`}
                  className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Biography Section */}
        <div className="bg-white p-8 rounded-3xl border border-[#E6DEC9] shadow-sm space-y-6">
          <h2 className="text-xl font-normal text-[#111] border-b pb-3">
            Biography
          </h2>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">
              Short Biography Summary
            </label>
            <input
              type="text"
              name="shortBiography"
              value={formData.shortBiography}
              onChange={handleChange}
              placeholder="e.g. Over 15 years of excellence in clinical dermatology..."
              className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">
              Short Biography Description
            </label>
            <textarea
              name="shortBiographyDescription"
              rows={4}
              value={formData.shortBiographyDescription}
              onChange={handleChange}
              placeholder="Provide a detailed overview of the doctor's philosophy, career, and medical approach..."
              className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
            />
          </div>
        </div>

        {/* Education & Experience Section */}
        <div className="bg-white p-8 rounded-3xl border border-[#E6DEC9] shadow-sm space-y-6">
          <h2 className="text-xl font-normal text-[#111] border-b pb-3">
            Education & Experience
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans uppercase tracking-wider text-[#514C48]/80">
                  1. Education
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem("education")}
                  className="text-xs font-sans text-[#111] flex items-center gap-1 hover:underline"
                >
                  <IoMdAdd size={14} /> Add item
                </button>
              </div>
              {formData.educationExperience.education.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange("education", idx, e.target.value)}
                    placeholder="e.g. M.D. from Harvard Medical School"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
                  />
                  {formData.educationExperience.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("education", idx)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <IoMdTrash size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Board Certification List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans uppercase tracking-wider text-[#514C48]/80">
                  2. Board Certification
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem("boardCertification")}
                  className="text-xs font-sans text-[#111] flex items-center gap-1 hover:underline"
                >
                  <IoMdAdd size={14} /> Add item
                </button>
              </div>
              {formData.educationExperience.boardCertification.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange("boardCertification", idx, e.target.value)}
                    placeholder="e.g. American Board of Dermatology"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
                  />
                  {formData.educationExperience.boardCertification.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("boardCertification", idx)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <IoMdTrash size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Field of Expertise List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans uppercase tracking-wider text-[#514C48]/80">
                  3. Field of Expertise
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem("fieldOfExpertise")}
                  className="text-xs font-sans text-[#111] flex items-center gap-1 hover:underline"
                >
                  <IoMdAdd size={14} /> Add item
                </button>
              </div>
              {formData.educationExperience.fieldOfExpertise.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange("fieldOfExpertise", idx, e.target.value)}
                    placeholder="e.g. Laser Skin Resurfacing"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
                  />
                  {formData.educationExperience.fieldOfExpertise.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("fieldOfExpertise", idx)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <IoMdTrash size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Years of Practice */}
            <div className="space-y-4">
              <label className="block text-xs font-sans uppercase tracking-wider text-[#514C48]/80">
                4. Years of Practice
              </label>
              <input
                type="text"
                name="yearsOfPractice"
                value={formData.educationExperience.yearsOfPractice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    educationExperience: {
                      ...prev.educationExperience,
                      yearsOfPractice: e.target.value,
                    },
                  }))
                }
                placeholder="e.g. 15+ Years Experience"
                className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-4 rounded-xl border border-[#E6DEC9] text-sm font-sans tracking-wider hover:bg-neutral-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#111] hover:bg-black text-[#FAF7F3] font-sans text-xs tracking-[0.15em] font-medium px-8 py-4 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Saving Doctor..." : "SAVE DOCTOR"}
          </button>
        </div>
      </form>
    </div>
  );
}