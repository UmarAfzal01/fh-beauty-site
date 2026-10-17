"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FiPlus, FiX, FiLogOut, FiCalendar, FiUser } from "react-icons/fi";

export default function PatientPortal() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const todayDate = new Date().toISOString().slice(0, 10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordDate, setRecordDate] = useState(todayDate);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [bmi, setBmi] = useState("");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState([]);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Auto-calculate BMI
  useEffect(() => {
    if (height && weight && Number(height) > 0) {
      const heightInMeters = Number(height) / 100;
      const calculatedBmi = (
        Number(weight) /
        (heightInMeters * heightInMeters)
      ).toFixed(1);
      setBmi(calculatedBmi);
    } else {
      setBmi("");
    }
  }, [height, weight]);

  // Fetch Patient History matching the API response format
  const fetchPatientData = async () => {
    try {
      const res = await fetch("/api/patient/baseline");
      const data = await res.json();
      if (res.ok && data.success) {
        const emailKey = Object.keys(data).find((key) => key !== "success");
        if (emailKey && data[emailKey]?.history) {
          setHistory(data[emailKey].history);
        }
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchPatientData();
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        date: recordDate,
        baselineMeasurements: {
          height: Number(height),
          weight: Number(weight),
          waistCircumference: Number(waist),
          bmi: Number(bmi),
        },
        medicalHistoryNotes: {
          knownConditions: conditions,
          currentMedications: medications,
          physicianNotes: notes,
        },
      };

      const res = await fetch("/api/patient/baseline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Baseline data saved successfully!");
        
        const emailKey = Object.keys(data).find((key) => key !== "success");
        if (emailKey && data[emailKey]?.history) {
          setHistory(data[emailKey].history);
        }

        setIsModalOpen(false);
        // Reset form fields
        setHeight("");
        setWeight("");
        setWaist("");
        setBmi("");
        setConditions("");
        setMedications("");
        setNotes("");
      } else {
        toast.error(data.message || "Failed to save data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server Error");
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") {
    return (
      <div className="h-[100svh] bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48]">
        Loading user profile...
      </div>
    );
  }

  return (
    <div className="h-[100svh] bg-[#FAF7F3] text-[#514C48] flex flex-col overflow-hidden">
      <Toaster />

      {/* Top Header Bar */}
      <header className="px-4 sm:px-6 md:px-12 py-3.5 border-b border-[#E6DEC9] bg-[#FAF7F3] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-[#111] text-[#FAF7F3] flex items-center justify-center font-serif font-bold text-xs sm:text-sm">
            {session?.user?.name?.[0]?.toUpperCase() || <FiUser />}
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-xs sm:text-sm md:text-base text-[#111] font-medium truncate leading-tight">
              {session?.user?.name || "Patient"}
            </h1>
            <p className="text-[10px] sm:text-[11px] font-serif text-[#514C48]/70 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#111] hover:bg-[#333] text-[#FAF7F3] px-3 sm:px-4 py-2 rounded-xl text-xs font-sans transition flex items-center gap-1.5 shadow-sm"
          >
            <FiPlus size={14} />
            <span className="hidden xs:inline sm:inline">Add Baseline</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/30 p-2 sm:p-2.5 rounded-xl transition"
            title="Logout"
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-[#111]">
              Baseline History Records
            </h2>
            <span className="text-[11px] sm:text-xs font-sans text-[#514C48]/70 bg-[#F3EDE2] border border-[#E6DEC9] px-2.5 sm:px-3 py-1 rounded-full">
              Entries: {history.length}
            </span>
          </div>

          {history.length === 0 ? (
            <div className="bg-[#F3EDE2]/40 border border-[#E6DEC9] p-8 sm:p-12 rounded-3xl text-center space-y-3">
              <p className="font-serif text-xs sm:text-sm text-[#514C48]/80">
                No baseline measurements submitted yet.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-sans text-[#111] underline font-medium"
              >
                Submit your first record now →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((record, idx) => (
                <div
                  key={record._id || idx}
                  className="bg-[#FAF7F3] border border-[#E6DEC9] p-4 sm:p-6 rounded-2xl shadow-sm space-y-3 hover:border-[#111]/30 transition"
                >
                  <div className="flex items-center justify-between border-b border-[#E6DEC9] pb-2.5">
                    <span className="font-serif text-xs sm:text-sm font-bold text-[#111] flex items-center gap-1.5">
                      <FiCalendar size={14} /> {record.date}
                    </span>
                    <span className="text-[11px] sm:text-xs bg-[#F3EDE2] border border-[#E6DEC9] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-mono">
                      BMI: {record.baselineMeasurements?.bmi}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-serif">
                    <div className="bg-[#F3EDE2]/50 p-2 sm:p-2.5 rounded-xl">
                      <span className="text-[#514C48]/60 block text-[9px] sm:text-[10px] uppercase">Height</span>
                      <strong className="text-[#111] text-[11px] sm:text-xs">{record.baselineMeasurements?.height} cm</strong>
                    </div>
                    <div className="bg-[#F3EDE2]/50 p-2 sm:p-2.5 rounded-xl">
                      <span className="text-[#514C48]/60 block text-[9px] sm:text-[10px] uppercase">Weight</span>
                      <strong className="text-[#111] text-[11px] sm:text-xs">{record.baselineMeasurements?.weight} kg</strong>
                    </div>
                    <div className="bg-[#F3EDE2]/50 p-2 sm:p-2.5 rounded-xl">
                      <span className="text-[#514C48]/60 block text-[9px] sm:text-[10px] uppercase">Waist</span>
                      <strong className="text-[#111] text-[11px] sm:text-xs">{record.baselineMeasurements?.waistCircumference} cm</strong>
                    </div>
                  </div>

                  <div className="text-[11px] sm:text-xs font-serif space-y-1 pt-1 border-t border-[#E6DEC9]/60">
                    <p className="truncate">
                      <strong className="text-[#111]">Conditions:</strong> {record.medicalHistoryNotes?.knownConditions || "None"}
                    </p>
                    <p className="truncate">
                      <strong className="text-[#111]">Meds:</strong> {record.medicalHistoryNotes?.currentMedications || "None"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Absolute Modal Form for Submitting Baseline */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#FAF7F3] border border-[#E6DEC9] max-w-xl w-full max-h-[92svh] overflow-y-auto rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-[#E6DEC9] pb-3">
              <h3 className="font-serif text-base sm:text-lg text-[#111] font-medium">
                Submit Baseline Measurements
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 sm:p-2 rounded-full hover:bg-[#F3EDE2] text-[#514C48] transition"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 font-serif">
              <div>
                <label className="text-[11px] sm:text-xs uppercase tracking-wider text-[#514C48]/70 block mb-1">
                  Record Date
                </label>
                <input
                  type="date"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  required
                  className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm"
                />
              </div>

              {/* Baseline Measurements Grid */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] sm:text-xs font-sans uppercase tracking-wider text-[#111] font-semibold">
                  Baseline Measurements
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] sm:text-[11px] text-[#514C48]/70 block mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                      placeholder="175"
                      className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-[11px] text-[#514C48]/70 block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                      placeholder="70"
                      className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-[11px] text-[#514C48]/70 block mb-1">Waist Circ. (cm)</label>
                    <input
                      type="number"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      required
                      placeholder="85"
                      className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-[11px] text-[#514C48]/70 block mb-1">BMI (Auto)</label>
                    <input
                      type="number"
                      readOnly
                      value={bmi}
                      placeholder="--"
                      className="w-full bg-[#E6DEC9]/40 border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-[#111]"
                    />
                  </div>
                </div>
              </div>

              {/* Medical History & Notes */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] sm:text-xs font-sans uppercase tracking-wider text-[#111] font-semibold">
                  Medical History & Notes
                </h4>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[10px] sm:text-[11px] text-[#514C48]/70 block mb-1">Known Conditions</label>
                    <input
                      type="text"
                      value={conditions}
                      onChange={(e) => setConditions(e.target.value)}
                      placeholder="Pre-diabetes, Joint pain, etc."
                      className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-[11px] text-[#514C48]/70 block mb-1">Current Medications</label>
                    <input
                      type="text"
                      value={medications}
                      onChange={(e) => setMedications(e.target.value)}
                      placeholder="Norvasc 5/160mg, Zopant 50mg, etc."
                      className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-[11px] text-[#514C48]/70 block mb-1">Physician Notes</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Patient aiming for 15% weight loss in 6 months, etc."
                      className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3 py-2 text-xs sm:text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-[#F3EDE2] hover:bg-[#E6DEC9] text-[#111] font-sans font-medium py-2.5 sm:py-3 rounded-xl transition text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-sans font-medium py-2.5 sm:py-3 rounded-xl transition text-xs sm:text-sm shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}