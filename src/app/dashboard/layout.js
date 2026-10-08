'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  MdKeyboardArrowUp
} from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Define categorized menu groups with collapsible dropdown support
  const [openCategories, setOpenCategories] = useState({
    overview: true,
    ecommerce: true,
    operations: true,
    content: true,
  });

  const toggleCategory = (categoryKey) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  // Set initial sidebar state based on screen size (open on desktop, closed on mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const navCategories = [
    {
      key: "overview",
      label: "Overview",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: MdDashboard }
      ]
    },
    {
      key: "ecommerce",
      label: "E-Commerce",
      items: [
        { href: "/dashboard/items", label: "Items", icon: MdInventory2 },
        { href: "/dashboard/orders", label: "Orders", icon: MdShoppingBag }
      ]
    },
    {
      key: "operations",
      label: "Operations",
      items: [
        { href: "/dashboard/appointments", label: "Appointments", icon: MdEventNote },
        { href: "/dashboard/customers", label: "Customers", icon: FaPeopleGroup },
        { href: "/dashboard/doctors", label: "Doctors", icon: MdLocalHospital }
      ]
    },
    {
      key: "content",
      label: "Content & Pages",
      items: [
        { href: "/dashboard/blogs", label: "Blogs", icon: MdArticle },
        { href: "/dashboard/about", label: "About Page", icon: MdInfo }
      ]
    }
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

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 h-[100svh] bg-[#F8F4EC]/95 md:bg-[#F3EDE2]/60 backdrop-blur-md border-r border-[#E6DEC9] flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out overflow-y-auto ${
          isSidebarOpen 
            ? "translate-x-0 w-72 p-6 opacity-100 shadow-2xl md:shadow-none" 
            : "-translate-x-full md:translate-x-0 md:w-0 md:p-0 md:opacity-0 md:border-none md:overflow-hidden"
        }`}
      >
        <div className="space-y-6 w-72">
          {/* Logo / Brand & Mobile Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC9]">
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

          {/* Categorized Dropdown Navigation */}
          <nav className="space-y-4 font-serif">
            {navCategories.map((cat) => {
              const isOpen = openCategories[cat.key];
              return (
                <div key={cat.key} className="space-y-1">
                  {/* Category Dropdown Header */}
                  <button
                    onClick={() => toggleCategory(cat.key)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs uppercase tracking-widest font-semibold text-[#514C48]/70 hover:text-[#111] transition rounded-lg hover:bg-[#FAF7F3]"
                  >
                    <span>{cat.label}</span>
                    {isOpen ? <MdKeyboardArrowUp size={16} /> : <MdKeyboardArrowDown size={16} />}
                  </button>

                  {/* Category Items Accordion */}
                  {isOpen && (
                    <div className="space-y-1 pl-2">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              if (window.innerWidth < 768) setIsSidebarOpen(false);
                            }}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition border text-sm ${
                              isActive
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
        </div>

        {/* Bottom Section / Logout */}
        <div className="pt-6 border-t border-[#E6DEC9] w-72">
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-700 hover:bg-rose-500/10 transition font-serif text-sm font-medium"
          >
            <MdLogout size={18} className="shrink-0" />
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