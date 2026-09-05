"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AppointmentPage() {
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);

  const initialFormState = {
    fullName: "",
    phone: "",
    email: "",
    patientType: "New Patient",
    appointmentFor: "Self",
    service: "Clinic Consultation",
    preferredDate: "",
    preferredTime: "09:00 AM",
    message: "",
    privacyConsent: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [bookedTimes, setBookedTimes] = useState([]);

  // Generate only from today onwards (up to 30 days)
  const generateMonthDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time for accurate comparison
    const totalDays = 30;

    for (let i = 0; i < totalDays; i++) {
      const dateObj = new Date(today);
      dateObj.setDate(today.getDate() + i);

      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });

      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");

      days.push({
        dayNum: dd,
        dayName: dayName,
        dateString: `${monthName} ${dateObj.getDate()}, ${yyyy}`,
        isoDate: `${yyyy}-${mm}-${dd}`,
      });
    }
    return days;
  };

  const daysList = generateMonthDays();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
    "09:00 PM", "10:00 PM", "11:00 PM", "12:00 AM",
    "01:00 AM", "02:00 AM",
  ];

  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0]);
  const [submitted, setSubmitted] = useState(false);

  // Helper function to check if a specific time slot has already passed today
  const isTimeSlotPassed = (timeString, selectedIsoDate) => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (selectedIsoDate !== todayStr) return false; // Only restrict if selected date is today

    const now = new Date();
    let [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    // Handle late-night extended hours (e.g., 12:00 AM - 02:00 AM are technically early next morning, 
    // but if viewed on the same day's cycle, handle according to your clinic schedule).
    // For standard comparison:
    const slotDate = new Date();
    slotDate.setHours(hours, minutes, 0, 0);

    // If slot is past midnight (12 AM, 1 AM, 2 AM), treat it as next day early morning hours
    if (modifier === "AM" && (hours < 6 || timeString.includes("12:00 AM"))) {
      slotDate.setDate(slotDate.getDate() + 1);
    }

    return slotDate.getTime() <= now.getTime();
  };

  // Fetch booked slots whenever selected date changes
  useEffect(() => {
    const currentDate = daysList[selectedDayIndex]?.isoDate;
    if (!currentDate) return;

    async function fetchBookedSlots() {
      try {
        const res = await fetch(`/api/appointments?date=${currentDate}`);
        const result = await res.json();
        if (result.success) {
          const times = result.data.map((app) => app.preferredTime);
          setBookedTimes(times);
        }
      } catch (err) {
        console.error("Failed to fetch booked slots", err);
      }
    }

    fetchBookedSlots();
  }, [selectedDayIndex]);

  // Prevent client/server hydration mismatch for dynamic dates
  useEffect(() => {
    setMounted(true);
    setFormData((f) => ({ ...f, preferredDate: daysList[0].isoDate }));
  }, []);

  const servicesList = [
    "Clinic Consultation",
    "Aesthetic Medicine",
    "Wellness & Anti-Aging",
    "Orthopedic Care",
    "Maternity & Gynecology",
    "Advanced Dermatology",
    "Plastic Surgery",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePrevDayScroll = () => {
    setSelectedDayIndex((prev) => {
      const newIndex = Math.max(0, prev - 1);
      setFormData((f) => ({ ...f, preferredDate: daysList[newIndex].isoDate }));
      return newIndex;
    });
  };

  const handleNextDayScroll = () => {
    setSelectedDayIndex((prev) => {
      const newIndex = Math.min(daysList.length - 1, prev + 1);
      setFormData((f) => ({ ...f, preferredDate: daysList[newIndex].isoDate }));
      return newIndex;
    });
  };

  const handleDaySelect = (index) => {
    setSelectedDayIndex(index);
    setFormData((prev) => ({
      ...prev,
      preferredDate: daysList[index].isoDate,
    }));
  };

  const handlePrevTimeScroll = () => {
    setSelectedTimeIndex((prev) => {
      const newIndex = Math.max(0, prev - 1);
      setSelectedTimeSlot(timeSlots[newIndex]);
      setFormData((f) => ({ ...f, preferredTime: timeSlots[newIndex] }));
      return newIndex;
    });
  };

  const handleNextTimeScroll = () => {
    setSelectedTimeIndex((prev) => {
      const newIndex = Math.min(timeSlots.length - 1, prev + 1);
      setSelectedTimeSlot(timeSlots[newIndex]);
      setFormData((f) => ({ ...f, preferredTime: timeSlots[newIndex] }));
      return newIndex;
    });
  };

  const handleTimeSelect = (index) => {
    const currentDate = daysList[selectedDayIndex]?.isoDate;
    if (bookedTimes.includes(timeSlots[index]) || isTimeSlotPassed(timeSlots[index], currentDate)) return;
    
    setSelectedTimeIndex(index);
    setSelectedTimeSlot(timeSlots[index]);
    setFormData((prev) => ({ ...prev, preferredTime: timeSlots[index] }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const currentDate = daysList[selectedDayIndex]?.isoDate;
    if (bookedTimes.includes(selectedTimeSlot) || isTimeSlotPassed(selectedTimeSlot, currentDate)) {
      alert("This time slot is unavailable or has already passed. Please choose another slot.");
      return;
    }
    setFormData((f) => ({
      ...f,
      preferredDate: f.preferredDate || currentDate,
      preferredTime: selectedTimeSlot,
    }));
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.privacyConsent) {
      alert("Please agree to the privacy & communication consent.");
      return;
    }

    setLoading(true);

    try {
      const finalPayload = {
        ...formData,
        preferredDate: formData.preferredDate || daysList[selectedDayIndex].isoDate,
        preferredTime: selectedTimeSlot,
      };

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit appointment.");
      }

      setSubmitted(true);
    } catch (err) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getVisibleDays = () => {
    const visibleCount = 5;
    let start = Math.max(0, selectedDayIndex - Math.floor(visibleCount / 2));
    let end = start + visibleCount;
    if (end > daysList.length) {
      end = daysList.length;
      start = Math.max(0, end - visibleCount);
    }
    return daysList.slice(start, end).map((day, idx) => ({
      ...day,
      originalIndex: start + idx,
    }));
  };

  const getVisibleTimes = () => {
    const visibleCount = 5;
    let start = Math.max(0, selectedTimeIndex - Math.floor(visibleCount / 2));
    let end = start + visibleCount;
    if (end > timeSlots.length) {
      end = timeSlots.length;
      start = Math.max(0, end - visibleCount);
    }
    return timeSlots.slice(start, end).map((time, idx) => ({
      timeString: time,
      originalIndex: start + idx,
    }));
  };

  if (!mounted) return null;

  const visibleDays = getVisibleDays();
  const visibleTimes = getVisibleTimes();
  const currentDate = daysList[selectedDayIndex]?.isoDate;

  return (
    <main className="w-full min-h-[100svh] bg-[#FAF7F3] text-[#514C48] flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-x-hidden">
      <div className="w-full max-w-[1400px] bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-[#514C48]/10 grid grid-cols-1 lg:grid-cols-12 border border-[#E0DED8]/60 overflow-hidden my-auto">
        
        {/* Left Side: Visual Showcase */}
        <div className="hidden lg:col-span-6 lg:block relative bg-[#EFECE6] min-h-[600px] overflow-hidden group">
          <Image
            src="/images/home-1-5.webp"
            alt="Clinic Interior Consultation Space"
            fill
            priority
            className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          <div className="absolute bottom-10 left-10 right-10 text-white z-10 space-y-2">
            <span className="inline-block text-[11px] font-sans uppercase tracking-[0.3em] bg-white/25 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
              BELLA BEAUTY STUDIO
            </span>
            <h2 className="text-3xl font-serif font-normal leading-snug">
              Extended Hours: Open 9:00 AM – 2:00 AM
            </h2>
            <p className="text-sm text-white/85 font-light max-w-md">
              Experience seamless booking with flexible late-night medical and aesthetic consultation options.
            </p>
          </div>
        </div>

        {/* Right Side: Responsive Form Container */}
        <div className="lg:col-span-6 p-4 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#FAF7F3]/40 w-full">
          <div className="max-w-xl mx-auto w-full">
            
            <div className="mb-4 sm:mb-6 flex items-center justify-between border-b border-[#E0DED8]/60 pb-3">
              <div>
                <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#7A5C58] font-bold block mb-0.5">
                  Step 0{step} of 02
                </span>
                <h1 className="text-xl sm:text-2xl font-serif text-[#111]">
                  {step === 1 ? "Select Date & Time" : "Patient Profile"}
                </h1>
              </div>

              <div className="flex items-center gap-1.5">
                <div className={`h-2 rounded-full transition-all duration-500 ${step === 1 ? "w-8 bg-[#111]" : "w-2 bg-[#E0DED8]"}`} />
                <div className={`h-2 rounded-full transition-all duration-500 ${step === 2 ? "w-8 bg-[#111]" : "w-2 bg-[#E0DED8]"}`} />
              </div>
            </div>

            {submitted ? (
              <div className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 text-center border border-[#E0DED8] shadow-xl animate-in fade-in zoom-in-95 duration-500 my-4">
                <div className="w-14 h-14 bg-[#111] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl shadow-lg shadow-black/10">
                  ✓
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#111] mb-2">
                  Appointment Reserved
                </h2>
                <p className="text-xs sm:text-sm text-[#514C48]/90 mb-6 font-light leading-relaxed">
                  Your slot has been securely logged in our database.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setFormData(initialFormState);
                    window.location.reload();
                  }}
                  className="bg-[#111] hover:bg-[#7A5C58] text-white text-xs font-sans tracking-widest uppercase py-3.5 px-8 rounded-full transition-all cursor-pointer shadow-md"
                >
                  Book Another Session
                </button>
              </div>
            ) : step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-sm border border-[#E0DED8]/80 space-y-4">
                  
                  {/* Date Navigation Header */}
                  <div className="flex items-center justify-between px-1">
                    <button
                      type="button"
                      onClick={handlePrevDayScroll}
                      disabled={selectedDayIndex === 0}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-xs text-[#514C48] hover:border-[#111] transition-all disabled:opacity-30 cursor-pointer shadow-sm"
                    >
                      &lt;
                    </button>
                    <span className="text-sm sm:text-base font-serif font-medium text-[#111]">
                      {daysList[selectedDayIndex].dateString.split(",")[0]}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextDayScroll}
                      disabled={selectedDayIndex === daysList.length - 1}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-xs text-[#514C48] hover:border-[#111] transition-all disabled:opacity-30 cursor-pointer shadow-sm"
                    >
                      &gt;
                    </button>
                  </div>

                  {/* Date Cube Cards Row */}
                  <div className="grid grid-cols-5 gap-2">
                    {visibleDays.map((day) => {
                      const isSelected = day.originalIndex === selectedDayIndex;
                      return (
                        <button
                          key={day.dateString}
                          type="button"
                          onClick={() => handleDaySelect(day.originalIndex)}
                          className={`aspect-square rounded-xl sm:rounded-2xl p-2 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer border ${
                            isSelected
                              ? "bg-[#111] text-white border-[#111] shadow-lg scale-105"
                              : "bg-[#FAF7F3] text-[#514C48] border-[#E0DED8]/60 hover:bg-white hover:border-[#7A5C58]"
                          }`}
                        >
                          <span className={`text-[9px] sm:text-[10px] font-sans uppercase tracking-wider mb-0.5 ${isSelected ? "text-white/70" : "text-[#514C48]/60"}`}>
                            {day.dayName}
                          </span>
                          <span className={`text-base sm:text-xl font-serif ${isSelected ? "font-bold text-white" : "font-medium text-[#111]"}`}>
                            {day.dayNum}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Time Navigation Header */}
                  <div className="flex items-center justify-between px-1 pt-2 border-t border-[#E0DED8]/40">
                    <button
                      type="button"
                      onClick={handlePrevTimeScroll}
                      disabled={selectedTimeIndex === 0}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-xs text-[#514C48] hover:border-[#111] transition-all disabled:opacity-30 cursor-pointer shadow-sm"
                    >
                      &lt;
                    </button>
                    <span className="text-sm sm:text-base font-serif font-medium text-[#111]">
                      Select Time Slot
                    </span>
                    <button
                      type="button"
                      onClick={handleNextTimeScroll}
                      disabled={selectedTimeIndex === timeSlots.length - 1}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-xs text-[#514C48] hover:border-[#111] transition-all disabled:opacity-30 cursor-pointer shadow-sm"
                    >
                      &gt;
                    </button>
                  </div>

                  {/* Time Cube Cards Row (With disabled logic for booked & past slots) */}
                  <div className="grid grid-cols-5 gap-2">
                    {visibleTimes.map((t) => {
                      const isSelected = t.originalIndex === selectedTimeIndex;
                      const isBooked = bookedTimes.includes(t.timeString);
                      const isPast = isTimeSlotPassed(t.timeString, currentDate);
                      const isDisabled = isBooked || isPast;
                      const parts = t.timeString.split(" ");
                      
                      return (
                        <button
                          key={t.timeString}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleTimeSelect(t.originalIndex)}
                          className={`aspect-square rounded-xl sm:rounded-2xl p-1.5 flex flex-col items-center justify-center transition-all duration-300 border ${
                            isDisabled
                              ? "bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed line-through"
                              : isSelected
                              ? "bg-[#111] text-white border-[#111] shadow-lg scale-105 cursor-pointer"
                              : "bg-[#FAF7F3] text-[#514C48] border-[#E0DED8]/60 hover:bg-white hover:border-[#7A5C58] cursor-pointer"
                          }`}
                        >
                          <span className={`text-[8px] sm:text-[9px] font-sans uppercase tracking-widest mb-0.5 ${isDisabled ? "text-gray-400" : isSelected ? "text-white/70" : "text-[#514C48]/60"}`}>
                            {parts[1]}
                          </span>
                          <span className={`text-xs sm:text-sm font-serif font-bold ${isDisabled ? "text-gray-400" : isSelected ? "text-white" : "text-[#111]"}`}>
                            {parts[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-[#E0DED8]/40 flex items-center justify-between text-xs sm:text-sm text-[#514C48]/80">
                    <span>Active Selection:</span>
                    <strong className="text-[#111] font-serif text-xs sm:text-sm truncate ml-2">
                      {daysList[selectedDayIndex]?.dateString} @ {selectedTimeSlot}
                    </strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#111] hover:bg-[#7A5C58] text-white text-xs font-sans tracking-widest uppercase py-3.5 rounded-full transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Details</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-sm border border-[#E0DED8]/80 space-y-3">
                  <h3 className="text-sm sm:text-base font-serif font-medium text-[#111]">
                    Enter Patient Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="fullName" className="block text-[10px] sm:text-xs font-sans uppercase tracking-wider text-[#514C48]/80 mb-1 font-medium">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Jane Doe"
                        className="w-full bg-[#FAF7F3] border border-[#E0DED8] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#111] focus:outline-none focus:border-[#7A5C58] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-[10px] sm:text-xs font-sans uppercase tracking-wider text-[#514C48]/80 mb-1 font-medium">
                        Phone / Whatsapp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-[#FAF7F3] border border-[#E0DED8] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#111] focus:outline-none focus:border-[#7A5C58] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="email" className="block text-[10px] sm:text-xs font-sans uppercase tracking-wider text-[#514C48]/80 mb-1 font-medium">
                        Email Address <span className="text-[#514C48]/40 normal-case">(Optional)</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jane@example.com"
                        className="w-full bg-[#FAF7F3] border border-[#E0DED8] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#111] focus:outline-none focus:border-[#7A5C58] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="patientType" className="block text-[10px] sm:text-xs font-sans uppercase tracking-wider text-[#514C48]/80 mb-1 font-medium">
                        Patient Type <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="patientType"
                        name="patientType"
                        value={formData.patientType}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F3] border border-[#E0DED8] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#111] focus:outline-none focus:border-[#7A5C58] focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="New Patient">New Patient</option>
                        <option value="Existing Patient">Existing Patient</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-[10px] sm:text-xs font-sans uppercase tracking-wider text-[#514C48]/80 mb-1 font-medium">
                      Select Service <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F3] border border-[#E0DED8] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#111] focus:outline-none focus:border-[#7A5C58] focus:bg-white transition-all cursor-pointer"
                    >
                      {servicesList.map((svc) => (
                        <option key={svc} value={svc}>{svc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[10px] sm:text-xs font-sans uppercase tracking-wider text-[#514C48]/80 mb-1 font-medium">
                      Reason for Visit <span className="text-[#514C48]/40 normal-case">(Optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="2"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Briefly describe your requirements..."
                      className="w-full bg-[#FAF7F3] border border-[#E0DED8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#111] placeholder:text-[#514C48]/40 focus:outline-none focus:border-[#7A5C58] focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer bg-[#FAF7F3] p-3 rounded-xl border border-[#E0DED8] hover:border-[#7A5C58] transition-colors">
                      <input
                        type="checkbox"
                        name="privacyConsent"
                        required
                        checked={formData.privacyConsent}
                        onChange={handleChange}
                        className="mt-0.5 accent-[#7A5C58] w-3.5 h-3.5 rounded cursor-pointer"
                      />
                      <span className="text-[11px] sm:text-xs text-[#514C48] leading-relaxed">
                        I agree to privacy & communication guidelines regarding appointment alerts. <span className="text-rose-500">*</span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={loading}
                    className="w-1/3 bg-transparent border border-[#514C48]/30 hover:border-[#111] text-[#514C48] text-xs font-sans tracking-widest uppercase py-3.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>←</span> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-[#111] hover:bg-[#7A5C58] text-white text-xs font-sans tracking-widest uppercase py-3.5 rounded-full transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? "Saving..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="pt-2 text-center text-[10px] sm:text-xs text-[#514C48]/50">
            Secure 256-bit encrypted reservation protocol
          </div>
        </div>
      </div>
    </main>
  );
}