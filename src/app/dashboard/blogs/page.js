"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (res.ok) {
        setBlogs(data.blogs || data);
      } else {
        toast.error("Failed to fetch blogs");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBlogs(blogs.filter((blog) => blog._id !== id && blog.id !== id));
        toast.success("Blog deleted successfully");
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48]">
        Loading blogs...
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-12 px-6 md:px-12 xl:px-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center border-b border-[#E6DEC9] pb-6">
            <h1 className="text-3xl font-serif font-normal text-[#111]">Manage Blogs</h1>
            <Link
              href="/dashboard/blogs/add"
              className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] px-5 py-2.5 rounded-xl text-sm font-sans transition"
            >
              Add New Blog
            </Link>
          </div>

          <div className="bg-[#F3EDE2]/50 rounded-2xl border border-[#E6DEC9] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E6DEC9] text-xs font-serif uppercase tracking-wider text-[#514C48]/70 bg-[#FAF7F3]/50">
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Writer</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DEC9] font-serif text-sm">
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-[#514C48]/60">
                        No blogs found.
                      </td>
                    </tr>
                  ) : (
                    blogs.map((blog) => {
                      const blogId = blog._id || blog.id;
                      return (
                        <tr key={blogId} className="hover:bg-[#FAF7F3]/80 transition">
                          <td className="p-4 font-medium text-[#111] max-w-xs truncate">
                            {blog.title}
                          </td>
                          <td className="p-4 capitalize">{blog.category}</td>
                          <td className="p-4">{blog.postedby}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-3">
                              <Link
                                href={`/blogs/${blog.slug}`}
                                target="_blank"
                                className="p-2 bg-[#FAF7F3] border border-[#E6DEC9] rounded-lg hover:bg-[#E6DEC9] transition text-[#514C48]"
                                title="View Live"
                              >
                                <FiEye size={16} />
                              </Link>
                              <Link
                                href={`/dashboard/blogs/edit/${blogId}`}
                                className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-600 hover:bg-blue-500/20 transition"
                                title="Edit"
                              >
                                <FiEdit size={16} />
                              </Link>
                              <button
                                onClick={() => handleDelete(blogId)}
                                className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 hover:bg-red-500/20 transition"
                                title="Delete"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </>
  );
};

export default ManageBlogs;