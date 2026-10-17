"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export default function RegisterPatient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "Male",
    contactNumber: "",
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/patient/portal");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/patient/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Registration successful!");
        router.push("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  if (status === "loading") {
    return (
      <div className="h-[100svh] bg-[#FAF7F3] flex items-center justify-center font-serif text-[#514C48]">
        Checking session...
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <main className="min-h-[100svh] bg-[#FAF7F3] flex items-center justify-center p-4 sm:p-6 text-[#514C48]">
      <Toaster />
      <div className="max-w-xl w-full bg-[#FAF7F3] border border-[#E6DEC9] p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        
        {/* Top Logo Section */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF7F3] border border-[#E6DEC9] flex items-center justify-center shadow-sm overflow-hidden p-2">
  <img
    src="https://res.cloudinary.com/wapixih0/image/upload/w_200,f_auto,q_auto/v1790707283/Logo.png"
    alt="Logo"
    className="w-full h-full object-contain"
    loading="eager"
  />
</div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif text-[#111]">
              Patient Registration
            </h1>
            <p className="text-[11px] sm:text-xs font-serif text-[#514C48]/70 mt-1">
              Create your profile to access the Baseline Management Portal.
            </p>
          </div>
        </div>

        {/* Google Autofill Button */}
        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full bg-[#FAF7F3] hover:bg-[#F3EDE2] border border-[#E6DEC9] text-[#111] font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition font-sans text-xs sm:text-sm shadow-sm"
        >
          <FcGoogle size={20} />
          <span>Autofill with Google</span>
        </button>

        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-[#E6DEC9]"></div>
          <span className="px-3 text-[10px] sm:text-xs font-serif text-[#514C48]/50 uppercase">
            Personal Details
          </span>
          <div className="flex-grow border-t border-[#E6DEC9]"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-serif">
          <div>
            <label className="text-[10px] sm:text-xs uppercase tracking-wider text-[#514C48]/70 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3.5 py-3 text-xs sm:text-sm text-[#514C48] focus:outline-none focus:border-[#111]"
            />
          </div>

          <div>
            <label className="text-[10px] sm:text-xs uppercase tracking-wider text-[#514C48]/70 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3.5 py-3 text-xs sm:text-sm text-[#514C48] focus:outline-none focus:border-[#111]"
            />
          </div>

          <div>
            <label className="text-[10px] sm:text-xs uppercase tracking-wider text-[#514C48]/70 block mb-1">
              Password (For Portal Login)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3.5 py-3 text-xs sm:text-sm text-[#514C48] focus:outline-none focus:border-[#111]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] sm:text-xs uppercase tracking-wider text-[#514C48]/70 block mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3.5 py-3 text-xs sm:text-sm text-[#514C48] focus:outline-none focus:border-[#111]"
              />
            </div>

            <div>
              <label className="text-[10px] sm:text-xs uppercase tracking-wider text-[#514C48]/70 block mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3.5 py-3 text-xs sm:text-sm text-[#514C48] focus:outline-none focus:border-[#111]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] sm:text-xs uppercase tracking-wider text-[#514C48]/70 block mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              placeholder="+92 300 0000000"
              className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3.5 py-3 text-xs sm:text-sm text-[#514C48] focus:outline-none focus:border-[#111]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium py-3.5 rounded-xl transition font-sans text-sm shadow-sm mt-2"
          >
            Register Account
          </button>
        </form>

        <p className="text-center text-xs font-serif text-[#514C48]/70 pt-2 border-t border-[#E6DEC9]">
          Already registered?{" "}
          <a href="/login" className="text-[#111] font-bold underline">
            Login here
          </a>
        </p>
      </div>
    </main>
  );
}