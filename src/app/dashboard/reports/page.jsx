"use client";
import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  FiFileText,
  FiSearch,
  FiPrinter,
  FiUsers,
  FiActivity,
  FiX,
  FiRefreshCw,
  FiClipboard,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "with", label: "With Logs" },
  { key: "without", label: "No Logs" },
];

const SORTS = [
  { key: "recent", label: "Recently Registered" },
  { key: "name", label: "Name (A–Z)" },
  { key: "logs", label: "Most Logs" },
];

const getBmiCategory = (bmi) => {
  const value = Number(bmi);
  if (!value) return null;
  if (value < 18.5) return { label: "Underweight", className: "bg-sky-50 text-sky-700 border-sky-200" };
  if (value < 25) return { label: "Healthy", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (value < 30) return { label: "Overweight", className: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "Obese", className: "bg-rose-50 text-rose-700 border-rose-200" };
};

const sortHistory = (history = []) =>
  [...history].sort((a, b) => {
    const byDate = new Date(b.date) - new Date(a.date);
    if (byDate !== 0 && !Number.isNaN(byDate)) return byDate;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const getAge = (dob) => {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "P";

function BmiBadge({ bmi }) {
  const category = getBmiCategory(bmi);
  if (!category) return <span className="text-[#514C48]/50">—</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-sans font-semibold uppercase tracking-wider ${category.className}`}>
      {Number(bmi).toFixed(1)} · {category.label}
    </span>
  );
}

function Trend({ current, previous, unit }) {
  if (current == null || previous == null) return null;
  const diff = Number(current) - Number(previous);
  if (!diff) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-sans text-[#514C48]/60">
        <FiMinus size={12} /> No change
      </span>
    );
  }
  const Icon = diff > 0 ? FiTrendingUp : FiTrendingDown;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-sans text-[#514C48]/80">
      <Icon size={12} /> {diff > 0 ? "+" : ""}
      {diff.toFixed(1)} {unit} since first log
    </span>
  );
}

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="bg-white p-5 rounded-[24px] border border-[#E0DED8]/80 shadow-sm flex items-start justify-between gap-3">
      <div className="space-y-1">
        <p className="text-[10px] sm:text-xs font-sans uppercase tracking-wider text-[#514C48]/70">{label}</p>
        <p className="text-2xl sm:text-3xl font-serif text-[#111]">{value}</p>
        {hint && <p className="text-[11px] text-[#514C48]/60 font-light">{hint}</p>}
      </div>
      <div className="w-10 h-10 rounded-2xl bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-[#111] shrink-0">
        <Icon size={18} />
      </div>
    </div>
  );
}

function ReportModal({ patient, onClose }) {
  const history = sortHistory(patient.history);
  const latest = history[0];
  const first = history[history.length - 1];
  const age = getAge(patient.dateOfBirth);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const measurements = latest
    ? [
        { label: "Height", value: latest.baselineMeasurements?.height, unit: "cm", prev: null },
        { label: "Weight", value: latest.baselineMeasurements?.weight, unit: "kg", prev: history.length > 1 ? first.baselineMeasurements?.weight : null },
        { label: "Waist", value: latest.baselineMeasurements?.waistCircumference, unit: "cm", prev: history.length > 1 ? first.baselineMeasurements?.waistCircumference : null },
        { label: "BMI", value: latest.baselineMeasurements?.bmi, unit: "", prev: history.length > 1 ? first.baselineMeasurements?.bmi : null },
      ]
    : [];

  return createPortal(
    <div
      id="patient-report-portal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-6 print:static print:block print:bg-transparent print:p-0 print:backdrop-blur-none"
      onClick={onClose}
    >
      <div
        id="patient-report"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[24px] border border-[#E0DED8] max-w-4xl w-full max-h-[92svh] overflow-y-auto shadow-2xl print:max-h-none print:overflow-visible print:shadow-none print:border-none print:rounded-none"
      >
        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 sm:px-8 py-4 bg-white/90 backdrop-blur-md border-b border-[#E0DED8] print:hidden">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-[#514C48]/70">
            <FiFileText size={14} /> <span className="hidden sm:inline">Report Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white rounded-xl text-xs font-sans uppercase tracking-widest whitespace-nowrap hover:bg-[#7A5C58] transition-all shadow-sm cursor-pointer"
            >
              <FiPrinter size={14} /> Print / PDF
            </button>
            <button
              onClick={onClose}
              aria-label="Close report"
              className="w-9 h-9 rounded-full bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-[#111] hover:bg-[#E0DED8] transition cursor-pointer"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-8">
          {/* Report Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E0DED8]">
            <div className="space-y-1">
              <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#7A5C58]">FH Beauty · Clinical Record</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#111]">Baseline Health Report</h2>
              <p className="text-xs text-[#514C48]/70 font-light">Patient profile and measurement history</p>
            </div>
            <div className="text-xs font-sans text-[#514C48]/70 sm:text-right space-y-0.5">
              <p>Generated: <span className="text-[#111]">{formatDate(new Date())}</span></p>
              <p>Total logs: <span className="text-[#111]">{history.length}</span></p>
            </div>
          </div>

          {/* Patient Profile */}
          <section className="flex flex-col sm:flex-row gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#111] text-white flex items-center justify-center font-serif text-xl shrink-0">
              {getInitials(patient.name)}
            </div>
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
              {[
                { label: "Full Name", value: patient.name || "Unnamed Patient" },
                { label: "Email", value: patient.email },
                { label: "Contact", value: patient.contactNumber || "—" },
                { label: "Gender", value: patient.gender || "—" },
                { label: "Date of Birth", value: `${formatDate(patient.dateOfBirth)}${age != null ? ` (${age} yrs)` : ""}` },
                { label: "Registered", value: formatDate(patient.createdAt) },
              ].map((field) => (
                <div key={field.label} className="min-w-0">
                  <p className="text-[10px] font-sans uppercase tracking-wider text-[#514C48]/60">{field.label}</p>
                  <p className={`font-serif text-[#111] truncate ${field.label === "Gender" ? "capitalize" : ""}`}>{field.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Latest Measurements */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-sans uppercase tracking-wider text-[#514C48]/70">Latest Measurements</h3>
              {latest && <span className="text-[11px] font-sans text-[#514C48]/60">Recorded {formatDate(latest.date)}</span>}
            </div>
            {latest ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {measurements.map((m) => (
                  <div key={m.label} className="bg-[#FAF7F3] border border-[#E0DED8] rounded-2xl p-4 space-y-1">
                    <p className="text-[10px] font-sans uppercase tracking-wider text-[#514C48]/60">{m.label}</p>
                    <p className="text-xl font-serif text-[#111]">
                      {m.value ?? "—"}
                      {m.unit && <span className="text-xs text-[#514C48]/60 ml-1">{m.unit}</span>}
                    </p>
                    {m.label === "BMI" ? <BmiBadge bmi={m.value} /> : <Trend current={m.value} previous={m.prev} unit={m.unit} />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#FAF7F3] border border-dashed border-[#E0DED8] rounded-2xl p-8 text-center text-sm text-[#514C48]/60 font-light">
                This patient hasn&apos;t logged any baseline measurements yet.
              </div>
            )}
          </section>

          {/* History */}
          {history.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-sans uppercase tracking-wider text-[#514C48]/70">Measurement History</h3>
              <div className="border border-[#E0DED8] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#FAF7F3] border-b border-[#E0DED8] text-[10px] font-sans uppercase tracking-wider text-[#514C48]/70">
                        <th className="p-3 font-medium">Date</th>
                        <th className="p-3 font-medium text-right">Height</th>
                        <th className="p-3 font-medium text-right">Weight</th>
                        <th className="p-3 font-medium text-right">Waist</th>
                        <th className="p-3 font-medium">BMI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0DED8]/60">
                      {history.map((record, idx) => (
                        <tr key={record._id || idx}>
                          <td className="p-3 font-serif text-[#111] whitespace-nowrap">{formatDate(record.date)}</td>
                          <td className="p-3 text-right whitespace-nowrap">{record.baselineMeasurements?.height} cm</td>
                          <td className="p-3 text-right whitespace-nowrap">{record.baselineMeasurements?.weight} kg</td>
                          <td className="p-3 text-right whitespace-nowrap">{record.baselineMeasurements?.waistCircumference} cm</td>
                          <td className="p-3 whitespace-nowrap"><BmiBadge bmi={record.baselineMeasurements?.bmi} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Medical Notes */}
          {history.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-sans uppercase tracking-wider text-[#514C48]/70">Medical Notes</h3>
              <div className="space-y-3">
                {history.map((record, idx) => (
                  <div key={record._id || idx} className="border border-[#E0DED8] rounded-2xl p-4 sm:p-5 space-y-3 break-inside-avoid">
                    <p className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#111] font-semibold">
                      <FiCalendar size={13} /> {formatDate(record.date)}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      {[
                        { label: "Known Conditions", value: record.medicalHistoryNotes?.knownConditions },
                        { label: "Current Medications", value: record.medicalHistoryNotes?.currentMedications },
                        { label: "Physician Notes", value: record.medicalHistoryNotes?.physicianNotes },
                      ].map((note) => (
                        <div key={note.label} className="bg-[#FAF7F3] rounded-xl p-3">
                          <p className="text-[10px] font-sans uppercase tracking-wider text-[#514C48]/60 mb-1">{note.label}</p>
                          <p className={`font-light ${note.value ? "text-[#111]" : "text-[#514C48]/50 italic"}`}>
                            {note.value || "None recorded"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <p className="pt-4 border-t border-[#E0DED8] text-[10px] font-sans text-[#514C48]/50 text-center">
            Confidential patient information — for clinical use only.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function PatientReportsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/patients");
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.success) {
          setPatients(data.patients || []);
          setError("");
        } else {
          setError(data.message || "Failed to load patient reports.");
        }
      } catch (err) {
        console.error("Failed to fetch patient reports:", err);
        if (!cancelled) setError("Failed to load patient reports.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleRefresh = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const stats = useMemo(() => {
    const totalLogs = patients.reduce((acc, p) => acc + (p.history?.length || 0), 0);
    const withLogs = patients.filter((p) => p.history?.length).length;
    const latestBmis = patients
      .map((p) => sortHistory(p.history)[0]?.baselineMeasurements?.bmi)
      .filter((v) => Number(v) > 0);
    const avgBmi = latestBmis.length ? latestBmis.reduce((a, b) => a + Number(b), 0) / latestBmis.length : null;
    return { totalLogs, withLogs, avgBmi };
  }, [patients]);

  const visiblePatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = patients.filter((p) => {
      const matchesQuery =
        !query ||
        p.name?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query) ||
        p.contactNumber?.toLowerCase().includes(query);
      const logs = p.history?.length || 0;
      const matchesFilter = filter === "all" || (filter === "with" ? logs > 0 : logs === 0);
      return matchesQuery && matchesFilter;
    });
    return list.sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "logs") return (b.history?.length || 0) - (a.history?.length || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [patients, searchQuery, filter, sortBy]);

  if (loading) {
    return (
      <div className="min-h-[calc(100svh-4rem)] w-full bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#111] border-t-transparent rounded-full animate-spin" />
          <p>Loading patient reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#patient-report-portal) { display: none !important; }
          #patient-report { max-width: none; }
        }
      `}</style>

      <main className="min-h-[calc(100svh-4rem)] w-full bg-[#FAF7F3] text-[#514C48] p-4 sm:p-8 print:hidden">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0DED8] pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif text-[#111]">Patient Reports</h1>
              <p className="text-xs sm:text-sm text-[#514C48]/70 font-light">
                Review patient baseline health logs and generate printable clinical reports.
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="self-start sm:self-auto flex items-center gap-2 bg-white border border-[#E0DED8] px-4 py-2 rounded-xl text-xs uppercase tracking-widest hover:border-[#111] transition-all cursor-pointer shadow-sm"
            >
              <FiRefreshCw size={13} /> Refresh
            </button>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm">{error}</div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard icon={FiUsers} label="Patients" value={patients.length} hint="Registered accounts" />
            <StatCard icon={FiClipboard} label="Health Logs" value={stats.totalLogs} hint="Baseline entries" />
            <StatCard icon={FiActivity} label="Active Patients" value={stats.withLogs} hint="With at least one log" />
            <StatCard
              icon={FiTrendingUp}
              label="Avg. BMI"
              value={stats.avgBmi ? stats.avgBmi.toFixed(1) : "—"}
              hint="Based on latest logs"
            />
          </div>

          {/* Toolbar */}
          <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-[#E0DED8]/80 shadow-sm flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#514C48]/50" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full bg-[#FAF7F3] border border-[#E0DED8] rounded-xl pl-11 pr-4 py-2.5 text-sm text-[#111] focus:outline-none focus:border-[#111] transition"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex bg-[#FAF7F3] border border-[#E0DED8] rounded-xl p-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-sans transition cursor-pointer whitespace-nowrap ${
                      filter === f.key ? "bg-[#111] text-white shadow-sm" : "text-[#514C48] hover:text-[#111]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FAF7F3] border border-[#E0DED8] rounded-xl px-3 py-2.5 text-xs font-sans text-[#111] focus:outline-none focus:border-[#111] cursor-pointer"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Patient List */}
          {visiblePatients.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-[#E0DED8]/80 shadow-sm p-12 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-[#514C48]/60">
                <FiUsers size={20} />
              </div>
              <p className="font-serif text-[#111]">No patients found</p>
              <p className="text-xs text-[#514C48]/60 font-light">
                {patients.length ? "Try a different search or filter." : "Registered patients will appear here."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block bg-white rounded-[24px] border border-[#E0DED8]/80 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAF7F3] border-b border-[#E0DED8] text-[10px] sm:text-xs font-sans uppercase tracking-wider text-[#514C48]/70">
                        <th className="p-4 font-medium">Patient</th>
                        <th className="p-4 font-medium">Contact</th>
                        <th className="p-4 font-medium text-center">Logs</th>
                        <th className="p-4 font-medium">Latest BMI</th>
                        <th className="p-4 font-medium">Last Log</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0DED8]/60 text-sm">
                      {visiblePatients.map((patient) => {
                        const latest = sortHistory(patient.history)[0];
                        return (
                          <tr key={patient._id} className="hover:bg-[#FAF7F3]/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-[#111] text-white flex items-center justify-center text-xs font-serif shrink-0">
                                  {getInitials(patient.name)}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-serif font-medium text-[#111] truncate">{patient.name || "Unnamed Patient"}</p>
                                  <p className="text-xs text-[#514C48]/60 capitalize">
                                    {[patient.gender, getAge(patient.dateOfBirth) != null && `${getAge(patient.dateOfBirth)} yrs`].filter(Boolean).join(" · ") || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-xs">
                              <p className="text-[#111] truncate max-w-[220px]">{patient.email}</p>
                              <p className="text-[#514C48]/60">{patient.contactNumber || "—"}</p>
                            </td>
                            <td className="p-4 text-center font-medium text-[#111]">{patient.history?.length || 0}</td>
                            <td className="p-4"><BmiBadge bmi={latest?.baselineMeasurements?.bmi} /></td>
                            <td className="p-4 text-xs whitespace-nowrap">{latest ? formatDate(latest.date) : "—"}</td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => setSelectedPatient(patient)}
                                className="px-4 py-2 bg-[#111] text-white rounded-xl text-xs font-sans uppercase tracking-widest hover:bg-[#7A5C58] transition-all shadow-sm cursor-pointer"
                              >
                                View Report
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {visiblePatients.map((patient) => {
                  const latest = sortHistory(patient.history)[0];
                  return (
                    <button
                      key={patient._id}
                      onClick={() => setSelectedPatient(patient)}
                      className="w-full text-left bg-white p-4 rounded-[20px] border border-[#E0DED8]/80 shadow-sm space-y-3 cursor-pointer active:scale-[0.99] transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#111] text-white flex items-center justify-center text-xs font-serif shrink-0">
                          {getInitials(patient.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-serif font-medium text-[#111] truncate">{patient.name || "Unnamed Patient"}</p>
                          <p className="text-xs text-[#514C48]/60 truncate flex items-center gap-1"><FiMail size={11} /> {patient.email}</p>
                        </div>
                        <FiChevronRight className="text-[#514C48]/50 shrink-0" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-sans">
                        <span className="px-2.5 py-1 rounded-full bg-[#FAF7F3] border border-[#E0DED8]">{patient.history?.length || 0} logs</span>
                        {patient.contactNumber && (
                          <span className="px-2.5 py-1 rounded-full bg-[#FAF7F3] border border-[#E0DED8] flex items-center gap-1"><FiPhone size={10} /> {patient.contactNumber}</span>
                        )}
                        <BmiBadge bmi={latest?.baselineMeasurements?.bmi} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      {selectedPatient && <ReportModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />}
    </>
  );
}
