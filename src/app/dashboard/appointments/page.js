'use client';

import { useState, useEffect } from 'react';

export default function DashboardAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    } catch (err) {
      alert(err.message);
    }
  };

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
        <div className="flex items-center justify-between border-b border-[#E0DED8] pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#111]">Dashboard Appointments</h1>
            <p className="text-xs sm:text-sm text-[#514C48]/70 font-light">
              Activate appointments to push them automatically to Google Calendar.
            </p>
          </div>
          <button
            onClick={fetchAppointments}
            className="bg-white border border-[#E0DED8] px-4 py-2 rounded-xl text-xs uppercase tracking-widest hover:border-[#111] transition-all cursor-pointer shadow-sm"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-[24px] border border-[#E0DED8]/80 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F3] border-b border-[#E0DED8] text-[10px] sm:text-xs font-sans uppercase tracking-wider text-[#514C48]/70">
                  <th className="p-4 font-medium">Patient Name</th>
                  <th className="p-4 font-medium">Service</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DED8]/60 text-xs sm:text-sm">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-[#514C48]/50 font-light">
                      No appointments found in the database.
                    </td>
                  </tr>
                ) : (
                  appointments.map((app) => {
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
                        <td className="p-4 whitespace-nowrap">{app.phone}</td>
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
                        <td className="p-4 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => handleToggleStatus(recordId, status)}
                            className={`px-3 py-2 rounded-xl text-xs font-sans uppercase tracking-widest transition-all cursor-pointer shadow-sm ${
                              isActive
                                ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                                : 'bg-[#111] text-white hover:bg-[#7A5C58]'
                            }`}
                          >
                            {isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(recordId)}
                            className="px-3 py-2 rounded-xl text-xs font-sans uppercase tracking-widest bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer shadow-sm"
                          >
                            Delete
                          </button>
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
  );
}