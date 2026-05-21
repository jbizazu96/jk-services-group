"use client";

import { loginWithGoogle } from "@/lib/auth";

export default function LoginScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">

      <div className="
        bg-white/5
        border border-white/10
        rounded-3xl
        p-10
        text-center
        max-w-md
        w-full
      ">

        <h1 className="text-4xl font-black text-white mb-4">
          J&K Admin
        </h1>

        <p className="text-gray-400 mb-8">
          Sign in with your Google account.
        </p>

        <button
          onClick={loginWithGoogle}
          className="
            w-full
            bg-yellow-500
            hover:bg-yellow-400
            text-black
            py-4
            rounded-xl
            font-bold
          "
        >
          Sign In With Google
        </button>

      </div>

    </div>
  );
}