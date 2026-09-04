'use client';

import { useState } from 'react';

export default function AppointmentPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    patientType: 'New Patient',
    appointmentFor: 'Self',
    service: 'Clinic',
    preferredDate: '',
    preferredTime: '',
    preferredDoctor: '',
    appointmentMode: 'In-Clinic',
    message: '',
    preferredContactMethod: 'Phone Call',
    privacyConsent: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const servicesList = [
    'Clinic Consultation',
    'Aesthetic Medicine',
    'Wellness & Anti-Aging',
    'Orthopedic Care',
    'Maternity & Gynecology',
    'Advanced Dermatology',
    'Plastic Surgery',
  ];

  const doctorsList = [
    'Dr. Sarah Johnson (General & Clinic)',
    'Dr. Michael Chen (Aesthetic & Dermatology)',
    'Dr. Robert Smith (Orthopedic Specialist)',
    'Dr. Emily Davis (Maternity & Care)',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.privacyConsent) {
      alert('Please agree to the privacy & communication consent.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className="w-full bg-[#FAF7F3] text-[#514C48] min-h-screen py-20 px-6 md:px-12 xl:px-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Editorial Page Header */}
        <div className="text-center mb-14">
          <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#7A5C58] block mb-3 font-medium">
            EXCLUSIVE CARE RESERVATION
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#111] tracking-tight">
            Book Your Appointment
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#514C48]/80 max-w-lg mx-auto font-sans font-light leading-relaxed">
            Experience bespoke aesthetic and clinical care. Share your preferences below, and our concierge team will finalize your schedule.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-[32px] p-10 sm:p-16 text-center shadow-2xl shadow-[#514C48]/10 border border-[#514C48]/10 transition-all">
            <span className="w-16 h-16 bg-[#FAF7F3] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl border border-[#7A5C58]/20 text-[#7A5C58]">
              ✦
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#111] mb-4">Request Received Successfully</h2>
            <p className="text-sm sm:text-base text-[#514C48]/80 mb-8 max-w-md mx-auto font-light leading-relaxed">
              Thank you, <span className="font-medium text-[#111]">{formData.fullName}</span>. We have saved your request and will connect with you via <span className="font-medium text-[#111]">{formData.phone}</span> shortly to verify your time slot.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-[#111] hover:bg-[#7A5C58] text-white text-[11px] font-sans tracking-[0.25em] uppercase py-4 px-10 rounded-full transition-all duration-500 shadow-lg shadow-[#111]/10"
            >
              Book Another Session
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 sm:p-12 md:p-16 shadow-2xl shadow-[#514C48]/10 border border-[#514C48]/10 space-y-12">
            
            {/* Section 1: Personal Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-xs font-serif italic text-[#7A5C58]">01</span>
                <h3 className="text-xl font-serif text-[#111]">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-[#514C48]/80 mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Victoria Sterling"
                    className="w-full bg-[#FAF7F3]/60 border border-[#514C48]/15 rounded-2xl px-5 py-4 text-sm text-[#111] placeholder:text-[#514C48]/30 focus:outline-none focus:border-[#7A5C58] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-[#514C48]/80 mb-2">
                    Phone / Whatsapp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-[#FAF7F3]/60 border border-[#514C48]/15 rounded-2xl px-5 py-4 text-sm text-[#111] placeholder:text-[#514C48]/30 focus:outline-none focus:border-[#7A5C58] transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-[#514C48]/80 mb-2">
                    Email Address <span className="text-[#514C48]/40 normal-case font-light">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="victoria@example.com"
                    className="w-full bg-[#FAF7F3]/60 border border-[#514C48]/15 rounded-2xl px-5 py-4 text-sm text-[#111] placeholder:text-[#514C48]/30 focus:outline-none focus:border-[#7A5C58] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Appointment Specifics */}
            <div className="space-y-6 pt-4 border-t border-[#514C48]/10">
              <div className="flex items-center gap-4">
                <span className="text-xs font-serif italic text-[#7A5C58]">02</span>
                <h3 className="text-xl font-serif text-[#111]">Care Preferences & Scheduling</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Patient Type */}
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-[#514C48]/80 mb-3">
                    Patient Status <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {['New Patient', 'Existing Patient'].map((type) => (
                      <label 
                        key={type} 
                        className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                          formData.patientType === type 
                            ? 'border-[#7A5C58] bg-[#7A5C58]/5 text-[#111] font-medium' 
                            : 'border-[#514C48]/15 bg-[#FAF7F3]/40 text-[#514C48]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="patientType"
                          value={type}
                          checked={formData.patientType === type}
                          onChange={handleChange}
                          className="hidden"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Appointment For */}
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-[#514C48]/80 mb-2">
                    Appointment For <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="appointmentFor"
                    value={formData.appointmentFor}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F3]/60 border border-[#514C48]/15 rounded-2xl px-5 py-4 text-sm text-[#111] focus:outline-none focus:border-[#7A5C58] transition-all cursor-pointer"
                  >
                    <option value="Self">Self</option>
                    <option value="Child">Child</option>
                    <option value="Family Member">Family Member</option>
                  </select>
                </div>

                {/* Select Services */}
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-[#514C48]/80 mb-2">
                    Select Service Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F3]/60 border border-[#514C48]/15 rounded-2xl px-5 py-4 text-sm text-[#111] focus:outline-none focus:border-[#7A5C58] transition-all cursor-pointer"
                  >
                    {servicesList.map((svc) => (
                      <option key={svc} value={svc}>{svc}</option>
                    ))}
                  </select>
                </div>

                {/* Appointment Mode */}
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-[#514C48]/80 mb-3">
                    Consultation Mode <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {['In-Clinic', 'Online Consultation'].map((mode) => (
                      <label 
                        key={mode} 
                        className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                          formData.appointmentMode === mode 
                            ? 'border-[#7A5C58] bg-[#7A5C58]/5 text-[#111] font-medium' 
                            : 'border-[#514C48]/15 bg-[#FAF7F3]/40 text-[#514C48]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="appointmentMode"
                          value={mode}
                          checked={formData.appointmentMode === mode}
                          onChange={handleChange}
                          className="hidden"
                        />
                        {mode}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-[#514C48]/80 mb-2">
                    Preferred Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    required
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F3]/60 border border-[#514C48]/15 rounded-2xl px-5 py-4 text-sm text-[#111] focus:outline-none focus:border-[#7A5C58] transition-all cursor-pointer"
                  />
                </div>

                {/* Preferred Time */}
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-[#514C48]/80 mb-2">
                    Preferred Time Slot <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="preferredTime"
                    required
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F3]/60 border border-[#514C48]/15 rounded-2xl px-5 py-4 text-sm text-[#111] focus:outline-none focus:border-[#7A5C58] transition-all cursor-pointer"
                  />
                </div>

                {/* Preferred Doctor */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-[#514C48]/80 mb-2">
                    Preferred Specialist <span className="text-[#514C48]/40 normal-case font-light">(Optional)</span>
                  </label>
                  <select
                    name="preferredDoctor"
                    value={formData.preferredDoctor}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F3]/60 border border-[#514C48]/15 rounded-2xl px-5 py-4 text-sm text-[#111] focus:outline-none focus:border-[#7A5C58] transition-all cursor-pointer"
                  >
                    <option value="">-- Assign Best Available Specialist --</option>
                    {doctorsList.map((doc) => (
                      <option key={doc} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Section 3: Additional Notes */}
            <div className="space-y-6 pt-4 border-t border-[#514C48]/10">
              <div className="flex items-center gap-4">
                <span className="text-xs font-serif italic text-[#7A5C58]">03</span>
                <h3 className="text-xl font-serif text-[#111]">Notes & Communication</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-[#514C48]/80 mb-2">
                    Reason for Visit / Message <span className="text-[#514C48]/40 normal-case font-light">(Optional)</span>
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us a little about your medical goals or any specific symptoms..."
                    className="w-full bg-[#FAF7F3]/60 border border-[#514C48]/15 rounded-2xl px-5 py-4 text-sm text-[#111] placeholder:text-[#514C48]/30 focus:outline-none focus:border-[#7A5C58] transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-[#514C48]/80 mb-3">
                    Preferred Contact Channel <span className="text-[#514C48]/40 normal-case font-light">(Optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {['Phone Call', 'Whatsapp', 'Email'].map((method) => (
                      <label key={method} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#514C48]">
                        <input
                          type="radio"
                          name="preferredContactMethod"
                          value={method}
                          checked={formData.preferredContactMethod === method}
                          onChange={handleChange}
                          className="accent-[#7A5C58]"
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Consent Box */}
            <div className="pt-2">
              <label className="flex items-start gap-3.5 cursor-pointer bg-[#FAF7F3]/40 p-5 rounded-2xl border border-[#514C48]/10 hover:border-[#7A5C58]/30 transition-all">
                <input
                  type="checkbox"
                  name="privacyConsent"
                  required
                  checked={formData.privacyConsent}
                  onChange={handleChange}
                  className="mt-0.5 accent-[#7A5C58] w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-[#514C48]/90 font-light leading-relaxed">
                  ✅ I consent to the privacy guidelines and authorize the clinic team to contact me via phone, WhatsApp, or email regarding appointment scheduling and health updates. <span className="text-rose-500">*</span>
                </span>
              </label>
            </div>

            {/* Submit CTA Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#111] hover:bg-[#7A5C58] text-white text-[11px] font-sans tracking-[0.25em] uppercase py-5 rounded-full transition-all duration-500 shadow-xl shadow-[#111]/15"
              >
                SUBMIT APPOINTMENT REQUEST
              </button>
            </div>

          </form>
        )}

      </div>
    </main>
  );
}