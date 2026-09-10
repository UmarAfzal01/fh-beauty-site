import Link from 'next/link';
import { MdDashboard, MdArticle, MdEventNote, MdLogout } from 'react-icons/md';
import { FaPeopleGroup } from "react-icons/fa6";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FAF7F3] text-[#514C48] flex selection:bg-[#E6DEC9] selection:text-[#111]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#F3EDE2]/60 border-r border-[#E6DEC9] flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div className="space-y-8">
          {/* Logo / Brand */}
          <div>
            <h2 className="text-xl font-serif font-medium text-[#111]">Admin Panel</h2>
            <p className="text-xs text-[#514C48]/60 font-serif mt-0.5">Management Dashboard</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 font-serif">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#514C48] hover:bg-[#FAF7F3] hover:text-[#111] transition border border-transparent hover:border-[#E6DEC9]"
            >
              <MdDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/blogs"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#514C48] hover:bg-[#FAF7F3] hover:text-[#111] transition border border-transparent hover:border-[#E6DEC9]"
            >
              <MdArticle size={20} />
              <span>Blogs</span>
            </Link>
            <Link
              href="/dashboard/appointments"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#514C48] hover:bg-[#FAF7F3] hover:text-[#111] transition border border-transparent hover:border-[#E6DEC9]"
            >
              <MdEventNote size={20} />
              <span>Appointments</span>
            </Link>
            <Link
              href="/dashboard/customers"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#514C48] hover:bg-[#FAF7F3] hover:text-[#111] transition border border-transparent hover:border-[#E6DEC9]"
            >
              <FaPeopleGroup size={20} />
              <span>Customers</span>
            </Link>

          </nav>
        </div>
        {/* Bottom Section / Logout */}
        <div className="pt-6 border-t border-[#E6DEC9]">
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-500/10 transition font-serif"
          >
            <MdLogout size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}