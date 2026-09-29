'use client';

import React, { useState, useEffect } from "react";
import { IoIosArrowRoundForward, IoMdAdd, IoMdClose } from "react-icons/io";
import { PiImage } from "react-icons/pi";
import { CldUploadButton } from "next-cloudinary";
import toast, { Toaster } from "react-hot-toast";

const initialFormState = {
  hero: { name: '', shortDesc: '', image: '' },
  about: { desc: '' },
  howItWorks: { image: '', steps: [{ title: '', description: '' }] },
  candidateRequirements: { image: '', smallDesc: '', requirements: [''] },
  faqs: [{ question: '', answer: '' }]
};

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSlug, setEditSlug] = useState(null);

  const [form, setForm] = useState(initialFormState);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) setServices(data.services);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setForm(initialFormState);
    setIsEditing(false);
    setEditSlug(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setForm({
      hero: { ...service.hero },
      about: { ...service.about },
      howItWorks: { 
        image: service.howItWorks?.image || '', 
        steps: service.howItWorks?.steps?.length ? [...service.howItWorks.steps] : [{ title: '', description: '' }] 
      },
      candidateRequirements: { 
        image: service.candidateRequirements?.image || '', 
        smallDesc: service.candidateRequirements?.smallDesc || '', 
        requirements: service.candidateRequirements?.requirements?.length ? [...service.candidateRequirements.requirements] : [''] 
      },
      faqs: service.faqs?.length ? [...service.faqs] : [{ question: '', answer: '' }]
    });
    setIsEditing(true);
    setEditSlug(service.slug);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(initialFormState);
    setIsEditing(false);
    setEditSlug(null);
  };

  // Dynamic Array Handlers (Add / Remove)
  const handleStepChange = (index, field, value) => {
    setForm(prev => {
      const steps = [...prev.howItWorks.steps];
      steps[index][field] = value;
      return { ...prev, howItWorks: { ...prev.howItWorks, steps } };
    });
  };

  const addStep = () => {
    setForm(prev => ({
      ...prev,
      howItWorks: { ...prev.howItWorks, steps: [...prev.howItWorks.steps, { title: '', description: '' }] }
    }));
  };

  const removeStep = (index) => {
    setForm(prev => ({
      ...prev,
      howItWorks: { ...prev.howItWorks, steps: prev.howItWorks.steps.filter((_, i) => i !== index) }
    }));
  };

  const handleRequirementChange = (index, value) => {
    setForm(prev => {
      const requirements = [...prev.candidateRequirements.requirements];
      requirements[index] = value;
      return { ...prev, candidateRequirements: { ...prev.candidateRequirements, requirements } };
    });
  };

  const addRequirement = () => {
    setForm(prev => ({
      ...prev,
      candidateRequirements: { ...prev.candidateRequirements, requirements: [...prev.candidateRequirements.requirements, ''] }
    }));
  };

  const removeRequirement = (index) => {
    setForm(prev => ({
      ...prev,
      candidateRequirements: { ...prev.candidateRequirements, requirements: prev.candidateRequirements.requirements.filter((_, i) => i !== index) }
    }));
  };

  const handleFaqChange = (index, field, value) => {
    setForm(prev => {
      const faqs = [...prev.faqs];
      faqs[index][field] = value;
      return { ...prev, faqs };
    });
  };

  const addFaq = () => {
    setForm(prev => ({ ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }));
  };

  const removeFaq = (index) => {
    setForm(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/services/${editSlug}` : '/api/services';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(isEditing ? "Service updated successfully" : "Service added successfully");
        fetchServices();
        closeModal();
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <>
      <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-12 px-4 md:px-8 xl:px-12">
        
        {/* Top Header with Add Service Button */}
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-[#F3EDE2]/50 p-6 rounded-3xl border border-[#E6DEC9] mb-8 shadow-sm">
          <div>
            <h1 className="text-3xl font-serif font-normal tracking-tight text-[#111]">
              Clinic Services Dashboard
            </h1>
            <p className="text-sm text-[#514C48]/70 mt-1">Manage, add, and edit dynamic clinic treatments.</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-6 py-3.5 rounded-2xl flex items-center gap-2 transition cursor-pointer shadow-md font-sans text-sm"
          >
            <IoMdAdd size={20} /> Add New Service
          </button>
        </div>

        {/* Existing Services Preview */}
        <div className="max-w-7xl mx-auto p-8 bg-white rounded-3xl border border-[#E6DEC9] shadow-2xl shadow-[#514C48]/5">
          <h2 className="text-xl font-serif text-[#111] mb-6">Existing Clinic Services</h2>
          {loading ? <p>Loading services...</p> : services.length === 0 ? (
            <p className="text-sm text-[#514C48]/60">No services created yet. Click "Add New Service" to get started.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s._id} className="bg-[#FAF7F3] p-5 rounded-2xl border border-[#E6DEC9] flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="font-serif font-bold text-[#111] text-lg">{s?.hero?.name}</h4>
                    <p className="text-xs text-[#514C48]/60 mt-0.5 truncate">Slug: /{s?.slug}</p>
                    <p className="text-xs text-[#514C48]/80 mt-2 line-clamp-2 font-serif">{s?.hero?.shortDesc}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E6DEC9]">
                    <button
                      onClick={() => openEditModal(s)}
                      className="flex-1 bg-[#111] text-[#FAF7F3] text-xs font-medium py-2 rounded-xl text-center hover:bg-[#333] transition"
                    >
                      Edit ✏️
                    </button>
                    <a 
                      href={`/services/${s?.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 text-xs bg-white py-2 rounded-xl border border-[#E6DEC9] font-medium text-center hover:bg-[#111] hover:text-[#FAF7F3] transition"
                    >
                      View ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Popup for Add / Edit Service */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#FAF7F3] w-full max-w-5xl rounded-3xl border border-[#E6DEC9] shadow-2xl max-h-[90vh] overflow-y-auto p-8 relative my-8">
              
              {/* Close Modal Button */}
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 bg-[#F3EDE2] hover:bg-[#E6DEC9] p-2.5 rounded-full text-[#111] transition"
              >
                <IoMdClose size={22} />
              </button>

              <form onSubmit={handleSubmit} className="space-y-8">
                <h2 className="text-2xl font-serif font-normal tracking-tight text-[#111] border-b border-[#E6DEC9] pb-4">
                  {isEditing ? 'Edit Clinic Service' : 'Add New Clinic Service'}
                </h2>

                {/* 1. Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#F3EDE2]/50 p-8 rounded-2xl border border-[#E6DEC9]">
                  <div className="flex flex-col gap-5 w-full">
                    <h3 className="font-serif text-lg text-[#111]">1. Hero Section</h3>
                    <input
                      type="text"
                      placeholder="Service Name (e.g., Advanced Laser Resurfacing)"
                      value={form.hero.name}
                      onChange={(e) => setForm(prev => ({ ...prev, hero: { ...prev.hero, name: e.target.value } }))}
                      required
                      className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
                    />
                    <textarea
                      rows={4}
                      placeholder="Short Description"
                      value={form.hero.shortDesc}
                      onChange={(e) => setForm(prev => ({ ...prev, hero: { ...prev.hero, shortDesc: e.target.value } }))}
                      required
                      className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition resize-none font-serif"
                    />
                  </div>

                  {/* Hero Image Upload */}
                  <div className="flex flex-col gap-4 w-full justify-between bg-[#FAF7F3] p-6 rounded-2xl border border-[#E6DEC9]">
                    <div className="flex flex-col gap-4">
                      <div
                        className="w-full h-44 rounded-2xl bg-cover bg-center border border-[#E6DEC9] shadow-inner"
                        style={{ backgroundImage: `url(${form.hero.image || "https://res.cloudinary.com/dgtk4rthy/image/upload/v1756465642/Blog-Size_bzpiux.jpg"})` }}
                      ></div>
                      <CldUploadButton
                        onSuccess={(result) => setForm(prev => ({ ...prev, hero: { ...prev.hero, image: result.info.secure_url } }))}
                        uploadPreset="Services_Img"
                        className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-4 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition w-full cursor-pointer font-sans"
                      >
                        <PiImage size={18} /> Upload Hero Image
                      </CldUploadButton>
                    </div>
                  </div>
                </div>

                {/* 2. About Service */}
                <div className="bg-[#F3EDE2]/50 p-8 rounded-2xl border border-[#E6DEC9] space-y-5">
                  <h3 className="font-serif text-lg text-[#111]">2. About Service</h3>
                  <textarea
                    rows={5}
                    placeholder="Detailed About Description"
                    value={form.about.desc}
                    onChange={(e) => setForm(prev => ({ ...prev, about: { desc: e.target.value } }))}
                    required
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition resize-none font-serif"
                  />
                </div>

                {/* 3. How It Works (With Plus / Minus) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#F3EDE2]/50 p-8 rounded-2xl border border-[#E6DEC9]">
                  <div className="flex flex-col gap-5 w-full">
                    <h3 className="font-serif text-lg text-[#111]">3. How It Works</h3>
                    {form.howItWorks.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-2 items-start bg-[#FAF7F3] p-4 rounded-2xl border border-[#E6DEC9]">
                        <div className="flex flex-col gap-3 flex-1">
                          <input
                            type="text"
                            placeholder={`Step ${idx + 1} Title`}
                            value={step.title}
                            onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                            required
                            className="w-full bg-white border border-[#E6DEC9] rounded-xl px-4 py-2.5 text-sm font-serif"
                          />
                          <input
                            type="text"
                            placeholder="Step Description"
                            value={step.description}
                            onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                            required
                            className="w-full bg-white border border-[#E6DEC9] rounded-xl px-4 py-2.5 text-sm font-serif"
                          />
                        </div>
                        {form.howItWorks.steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStep(idx)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 p-2.5 rounded-xl transition text-sm font-bold"
                            title="Remove Step"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addStep}
                      className="bg-[#111] text-[#FAF7F3] text-xs font-medium px-4 py-2.5 rounded-xl w-fit"
                    >
                      + Add Step
                    </button>
                  </div>

                  {/* How it works Image Upload */}
                  <div className="flex flex-col gap-4 w-full justify-between bg-[#FAF7F3] p-6 rounded-2xl border border-[#E6DEC9]">
                    <div className="flex flex-col gap-4">
                      <div
                        className="w-full h-44 rounded-2xl bg-cover bg-center border border-[#E6DEC9] shadow-inner"
                        style={{ backgroundImage: `url(${form.howItWorks.image || "https://res.cloudinary.com/dgtk4rthy/image/upload/v1756465642/Blog-Size_bzpiux.jpg"})` }}
                      ></div>
                      <CldUploadButton
                        onSuccess={(result) => setForm(prev => ({ ...prev, howItWorks: { ...prev.howItWorks, image: result.info.secure_url } }))}
                        uploadPreset="Services_Img"
                        className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-4 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition w-full cursor-pointer font-sans"
                      >
                        <PiImage size={18} /> Upload How It Works Image
                      </CldUploadButton>
                    </div>
                  </div>
                </div>

                {/* 4. Candidate Requirements (With Plus / Minus) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#F3EDE2]/50 p-8 rounded-2xl border border-[#E6DEC9]">
                  <div className="flex flex-col gap-5 w-full">
                    <h3 className="font-serif text-lg text-[#111]">4. Candidate Requirements</h3>
                    <input
                      type="text"
                      placeholder="Small Description"
                      value={form.candidateRequirements.smallDesc}
                      onChange={(e) => setForm(prev => ({ ...prev, candidateRequirements: { ...prev.candidateRequirements, smallDesc: e.target.value } }))}
                      required
                      className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] font-serif"
                    />
                    {form.candidateRequirements.requirements.map((req, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder={`Requirement #${idx + 1}`}
                          value={req}
                          onChange={(e) => handleRequirementChange(idx, e.target.value)}
                          required
                          className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-2.5 text-sm font-serif"
                        />
                        {form.candidateRequirements.requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(idx)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 p-2.5 rounded-xl transition text-sm font-bold shrink-0"
                            title="Remove Requirement"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="bg-[#111] text-[#FAF7F3] text-xs font-medium px-4 py-2.5 rounded-xl w-fit"
                    >
                      + Add Requirement
                    </button>
                  </div>

                  {/* Requirements Image Upload */}
                  <div className="flex flex-col gap-4 w-full justify-between bg-[#FAF7F3] p-6 rounded-2xl border border-[#E6DEC9]">
                    <div className="flex flex-col gap-4">
                      <div
                        className="w-full h-44 rounded-2xl bg-cover bg-center border border-[#E6DEC9] shadow-inner"
                        style={{ backgroundImage: `url(${form.candidateRequirements.image || "https://res.cloudinary.com/dgtk4rthy/image/upload/v1756465642/Blog-Size_bzpiux.jpg"})` }}
                      ></div>
                      <CldUploadButton
                        onSuccess={(result) => setForm(prev => ({ ...prev, candidateRequirements: { ...prev.candidateRequirements, image: result.info.secure_url } }))}
                        uploadPreset="Services_Img"
                        className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-4 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition w-full cursor-pointer font-sans"
                      >
                        <PiImage size={18} /> Upload Requirements Image
                      </CldUploadButton>
                    </div>
                  </div>
                </div>

                {/* 5. Quick Questions / FAQs (With Plus / Minus) */}
                <div className="bg-[#F3EDE2]/50 p-8 rounded-2xl border border-[#E6DEC9] space-y-5">
                  <h3 className="font-serif text-lg text-[#111]">5. Quick Questions (FAQs)</h3>
                  {form.faqs.map((faq, idx) => (
                    <div key={idx} className="flex gap-2 items-start bg-[#FAF7F3] p-4 rounded-2xl border border-[#E6DEC9]">
                      <div className="flex flex-col gap-3 flex-1">
                        <input
                          type="text"
                          placeholder="Question"
                          value={faq.question}
                          onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                          required
                          className="w-full bg-white border border-[#E6DEC9] rounded-xl px-4 py-2.5 text-sm font-serif font-medium"
                        />
                        <textarea
                          rows={2}
                          placeholder="Long Answer"
                          value={faq.answer}
                          onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                          required
                          className="w-full bg-white border border-[#E6DEC9] rounded-xl px-4 py-2.5 text-sm font-serif resize-none"
                        />
                      </div>
                      {form.faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-2.5 rounded-xl transition text-sm font-bold"
                          title="Remove FAQ"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFaq}
                    className="bg-[#111] text-[#FAF7F3] text-xs font-medium px-4 py-2.5 rounded-xl"
                  >
                    + Add FAQ
                  </button>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-[#E6DEC9]">
                  <button
                    type="submit"
                    className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-8 py-4 rounded-2xl flex items-center gap-2 transition cursor-pointer shadow-lg font-sans"
                  >
                    {isEditing ? 'Update Service' : 'Save Service'} <IoIosArrowRoundForward size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-[#F3EDE2] hover:bg-[#E6DEC9] text-[#514C48] font-medium px-8 py-4 rounded-2xl transition font-sans border border-[#E6DEC9]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
      <Toaster />
    </>
  );
}