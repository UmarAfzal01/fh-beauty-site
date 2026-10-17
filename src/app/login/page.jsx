"use client";
import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function PatientLogin() {
  const { status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/patient/portal");
    }
  }, [status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid Email or Password");
      } else {
        toast.success("Login successful!");
        router.replace("/patient/portal");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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
      <div className="max-w-md w-full bg-[#FAF7F3] border border-[#E6DEC9] p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
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
              Patient Portal Login
            </h1>
            <p className="text-[11px] sm:text-xs font-serif text-[#514C48]/70 mt-1">
              Enter your registered email & password to access your profile.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 font-serif">
          <div>
            <label className="text-[10px] sm:text-xs uppercase tracking-wider text-[#514C48]/70 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="patient@example.com"
              className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3.5 py-3 text-xs sm:text-sm text-[#514C48] focus:outline-none focus:border-[#111]"
            />
          </div>

          <div>
            <label className="text-[10px] sm:text-xs uppercase tracking-wider text-[#514C48]/70 block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#F3EDE2] border border-[#E6DEC9] rounded-xl px-3.5 py-3 text-xs sm:text-sm text-[#514C48] focus:outline-none focus:border-[#111]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111] hover:bg-[#333] text-[#FAF7F3] font-medium py-3.5 rounded-xl transition font-sans text-sm disabled:opacity-50 mt-2 shadow-sm"
          >
            {loading ? "Logging in..." : "Login to Portal"}
          </button>
        </form>

        <p className="text-center text-xs font-serif text-[#514C48]/70 pt-2 border-t border-[#E6DEC9]">
          Need an account?{" "}
          <a href="/register" className="text-[#111] font-bold underline">
            Register here
          </a>
        </p>
      </div>
    </main>
  );
}
