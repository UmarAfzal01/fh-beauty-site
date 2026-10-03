"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiFileText, FiPlusCircle, FiTag, FiEye, FiTrendingUp, FiArrowUpRight, FiEdit3, FiCalendar, FiBarChart2, FiClock } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [blogRes, catRes, appRes] = await Promise.all([
          fetch("/api/blogs"),
          fetch("/api/categories"),
          fetch("/api/appointments")
        ]);

        const blogData = await blogRes.json();
        const catData = await catRes.json();
        const appData = await appRes.json();

        if (blogRes.ok) {
          setBlogs(Array.isArray(blogData) ? blogData : blogData.blogs || []);
        }
        if (catRes.ok) {
          setCategories(catData.categories || []);
        }
        if (appRes.ok) {
          setAppointments(Array.isArray(appData) ? appData : appData.appointments || appData.data || []);
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

  // Aggregate metrics
  const totalViews = blogs.reduce((acc, blog) => acc + (blog.views || blog.viewCount || 0), 0);
  const maxViews = Math.max(...blogs.map(b => b.views || b.viewCount || 0), 1);

  // Appointment calculations
  const totalAppointments = appointments.length;
  const todayStr = new Date().toDateString();
  const todaysAppointmentsCount = appointments.filter(app => {
    const appDate = app.date || app.appointmentDate || app.createdAt;
    if (!appDate) return false;
    return new Date(appDate).toDateString() === todayStr;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#111] border-t-transparent rounded-full animate-spin" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen w-full bg-[#FAF7F3] text-[#514C48] py-12 px-6 md:px-12 xl:px-16">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Top Header Row with Date/Action Icon */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-serif font-normal text-[#111] flex items-center gap-2">
                Welcome, Dr Warda Sikander <span className="inline-block animate-wave">👋</span>
              </h1>
              <p className="text-sm font-serif text-[#514C48]/70">
                Manage blogs, track total views, review appointments, and performance — all in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white border border-[#E6DEC9] rounded-2xl shadow-2xs text-[#514C48]">
                <FiCalendar size={18} />
              </div>
              <Link
                href="/dashboard/blogs/add"
                className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] px-5 py-3 rounded-2xl text-xs font-sans tracking-wider uppercase flex items-center gap-2 transition shadow-sm"
              >
                <FiPlusCircle size={16} /> Add New Blog
              </Link>
            </div>
          </div>

          {/* 4 Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Total Blogs */}
            <div className="bg-white p-7 rounded-3xl border border-[#E6DEC9] shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-[#514C48]/60">
                  <span className="p-2 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-[#111]">
                    <FiFileText size={14} />
                  </span>
                  Total Blogs
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <h3 className="text-4xl font-serif font-normal text-[#111]">{blogs.length}</h3>
                <span className="text-xs font-sans font-medium text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <FiTrendingUp size={12} /> Live
                </span>
              </div>
            </div>

            {/* Card 2: Total Views */}
            <div className="bg-white p-7 rounded-3xl border border-[#E6DEC9] shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-[#514C48]/60">
                  <span className="p-2 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-[#111]">
                    <FiEye size={14} />
                  </span>
                  Total Views
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <h3 className="text-4xl font-serif font-normal text-[#111]">{totalViews.toLocaleString()}</h3>
                <span className="text-xs font-sans font-medium text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <FiTrendingUp size={12} /> +12%
                </span>
              </div>
            </div>

            {/* Card 3: Total Appointments */}
            <div className="bg-white p-7 rounded-3xl border border-[#E6DEC9] shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-[#514C48]/60">
                  <span className="p-2 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-[#111]">
                    <FiCalendar size={14} />
                  </span>
                  Total Appointments
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <h3 className="text-4xl font-serif font-normal text-[#111]">{totalAppointments}</h3>
                <span className="text-xs font-sans font-medium text-[#111] bg-[#FAF7F3] border border-[#E6DEC9] px-2.5 py-1 rounded-full flex items-center gap-1">
                  All Time
                </span>
              </div>
            </div>

            {/* Card 4: Today's Appointments */}
            <div className="bg-white p-7 rounded-3xl border border-[#E6DEC9] shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-[#514C48]/60">
                  <span className="p-2 bg-[#FAF7F3] border border-[#E6DEC9] rounded-xl text-[#111]">
                    <FiClock size={14} />
                  </span>
                  Today's Appointments
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <h3 className="text-4xl font-serif font-normal text-emerald-700">{todaysAppointmentsCount}</h3>
                <span className="text-xs font-sans font-medium text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <FiTrendingUp size={12} /> Today
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Grid: Overview Chart Section & Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Overview Vertical Bar Chart Section */}
            <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-[#E6DEC9] shadow-xs space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-serif text-[#111]">Overview</h2>
                  <p className="text-xs font-serif text-[#514C48]/60 mt-0.5">Top performing blogs comparison</p>
                </div>
                <div className="text-xs font-sans bg-[#FAF7F3] border border-[#E6DEC9] px-3.5 py-1.5 rounded-xl text-[#514C48] flex items-center gap-2">
                  <span>Last Month</span> ▾
                </div>
              </div>

              {/* Summary Metric inside Overview */}
              <div className="pt-2">
                <p className="text-xs font-serif text-[#514C48]/60 uppercase tracking-wider">Avg Views Per Blog</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h4 className="text-3xl font-serif text-[#111]">
                    {blogs.length ? Math.round(totalViews / blogs.length).toLocaleString() : 0}
                  </h4>
                  <span className="text-xs font-sans text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md font-medium">
                    50.2% ▲
                  </span>
                </div>
              </div>

              {/* Custom Vertical Bar Chart UI */}
              <div className="pt-8 pb-2">
                {blogs.length === 0 ? (
                  <p className="text-center font-serif text-sm text-[#514C48]/50 py-10">No analytics data available.</p>
                ) : (
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-4 items-end h-52 border-b border-[#E6DEC9] pb-4">
                    {blogs.slice(0, 6).map((blog, idx) => {
                      const views = blog.views || blog.viewCount || 0;
                      const heightPercent = Math.max(Math.round((views / maxViews) * 100), 15);
                      const isHighlighted = idx === 2;

                      return (
                        <div key={blog._id || idx} className="flex flex-col items-center gap-2 h-full justify-end group relative">
                          
                          {/* Tooltip Popup on Hover */}
                          <div className="absolute -top-12 bg-[#111] text-[#FAF7F3] text-[10px] font-sans px-2.5 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-md pointer-events-none z-10">
                            <p className="font-semibold truncate max-w-[100px]">{blog.title}</p>
                            <p className="text-neutral-300">{views} Views</p>
                          </div>

                          {/* Vertical Column Bar */}
                          <div 
                            className={`w-full max-w-[48px] rounded-2xl transition-all duration-300 ${
                              isHighlighted 
                                ? "bg-[#111] shadow-lg ring-4 ring-[#111]/10 flex flex-col items-center pt-2" 
                                : "bg-[#F3EDE2] hover:bg-[#E6DEC9]"
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          >
                            {isHighlighted && (
                              <span className="w-2 h-2 rounded-full bg-white block mb-auto" />
                            )}
                          </div>

                          <span className="text-[11px] font-serif text-[#514C48]/70 truncate w-full text-center">
                            {blog.category || "General"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Recent Blogs / History Feed */}
            <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-[#E6DEC9] shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-serif text-[#111]">Recent Blogs</h2>
                  <Link href="/dashboard/blogs" className="text-xs font-sans uppercase tracking-wider text-[#111] hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {blogs.slice(0, 3).map((blog) => {
                    const blogId = blog._id || blog.id;
                    const views = blog.views || blog.viewCount || 0;
                    return (
                      <div key={blogId} className="p-4 bg-[#FAF7F3] rounded-2xl border border-[#E6DEC9] space-y-2 hover:border-[#514C48]/40 transition">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-sans tracking-wider bg-white px-2.5 py-0.5 rounded-md border border-[#E6DEC9] text-[#514C48]/70">
                            {blog.category || "Blog"}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-serif ${blog.status === "Active" ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}`}>
                            {blog.status || "Active"}
                          </span>
                        </div>
                        <h4 className="font-serif font-medium text-sm text-[#111] truncate">{blog.title}</h4>
                        <div className="flex justify-between items-center text-xs text-[#514C48]/60 font-serif pt-1">
                          <span>{views} views</span>
                          <Link href={`/dashboard/blogs/edit/${blogId}`} className="text-[#111] hover:underline flex items-center gap-0.5">
                            Edit <FiArrowUpRight size={12} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  {blogs.length === 0 && (
                    <p className="text-center text-xs text-[#514C48]/50 italic py-6">No recent blogs found.</p>
                  )}
                </div>
              </div>

              {/* Active Categories footer snippet */}
              <div className="pt-4 border-t border-[#E6DEC9]">
                <p className="text-xs font-serif text-[#514C48]/60 mb-2">Categories ({categories.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.slice(0, 4).map((cat, idx) => (
                    <span key={idx} className="text-[11px] bg-[#FAF7F3] border border-[#E6DEC9] px-2.5 py-1 rounded-lg font-serif capitalize">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Toaster position="bottom-right" />
    </>
  );
};

export default Dashboard;