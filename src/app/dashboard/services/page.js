"use client";

import { useState, useEffect } from 'react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchServices = async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/services');
      const data = await res.json();
      if (res.ok) {
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save service');
      }

      setName('');
      setSuccess('Service saved successfully!');
      setServices([data.service, ...services]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (service) => {
    setEditingId(service._id);
    setEditName(service.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update service');
      }

      setServices((prev) =>
        prev.map((s) => (s._id === id ? data.service : s))
      );
      setEditingId(null);
      setEditName('');
      setSuccess('Service renamed successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete service');
      }

      setServices((prev) => prev.filter((s) => s._id !== id));
      setSuccess('Service deleted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-[#111]">Manage Services</h1>
      </div>

      {/* Form to Add Service */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E6DEC9] p-6 rounded-2xl space-y-4 shadow-sm">
        <h2 className="text-lg font-serif text-[#111]">Add New Service</h2>

        {error && <p className="text-xs text-rose-600 font-sans">{error}</p>}
        {success && <p className="text-xs text-emerald-600 font-sans">{success}</p>}

        <div>
          <label className="block text-xs font-sans uppercase tracking-wider text-[#514C48]/70 mb-1">
            Service Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Web Development"
            className="w-full bg-white border border-[#E6DEC9] rounded-xl px-4 py-3 text-sm text-[#111] focus:outline-none focus:border-[#111] transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#111] text-[#FAF7F3] rounded-xl text-sm font-sans tracking-wide hover:bg-[#333] transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Saving...' : 'Save Service'}
        </button>
      </form>

      {/* List of Services (Cards Look) */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif text-[#111]">Saved Services</h2>

        {fetching ? (
          <p className="text-sm text-[#514C48]/70">Loading services...</p>
        ) : services.length === 0 ? (
          <div className="bg-white border border-[#E6DEC9] p-6 rounded-2xl shadow-sm">
            <p className="text-sm font-light text-[#514C48]/70 italic">No services added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white border border-[#E6DEC9] p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4 transition hover:shadow-md"
              >
                {editingId === service._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white border border-[#E6DEC9] rounded-xl px-3 py-2 text-sm text-[#111] focus:outline-none focus:border-[#111]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdate(service._id)}
                        className="flex-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-sans hover:bg-emerald-700 transition cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-3 py-1.5 bg-gray-200 text-[#111] rounded-lg text-xs font-sans hover:bg-gray-300 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="text-base font-medium text-[#111] block break-words">
                        {service.name}
                      </span>
                      <span className="text-xs text-[#514C48]/60 block">
                        {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6DEC9]/60">
                      <button
                        onClick={() => handleStartEdit(service)}
                        className="text-xs font-sans text-blue-600 hover:underline cursor-pointer"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="text-xs font-sans text-rose-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}