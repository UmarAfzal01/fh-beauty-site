"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiFileText, FiSearch, FiPrinter, FiCalendar, FiUser, FiMail, FiActivity, FiX } from "react-icons/fi";

export default function PatientReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReportPatient, setSelectedReportPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch all patients for report generation
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/patients");
      const data = await res.json();
      if (res.ok && data.success) {
        setPatients(data.patients || []);
      }
    } catch (err) {
      console.error("Failed to fetch patient report database:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchReportData();
    }
  }, [status]);

  // Filter patients by name or email
  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query)
    );
  });

  const handlePrintReport = () => {
    window.print();
  };

  if (status === "loading" || loading) {
    return (
      <div className="h-[100svh] bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48]">
        Loading patient reports module...
      </div>
    );
  }

  return (
    <div className="h-[100svh] bg-[#FAF7F3] text-[#514C48] flex flex-col overflow-hidden">
      
      {/* Top Header */}
      <header className="px-4 sm:px-6 md:px-12 py-4 border-b border-[#E6DEC9] bg-[#FAF7F3] flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#111] text-[#FAF7F3] flex items-center justify-center font-serif font-bold text-sm">
            <FiFileText size={18} />
          </div>
          <div>
            <h1 className="font-serif text-sm sm:text-base md:text-lg text-[#111] font-medium leading-tight">
              Clinical Patient Reports
            </h1>
            <p className="text-[10px] sm:text-[11px] font-serif text-[#514C48]/70">
              Generate and inspect individual patient baseline health reports
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/dashboard/analytics")}
          className="bg-[#F3EDE2] hover:bg-[#E6DEC9] border border-[#E6DEC9] text-[#111] px-4 py-2 rounded-xl text-xs font-sans transition font-medium"
        >
          View Analytics →
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-12 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#514C48]/50" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient to generate report..."
              className="w-full bg-[#FAF7F3] border border-[#E6DEC9] rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-serif text-[#514C48] focus:outline-none focus:border-[#111] shadow-sm"
            />
          </div>

          {/* Patient Selection List */}
          {filteredPatients.length === 0 ? (
            <div className="bg-[#F3EDE2]/40 border border-[#E6DEC9] p-12 rounded-3xl text-center space-y-2">
              <p className="font-serif text-sm text-[#514C48]/80">
                No patients found for report generation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPatients.map((patient) => {
                const recordCount = patient.history?.length || 0;
                return (
                  <div
                    key={patient._id}
                    className="bg-[#FAF7F3] border border-[#E6DEC9] p-5 rounded-2xl shadow-sm flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-serif text-base text-[#111] font-bold truncate">
                        {patient.name || "Unnamed Patient"}
                      </h3>
                      <p className="text-xs font-serif text-[#514C48]/70 truncate">
                        {patient.email}
                      </p>
                      <p className="text-[11px] font-sans text-[#514C48]/60">
                        Total Logs: {recordCount}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedReportPatient(patient)}
                      className="shrink-0 bg-[#111] hover:bg-[#333] text-[#FAF7F3] px-4 py-2.5 rounded-xl text-xs font-sans font-medium transition shadow-sm"
                    >
                      Generate Report
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Patient Report Modal Preview */}
      {selectedReportPatient && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#FAF7F3] border border-[#E6DEC9] max-w-3xl w-full max-h-[92svh] overflow-y-auto rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Controls / Header */}
            <div className="flex items-center justify-between border-b border-[#E6DEC9] pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReport}
                  className="bg-[#F3EDE2] hover:bg-[#E6DEC9] border border-[#E6DEC9] text-[#111] px-4 py-2 rounded-xl text-xs font-sans transition flex items-center gap-1.5 font-medium"
                >
                  <FiPrinter size={14} /> Print / Export PDF
                </button>
              </div>
              <button
                onClick={() => setSelectedReportPatient(null)}
                className="p-2 rounded-full hover:bg-[#F3EDE2] text-[#514C48] transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Printable Clinical Report Body */}
            <div className="space-y-6 font-serif">
              <div className="text-center space-y-1 border-b border-[#E6DEC9] pb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#111]">
                  CLINICAL BASELINE HEALTH REPORT
                </h2>
                <p className="text-xs text-[#514C48]/70">
                  Patient Profile & Historical Telemetry Summary
                </p>
              </div>

              {/* Patient Bio Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F3EDE2]/40 p-4 rounded-2xl border border-[#E6DEC9] text-xs">
                <div>
                  <span className="text-[#514C48]/60 block text-[10px] uppercase">Full Name</span>
                  <strong className="text-[#111]">{selectedReportPatient.name}</strong>
                </div>
                <div>
                  <span className="text-[#514C48]/60 block text-[10px] uppercase">Email</span>
                  <strong className="text-[#111] truncate block">{selectedReportPatient.email}</strong>
                </div>
                <div>
                  <span className="text-[#514C48]/60 block text-[10px] uppercase">Gender</span>
                  <strong className="text-[#111]">{selectedReportPatient.gender || "N/A"}</strong>
                </div>
                <div>
                  <span className="text-[#514C48]/60 block text-[10px] uppercase">Contact</span>
                  <strong className="text-[#111]">{selectedReportPatient.contactNumber || "N/A"}</strong>
                </div>
              </div>

              {/* Historical Log Entries */}
              <div className="space-y-4">
                <h3 className="text-xs font-sans uppercase tracking-wider text-[#111] font-semibold">
                  Historical Baseline Logs ({selectedReportPatient.history?.length || 0} Entries)
                </h3>

                {!selectedReportPatient.history || selectedReportPatient.history.length === 0 ? (
                  <p className="text-xs italic text-[#514C48]/70 py-4 text-center">
                    No historical logs recorded for this patient.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {selectedReportPatient.history.map((record, idx) => (
                      <div
                        key={record._id || idx}
                        className="bg-[#FAF7F3] border border-[#E6DEC9] p-5 rounded-2xl space-y-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between border-b border-[#E6DEC9] pb-2">
                          <span className="text-sm font-bold text-[#111]">
                            📅 Date: {record.date}
                          </span>
                          <span className="text-xs bg-[#F3EDE2] border border-[#E6DEC9] px-2.5 py-1 rounded-lg font-mono">
                            BMI: {record.baselineMeasurements?.bmi}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-[#F3EDE2]/50 p-2.5 rounded-xl">
                            <span className="text-[#514C48]/60 block text-[9px] uppercase">Height</span>
                            <strong className="text-[#111]">{record.baselineMeasurements?.height} cm</strong>
                          </div>
                          <div className="bg-[#F3EDE2]/50 p-2.5 rounded-xl">
                            <span className="text-[#514C48]/60 block text-[9px] uppercase">Weight</span>
                            <strong className="text-[#111]">{record.baselineMeasurements?.weight} kg</strong>
                          </div>
                          <div className="bg-[#F3EDE2]/50 p-2.5 rounded-xl">
                            <span className="text-[#514C48]/60 block text-[9px] uppercase">Waist Circ.</span>
                            <strong className="text-[#111]">{record.baselineMeasurements?.waistCircumference} cm</strong>
                          </div>
                        </div>

                        <div className="text-xs space-y-1 pt-1 border-t border-[#E6DEC9]/60">
                          <p>
                            <strong className="text-[#111]">Known Conditions:</strong>{" "}
                            {record.medicalHistoryNotes?.knownConditions || "None"}
                          </p>
                          <p>
                            <strong className="text-[#111]">Current Medications:</strong>{" "}
                            {record.medicalHistoryNotes?.currentMedications || "None"}
                          </p>
                          <p>
                            <strong className="text-[#111]">Physician Notes:</strong>{" "}
                            {record.medicalHistoryNotes?.physicianNotes || "None"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedReportPatient(null)}
              className="w-full bg-[#111] text-[#FAF7F3] py-3 rounded-xl font-sans text-xs font-medium transition print:hidden"
            >
              Close Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}