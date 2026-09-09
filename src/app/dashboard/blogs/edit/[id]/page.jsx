"use client"
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { IoIosArrowRoundForward } from "react-icons/io";
import { LuHeading2, LuGripVertical } from "react-icons/lu";
import { BsTextParagraph } from "react-icons/bs";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { PiImage, PiImages } from "react-icons/pi";
import { AiFillYoutube } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import { CldUploadButton } from "next-cloudinary";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const EditBlog = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // Assumes your route folder is structured like app/blogs/edit/[id]/page.jsx

  const [heading, setHeading] = useState("");
  const [writer, setWriter] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState(["activity", "achievement", "donation"]);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [bannerAlt, setBannerAlt] = useState("");
  const [image, setimage] = useState("");
  const [fields, setFields] = useState([]);
  const [value, setValue] = useState("");
  const [morefields, setMoreFields] = useState([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch categories and existing blog data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        if (catData.success && catData.categories.length > 0) {
          setCategories(catData.categories);
        }

        // Fetch Existing Blog Data
        if (id) {
          const blogRes = await fetch(`/api/blogs/${id}`);
          const blogData = await blogRes.json();
          
          if (blogRes.ok && blogData) {
            const blog = blogData.blog || blogData; 
            setHeading(blog.title || "");
            setWriter(blog.postedby || "");
            setCategory(blog.category || "");
            setUrl(blog.slug || "");
            setDescription(blog.description || "");
            setMetaDescription(blog.metaDescription || "");
            setBannerAlt(blog.imgalt || "");
            setimage(blog.img || "");
            setFields(blog.tags || []);
            setMoreFields(blog.blog_detail || []);
            
            if (blog.scheduledAt) {
              const formattedDate = new Date(blog.scheduledAt).toISOString().slice(0, 16);
              setScheduledDate(formattedDate);
            }
          } else {
            toast.error("Failed to load blog data");
          }
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);
        toast.error("Server error while loading blog");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddCategory = async () => {
    const trimmed = newCategoryInput.trim().toLowerCase();
    if (trimmed !== "") {
      try {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmed }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setCategories([...categories, data.category]);
          setNewCategoryInput("");
          toast.success("Category added successfully");
        } else {
          toast.error(data.error || "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error");
      }
    }
  };

  const handleRemoveCategory = async (catToRemove) => {
    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catToRemove }),
      });

      if (res.ok) {
        setCategories(categories.filter((cat) => cat !== catToRemove));
        if (category === catToRemove) {
          setCategory("");
        }
        toast.success("Category removed");
      } else {
        toast.error("Failed to remove category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handleRemoveField = (index) => {
    const updatedMoreFields = morefields.filter((_, i) => i !== index);
    setMoreFields(updatedMoreFields);
  };

  const addField = (type) => {
    if (type === "single-image") {
      setMoreFields([...morefields, { type, value: "", imageUrl: "" }]);
    } else if (type === "double-image") {
      setMoreFields([
        ...morefields,
        { type, value: ["", ""], imageUrls: ["", ""] },
      ]);
    } else if (type === "youtube") {
      setMoreFields([...morefields, { type, value: "" }]);
    } else {
      setMoreFields([...morefields, { type, value: "" }]);
    }
  };

  const handleChange = (index, value) => {
    const updated = [...morefields];
    updated[index].value = value;
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
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
            />
            <button
              className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/30 p-3 rounded-xl transition shrink-0"
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
              rows={5}
              placeholder="Description"
              value={field.value}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif resize-none"
            />
            <button
              className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/30 p-3 rounded-xl transition shrink-0 mt-1"
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
              placeholder="Bullet Heading"
              value={field.value}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
            />
            <button
              className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/30 p-3 rounded-xl transition shrink-0"
              type="button"
              onClick={() => handleRemoveField(index)}
            >
              ✕
            </button>
          </div>
        );
      case "single-image":
        return (
          <div className="flex items-center gap-3 w-full bg-[#F3EDE2]/60 p-4 rounded-2xl border border-[#E6DEC9]">
            <div className="flex flex-col gap-3 w-full">
              {field.imageUrl && (
                <img
                  src={field.imageUrl}
                  alt={field.value}
                  className="w-32 h-20 object-cover rounded-xl border border-[#E6DEC9]"
                />
              )}
              <div className="flex items-center gap-3">
                <CldUploadButton
                  uploadPreset="Blogs_Images"
                  onSuccess={(result) => {
                    const updated = [...morefields];
                    updated[index].imageUrl = result.info.secure_url;
                    setMoreFields(updated);
                  }}
                  className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition cursor-pointer font-sans"
                >
                  <PiImage size={18} /> Upload Image
                </CldUploadButton>
              </div>
              <input
                type="text"
                placeholder="Image Alt Tag"
                value={field.value}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
              />
            </div>
            <button
              className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/30 p-3 rounded-xl transition shrink-0 self-start"
              type="button"
              onClick={() => handleRemoveField(index)}
            >
              ✕
            </button>
          </div>
        );
      case "youtube":
        return (
          <div className="flex items-center gap-2 w-full">
            <div className="w-full relative flex items-center">
              <input
                type="text"
                placeholder="Paste YouTube Video URL (e.g., https://www.youtube.com/watch?v=...)"
                value={field.value}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-4 py-3 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
              />
            </div>
            <button
              className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/30 p-3 rounded-xl transition shrink-0"
              type="button"
              onClick={() => handleRemoveField(index)}
            >
              ✕
            </button>
          </div>
        );
      case "double-image":
        return (
          <div className="flex items-center gap-3 w-full bg-[#F3EDE2]/60 p-4 rounded-2xl border border-[#E6DEC9]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {[0, 1].map((i) => (
                <div className="flex flex-col gap-3 p-3 bg-[#FAF7F3] rounded-xl border border-[#E6DEC9]" key={i}>
                  {field.imageUrls?.[i] && (
                    <img
                      src={field.imageUrls[i]}
                      alt={field.value?.[i]}
                      className="w-32 h-20 object-cover rounded-xl border border-[#E6DEC9]"
                    />
                  )}
                  <CldUploadButton
                    uploadPreset="Blogs_Images"
                    onSuccess={(result) => {
                      const updated = [...morefields];
                      if (!updated[index].imageUrls) updated[index].imageUrls = ["", ""];
                      updated[index].imageUrls[i] = result.info.secure_url;
                      setMoreFields(updated);
                    }}
                    className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition w-fit cursor-pointer font-sans"
                  >
                    <PiImage size={18} /> Upload Image {i + 1}
                  </CldUploadButton>
                  <input
                    type="text"
                    placeholder="Image Alt Tag"
                    value={field.value?.[i] || ""}
                    onChange={(e) => {
                      const updated = [...morefields];
                      if (!updated[index].value) updated[index].value = ["", ""];
                      updated[index].value[i] = e.target.value;
                      setMoreFields(updated);
                    }}
                    className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-4 py-2 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition text-sm font-serif"
                  />
                </div>
              ))}
            </div>
            <button
              className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/30 p-3 rounded-xl transition shrink-0 self-start"
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

  const handleAddTag = () => {
    if (value.trim() !== "") {
      const newTags = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      setFields([...fields, ...newTags]);
      setValue("");
    }
  };

  const handleDeleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateData = async () => {
    if (
      heading &&
      writer &&
      category &&
      url &&
      description &&
      metaDescription &&
      bannerAlt &&
      image
    ) {
      try {
        const finalScheduledDate = scheduledDate
          ? new Date(scheduledDate).toISOString()
          : null;

        const res = await fetch(`/api/blogs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: heading,
            postedby: writer,
            category,
            slug: url,
            description,
            metaDescription,
            imgalt: bannerAlt,
            img: image,
            tags: fields,
            blog_detail: morefields,
            scheduledAt: finalScheduledDate,
          }),
        });

        if (res.ok) {
          toast.success("Blog updated successfully");
          router.push("/dashboard");
        } else {
          toast.error("Something went wrong");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error");
      }
    } else {
      toast.error("All fields are required including Meta Description");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F3] flex items-center justify-center text-[#514C48] font-serif text-lg">
        Loading blog data...
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-12 px-6 md:px-12 xl:px-20">
        <form className="max-w-5xl mx-auto p-8 space-y-8 bg-[#FAF7F3] text-[#514C48] rounded-3xl border border-[#E6DEC9] shadow-2xl shadow-[#514C48]/5">
          <h1 className="text-3xl font-serif font-normal tracking-tight text-[#111] border-b border-[#E6DEC9] pb-6">
            Edit Blog Post
          </h1>

          {/* Top Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#F3EDE2]/50 p-8 rounded-2xl border border-[#E6DEC9]">
            <div className="flex flex-col gap-5 w-full">
              <input
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                type="text"
                placeholder="Heading"
                required
                className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                <input
                  value={writer}
                  onChange={(e) => setWriter(e.target.value)}
                  type="text"
                  placeholder="Writer"
                  required
                  className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
                />
                
                <div className="flex flex-col gap-2 md:col-span-2">
                  <div className="flex gap-2">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] focus:outline-none focus:border-[#111] transition font-serif"
                    >
                      <option value="" disabled className="bg-[#FAF7F3]">
                        Select Category
                      </option>
                      {categories.map((cat, i) => (
                        <option key={i} value={cat} className="bg-[#FAF7F3] capitalize">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="New category name"
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] text-xs font-medium px-3 py-2 rounded-xl transition shrink-0 font-sans"
                    >
                      Add Cat
                    </button>
                  </div>

                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {categories.map((cat, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 text-[11px] bg-[#FAF7F3] border border-[#E6DEC9] px-2 py-0.5 rounded-lg font-serif capitalize">
                          {cat}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(cat)}
                            className="text-red-600 hover:text-red-800 font-bold ml-0.5"
                            title="Remove category"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  type="text"
                  placeholder="Url (Slug)"
                  required
                  className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif md:col-span-3"
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-serif uppercase tracking-wider text-[#514C48]/70">
                  Schedule Post (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] focus:outline-none focus:border-[#111] transition font-serif"
                />
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Top Description"
                rows={4}
                required
                className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition resize-none font-serif"
              ></textarea>

              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Meta Description"
                rows={4}
                required
                className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition resize-none font-serif"
              ></textarea>
            </div>

            {/* Banner Upload Section */}
            <div className="flex flex-col gap-4 w-full justify-between bg-[#FAF7F3] p-6 rounded-2xl border border-[#E6DEC9]">
              <div className="flex flex-col gap-4">
                <div
                  className="w-full h-56 rounded-2xl bg-cover bg-center border border-[#E6DEC9] shadow-inner"
                  style={{
                    backgroundImage: `url(${image || "https://res.cloudinary.com/dgtk4rthy/image/upload/v1756465642/Blog-Size_bzpiux.jpg"})`,
                  }}
                ></div>
                <div className="flex items-center">
                  <CldUploadButton
                    onSuccess={(e) => setimage(e.info.secure_url)}
                    uploadPreset="Blogs_Images"
                    className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-4 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition w-full cursor-pointer font-sans"
                  >
                    Change Banner Image
                  </CldUploadButton>
                </div>
              </div>
              <input
                value={bannerAlt}
                onChange={(e) => setBannerAlt(e.target.value)}
                type="text"
                placeholder="Banner Image Alt Tags"
                required
                className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
              />
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-[#F3EDE2]/50 p-8 rounded-2xl border border-[#E6DEC9] space-y-5">
            <label className="font-serif text-lg text-[#111] block">Add Tags</label>
            {fields.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {fields.map((field, index) => (
                  <div key={index} className="flex items-center gap-2 bg-[#FAF7F3] border border-[#E6DEC9] px-3.5 py-2 rounded-xl text-sm font-serif">
                    <span>{field}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteField(index)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type Tag(s) separated by commas & click 'Add'"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl px-4 py-3.5 text-[#514C48] placeholder-[#514C48]/40 focus:outline-none focus:border-[#111] transition font-serif"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-6 py-3.5 rounded-xl transition shrink-0 font-sans"
              >
                Add
              </button>
            </div>
          </div>

          {/* Additional Content Blocks Section with DragDropContext */}
          <div className="bg-[#F3EDE2]/50 p-8 rounded-2xl border border-[#E6DEC9] space-y-5">
            <label className="font-serif text-lg text-[#111] block">Add Additional Information :</label>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="blog-fields">
                {(provided) => (
                  <div 
                    className="flex flex-col gap-4 w-full"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {morefields.map((field, index) => (
                      <Draggable key={index} draggableId={`field-${index}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-start gap-2 w-full transition-all ${
                              snapshot.isDragging ? "opacity-75 scale-[1.01]" : ""
                            }`}
                          >
                            <div 
                              {...provided.dragHandleProps}
                              className="mt-3.5 text-[#514C48]/50 hover:text-[#111] cursor-grab active:cursor-grabbing shrink-0"
                              title="Drag to reorder"
                            >
                              <LuGripVertical size={20} />
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
            
            <div className="pt-3">
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
                  onClick={() => addField("single-image")}
                  className="bg-[#FAF7F3] hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] text-[#514C48] px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition font-sans"
                >
                  <PiImage size={16} /> Image
                </button>
                <button 
                  type="button" 
                  onClick={() => addField("double-image")}
                  className="bg-[#FAF7F3] hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] text-[#514C48] px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition font-sans"
                >
                  <PiImages size={16} /> Dual Image
                </button>
                <button 
                  type="button" 
                  onClick={() => addField("youtube")}
                  className="bg-[#FAF7F3] hover:bg-[#E6DEC9]/40 border border-[#E6DEC9] text-[#514C48] px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition font-sans"
                >
                  <AiFillYoutube size={18} className="text-red-600" /> Video
                </button>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#E6DEC9]">
            <button 
              type="button" 
              onClick={updateData} 
              className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium px-8 py-4 rounded-2xl flex items-center gap-2 transition cursor-pointer shadow-lg shadow-[#514C48]/10 font-sans"
            >
              Update <IoIosArrowRoundForward size={22} />
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

export default EditBlog;