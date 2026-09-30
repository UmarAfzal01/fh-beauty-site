'use client';

import React, { useState, useEffect } from "react";
import { 
  IoIosArrowRoundForward, 
  IoMdAdd, 
  IoMdClose, 
  IoIosTrash, 
  IoIosCreate, 
  IoIosEye, 
  IoIosStar,
  IoIosInformationCircle,
  IoIosCheckmarkCircleOutline,
  IoIosHelpCircle
} from "react-icons/io";
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
      toast.error("Failed to load services");
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

  // Delete Handler
  const handleDelete = async (slug, serviceName) => {
    if (!confirm(`Are you sure you want to delete "${serviceName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/services/${slug}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Service deleted successfully");
        fetchServices();
      } else {
        toast.error(data.error || "Failed to delete service");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error during deletion");
    }
  };

  // Dynamic Array Handlers
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
      <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-12 px-4 md:px-8 xl:px-12 selection:bg-[#8D4D5D]/20">
        
        {/* Top Header */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl border border-[#EBE4DE] mb-8 shadow-sm gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F3] border border-[#EBE4DE] text-[10px] uppercase font-sans tracking-[0.2em] text-[#8D4D5D] font-semibold">
              <IoIosStar size={12} /> Management Portal
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-normal text-[#2C2623] tracking-tight">
              Clinic Services Dashboard
            </h1>
            <p className="text-sm text-[#514C48]/70 font-sans">
              Seamlessly curate, structure, and manage dynamic clinical treatments and layout configurations.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#2C2623] hover:bg-[#8D4D5D] text-white font-medium px-6 py-4 rounded-2xl flex items-center gap-2.5 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg font-sans text-xs uppercase tracking-widest shrink-0"
          >
            <IoMdAdd size={18} /> Add New Service
          </button>
        </div>

        {/* Existing Services Section */}
        <div className="max-w-7xl mx-auto p-8 lg:p-10 bg-white rounded-3xl border border-[#EBE4DE] shadow-sm">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#FAF7F3]">
            <h2 className="text-xl font-serif text-[#2C2623]">Active Clinic Treatments</h2>
            <span className="text-xs px-3 py-1 rounded-full bg-[#FAF7F3] border border-[#EBE4DE] text-[#514C48] font-medium">
              {services.length} {services.length === 1 ? 'Service' : 'Services'} Available
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-[#514C48]/60 font-sans animate-pulse">
              Loading clinic services...
            </div>
          ) : services.length === 0 ? (
            <div className="py-16 text-center bg-[#FAF7F3]/50 rounded-2xl border border-dashed border-[#EBE4DE] p-8">
              <p className="text-sm text-[#514C48]/60 font-sans mb-4">No clinic services created yet. Get started by adding your first treatment.</p>
              <button
                onClick={openAddModal}
                className="bg-[#2C2623] text-white px-5 py-2.5 rounded-xl text-xs uppercase font-sans tracking-wider hover:bg-[#8D4D5D] transition-colors"
              >
                Create First Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(s => (
                <div 
                  key={s._id} 
                  className="bg-[#FAF7F3] p-6 rounded-2xl border border-[#EBE4DE] flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-md hover:border-[#DCD2C8] group"
                >
                  <div className="space-y-3">
                    {s?.hero?.image && (
                      <div 
                        className="w-full h-36 rounded-xl bg-cover bg-center border border-[#EBE4DE] shadow-inner transition-transform duration-500 group-hover:scale-[1.02]"
                        style={{ backgroundImage: `url(${s.hero.image})` }}
                      />
                    )}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-bold text-[#2C2623] text-xl group-hover:text-[#8D4D5D] transition-colors">
                          {s?.hero?.name}
                        </h4>
                        <button
                          onClick={() => handleDelete(s.slug, s?.hero?.name)}
                          className="bg-white hover:bg-red-50 text-red-500 border border-[#EBE4DE] hover:border-red-200 p-2 rounded-xl transition shadow-sm shrink-0 cursor-pointer"
                          title="Delete Service"
                        >
                          <IoIosTrash size={16} />
                        </button>
                      </div>
                      <span className="inline-block text-[10px] font-sans tracking-wider text-[#8D4D5D] bg-white px-2.5 py-0.5 rounded-md border border-[#EBE4DE] mt-1.5">
                        /{s?.slug}
                      </span>
                      <p className="text-xs text-[#514C48]/80 mt-3 line-clamp-2 font-sans leading-relaxed">
                        {s?.hero?.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-[#EBE4DE]">
                    <button
                      onClick={() => openEditModal(s)}
                      className="flex-1 bg-[#2C2623] text-white text-xs font-sans uppercase tracking-wider py-2.5 rounded-xl text-center hover:bg-[#8D4D5D] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <IoIosCreate size={15} /> Edit
                    </button>
                    <a 
                      href={`/services/${s?.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 text-xs font-sans uppercase tracking-wider bg-white py-2.5 rounded-xl border border-[#EBE4DE] text-[#2C2623] font-medium text-center hover:bg-[#FAF7F3] hover:border-[#2C2623] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <IoIosEye size={15} /> View ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Popup for Add / Edit Service */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-[#FAF7F3] w-full max-w-5xl rounded-3xl border border-[#EBE4DE] shadow-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-10 relative my-8">
              
              {/* Close Modal Button */}
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 bg-white hover:bg-[#FAF7F3] p-3 rounded-full text-[#2C2623] border border-[#EBE4DE] transition shadow-sm cursor-pointer"
              >
                <IoMdClose size={20} />
              </button>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="border-b border-[#EBE4DE] pb-5 pr-12">
                  <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#8D4D5D] font-semibold block mb-1">
                    {isEditing ? 'Configuration Edit' : 'New Setup'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#2C2623]">
                    {isEditing ? 'Edit Clinic Service' : 'Add New Clinic Service'}
                  </h2>
                </div>

                {/* 1. Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE4DE] shadow-sm">
                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex items-center gap-2 text-[#2C2623] font-serif text-lg border-b border-[#FAF7F3] pb-2">
                      <span className="w-6 h-6 rounded-full bg-[#FAF7F3] border border-[#EBE4DE] text-xs flex items-center justify-center font-sans font-bold text-[#8D4D5D]">1</span>
                      Hero Section
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-sans uppercase tracking-wider text-[#514C48]/70 font-semibold">Service Title</label>
                      <input
                        type="text"
                        placeholder="e.g., Advanced Laser Resurfacing"
                        value={form.hero.name}
                        onChange={(e) => setForm(prev => ({ ...prev, hero: { ...prev.hero, name: e.target.value } }))}
                        required
                        className="w-full bg-[#FAF7F3] border border-[#EBE4DE] rounded-xl px-4 py-3.5 text-[#2C2623] placeholder-[#514C48]/30 focus:outline-none focus:border-[#2C2623] transition font-sans text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-sans uppercase tracking-wider text-[#514C48]/70 font-semibold">Short Description</label>
                      <textarea
                        rows={4}
                        placeholder="Brief summary statement for the card or hero preview..."
                        value={form.hero.shortDesc}
                        onChange={(e) => setForm(prev => ({ ...prev, hero: { ...prev.hero, shortDesc: e.target.value } }))}
                        required
                        className="w-full bg-[#FAF7F3] border border-[#EBE4DE] rounded-xl px-4 py-3.5 text-[#2C2623] placeholder-[#514C48]/30 focus:outline-none focus:border-[#2C2623] transition resize-none font-sans text-sm"
                      />
                    </div>
                  </div>

                  {/* Hero Image Upload */}
                  <div className="flex flex-col gap-4 w-full justify-between bg-[#FAF7F3] p-6 rounded-2xl border border-[#EBE4DE]">
                    <div className="space-y-3">
                      <label className="text-[11px] font-sans uppercase tracking-wider text-[#514C48]/70 font-semibold block">Hero Background Image (1024x702)</label>
                      <div
                        className="w-full h-40 sm:h-48 rounded-xl bg-cover bg-center border border-[#EBE4DE] shadow-inner"
                        style={{ backgroundImage: `url(${form.hero.image || "https://www.dummyimage.com/1024x702/f3f3f3/000"})` }}
                      ></div>
                    </div>
                    <CldUploadButton
                      onSuccess={(result) => setForm(prev => ({ ...prev, hero: { ...prev.hero, image: result.info.secure_url } }))}
                      uploadPreset="Services_Img"
                      className="bg-[#2C2623] hover:bg-[#8D4D5D] text-white font-medium px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition w-full cursor-pointer font-sans shadow-sm"
                    >
                      <PiImage size={18} /> Upload Hero Image
                    </CldUploadButton>
                  </div>
                </div>

                {/* 2. About Service */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE4DE] shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-[#2C2623] font-serif text-lg border-b border-[#FAF7F3] pb-2">
                    <span className="w-6 h-6 rounded-full bg-[#FAF7F3] border border-[#EBE4DE] text-xs flex items-center justify-center font-sans font-bold text-[#8D4D5D]">2</span>
                    About Service Overview
                  </div>
                  <textarea
                    rows={5}
                    placeholder="Comprehensive description highlighting benefits, process safety, and expected outcomes..."
                    value={form.about.desc}
                    onChange={(e) => setForm(prev => ({ ...prev, about: { desc: e.target.value } }))}
                    required
                    className="w-full bg-[#FAF7F3] border border-[#EBE4DE] rounded-xl px-4 py-3.5 text-[#2C2623] placeholder-[#514C48]/30 focus:outline-none focus:border-[#2C2623] transition resize-none font-sans text-sm leading-relaxed"
                  />
                </div>

                {/* 3. How It Works */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE4DE] shadow-sm">
                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex items-center gap-2 text-[#2C2623] font-serif text-lg border-b border-[#FAF7F3] pb-2">
                      <span className="w-6 h-6 rounded-full bg-[#FAF7F3] border border-[#EBE4DE] text-xs flex items-center justify-center font-sans font-bold text-[#8D4D5D]">3</span>
                      How It Works Steps
                    </div>
                    
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {form.howItWorks.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start bg-[#FAF7F3] p-4 rounded-xl border border-[#EBE4DE]">
                          <span className="text-xs font-bold text-[#8D4D5D] pt-2">0{idx + 1}</span>
                          <div className="flex flex-col gap-3 flex-1">
                            <input
                              type="text"
                              placeholder={`Step ${idx + 1} Title`}
                              value={step.title}
                              onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                              required
                              className="w-full bg-white border border-[#EBE4DE] rounded-lg px-3.5 py-2.5 text-xs font-sans text-[#2C2623] focus:outline-none focus:border-[#2C2623]"
                            />
                            <input
                              type="text"
                              placeholder="Step explanation description..."
                              value={step.description}
                              onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                              required
                              className="w-full bg-white border border-[#EBE4DE] rounded-lg px-3.5 py-2.5 text-xs font-sans text-[#2C2623] focus:outline-none focus:border-[#2C2623]"
                            />
                          </div>
                          {form.howItWorks.steps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeStep(idx)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-xl transition text-xs font-bold shrink-0 mt-1 cursor-pointer"
                              title="Remove Step"
                            >
                              <IoIosTrash size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addStep}
                      className="bg-[#2C2623] hover:bg-[#8D4D5D] text-white text-xs uppercase tracking-wider font-sans font-medium px-5 py-3 rounded-xl w-fit transition shadow-sm cursor-pointer"
                    >
                      + Add Step
                    </button>
                  </div>

                  {/* How it works Image Upload */}
                  <div className="flex flex-col gap-4 w-full justify-between bg-[#FAF7F3] p-6 rounded-2xl border border-[#EBE4DE]">
                    <div className="space-y-3">
                      <label className="text-[11px] font-sans uppercase tracking-wider text-[#514C48]/70 font-semibold block">Section Visual Graphic (1024x875)</label>
                      <div
                        className="w-full h-40 sm:h-48 rounded-xl bg-cover bg-center border border-[#EBE4DE] shadow-inner"
                        style={{ backgroundImage: `url(${form.howItWorks.image || "https://www.dummyimage.com/1024x875/f3f3f3/000"})` }}
                      ></div>
                    </div>
                    <CldUploadButton
                      onSuccess={(result) => setForm(prev => ({ ...prev, howItWorks: { ...prev.howItWorks, image: result.info.secure_url } }))}
                      uploadPreset="Services_Img"
                      className="bg-[#2C2623] hover:bg-[#8D4D5D] text-white font-medium px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition w-full cursor-pointer font-sans shadow-sm"
                    >
                      <PiImage size={18} /> Upload Process Image
                    </CldUploadButton>
                  </div>
                </div>

                {/* 4. Candidate Requirements */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE4DE] shadow-sm">
                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex items-center gap-2 text-[#2C2623] font-serif text-lg border-b border-[#FAF7F3] pb-2">
                      <span className="w-6 h-6 rounded-full bg-[#FAF7F3] border border-[#EBE4DE] text-xs flex items-center justify-center font-sans font-bold text-[#8D4D5D]">4</span>
                      Candidate Requirements
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-sans uppercase tracking-wider text-[#514C48]/70 font-semibold">Overview Subheading / Small Description</label>
                      <input
                        type="text"
                        placeholder="e.g., Ideal candidates looking for skin rejuvenation..."
                        value={form.candidateRequirements.smallDesc}
                        onChange={(e) => setForm(prev => ({ ...prev, candidateRequirements: { ...prev.candidateRequirements, smallDesc: e.target.value } }))}
                        required
                        className="w-full bg-[#FAF7F3] border border-[#EBE4DE] rounded-xl px-4 py-3.5 text-[#2C2623] font-sans text-sm focus:outline-none focus:border-[#2C2623]"
                      />
                    </div>

                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                      <label className="text-[11px] font-sans uppercase tracking-wider text-[#514C48]/70 font-semibold block">Bullet Requirements</label>
                      {form.candidateRequirements.requirements.map((req, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder={`Requirement #${idx + 1}`}
                            value={req}
                            onChange={(e) => handleRequirementChange(idx, e.target.value)}
                            required
                            className="w-full bg-[#FAF7F3] border border-[#EBE4DE] rounded-xl px-4 py-2.5 text-xs font-sans text-[#2C2623] focus:outline-none focus:border-[#2C2623]"
                          />
                          {form.candidateRequirements.requirements.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRequirement(idx)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-xl transition text-sm font-bold shrink-0 cursor-pointer"
                              title="Remove Requirement"
                            >
                              <IoIosTrash size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="bg-[#2C2623] hover:bg-[#8D4D5D] text-white text-xs uppercase tracking-wider font-sans font-medium px-5 py-3 rounded-xl w-fit transition shadow-sm cursor-pointer"
                    >
                      + Add Requirement
                    </button>
                  </div>

                  {/* Requirements Image Upload */}
                  <div className="flex flex-col gap-4 w-full justify-between bg-[#FAF7F3] p-6 rounded-2xl border border-[#EBE4DE]">
                    <div className="space-y-3">
                      <label className="text-[11px] font-sans uppercase tracking-wider text-[#514C48]/70 font-semibold block">Requirements Graphic Banner (768x934)</label>
                      <div
                        className="w-full h-40 sm:h-48 rounded-xl bg-cover bg-center border border-[#EBE4DE] shadow-inner"
                        style={{ backgroundImage: `url(${form.candidateRequirements.image || "https://www.dummyimage.com/768x934/f3f3f3/000"})` }}
                      ></div>
                    </div>
                    <CldUploadButton
                      onSuccess={(result) => setForm(prev => ({ ...prev, candidateRequirements: { ...prev.candidateRequirements, image: result.info.secure_url } }))}
                      uploadPreset="Services_Img"
                      className="bg-[#2C2623] hover:bg-[#8D4D5D] text-white font-medium px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition w-full cursor-pointer font-sans shadow-sm"
                    >
                      <PiImage size={18} /> Upload Banner Image
                    </CldUploadButton>
                  </div>
                </div>

                {/* 5. Quick Questions / FAQs */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE4DE] shadow-sm space-y-5">
                  <div className="flex items-center gap-2 text-[#2C2623] font-serif text-lg border-b border-[#FAF7F3] pb-2">
                    <span className="w-6 h-6 rounded-full bg-[#FAF7F3] border border-[#EBE4DE] text-xs flex items-center justify-center font-sans font-bold text-[#8D4D5D]">5</span>
                    Frequently Asked Questions (FAQs)
                  </div>
                  
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    {form.faqs.map((faq, idx) => (
                      <div key={idx} className="flex gap-3 items-start bg-[#FAF7F3] p-4 rounded-xl border border-[#EBE4DE]">
                        <span className="text-xs font-bold text-[#8D4D5D] pt-2">Q{idx + 1}</span>
                        <div className="flex flex-col gap-3 flex-1">
                          <input
                            type="text"
                            placeholder="Type question here..."
                            value={faq.question}
                            onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                            required
                            className="w-full bg-white border border-[#EBE4DE] rounded-lg px-3.5 py-2.5 text-xs font-sans font-semibold text-[#2C2623] focus:outline-none focus:border-[#2C2623]"
                          />
                          <textarea
                            rows={2}
                            placeholder="Type detailed answer here..."
                            value={faq.answer}
                            onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                            required
                            className="w-full bg-white border border-[#EBE4DE] rounded-lg px-3.5 py-2.5 text-xs font-sans text-[#2C2623] focus:outline-none focus:border-[#2C2623] resize-none"
                          />
                        </div>
                        {form.faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFaq(idx)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-xl transition text-sm font-bold shrink-0 mt-1 cursor-pointer"
                            title="Remove FAQ"
                          >
                            <IoIosTrash size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addFaq}
                    className="bg-[#2C2623] hover:bg-[#8D4D5D] text-white text-xs uppercase tracking-wider font-sans font-medium px-5 py-3 rounded-xl transition shadow-sm cursor-pointer"
                  >
                    + Add FAQ
                  </button>
                </div>

                {/* Submit Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-[#EBE4DE]">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#2C2623] hover:bg-[#8D4D5D] text-white font-medium px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg font-sans text-xs uppercase tracking-widest"
                  >
                    {isEditing ? 'Update Service' : 'Save Service'} <IoIosArrowRoundForward size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full sm:w-auto bg-[#FAF7F3] hover:bg-[#EBE4DE] text-[#514C48] font-medium px-8 py-4 rounded-2xl transition font-sans border border-[#EBE4DE] text-xs uppercase tracking-widest cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
      <Toaster position="bottom-right" />
    </>
  );
}