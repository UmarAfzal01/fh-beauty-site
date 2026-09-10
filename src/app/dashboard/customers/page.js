'use client';

import { useState, useEffect } from 'react';

export default function DashboardCustomersPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null); // For popup modal

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load customers data');
      
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

  // Group appointments by customer (using email or phone as unique key)
  const customersMap = {};

  appointments.forEach((app) => {
    const key = (app.email || app.phone || app.fullName || 'unknown').toLowerCase().trim();
    if (!customersMap[key]) {
      customersMap[key] = {
        name: app.fullName || 'Unknown',
        email: app.email || 'N/A',
        phone: app.phone || 'N/A',
        patientType: app.patientType || 'N/A',
        appointments: [],
      };
    }
    customersMap[key].appointments.push(app);
  });

  const customersList = Object.values(customersMap);

  // Filter customers based on search query
  const filteredCustomers = customersList.filter((cust) => {
    const query = searchQuery.toLowerCase().trim();
    const nameMatch = cust.name.toLowerCase().includes(query);
    const phoneMatch = cust.phone.toLowerCase().includes(query);
    const emailMatch = cust.email.toLowerCase().includes(query);
    return !query || nameMatch || phoneMatch || emailMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F3] flex items-center justify-center text-[#514C48] font-serif">
        Loading customers directory...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F3] p-4 sm:p-8 text-[#514C48]">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0DED8] pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#111]">Customers Directory</h1>
            <p className="text-xs sm:text-sm text-[#514C48]/70 font-light">
              View all registered customers and inspect their appointment histories.
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

        {/* Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-[24px] border border-[#E0DED8]/80 shadow-sm">
          <label className="block text-xs font-sans uppercase tracking-wider text-[#514C48]/70 mb-1.5">
            Search Customer by Name, Phone, or Email
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type name, phone number, or email..."
            className="w-full bg-[#FAF7F3] border border-[#E0DED8] rounded-xl px-4 py-2.5 text-sm text-[#111] focus:outline-none focus:border-[#111] transition"
          />
        </div>

        {/* Clean Customers Table View */}
        <div className="bg-white rounded-[24px] border border-[#E0DED8]/80 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F3] border-b border-[#E0DED8] text-[10px] sm:text-xs font-sans uppercase tracking-wider text-[#514C48]/70">
                  <th className="p-4 font-medium">Customer Name</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Patient Type</th>
                  <th className="p-4 font-medium text-center">Total Appointments</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DED8]/60 text-xs sm:text-sm">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-[#514C48]/50 font-light">
                      No matching customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F3]/50 transition-colors">
                      <td className="p-4 font-serif font-medium text-[#111]">{cust.name}</td>
                      <td className="p-4 whitespace-nowrap">{cust.phone}</td>
                      <td className="p-4 whitespace-nowrap">{cust.email}</td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-sans uppercase tracking-wider bg-[#FAF7F3] border border-[#E0DED8]">
                          {cust.patientType}
                        </span>
                      </td>
                      <td className="p-4 text-center font-medium text-[#111]">
                        {cust.appointments.length}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-4 py-2 bg-[#111] text-white rounded-xl text-xs font-sans uppercase tracking-widest hover:bg-[#7A5C58] transition-all shadow-sm cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Details Popup Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] border border-[#E0DED8] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-[#E0DED8] pb-4">
                <div>
                  <h3 className="text-xl font-serif font-medium text-[#111]">{selectedCustomer.name}</h3>
                  <p className="text-xs text-[#514C48]/70 font-sans mt-0.5">
                    {selectedCustomer.phone} • {selectedCustomer.email}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-8 h-8 rounded-full bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-xs font-sans text-[#111] hover:bg-[#E0DED8] transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-sans uppercase tracking-wider text-[#514C48]/70">Appointment History</h4>
                <div className="space-y-3">
                  {selectedCustomer.appointments.map((app, appIdx) => {
                    const status = app.status || 'pending';
                    const isActive = status === 'active';
                    return (
                      <div key={app._id || appIdx} className="bg-[#FAF7F3] p-4 rounded-xl border border-[#E0DED8]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium font-serif text-[#111]">{app.service}</p>
                          <p className="text-xs text-[#514C48]/70">
                            {app.preferredDate} at {app.preferredTime} {app.appointmentFor ? `• (${app.appointmentFor})` : ''}
                          </p>
                        </div>
                        <span
                          className={`self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[9px] font-sans uppercase tracking-widest font-bold ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E0DED8] flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-6 py-2.5 bg-[#111] text-white rounded-xl text-xs font-sans uppercase tracking-widest hover:bg-[#333] transition"
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