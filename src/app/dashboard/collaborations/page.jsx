"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiX,
  FiUploadCloud,
  FiCheckCircle,
} from "react-icons/fi";

export default function CollaborationsDashboard() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    coverImage: "",
    logo: "",
    shortDesc: "",
    images: [""],
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadingField, setUploadingField] = useState(null);

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      const res = await fetch("/api/collaborations");
      const data = await res.json();
      if (data.success) {
        setCollaborations(data.collaborations);
      }
    } catch (err) {
      console.error("Failed to load collaborations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: "",
      role: "",
      coverImage: "",
      logo: "",
      shortDesc: "",
      images: [""],
    });
    setSuccessMsg("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (collab) => {
    setIsEditing(true);
    setCurrentId(collab._id);
    setFormData({
      name: collab.name || "",
      role: collab.role || "",
      coverImage: collab.coverImage || "",
      logo: collab.logo || "",
      shortDesc: collab.shortDesc || "",
      images: collab.images?.length > 0 ? collab.images : [""],
    });
    setSuccessMsg("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGalleryChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const addGalleryField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeGalleryField = (index) => {
    if (formData.images.length === 1) return;
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const handleCloudinaryUpload = async (e, targetField, galleryIndex = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(targetField + (galleryIndex !== null ? `-${galleryIndex}` : ""));
    setErrorMsg("");

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "Collabrations");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/wapixih0/image/upload`,
        { method: "POST", body: uploadData }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");

      const imageUrl = data.secure_url;

      if (galleryIndex !== null) {
        const updatedImages = [...formData.images];
        updatedImages[galleryIndex] = imageUrl;
        setFormData((prev) => ({ ...prev, images: updatedImages }));
      } else {
        setFormData((prev) => ({ ...prev, [targetField]: imageUrl }));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to upload image to Cloudinary.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    const cleanedImages = formData.images.filter((url) => url.trim() !== "");
    const payload = { ...formData, images: cleanedImages };

    try {
      const endpoint = isEditing
        ? `/api/collaborations/${currentId}`
        : `/api/collaborations`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save collaboration");

      setSuccessMsg(isEditing ? "Updated successfully!" : "Created successfully!");
      fetchCollaborations();
      setTimeout(() => {
        closeModal();
      }, 800);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this collaboration?")) return;

    try {
      const res = await fetch(`/api/collaborations/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      fetchCollaborations();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete collaboration.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3] p-6 lg:p-12 text-[#514C48] font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#EBE4DE] pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#8D4D5D] font-semibold">
              Admin Portal
            </span>
            <h1 className="text-3xl lg:text-4xl font-serif text-[#2C2623] font-normal mt-1">
              Collaborations Management
            </h1>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C2623] hover:bg-[#8D4D5D] text-white rounded-2xl text-xs uppercase tracking-widest font-semibold transition shadow-xs cursor-pointer"
          >
            <FiPlus size={16} /> Add Collaboration
          </button>
        </div>

        {/* Collaborations Grid */}
        {loading ? (
          <div className="text-center py-20 text-sm text-[#514C48]/60">Loading collaborations...</div>
        ) : collaborations.length === 0 ? (
          <div className="bg-white rounded-[28px] border border-[#EBE4DE] p-12 text-center space-y-3">
            <p className="text-sm font-sans text-[#514C48]/70">No collaborations found.</p>
            <button
              onClick={handleOpenCreate}
              className="text-xs uppercase tracking-widest text-[#8D4D5D] font-semibold underline cursor-pointer"
            >
              Create your first collaboration
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaborations.map((collab) => (
              <div
                key={collab._id}
                className="bg-white rounded-[28px] border border-[#EBE4DE] overflow-hidden shadow-xs flex flex-col justify-between group"
              >
                <div className="relative aspect-[16/10] bg-[#F4F0EC]">
                  {collab.coverImage && (
                    <Image
                      src={collab.coverImage}
                      alt={collab.name}
                      fill
                      className="object-cover object-center"
                    />
                  )}
                  {collab.logo && (
                    <div className="absolute top-3 right-3 w-12 h-12 rounded-xl bg-white/95 p-0.5 shadow-md border border-[#EBE4DE] overflow-hidden flex items-center justify-center">
                      <Image src={collab.logo} alt="logo" fill className="object-cover rounded-lg" />
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-sans tracking-widest text-[#8D4D5D] font-semibold block mb-1">
                      {collab.role}
                    </span>
                    <h3 className="text-xl font-serif font-medium text-[#2C2623]">
                      {collab.name}
                    </h3>
                    <p className="text-xs font-sans text-[#514C48]/70 line-clamp-2 mt-1">
                      {collab.shortDesc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-[#EBE4DE]">
                    <button
                      onClick={() => handleOpenEdit(collab)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#FAF7F3] hover:bg-[#EBE4DE] text-[#2C2623] rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      <FiEdit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(collab._id)}
                      className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition cursor-pointer"
                      aria-label="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Create / Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
              
              <div className="flex justify-between items-center p-6 border-b border-[#EBE4DE] bg-[#FAF7F3]">
                <h2 className="text-xl font-serif text-[#2C2623]">
                  {isEditing ? "Edit Collaboration" : "Add New Collaboration"}
                </h2>
                <button
                  onClick={closeModal}
                  className="w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 text-[#2C2623] flex items-center justify-center transition cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                {successMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-medium">
                    <FiCheckCircle size={18} className="text-emerald-600 shrink-0" />
                    {successMsg}
                  </div>
                )}

                {errorMsg && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm font-medium">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-[#514C48]/80 font-semibold">
                    Collaborator / Brand Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Good Morning Pakistan"
                    className="w-full px-4 py-3 bg-[#FAF7F3] border border-[#EBE4DE] rounded-xl text-sm focus:outline-none focus:border-[#8D4D5D] transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-[#514C48]/80 font-semibold">
                    Partnership Type / Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Media & Television Partner"
                    className="w-full px-4 py-3 bg-[#FAF7F3] border border-[#EBE4DE] rounded-xl text-sm focus:outline-none focus:border-[#8D4D5D] transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-[#514C48]/80 font-semibold">
                    Short Description / Overview *
                  </label>
                  <textarea
                    name="shortDesc"
                    required
                    rows={3}
                    value={formData.shortDesc}
                    onChange={handleChange}
                    placeholder="Write a brief summary..."
                    className="w-full px-4 py-3 bg-[#FAF7F3] border border-[#EBE4DE] rounded-xl text-sm focus:outline-none focus:border-[#8D4D5D] transition resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-[#514C48]/80 font-semibold">
                    Cover / Background Image *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      name="coverImage"
                      required
                      value={formData.coverImage}
                      onChange={handleChange}
                      placeholder="Image URL or upload"
                      className="flex-1 px-4 py-3 bg-[#FAF7F3] border border-[#EBE4DE] rounded-xl text-sm focus:outline-none focus:border-[#8D4D5D] transition"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 bg-[#2C2623] hover:bg-[#8D4D5D] text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition shrink-0">
                      <FiUploadCloud size={16} />
                      {uploadingField === "coverImage" ? "..." : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleCloudinaryUpload(e, "coverImage")}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-[#514C48]/80 font-semibold">
                    Brand Logo *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      name="logo"
                      required
                      value={formData.logo}
                      onChange={handleChange}
                      placeholder="Logo URL or upload"
                      className="flex-1 px-4 py-3 bg-[#FAF7F3] border border-[#EBE4DE] rounded-xl text-sm focus:outline-none focus:border-[#8D4D5D] transition"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 bg-[#2C2623] hover:bg-[#8D4D5D] text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition shrink-0">
                      <FiUploadCloud size={16} />
                      {uploadingField === "logo" ? "..." : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleCloudinaryUpload(e, "logo")}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#EBE4DE]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-serif text-[#2C2623]">Popup Slider Gallery Images</span>
                    <button
                      type="button"
                      onClick={addGalleryField}
                      className="text-xs font-semibold text-[#8D4D5D] hover:underline uppercase tracking-wider cursor-pointer"
                    >
                      + Add Image
                    </button>
                  </div>

                  {formData.images.map((imgUrl, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => handleGalleryChange(index, e.target.value)}
                        placeholder={`Gallery Image #${index + 1} URL`}
                        className="flex-1 px-4 py-2.5 bg-[#FAF7F3] border border-[#EBE4DE] rounded-xl text-sm focus:outline-none"
                      />
                      <label className="cursor-pointer px-3 py-2.5 bg-[#FAF7F3] hover:bg-[#EBE4DE] border border-[#EBE4DE] rounded-xl text-xs font-semibold transition shrink-0">
                        <FiUploadCloud size={14} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleCloudinaryUpload(e, "images", index)}
                        />
                      </label>
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGalleryField(index)}
                          className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition cursor-pointer"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#EBE4DE]">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 bg-[#2C2623] hover:bg-[#8D4D5D] text-white rounded-2xl text-xs uppercase tracking-widest font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "Saving..." : isEditing ? "Update Collaboration" : "Publish Collaboration"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}