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

  // Edit/Reschedule modal state
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Edit modal day slider offset
  const [editDayOffset, setEditDayOffset] = useState(0);

  // State to track which row's three-dot dropdown menu is open and its button coordinates
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);

  // Generate 30-minute time slots from 09:00 AM to 09:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 21 && minute > 0) break;
        const h24 = hour % 12 === 0 ? 12 : hour % 12;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedMinute = String(minute).padStart(2, '0');
        slots.push(`${String(h24).padStart(2, '0')}:${formattedMinute} ${ampm}`);
      }
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load appointments');
      
      const fetchedArray = Array.isArray(data) 
        ? data 
        : data.appointments || data.data || [];
        
      console.log('--- FETCHED APPOINTMENTS ---', fetchedArray);
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

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingAppointment) return;

    try {
      const recordId = editingAppointment._id || editingAppointment.id;
      const res = await fetch(`/api/appointments/${recordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferredDate: editingAppointment.preferredDate,
          preferredTime: editingAppointment.preferredTime,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update appointment schedule');

      const updatedRecord = result.data || result;

      setAppointments((prev) =>
        prev.map((app) => ((app._id || app.id) === recordId ? updatedRecord : app))
      );

      setEditingAppointment(null);
      alert('Appointment schedule updated successfully!');
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

  const handleViewCustomerDetails = (appointment) => {
    const targetEmail = (appointment.email || '').toLowerCase().trim();
    const targetPhone = (appointment.phone || '').toLowerCase().trim();
    const targetName = (appointment.fullName || '').toLowerCase().trim();

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

  const getBookedSlotsForDate = (dateStr, currentAppId) => {
    if (!dateStr) return new Set();
    const targetDate = dateStr.split('T')[0];
    const booked = new Set();
    appointments.forEach((app) => {
      const appId = app._id || app.id;
      const appDate = app.preferredDate ? app.preferredDate.split('T')[0] : '';
      if (appId !== currentAppId && appDate === targetDate && app.preferredTime) {
        booked.add(app.preferredTime);
      }
    });
    console.log(`--- BOOKED SLOTS FOR DATE [${targetDate}] (Excluding ID: ${currentAppId}) ---`, Array.from(booked));
    return booked;
  };

  const filteredAppointments = appointments.filter((app) => {
    const query = searchQuery.toLowerCase().trim();
    const phoneMatch = app.phone ? app.phone.toLowerCase().includes(query) : false;
    const emailMatch = app.email ? app.email.toLowerCase().includes(query) : false;
    const matchesSearch = !query || phoneMatch || emailMatch;

    const appDateClean = app.preferredDate ? app.preferredDate.split('T')[0] : '';
    const matchesDate = !selectedDate || appDateClean.includes(selectedDate);

    return matchesSearch && matchesDate;
  });

  const getModalVisibleDays = () => {
    const days = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + editDayOffset);

    for (let i = 0; i < 5; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dayNum = String(d.getDate()).padStart(2, '0');
      const isSunday = d.getDay() === 0;

      days.push({ dateString, dayName, dayNum, isSunday });
    }
    return days;
  };

  // Pre-calculate booked slots for the active editing appointment
  const currentRecordId = editingAppointment ? (editingAppointment._id || editingAppointment.id) : null;
  const bookedSet = editingAppointment ? getBookedSlotsForDate(editingAppointment.preferredDate, currentRecordId) : new Set();

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
                    const cleanDate = app.preferredDate ? app.preferredDate.split('T')[0] : '';

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
                          <span className="font-medium text-[#111]">{cleanDate}</span>
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

        {/* Absolutely Positioned Dropdown Menu */}
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
                      console.log('--- OPENING EDIT MODAL FOR APPOINTMENT ---', app);
                      const cleanDate = app.preferredDate ? app.preferredDate.split('T')[0] : getTodayString();
                      if (cleanDate) {
                        const today = new Date();
                        today.setHours(0,0,0,0);
                        const target = new Date(cleanDate + 'T00:00:00');
                        const diffTime = target.getTime() - today.getTime();
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        setEditDayOffset(Math.max(0, diffDays));
                      } else {
                        setEditDayOffset(0);
                      }
                      setEditingAppointment({ ...app, preferredDate: cleanDate });
                    }}
                    className="w-full px-4 py-2.5 text-xs font-sans uppercase tracking-wider text-[#111] hover:bg-[#FAF7F3] transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>✏️</span> Edit Date & Time
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

        {/* Edit Date & Time Modal */}
        {editingAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] border border-[#E0DED8] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-[#E0DED8] pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#514C48]/60 font-sans block mb-1">Reschedule Appointment</span>
                  <h3 className="text-xl font-serif font-medium text-[#111]">{editingAppointment.fullName}</h3>
                </div>
                <button
                  onClick={() => setEditingAppointment(null)}
                  className="w-8 h-8 rounded-full bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-xs font-sans text-[#111] hover:bg-[#E0DED8] transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-6">
                {/* Date Slider Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setEditDayOffset((prev) => Math.max(0, prev - 5))}
                      className="w-8 h-8 rounded-xl bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-sm font-bold text-[#111] hover:bg-[#E0DED8] transition cursor-pointer"
                    >
                      &lt;
                    </button>
                    <span className="text-sm font-serif font-medium text-[#111]">
                      {editingAppointment.preferredDate 
                        ? new Date(editingAppointment.preferredDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Select Date'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditDayOffset((prev) => prev + 5)}
                      className="w-8 h-8 rounded-xl bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-sm font-bold text-[#111] hover:bg-[#E0DED8] transition cursor-pointer"
                    >
                      &gt;
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {getModalVisibleDays().map((day) => {
                      const isSelected = editingAppointment.preferredDate === day.dateString;
                      const isSunday = day.isSunday;

                      return (
                        <button
                          key={day.dateString}
                          type="button"
                          disabled={isSunday}
                          onClick={() => {
                            if (!isSunday) {
                              console.log('--- SELECTED NEW DATE IN MODAL ---', day.dateString);
                              setEditingAppointment({ 
                                ...editingAppointment, 
                                preferredDate: day.dateString
                              });
                            }
                          }}
                          className={`aspect-square rounded-2xl p-2 flex flex-col items-center justify-center transition-all duration-300 relative border ${
                            isSunday
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-80'
                              : isSelected
                              ? 'bg-[#111] text-white border-[#111] shadow-lg scale-105'
                              : 'bg-[#FAF7F3] text-[#514C48] border-[#E0DED8]/60 hover:bg-white hover:border-[#7A5C58] cursor-pointer'
                          }`}
                        >
                          <span className={`text-[9px] uppercase tracking-wider mb-0.5 ${isSelected ? 'text-white/70' : 'text-[#514C48]/60'}`}>
                            {day.dayName}
                          </span>
                          <span className={`text-base sm:text-lg font-serif ${isSelected ? 'font-bold text-white' : 'font-medium text-[#111]'}`}>
                            {day.dayNum}
                          </span>
                          {isSunday && (
                            <span className="absolute inset-x-1 bottom-1 bg-rose-100 text-rose-800 text-[8px] uppercase tracking-wider font-bold py-0.5 rounded text-center shadow-xs">
                              Closed
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots Grid Section (9 AM to 9 PM) */}
                <div className="space-y-3">
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#514C48]/70">
                    Select Time Slot (30 mins) — Active Date: {editingAppointment.preferredDate || 'None'}
                  </label>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 bg-[#FAF7F3] rounded-2xl border border-[#E0DED8]/80 max-h-60 overflow-y-auto">
                    {timeSlots.map((slot) => {
                      const isBooked = bookedSet.has(slot);
                      const isSelected = editingAppointment.preferredTime === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => {
                            console.log('--- SELECTED TIME SLOT ---', slot);
                            setEditingAppointment({ ...editingAppointment, preferredTime: slot });
                          }}
                          className={`py-2 px-2 rounded-xl border text-xs font-medium transition-all text-center block ${
                            isBooked
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60 line-through'
                              : isSelected
                              ? 'bg-[#111] text-white border-[#111] shadow-md scale-105'
                              : 'bg-white text-[#514C48] border-[#E0DED8] hover:border-[#111] cursor-pointer'
                          }`}
                        >
                          <span>{slot}</span>
                          {isBooked && <span className="block text-[8px] text-rose-500 font-normal">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E0DED8] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingAppointment(null)}
                    className="px-5 py-2.5 bg-[#FAF7F3] border border-[#E0DED8] text-[#111] rounded-xl text-xs font-sans uppercase tracking-widest hover:border-[#111] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!editingAppointment.preferredDate || !editingAppointment.preferredTime}
                    className="px-6 py-2.5 bg-[#111] text-white rounded-xl text-xs font-sans uppercase tracking-widest hover:bg-[#333] transition cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
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
                    const cleanDate = app.preferredDate ? app.preferredDate.split('T')[0] : '';

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
                            {cleanDate} at {app.preferredTime} {app.appointmentFor ? `• (${app.appointmentFor})` : ''}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => {
                              setSelectedCustomer(null);
                              console.log('--- OPENING EDIT MODAL FROM CUSTOMER DETAILS FOR ---', app);
                              const cleanDate = app.preferredDate ? app.preferredDate.split('T')[0] : getTodayString();
                              if (cleanDate) {
                                const today = new Date();
                                today.setHours(0,0,0,0);
                                const target = new Date(cleanDate + 'T00:00:00');
                                const diffTime = target.getTime() - today.getTime();
                                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                setEditDayOffset(Math.max(0, diffDays));
                              } else {
                                setEditDayOffset(0);
                              }
                              setEditingAppointment({ ...app, preferredDate: cleanDate });
                            }}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-sans uppercase tracking-wider bg-white border border-[#E0DED8] text-[#111] hover:border-[#111] transition-all cursor-pointer shadow-sm whitespace-nowrap"
                          >
                            Edit
                          </button>
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