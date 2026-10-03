'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MdDashboard, 
  MdArticle, 
  MdEventNote, 
  MdLogout, 
  MdInfo, 
  MdLocalHospital,
  MdMenu,
  MdClose,
  MdInventory2
} from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { GrCatalog } from "react-icons/gr";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Set initial sidebar state based on screen size (open on desktop, closed on mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: MdDashboard },
    { href: "/dashboard/doctors", label: "Doctors", icon: MdLocalHospital },
    { href: "/dashboard/blogs", label: "Blogs", icon: MdArticle },
    { href: "/dashboard/appointments", label: "Appointments", icon: MdEventNote },
    { href: "/dashboard/customers", label: "Customers", icon: FaPeopleGroup },
    { href: "/dashboard/services", label: "Services", icon: GrCatalog },
    { href: "/dashboard/bundles", label: "Bundles", icon: MdInventory2 },
    { href: "/dashboard/about", label: "About Page", icon: MdInfo },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F3] via-[#F5EFEB] to-[#EFE7DD] text-[#514C48] flex selection:bg-[#E6DEC9] selection:text-[#111]">
      
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/25 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation - Locked to 100svh and sticky */}
      <aside 
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 h-[100svh] bg-[#F8F4EC]/95 md:bg-[#F3EDE2]/60 backdrop-blur-md border-r border-[#E6DEC9] flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out overflow-y-auto ${
          isSidebarOpen 
            ? "translate-x-0 w-72 p-6 opacity-100 shadow-2xl md:shadow-none" 
            : "-translate-x-full md:translate-x-0 md:w-0 md:p-0 md:opacity-0 md:border-none md:overflow-hidden"
        }`}
      >
        <div className="space-y-8 w-72">
          {/* Logo / Brand & Mobile Close Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-medium text-[#111]">
                Admin Panel
              </h2>
              <p className="text-xs text-[#514C48]/60 font-serif mt-0.5">
                Management Dashboard
              </p>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 rounded-xl text-[#514C48] hover:bg-[#E6DEC9]/40 transition cursor-pointer"
              aria-label="Close Sidebar"
            >
              <MdClose size={22} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 font-serif">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#514C48] hover:bg-[#FAF7F3] hover:text-[#111] transition border border-transparent hover:border-[#E6DEC9] shadow-2xs"
                >
                  <Icon size={20} className="text-[#514C48]/80 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section / Logout */}
        <div className="pt-6 border-t border-[#E6DEC9] w-72">
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-700 hover:bg-rose-500/10 transition font-serif"
          >
            <MdLogout size={20} className="shrink-0" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Top Header Bar with Sidebar Toggle */}
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-8 border-b border-[#E6DEC9]/70 bg-white/60 backdrop-blur-md flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 rounded-xl bg-white/80 border border-[#E6DEC9] text-[#111] hover:bg-white transition shadow-xs flex items-center justify-center cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <MdMenu size={22} />
          </button>

          <div className="text-xs font-serif text-[#514C48]/70 tracking-wide uppercase">
            Admin Control Center
          </div>
        </header>

        {/* Page Content Flow */}
        <main className="flex-1">
          {children}
        </main>

      </div>
    </div>
  );
}