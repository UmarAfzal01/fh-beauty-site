"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiFileText, FiPlusCircle, FiTag, FiEye, FiTrendingUp } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [blogRes, catRes] = await Promise.all([
          fetch("/api/blogs"),
          fetch("/api/categories")
        ]);

        const blogData = await blogRes.json();
        const catData = await catRes.json();

        if (blogRes.ok) {
          setBlogs(Array.isArray(blogData) ? blogData : blogData.blogs || []);
        }
        if (catRes.ok) {
          setCategories(catData.categories || []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeBlogsCount = blogs.filter(b => b.status === "Active").length;
  const inactiveBlogsCount = blogs.filter(b => b.status === "Inactive").length;

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-12 px-6 md:px-12 xl:px-20">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E6DEC9] pb-6">
            <div>
              <h1 className="text-3xl font-serif font-normal text-[#111]">Dashboard Overview</h1>
              <p className="text-sm font-serif text-[#514C48]/70 mt-1">Welcome back, manage your content and monitor performance.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/blogs/add"
                className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] px-5 py-2.5 rounded-xl text-sm font-sans flex items-center gap-2 transition"
              >
                <FiPlusCircle size={16} /> Add New Blog
              </Link>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F3EDE2]/50 p-6 rounded-2xl border border-[#E6DEC9] flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-serif uppercase tracking-wider text-[#514C48]/70">Total Blogs</p>
                <h3 className="text-3xl font-serif text-[#111]">{blogs.length}</h3>
              </div>
              <div className="p-4 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-[#111]">
                <FiFileText size={24} />
              </div>
            </div>

            <div className="bg-[#F3EDE2]/50 p-6 rounded-2xl border border-[#E6DEC9] flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-serif uppercase tracking-wider text-[#514C48]/70">Active / Scheduled</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-serif text-emerald-700">{activeBlogsCount}</h3>
                  <span className="text-sm font-serif text-[#514C48]/50">/ {inactiveBlogsCount} Inactive</span>
                </div>
              </div>
              <div className="p-4 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-emerald-700">
                <FiTrendingUp size={24} />
              </div>
            </div>

            <div className="bg-[#F3EDE2]/50 p-6 rounded-2xl border border-[#E6DEC9] flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-serif uppercase tracking-wider text-[#514C48]/70">Categories</p>
                <h3 className="text-3xl font-serif text-[#111]">{categories.length}</h3>
              </div>
              <div className="p-4 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-[#111]">
                <FiTag size={24} />
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#F3EDE2]/50 p-6 rounded-2xl border border-[#E6DEC9] space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-serif text-[#111]">Recent Blogs</h2>
                <Link href="/dashboard/blogs" className="text-xs font-sans uppercase tracking-wider text-[#111] hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {blogs.slice(0, 5).map((blog) => {
                  const blogId = blog._id || blog.id;
                  return (
                    <div key={blogId} className="flex items-center justify-between p-4 bg-[#FAF7F3] rounded-xl border border-[#E6DEC9]">
                      <div className="space-y-1 max-w-md">
                        <h4 className="font-serif font-medium text-[#111] truncate">{blog.title}</h4>
                        <div className="flex items-center gap-2 text-xs font-serif text-[#514C48]/70">
                          <span className="capitalize px-2 py-0.5 bg-[#F3EDE2] rounded border border-[#E6DEC9]">{blog.category}</span>
                          <span>•</span>
                          <span>{blog.postedby}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-serif ${blog.status === "Active" ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20" : "bg-amber-500/10 text-amber-700 border border-amber-500/20"}`}>
                          {blog.status || "Active"}
                        </span>
                        <Link
                          href={`/dashboard/blogs/edit/${blogId}`}
                          className="p-2 bg-[#FAF7F3] border border-[#E6DEC9] rounded-lg hover:bg-[#E6DEC9] transition text-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  );
                })}
                {blogs.length === 0 && (
                  <p className="text-center font-serif text-sm text-[#514C48]/60 py-6">No blogs created yet.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#F3EDE2]/50 p-6 rounded-2xl border border-[#E6DEC9] space-y-4">
                <h2 className="text-xl font-serif text-[#111]">Quick Links</h2>
                <div className="flex flex-col gap-2.5 font-sans text-sm">
                  <Link href="/dashboard/blogs" className="p-3 bg-[#FAF7F3] rounded-xl border border-[#E6DEC9] hover:bg-[#E6DEC9]/40 transition flex items-center justify-between">
                    <span>Manage All Blogs</span>
                    <FiFileText size={16} />
                  </Link>
                  <Link href="/dashboard/blogs/add" className="p-3 bg-[#FAF7F3] rounded-xl border border-[#E6DEC9] hover:bg-[#E6DEC9]/40 transition flex items-center justify-between">
                    <span>Create Blog Post</span>
                    <FiPlusCircle size={16} />
                  </Link>
                </div>
              </div>

              <div className="bg-[#F3EDE2]/50 p-6 rounded-2xl border border-[#E6DEC9] space-y-3">
                <h2 className="text-lg font-serif text-[#111]">Active Categories</h2>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat, idx) => (
                    <span key={idx} className="text-xs bg-[#FAF7F3] border border-[#E6DEC9] px-2.5 py-1 rounded-lg font-serif capitalize">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </>
  );
};

export default Dashboard;