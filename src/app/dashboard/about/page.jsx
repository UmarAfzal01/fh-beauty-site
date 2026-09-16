"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundForward, IoIosArrowDown } from "react-icons/io";
import { LuHeading2 } from "react-icons/lu";
import { BsTextParagraph } from "react-icons/bs";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { PiImage, PiColumns } from "react-icons/pi";
import { MdDragIndicator } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { CldUploadButton } from "next-cloudinary";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const AddAbout = () => {
  const router = useRouter();
  const [subtitle, setSubtitle] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [description, setDescription] = useState("");
  const [morefields, setMoreFields] = useState([]);

  // Accordion open/close state tracking ("hero" open by default)
  const [openSection, setOpenSection] = useState("hero");

  const DUMMY_IMAGE = "https://www.dummyimage.com/1240x800/f3f3f3/000";

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        if (data.success && data.about) {
          setSubtitle(data.about.subtitle || "");
          setTitle(data.about.title || "");
          setImage(data.about.img || "");
          setImgAlt(data.about.imgalt || "");
          setDescription(data.about.description || "");
          setMoreFields(data.about.about_detail || []);
        }
      } catch (err) {
        console.error("Failed to fetch about data", err);
      }
    };
    fetchAboutData();
  }, []);

  const toggleAccordion = (sectionKey) => {
    setOpenSection(openSection === sectionKey ? null : sectionKey);
  };

  const handleRemoveField = (index) => {
    const updatedMoreFields = morefields.filter((_, i) => i !== index);
    setMoreFields(updatedMoreFields);
  };

  const addField = (type) => {
    if (type === "side-image") {
      setMoreFields([
        ...morefields,
        {
          type,
          heading: "",
          description: "",
          imageUrl: "",
          imgAlt: "",
          alignment: "left",
        },
      ]);
    } else if (type === "triplet-batch") {
      setMoreFields([
        ...morefields,
        {
          type,
          heading: "",
          description: "",
          alignment: "left",
          mainImageIndex: 2,
          imageUrls: ["", "", ""],
          altTags: ["", "", ""],
        },
      ]);
    } else {
      setMoreFields([...morefields, { type, value: "" }]);
    }
  };

  const handleNestedChange = (index, fieldName, val) => {
    const updated = [...morefields];
    updated[index][fieldName] = val;
    setMoreFields(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(morefields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setMoreFields(items);
  };

  const renderField = (field, index) => {
    switch (field.type) {
      case "Sub":
        return (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              placeholder="Sub Heading"
              value={field.value}
              onChange={(e) => handleNestedChange(index, "value", e.target.value)}
              className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
            />
            <button
              className="bg-red-500/15 hover:bg-red-500/25 text-red-600 border border-red-500/30 p-3 rounded-xl transition shrink-0"
              type="button"
              onClick={() => handleRemoveField(index)}
            >
              ✕
            </button>
          </div>
        );
      case "description":
        return (
          <div className="flex items-start gap-2 w-full">
            <textarea
              rows={4}
              placeholder="Detail Description"
              value={field.value}
              onChange={(e) => handleNestedChange(index, "value", e.target.value)}
              className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif resize-none"
            />
            <button
              className="bg-red-500/15 hover:bg-red-500/25 text-red-600 border border-red-500/30 p-3 rounded-xl transition shrink-0 mt-1"
              type="button"
              onClick={() => handleRemoveField(index)}
            >
              ✕
            </button>
          </div>
        );
      case "bullet":
        return (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              placeholder="Bullet Item"
              value={field.value}
              onChange={(e) => handleNestedChange(index, "value", e.target.value)}
              className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
            />
            <button
              className="bg-red-500/15 hover:bg-red-500/25 text-red-600 border border-red-500/30 p-3 rounded-xl transition shrink-0"
              type="button"
              onClick={() => handleRemoveField(index)}
            >
              ✕
            </button>
          </div>
        );
      case "side-image":
        return (
          <div className="flex items-start gap-3 w-full bg-[#F3EDE2]/60 p-5 rounded-2xl border border-[#E6DEC9]">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col gap-3 w-full md:w-1/2">
                  <input
                    type="text"
                    placeholder="Section Heading"
                    value={field.heading}
                    onChange={(e) => handleNestedChange(index, "heading", e.target.value)}
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
                  />
                  <textarea
                    rows={3}
                    placeholder="Section Description"
                    value={field.description}
                    onChange={(e) => handleNestedChange(index, "description", e.target.value)}
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-serif text-[#514C48]">Layout Alignment:</label>
                    <select
                      value={field.alignment || "left"}
                      onChange={(e) => handleNestedChange(index, "alignment", e.target.value)}
                      className="bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs text-[#514C48] focus:outline-none font-serif"
                    >
                      <option value="left">Image Left / Text Right</option>
                      <option value="right">Text Left / Image Right</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-1/2 bg-[#FAF7F3] p-4 rounded-xl border border-[#E6DEC9]">
                  <img
                    src={field.imageUrl || DUMMY_IMAGE}
                    alt={field.imgAlt || "Dummy Preview"}
                    className="w-full h-28 object-cover rounded-xl border border-[#E6DEC9]"
                  />
                  <CldUploadButton
                    uploadPreset="Blogs_Images"
                    onSuccess={(result) => {
                      const updated = [...morefields];
                      updated[index].imageUrl = result.info.secure_url;
                      setMoreFields(updated);
                    }}
                    className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer font-sans"
                  >
                    <PiImage size={16} /> Upload Image
                  </CldUploadButton>
                  <input
                    type="text"
                    placeholder="Image Alt Tag"
                    value={field.imgAlt}
                    onChange={(e) => handleNestedChange(index, "imgAlt", e.target.value)}
                    className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
                  />
                </div>
              </div>
            </div>
            <button
              className="bg-red-500/15 hover:bg-red-500/25 text-red-600 border border-red-500/30 p-3 rounded-xl transition shrink-0"
              type="button"
              onClick={() => handleRemoveField(index)}
            >
              ✕
            </button>
          </div>
        );
      case "triplet-batch":
        return (
          <div className="flex items-start gap-3 w-full bg-[#F3EDE2]/60 p-5 rounded-2xl border border-[#E6DEC9]">
            <div className="flex flex-col gap-5 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Section Heading"
                  value={field.heading}
                  onChange={(e) => handleNestedChange(index, "heading", e.target.value)}
                  className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif md:col-span-1"
                />
                <div className="flex items-center gap-2 self-center">
                  <label className="text-xs font-serif text-[#514C48]">Content Side:</label>
                  <select
                    value={field.alignment || "left"}
                    onChange={(e) => handleNestedChange(index, "alignment", e.target.value)}
                    className="bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs text-[#514C48] focus:outline-none font-serif w-full"
                  >
                    <option value="left">Text Left / Images Right</option>
                    <option value="right">Images Left / Text Right</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 self-center">
                  <label className="text-xs font-serif text-[#514C48]">Main Large Image:</label>
                  <select
                    value={field.mainImageIndex ?? 2}
                    onChange={(e) => handleNestedChange(index, "mainImageIndex", parseInt(e.target.value))}
                    className="bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs text-[#514C48] focus:outline-none font-serif w-full"
                  >
                    <option value={0}>Image #1 Main</option>
                    <option value={1}>Image #2 Main</option>
                    <option value={2}>Image #3 Main</option>
                  </select>
                </div>
              </div>

              <textarea
                rows={3}
                placeholder="Section Description text..."
                value={field.description}
                onChange={(e) => handleNestedChange(index, "description", e.target.value)}
                className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif resize-none"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => {
                  const isMain = (field.mainImageIndex ?? 2) === i;
                  return (
                    <div 
                      className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${
                        isMain ? "bg-[#111]/5 border-[#111]/30 ring-1 ring-[#111]/20" : "bg-[#FAF7F3] border-[#E6DEC9]"
                      }`} 
                      key={i}
                    >
                      <span className="text-xs font-sans font-semibold text-[#514C48]">
                        Image #{i + 1} {isMain && "⭐ (Main)"}
                      </span>
                      <img
                        src={field.imageUrls[i] || DUMMY_IMAGE}
                        alt={field.altTags[i] || `Dummy Preview ${i + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-[#E6DEC9]"
                      />
                      <CldUploadButton
                        uploadPreset="Blogs_Images"
                        onSuccess={(result) => {
                          const updated = [...morefields];
                          updated[index].imageUrls[i] = result.info.secure_url;
                          setMoreFields(updated);
                        }}
                        className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition w-full cursor-pointer font-sans"
                      >
                        <PiImage size={14} /> Upload #{i + 1}
                      </CldUploadButton>
                      <input
                        type="text"
                        placeholder={`Alt Tag #${i + 1}`}
                        value={field.altTags[i]}
                        onChange={(e) => {
                          const updated = [...morefields];
                          updated[index].altTags[i] = e.target.value;
                          setMoreFields(updated);
                        }}
                        className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-lg px-2.5 py-1.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition text-xs font-serif"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              className="bg-red-500/15 hover:bg-red-500/25 text-red-600 border border-red-500/30 p-3 rounded-xl transition shrink-0"
              type="button"
              onClick={() => handleRemoveField(index)}
            >
              ✕
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const submitData = async () => {
    if (title && description && image && imgAlt) {
      try {
        const res = await fetch("/api/about", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subtitle,
            title,
            img: image,
            imgalt: imgAlt,
            description,
            about_detail: morefields,
          }),
        });

        if (res.ok) {
          toast.success("About page configuration updated successfully");
          router.push("/dashboard");
        } else {
          toast.error("Something went wrong");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error");
      }
    } else {
      toast.error("Please fill in all mandatory fields (Title, Description, Image & Alt Tag)");
    }
  };

  return (
    <>
      <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-12 px-1">
        <form className="max-w-7xl mx-auto p-8 space-y-6 bg-[#FAF7F3] text-[#514C48] rounded-3xl border border-[#E6DEC9] shadow-2xl shadow-[#514C48]/5">
          <h1 className="text-3xl font-serif font-normal tracking-tight text-[#111] border-b border-[#E6DEC9] pb-6">
            Manage About Page
          </h1>

          {/* ACCORDION ITEM 1: Hero Header Section */}
          <div className="border border-[#E6DEC9] rounded-2xl overflow-hidden bg-[#F3EDE2]/30 transition-all">
            <button
              type="button"
              onClick={() => toggleAccordion("hero")}
              className="w-full px-6 py-4 flex items-center justify-between bg-[#F3EDE2]/60 hover:bg-[#E6DEC9]/40 transition text-left"
            >
              <span className="font-serif font-medium text-lg text-[#111]">
                1. Hero Header Section
              </span>
              <IoIosArrowDown
                size={20}
                className={`transform transition-transform duration-300 ${
                  openSection === "hero" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openSection === "hero" && (
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#FAF7F3] border-t border-[#E6DEC9]">
                <div className="flex flex-col gap-5 w-full">
                  <input
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    type="text"
                    placeholder="Subtitle"
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
                  />
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder="Main Title"
                    required
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Main Description"
                    rows={5}
                    required
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition resize-none font-serif"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-4 w-full justify-between bg-[#FAF7F3] p-6 rounded-2xl border border-[#E6DEC9]">
                  <div className="flex flex-col gap-4">
                    <div
                      className="w-full h-44 rounded-2xl bg-cover bg-center border border-[#E6DEC9] shadow-inner"
                      style={{
                        backgroundImage: `url(${image || DUMMY_IMAGE})`,
                      }}
                    ></div>
                    <div className="flex items-center">
                      <CldUploadButton
                        onSuccess={(e) => setImage(e.info.secure_url)}
                        uploadPreset="Blogs_Images"
                        className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-4 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition w-full cursor-pointer font-sans"
                      >
                        Upload Main Image
                      </CldUploadButton>
                    </div>
                  </div>
                  <input
                    value={imgAlt}
                    onChange={(e) => setImgAlt(e.target.value)}
                    type="text"
                    placeholder="Image Alt Tags"
                    required
                    className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION ITEM 2: Dynamic Content Blocks Section */}
          <div className="border border-[#E6DEC9] rounded-2xl overflow-hidden bg-[#F3EDE2]/30 transition-all">
            <button
              type="button"
              onClick={() => toggleAccordion("details")}
              className="w-full px-6 py-4 flex items-center justify-between bg-[#F3EDE2]/60 hover:bg-[#E6DEC9]/40 transition text-left"
            >
              <span className="font-serif font-medium text-lg text-[#111]">
                2. Additional Content Sections & Layouts ({morefields.length})
              </span>
              <IoIosArrowDown
                size={20}
                className={`transform transition-transform duration-300 ${
                  openSection === "details" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openSection === "details" && (
              <div className="p-6 bg-[#FAF7F3] border-t border-[#E6DEC9] space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#514C48]/60 italic font-serif">💡 Drag items using the handle to reorder</span>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="about-details-list">
                    {(provided) => (
                      <div 
                        {...provided.droppableProps} 
                        ref={provided.innerRef}
                        className="flex flex-col gap-4 w-full"
                      >
                        {morefields.map((field, index) => (
                          <Draggable key={index} draggableId={`field-${index}`} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-center gap-2 w-full transition-all ${
                                  snapshot.isDragging ? "opacity-75 scale-[1.01]" : ""
                                }`}
                              >
                                <div 
                                  {...provided.dragHandleProps} 
                                  className="cursor-grab active:cursor-grabbing text-[#514C48]/50 hover:text-[#514C48] p-1 flex items-center justify-center shrink-0"
                                  title="Drag to reorder"
                                >
                                  <MdDragIndicator size={24} />
                                </div>
                                <div className="w-full">
                                  {renderField(field, index)}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                
                <div className="pt-3 border-t border-[#E6DEC9]/60">
                  <label className="text-xs font-sans text-[#514C48]/75 mb-2 block font-medium">Add New Element Block:</label>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      type="button" 
                      onClick={() => addField("Sub")}
                      className="bg-[#FAF7F3] hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] text-[#514C48] px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition font-sans"
                    >
                      <LuHeading2 size={16} /> Heading
                    </button>
                    <button 
                      type="button" 
                      onClick={() => addField("description")}
                      className="bg-[#FAF7F3] hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] text-[#514C48] px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition font-sans"
                    >
                      <BsTextParagraph size={16} /> Description
                    </button>
                    <button 
                      type="button" 
                      onClick={() => addField("bullet")}
                      className="bg-[#FAF7F3] hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] text-[#514C48] px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition font-sans"
                    >
                      <MdOutlineFormatListBulleted size={16} /> Bullet
                    </button>
                    <button 
                      type="button" 
                      onClick={() => addField("side-image")}
                      className="bg-[#FAF7F3] hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] text-[#514C48] px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition font-sans"
                    >
                      <PiImage size={16} /> Side Image Component
                    </button>
                    <button 
                      type="button" 
                      onClick={() => addField("triplet-batch")}
                      className="bg-[#FAF7F3] hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] text-[#514C48] px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition font-sans"
                    >
                      <PiColumns size={16} /> Triplet Batch Component
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#E6DEC9]">
            <button 
              type="button" 
              onClick={submitData} 
              className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-8 py-4 rounded-2xl flex items-center gap-2 transition cursor-pointer shadow-lg shadow-[#514C48]/10 font-sans"
            >
              Save <IoIosArrowRoundForward size={22} />
            </button>
            <a 
              href="/dashboard" 
              className="bg-[#F3EDE2] hover:bg-[#E6DEC9] text-[#514C48] font-medium px-8 py-4 rounded-2xl transition text-center font-sans border border-[#E6DEC9]"
            >
              Cancel
            </a>
          </div>
        </form>
      </main>
      <Toaster />
    </>
  );
};

export default AddAbout;