"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import { IoMdTrash, IoMdAdd } from "react-icons/io";

export default function EditDoctorPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    designation: "",
    phone: "",
    officePhone: "",
    email: "",
    socialLinks: { facebook: "", insta: "", pinterest: "", linkedin: "" },
    shortBiography: "",
    shortBiographyDescription: "",
    educationExperience: {
      education: [""],
      boardCertification: [""],
      fieldOfExpertise: [""],
      yearsOfPractice: "",
    },
  });

  // Fetch existing doctor data on mount using slug
  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`/api/doctors/${slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch doctor details");
        
        setFormData({
          name: data.data.name || "",
          slug: data.data.slug || slug,
          image: data.data.image || "",
          designation: data.data.designation || "",
          phone: data.data.phone || "",
          officePhone: data.data.officePhone || "",
          email: data.data.email || "",
          socialLinks: data.data.socialLinks || { facebook: "", insta: "", pinterest: "", linkedin: "" },
          shortBiography: data.data.shortBiography || "",
          shortBiographyDescription: data.data.shortBiographyDescription || "",
          educationExperience: {
            education: data.data.educationExperience?.education?.length ? data.data.educationExperience.education : [""],
            boardCertification: data.data.educationExperience?.boardCertification?.length ? data.data.educationExperience.boardCertification : [""],
            fieldOfExpertise: data.data.educationExperience?.fieldOfExpertise?.length ? data.data.educationExperience.fieldOfExpertise : [""],
            yearsOfPractice: data.data.educationExperience?.yearsOfPractice || "",
          },
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleArrayChange = (category, index, value) => {
    const updatedList = [...formData.educationExperience[category]];
    updatedList[index] = value;
    setFormData((prev) => ({
      ...prev,
      educationExperience: { ...prev.educationExperience, [category]: updatedList },
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
    const updatedList = formData.educationExperience[category].filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      educationExperience: { ...prev.educationExperience, [category]: updatedList },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/doctors/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update doctor");

      // If slug changed, push to the new slug path or general list
      router.push(`/dashboard/doctors/edit/${formData.slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 font-sans text-sm text-[#514C48]/60 bg-[#FAF7F3] min-h-screen">Loading doctor details...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 font-serif text-[#514C48] bg-[#FAF7F3] min-h-screen">
      <div className="mb-8 flex items-center justify-between border-b border-[#E6DEC9] pb-6">
        <div>
          <h1 className="text-3xl font-normal text-[#111]">Edit Doctor Profile</h1>
          <p className="text-sm font-sans tracking-wide text-[#514C48]/70 mt-1">
            Update professional information and background fields.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Information */}
        <div className="bg-white p-8 rounded-3xl border border-[#E6DEC9] shadow-sm space-y-6">
          <h2 className="text-xl font-normal text-[#111] border-b pb-3">General Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">Slug *</label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">Designation / Specialty *</label>
              <input
                type="text"
                name="designation"
                required
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">Office Phone</label>
                <input
                  type="text"
                  name="officePhone"
                  value={formData.officePhone}
                  onChange={handleChange}
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
                  <img src={formData.image} alt="Doctor preview" className="w-full h-full object-cover" />
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
                  const secureUrl = result?.info?.secure_url || result?.secure_url;
                  if (secureUrl) setFormData((prev) => ({ ...prev, image: secureUrl }));
                }}
                options={{ maxFiles: 1 }}
                className="bg-[#F2E5E3] hover:bg-[#E8D5D3] text-[#514C48] font-sans text-xs tracking-wider px-6 py-3 rounded-xl transition"
              >
                Change Image
              </CldUploadButton>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-8 rounded-3xl border border-[#E6DEC9] shadow-sm space-y-6">
          <h2 className="text-xl font-normal text-[#111] border-b pb-3">Social Links</h2>
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
                  className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Biography */}
        <div className="bg-white p-8 rounded-3xl border border-[#E6DEC9] shadow-sm space-y-6">
          <h2 className="text-xl font-normal text-[#111] border-b pb-3">Biography</h2>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">Short Biography Summary</label>
            <input
              type="text"
              name="shortBiography"
              value={formData.shortBiography}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider mb-2 text-[#514C48]/80">Short Biography Description</label>
            <textarea
              name="shortBiographyDescription"
              rows={4}
              value={formData.shortBiographyDescription}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
            />
          </div>
        </div>

        {/* Education & Experience */}
        <div className="bg-white p-8 rounded-3xl border border-[#E6DEC9] shadow-sm space-y-6">
          <h2 className="text-xl font-normal text-[#111] border-b pb-3">Education & Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans uppercase tracking-wider text-[#514C48]/80">1. Education</label>
                <button type="button" onClick={() => addArrayItem("education")} className="text-xs font-sans text-[#111] flex items-center gap-1 hover:underline">
                  <IoMdAdd size={14} /> Add item
                </button>
              </div>
              {formData.educationExperience.education.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange("education", idx, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
                  />
                  {formData.educationExperience.education.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem("education", idx)} className="text-red-500 hover:text-red-700 p-2">
                      <IoMdTrash size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Board Certification */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans uppercase tracking-wider text-[#514C48]/80">2. Board Certification</label>
                <button type="button" onClick={() => addArrayItem("boardCertification")} className="text-xs font-sans text-[#111] flex items-center gap-1 hover:underline">
                  <IoMdAdd size={14} /> Add item
                </button>
              </div>
              {formData.educationExperience.boardCertification.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange("boardCertification", idx, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
                  />
                  {formData.educationExperience.boardCertification.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem("boardCertification", idx)} className="text-red-500 hover:text-red-700 p-2">
                      <IoMdTrash size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Field of Expertise */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans uppercase tracking-wider text-[#514C48]/80">3. Field of Expertise</label>
                <button type="button" onClick={() => addArrayItem("fieldOfExpertise")} className="text-xs font-sans text-[#111] flex items-center gap-1 hover:underline">
                  <IoMdAdd size={14} /> Add item
                </button>
              </div>
              {formData.educationExperience.fieldOfExpertise.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange("fieldOfExpertise", idx, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
                  />
                  {formData.educationExperience.fieldOfExpertise.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem("fieldOfExpertise", idx)} className="text-red-500 hover:text-red-700 p-2">
                      <IoMdTrash size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Years of Practice */}
            <div className="space-y-4">
              <label className="block text-xs font-sans uppercase tracking-wider text-[#514C48]/80">4. Years of Practice</label>
              <input
                type="text"
                name="yearsOfPractice"
                value={formData.educationExperience.yearsOfPractice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    educationExperience: { ...prev.educationExperience, yearsOfPractice: e.target.value },
                  }))
                }
                className="w-full px-4 py-3 rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#111] font-sans text-sm bg-[#FAF7F3]/30"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
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
            disabled={submitting}
            className="bg-[#111] hover:bg-black text-[#FAF7F3] font-sans text-xs tracking-[0.15em] font-medium px-8 py-4 rounded-xl transition disabled:opacity-50"
          >
            {submitting ? "Updating..." : "UPDATE DOCTOR"}
          </button>
        </div>
      </form>
    </div>
  );
}