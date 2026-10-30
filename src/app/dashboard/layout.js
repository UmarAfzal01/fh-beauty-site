'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  MdDashboard,
  MdArticle,
  MdEventNote,
  MdLogout,
  MdInfo,
  MdLocalHospital,
  MdMenu,
  MdClose,
  MdInventory2,
  MdShoppingBag,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdAssessment,
} from "react-icons/md";
import { LuHandshake, LuPanelTopOpen } from "react-icons/lu";
import { FaPeopleGroup } from "react-icons/fa6";

const navCategories = [
  {
    key: "overview",
    label: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: MdDashboard }],
  },
  {
    key: "ecommerce",
    label: "E-Commerce",
    items: [
      { href: "/dashboard/items", label: "Items", icon: MdInventory2 },
      { href: "/dashboard/orders", label: "Orders", icon: MdShoppingBag },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    items: [
      { href: "/dashboard/appointments", label: "Appointments", icon: MdEventNote },
      { href: "/dashboard/customers", label: "Customers", icon: FaPeopleGroup },
      { href: "/dashboard/doctors", label: "Doctors", icon: MdLocalHospital },
      { href: "/dashboard/reports", label: "Patient Reports", icon: MdAssessment },
    ],
  },
  {
    key: "content",
    label: "Content & Pages",
    items: [
      { href: "/dashboard/blogs", label: "Blogs", icon: MdArticle },
      { href: "/dashboard/about", label: "About Page", icon: MdInfo },
      { href: "/dashboard/banner-select", label: "Main Popup", icon: LuPanelTopOpen },
      { href: "/dashboard/collaborations", label: "Collaborations", icon: LuHandshake },
    ],
  },
];

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const [openCategories, setOpenCategories] = useState({
    overview: true,
    ecommerce: true,
    operations: true,
    content: true,
  });

  const toggleCategory = (key) =>
    setOpenCategories((prev) => ({ ...prev, [key]: !prev[key] }));

  // Closed by default on mobile
  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  // Active on exact match, or on nested routes (e.g. /dashboard/items/edit/123)
  const isActiveRoute = (href) =>
    href === "/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F3] via-[#F5EFEB] to-[#EFE7DD] text-[#514C48] flex selection:bg-[#E6DEC9] selection:text-[#111]">

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/25 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar: outer shell only animates width/position and never scrolls */}
      <aside
        inert={!isSidebarOpen}
        className={`fixed md:sticky top-0 left-0 z-50 h-[100svh] shrink-0 overflow-hidden bg-[#F8F4EC]/95 md:bg-[#F3EDE2]/60 backdrop-blur-md border-r border-[#E6DEC9] transition-[width,transform] duration-300 ease-in-out ${
          isSidebarOpen
            ? "translate-x-0 w-72 shadow-2xl md:shadow-none"
            : "-translate-x-full md:translate-x-0 w-72 md:w-0 md:border-r-0"
        }`}
      >
        {/* Fixed-width inner column keeps content from squishing while collapsing */}
        <div className="flex h-full w-72 flex-col p-6">

          {/* Header (pinned) */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC9] shrink-0">
            <div>
              <h2 className="text-xl font-serif font-medium text-[#111]">Admin Panel</h2>
              <p className="text-xs text-[#514C48]/60 font-serif mt-0.5">Management Dashboard</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 rounded-xl text-[#514C48] hover:bg-[#E6DEC9]/40 transition cursor-pointer"
              aria-label="Close Sidebar"
            >
              <MdClose size={22} />
            </button>
          </div>

          {/* Nav (the only scrolling part) */}
          <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-4 -mr-3 pr-3 space-y-4 font-serif [scrollbar-width:thin] [scrollbar-color:#E6DEC9_transparent]">
            {navCategories.map((cat) => {
              const isOpen = openCategories[cat.key];
              return (
                <div key={cat.key} className="space-y-1">
                  <button
                    onClick={() => toggleCategory(cat.key)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs uppercase tracking-widest font-semibold text-[#514C48]/70 hover:text-[#111] transition rounded-lg hover:bg-[#FAF7F3] cursor-pointer"
                  >
                    <span>{cat.label}</span>
                    {isOpen ? <MdKeyboardArrowUp size={16} /> : <MdKeyboardArrowDown size={16} />}
                  </button>

                  {isOpen && (
                    <div className="space-y-1 pl-2">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActiveRoute(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              if (window.innerWidth < 768) setIsSidebarOpen(false);
                            }}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition border text-sm ${
                              active
                                ? "bg-white text-[#111] border-[#E6DEC9] shadow-xs font-semibold"
                                : "text-[#514C48] hover:bg-[#FAF7F3] hover:text-[#111] border-transparent hover:border-[#E6DEC9]"
                            }`}
                          >
                            <Icon size={18} className="shrink-0 text-[#514C48]/80" />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout (pinned) */}
          <div className="pt-4 border-t border-[#E6DEC9] shrink-0">
            <button
              type="button"
              onClick={() => signOut({ redirectTo: "/login" })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-700 hover:bg-rose-500/10 transition font-serif text-sm font-medium cursor-pointer"
            >
              <MdLogout size={18} className="shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-8 border-b border-[#E6DEC9]/70 bg-white/60 backdrop-blur-md flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsSidebarOpen((v) => !v)}
            className="p-2.5 rounded-xl bg-white/80 border border-[#E6DEC9] text-[#111] hover:bg-white transition shadow-xs flex items-center justify-center cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <MdMenu size={22} />
          </button>

          <div className="text-xs font-serif text-[#514C48]/70 tracking-wide uppercase">
            Admin Control Center
          </div>
        </header>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}