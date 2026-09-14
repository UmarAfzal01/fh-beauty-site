"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function GoogleAuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-xs text-[#514C48]">Loading session...</div>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs font-serif text-[#111]">
          Hello, {session.user.name}
        </span>
        <button
          onClick={() => signOut()}
          className="bg-transparent border border-[#514C48]/30 hover:border-[#111] text-[#514C48] text-xs font-sans tracking-widest uppercase py-2 px-4 rounded-full transition-all cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-[#111] hover:bg-[#7A5C58] text-white text-xs font-sans tracking-widest uppercase py-3 px-6 rounded-full transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
    >
      <span>Sign in with Google</span>
    </button>
  );
}