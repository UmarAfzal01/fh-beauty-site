'use client';

import { useState, useEffect, useRef } from 'react';

export default function DashboardAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Popup modal state for full customer details view
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // State to track which row's three-dot dropdown menu is open and its button coordinates
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load appointments');
      
      const fetchedArray = Array.isArray(data) 
        ? data 
        : data.appointments || data.data || [];
        
      setAppointments(fetchedArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'active' : 'pending';
    
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update status');

      setAppointments((prev) =>
        prev.map((app) => (app._id === id || app.id === id ? { ...app, status: nextStatus } : app))
      );

      // If modal is open, update its appointments state as well
      setSelectedCustomer((prev) => {
        if (!prev) return null;
        const updatedAppointments = prev.appointments.map((app) =>
          (app._id === id || app.id === id ? { ...app, status: nextStatus } : app)
        );
        return { ...prev, appointments: updatedAppointments };
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to delete appointment');

      setAppointments((prev) => prev.filter((app) => (app._id || app.id) !== id));

      // If modal is open, remove it from modal appointments and close if empty
      setSelectedCustomer((prev) => {
        if (!prev) return null;
        const remaining = prev.appointments.filter((app) => (app._id || app.id) !== id);
        if (remaining.length === 0) return null;
        return { ...prev, appointments: remaining };
      });
    } catch (err) {
      alert(err.message);
    }
  };

  // Helper to get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSetToday = () => {
    setSelectedDate(getTodayString());
  };

  // Function to open customer details modal by gathering all appointments for this customer
  const handleViewCustomerDetails = (appointment) => {
    const targetEmail = (appointment.email || '').toLowerCase().trim();
    const targetPhone = (appointment.phone || '').toLowerCase().trim();
    const targetName = (appointment.fullName || '').toLowerCase().trim();

    // Find all appointments matching this customer (by email, phone, or name)
    const customerAppointments = appointments.filter((app) => {
      const appEmail = (app.email || '').toLowerCase().trim();
      const appPhone = (app.phone || '').toLowerCase().trim();
      const appName = (app.fullName || '').toLowerCase().trim();

      if (targetEmail && appEmail === targetEmail) return true;
      if (targetPhone && appPhone === targetPhone) return true;
      if (appName && appName === targetName) return true;
      return false;
    });

    setSelectedCustomer({
      name: appointment.fullName || 'Unknown',
      email: appointment.email || 'N/A',
      phone: appointment.phone || 'N/A',
      patientType: appointment.patientType || 'N/A',
      appointments: customerAppointments,
    });
  };

  // Toggle dropdown and calculate absolute positioning relative to the viewport/document
  const handleToggleDropdown = (e, recordId) => {
    e.stopPropagation();
    if (openDropdownId === recordId) {
      setOpenDropdownId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownCoords({
        top: rect.bottom + window.scrollY + 6,
        right: window.innerWidth - rect.right,
      });
      setOpenDropdownId(recordId);
    }
  };

  // Filter appointments based on search query (phone or email) and date selection
  const filteredAppointments = appointments.filter((app) => {
    const query = searchQuery.toLowerCase().trim();
    const phoneMatch = app.phone ? app.phone.toLowerCase().includes(query) : false;
    const emailMatch = app.email ? app.email.toLowerCase().includes(query) : false;
    const matchesSearch = !query || phoneMatch || emailMatch;

    const matchesDate = !selectedDate || (app.preferredDate && app.preferredDate.includes(selectedDate));

    return matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F3] flex items-center justify-center text-[#514C48] font-serif">
        Loading appointments...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F3] p-4 sm:p-8 text-[#514C48]">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0DED8] pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#111]">Dashboard Appointments</h1>
            <p className="text-xs sm:text-sm text-[#514C48]/70 font-light">
              Activate appointments to push them automatically to Google Calendar.
            </p>
          </div>
          <button
            onClick={fetchAppointments}
            className="self-start sm:self-auto bg-white border border-[#E0DED8] px-4 py-2 rounded-xl text-xs uppercase tracking-widest hover:border-[#111] transition-all cursor-pointer shadow-sm"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Search and Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-[24px] border border-[#E0DED8]/80 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-end gap-4 justify-between">
          <div className="w-full lg:w-1/2">
            <label className="block text-xs font-sans uppercase tracking-wider text-[#514C48]/70 mb-1.5">
              Search by Phone or Email
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter phone number or email..."
              className="w-full bg-[#FAF7F3] border border-[#E0DED8] rounded-xl px-4 py-2.5 text-sm text-[#111] focus:outline-none focus:border-[#111] transition"
            />
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div>
              <label className="block text-xs font-sans uppercase tracking-wider text-[#514C48]/70 mb-1.5">
                Filter by Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto bg-[#FAF7F3] border border-[#E0DED8] rounded-xl px-4 py-2.5 text-sm text-[#111] focus:outline-none focus:border-[#111] transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSetToday}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-[#FAF7F3] border border-[#E0DED8] text-[#111] rounded-xl text-xs font-sans uppercase tracking-wider hover:border-[#111] transition whitespace-nowrap"
              >
                Today's Appointments
              </button>
              {(selectedDate || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedDate('');
                    setSearchQuery('');
                  }}
                  className="px-3 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-sans uppercase tracking-wider hover:bg-rose-100 transition whitespace-nowrap"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-[#E0DED8]/80 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F3] border-b border-[#E0DED8] text-[10px] sm:text-xs font-sans uppercase tracking-wider text-[#514C48]/70">
                  <th className="p-4 font-medium">Patient Name</th>
                  <th className="p-4 font-medium">Service</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Phone / Email</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DED8]/60 text-xs sm:text-sm">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-[#514C48]/50 font-light">
                      No matching appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app) => {
                    const status = app.status || 'pending';
                    const isActive = status === 'active';
                    const recordId = app._id || app.id;

                    return (
                      <tr key={recordId} className="hover:bg-[#FAF7F3]/50 transition-colors">
                        <td className="p-4 font-serif font-medium text-[#111]">
                          {app.fullName}
                          <span className="block text-[10px] text-[#514C48]/60 font-sans font-normal">
                            {app.patientType} ({app.appointmentFor})
                          </span>
                        </td>
                        <td className="p-4">{app.service}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-medium text-[#111]">{app.preferredDate}</span>
                          <span className="block text-xs text-[#514C48]/70">{app.preferredTime}</span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-medium text-[#111]">{app.phone}</span>
                          {app.email && (
                            <span className="block text-xs text-[#514C48]/70">{app.email}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[10px] font-sans uppercase tracking-widest font-bold ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end">
                            {/* Three Dots Button */}
                            <button
                              onClick={(e) => handleToggleDropdown(e, recordId)}
                              className="w-9 h-9 rounded-xl bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-[#111] hover:border-[#111] transition-all cursor-pointer shadow-sm font-bold text-lg"
                              title="Actions"
                            >
                              &#8942;
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

        {/* Absolutely Positioned Dropdown Menu (Escapes table overflow scrollbar clipping) */}
        {openDropdownId && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: `${dropdownCoords.top}px`,
              right: `${dropdownCoords.right}px`,
            }}
            className="z-50 w-48 bg-white border border-[#E0DED8] rounded-2xl shadow-2xl py-2 text-left space-y-1"
          >
            {(() => {
              const app = appointments.find((a) => (a._id || a.id) === openDropdownId);
              if (!app) return null;
              const status = app.status || 'pending';
              const isActive = status === 'active';
              const recordId = app._id || app.id;

              return (
                <>
                  <button
                    onClick={() => {
                      setOpenDropdownId(null);
                      handleViewCustomerDetails(app);
                    }}
                    className="w-full px-4 py-2.5 text-xs font-sans uppercase tracking-wider text-[#111] hover:bg-[#FAF7F3] transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>👤</span> Customer Details
                  </button>
                  <button
                    onClick={() => {
                      setOpenDropdownId(null);
                      handleToggleStatus(recordId, status);
                    }}
                    className="w-full px-4 py-2.5 text-xs font-sans uppercase tracking-wider text-[#111] hover:bg-[#FAF7F3] transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>{isActive ? '⏸️' : '▶️'}</span> {isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => {
                      setOpenDropdownId(null);
                      handleDelete(recordId);
                    }}
                    className="w-full px-4 py-2.5 text-xs font-sans uppercase tracking-wider text-rose-700 hover:bg-rose-50 transition flex items-center gap-2.5 cursor-pointer border-t border-[#E0DED8]/60 mt-1 pt-2.5"
                  >
                    <span>🗑️</span> Delete
                  </button>
                </>
              );
            })()}
          </div>
        )}

        {/* Customer Details Popup Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] border border-[#E0DED8] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-[#E0DED8] pb-4">
                <div>
                  <h3 className="text-xl font-serif font-medium text-[#111]">{selectedCustomer.name}</h3>
                  <p className="text-xs text-[#514C48]/70 font-sans mt-0.5">
                    {selectedCustomer.phone} • {selectedCustomer.email} • <span className="uppercase">{selectedCustomer.patientType}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-8 h-8 rounded-full bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-xs font-sans text-[#111] hover:bg-[#E0DED8] transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-sans uppercase tracking-wider text-[#514C48]/70">Appointment History & Actions</h4>
                  <span className="text-xs font-sans text-[#514C48]/60">Total: {selectedCustomer.appointments.length}</span>
                </div>
                <div className="space-y-3">
                  {selectedCustomer.appointments.map((app, appIdx) => {
                    const status = app.status || 'pending';
                    const isActive = status === 'active';
                    const recordId = app._id || app.id;

                    return (
                      <div key={recordId || appIdx} className="bg-[#FAF7F3] p-4 rounded-xl border border-[#E0DED8]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium font-serif text-[#111]">{app.service}</p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-sans uppercase tracking-widest font-bold ${
                                isActive
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                          <p className="text-xs text-[#514C48]/70">
                            {app.preferredDate} at {app.preferredTime} {app.appointmentFor ? `• (${app.appointmentFor})` : ''}
                          </p>
                        </div>
                        
                        {/* Action buttons inside the modal item */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => handleToggleStatus(recordId, status)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-sans uppercase tracking-wider transition-all cursor-pointer shadow-sm whitespace-nowrap ${
                              isActive
                                ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                                : 'bg-[#111] text-white hover:bg-[#7A5C58]'
                            }`}
                          >
                            {isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(recordId)}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-sans uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E0DED8] flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-6 py-2.5 bg-[#111] text-white rounded-xl text-xs font-sans uppercase tracking-widest hover:bg-[#333] transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}