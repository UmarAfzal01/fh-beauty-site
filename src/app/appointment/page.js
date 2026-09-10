"use client";

import { useState, useEffect, useRef } from "react";
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

  // Generate only from today onwards (up to 30 days) and flag Sundays
  const generateMonthDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDays = 30;

    for (let i = 0; i < totalDays; i++) {
      const dateObj = new Date(today);
      dateObj.setDate(today.getDate() + i);

      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });

      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");

      const isSunday = dateObj.getDay() === 0;

      days.push({
        dayNum: dd,
        dayName: dayName,
        dateString: `${monthName} ${dateObj.getDate()}, ${yyyy}`,
        isoDate: `${yyyy}-${mm}-${dd}`,
        isSunday,
      });
    }
    return days;
  };

  const daysList = generateMonthDays();

  // Helper to find the first valid non-Sunday index starting from current index
  const findFirstAvailableDayIndex = (startIndex = 0) => {
    for (let i = startIndex; i < daysList.length; i++) {
      if (!daysList[i].isSunday) return i;
    }
    return 0;
  };

  const [selectedDayIndex, setSelectedDayIndex] = useState(() => findFirstAvailableDayIndex(0));

  // Generate 30-minute intervals from 09:00 AM to 09:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 21 && minute > 0) break;

        const h24 = hour;
        const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
        const modifier = h24 >= 12 ? "PM" : "AM";
        const mStr = String(minute).padStart(2, "0");
        const hStr = String(h12).padStart(2, "0");

        slots.push(`${hStr}:${mStr} ${modifier}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0]);
  const [submitted, setSubmitted] = useState(false);

  // Refs for auto-scrolling active items into view
  const timeSliderRef = useRef(null);
  const timeButtonRefs = useRef([]);
  const dayButtonRefs = useRef([]);

  // Helper function to check if a specific time slot has passed or is within the next 20 minutes
  const isTimeSlotPassed = (timeString, selectedIsoDate) => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (selectedIsoDate !== todayStr) return false;

    const now = new Date();
    // Add a 20-minute buffer to the current time
    const bufferTime = new Date(now.getTime() + 20 * 60000);

    let [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const slotDate = new Date();
    slotDate.setHours(hours, minutes, 0, 0);

    // Disable if the slot is in the past OR within the next 20 minutes
    return slotDate.getTime() <= bufferTime.getTime();
  };

  // Helper to find the first valid (unbooked and unpassed) time slot index
  const findFirstValidTimeIndex = (dateIso, currentBookedTimes = bookedTimes) => {
    for (let i = 0; i < timeSlots.length; i++) {
      const slot = timeSlots[i];
      const isBooked = currentBookedTimes.includes(slot);
      const isPast = isTimeSlotPassed(slot, dateIso);
      
      if (isPast && !isBooked) continue;

      if (!isBooked && !isPast) {
        return i;
      }
    }
    return 0;
  };

  // Auto-scroll active time slot into view when selected
  useEffect(() => {
    if (timeButtonRefs.current[selectedTimeIndex] && timeSliderRef.current) {
      const activeBtn = timeButtonRefs.current[selectedTimeIndex];
      const container = timeSliderRef.current;
      
      const scrollLeft = activeBtn.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [selectedTimeIndex]);

  // Auto-scroll active day card into view when selected
  useEffect(() => {
    if (dayButtonRefs.current[selectedDayIndex]) {
      dayButtonRefs.current[selectedDayIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedDayIndex]);

  // Fetch booked slots whenever selected date changes
  useEffect(() => {
    const currentDayObj = daysList[selectedDayIndex];
    if (!currentDayObj || currentDayObj.isSunday) return;

    const currentDate = currentDayObj.isoDate;

    async function fetchBookedSlots() {
      try {
        const res = await fetch(`/api/appointments?date=${currentDate}`);
        const result = await res.json();
        if (result.success) {
          const times = result.data.map((app) => app.preferredTime);
          setBookedTimes(times);

          const firstValidIdx = findFirstValidTimeIndex(currentDate, times);
          setSelectedTimeIndex(firstValidIdx);
          setSelectedTimeSlot(timeSlots[firstValidIdx]);
          setFormData((f) => ({ ...f, preferredTime: timeSlots[firstValidIdx] }));
        }
      } catch (err) {
        console.error("Failed to fetch booked slots", err);
      }
    }

    fetchBookedSlots();
  }, [selectedDayIndex]);

  // Prevent hydration mismatch & initialize first valid time
  useEffect(() => {
    setMounted(true);
    const initialValidIdx = findFirstAvailableDayIndex(0);
    setSelectedDayIndex(initialValidIdx);
    const initialIso = daysList[initialValidIdx].isoDate;
    const firstValidIdx = findFirstValidTimeIndex(initialIso, bookedTimes);
    setSelectedTimeIndex(firstValidIdx);
    setSelectedTimeSlot(timeSlots[firstValidIdx]);
    setFormData((f) => ({
      ...f,
      preferredDate: initialIso,
      preferredTime: timeSlots[firstValidIdx],
    }));
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
      let newIndex = prev - 1;
      while (newIndex >= 0 && daysList[newIndex].isSunday) {
        newIndex--;
      }
      if (newIndex < 0) return prev; // Don't move if blocked by a Sunday or start limit
      setFormData((f) => ({ ...f, preferredDate: daysList[newIndex].isoDate }));
      return newIndex;
    });
  };

  const handleNextDayScroll = () => {
    setSelectedDayIndex((prev) => {
      let newIndex = prev + 1;
      while (newIndex < daysList.length && daysList[newIndex].isSunday) {
        newIndex++;
      }
      if (newIndex >= daysList.length) return prev;
      setFormData((f) => ({ ...f, preferredDate: daysList[newIndex].isoDate }));
      return newIndex;
    });
  };

  const handlePrevTimeScroll = () => {
    if (timeSliderRef.current) {
      timeSliderRef.current.scrollBy({ left: -150, behavior: "smooth" });
    }
  };

  const handleNextTimeScroll = () => {
    if (timeSliderRef.current) {
      timeSliderRef.current.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  const handleDaySelect = (index) => {
    if (daysList[index].isSunday) return; // Prevent selecting Sunday
    setSelectedDayIndex(index);
    setFormData((prev) => ({
      ...prev,
      preferredDate: daysList[index].isoDate,
    }));
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
    const currentDay = daysList[selectedDayIndex];
    if (!currentDay || currentDay.isSunday) {
      alert("Sundays are closed. Please select another day.");
      return;
    }
    const currentDate = currentDay.isoDate;
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

  if (!mounted) return null;

  const visibleDays = getVisibleDays();
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
              Dr Warda Sikander
            </span>
            <h2 className="text-3xl font-serif font-normal leading-snug">
              Clinic Hours: Mon – Sat (9:00 AM – 9:00 PM)
            </h2>
            <p className="text-sm text-white/85 font-light max-w-md">
              Experience seamless booking with 30-minute interval medical and aesthetic consultation options.
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
                      const isSunday = day.isSunday;

                      return (
                        <button
                          key={day.dateString}
                          ref={(el) => {
                            if (el) dayButtonRefs.current[day.originalIndex] = el;
                          }}
                          type="button"
                          disabled={isSunday}
                          onClick={() => handleDaySelect(day.originalIndex)}
                          className={`aspect-square rounded-xl sm:rounded-2xl p-2 flex flex-col items-center justify-center transition-all duration-300 relative border ${
                            isSunday
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-80"
                              : isSelected
                              ? "bg-[#111] text-white border-[#111] shadow-lg scale-105"
                              : "bg-[#FAF7F3] text-[#514C48] border-[#E0DED8]/60 hover:bg-white hover:border-[#7A5C58] cursor-pointer"
                          }`}
                        >
                          <span className={`text-[9px] sm:text-[10px] font-sans uppercase tracking-wider mb-0.5 ${isSelected ? "text-white/70" : "text-[#514C48]/60"}`}>
                            {day.dayName}
                          </span>
                          <span className={`text-base sm:text-xl font-serif ${isSelected ? "font-bold text-white" : "font-medium text-[#111]"}`}>
                            {day.dayNum}
                          </span>

                          {/* Sunday Overlay Label */}
                          {isSunday && (
                            <span className="absolute inset-x-1 bottom-1.5 bg-rose-100 text-rose-800 text-[8px] sm:text-[9px] uppercase tracking-wider font-bold py-0.5 rounded text-center shadow-xs">
                              Closed
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Horizontal Scrollable Time Slots Row with Scroll Controls */}
                  <div className="pt-2 border-t border-[#E0DED8]/40">
                    <div className="flex items-center justify-between px-1 mb-2">
                      <span className="text-sm font-serif font-medium text-[#111]">
                        Select Time Slot (30 mins)
                      </span>
                      
                      {/* Left & Right Time Navigation Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handlePrevTimeScroll}
                          className="w-7 h-7 rounded-lg bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-xs text-[#514C48] hover:border-[#111] transition-all cursor-pointer shadow-sm"
                          title="Scroll Left"
                        >
                          &lt;
                        </button>
                        <button
                          type="button"
                          onClick={handleNextTimeScroll}
                          className="w-7 h-7 rounded-lg bg-[#FAF7F3] border border-[#E0DED8] flex items-center justify-center text-xs text-[#514C48] hover:border-[#111] transition-all cursor-pointer shadow-sm"
                          title="Scroll Right"
                        >
                          &gt;
                        </button>
                      </div>
                    </div>

                    <div 
                      ref={timeSliderRef}
                      className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#FAF7F3] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E0DED8] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#7A5C58]"
                    >
                      {timeSlots.map((timeStr, index) => {
                        const isSelected = index === selectedTimeIndex;
                        const isBooked = bookedTimes.includes(timeStr);
                        const isPast = isTimeSlotPassed(timeStr, currentDate);

                        // Hide past time slots UNLESS they are booked
                        if (isPast && !isBooked) return null;

                        const isDisabled = isBooked || isPast;

                        return (
                          <button
                            key={timeStr}
                            ref={(el) => {
                              if (el) timeButtonRefs.current[index] = el;
                            }}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => handleTimeSelect(index)}
                            className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm sm:text-base font-serif transition-all duration-300 border relative ${
                              isDisabled
                                ? "bg-gray-100 text-gray-400 border-gray-200 opacity-75 cursor-not-allowed"
                                : isSelected
                                ? "bg-[#111] text-white border-[#111] shadow-md scale-105"
                                : "bg-[#FAF7F3] text-[#514C48] border-[#E0DED8]/80 hover:bg-white hover:border-[#7A5C58] cursor-pointer"
                            }`}
                          >
                            <span>{timeStr}</span>
                            {isBooked && (
                              <span className="block text-[9px] uppercase tracking-wider text-green-600 font-sans font-semibold mt-0.5">
                                Booked
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
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