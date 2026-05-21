"use client";

/* ==========================================
   AUTH FUNCTIONS
========================================== */

import { loginWithGoogle } from "@/lib/auth";

/* ==========================================
   LOGIN SCREEN COMPONENT

   Displays Google Sign-In page
   for J&K Admin Portal.
========================================== */

export default function LoginScreen() {

  return (

    /* ==========================================
       PAGE CONTAINER

       Full-screen centered layout
    ========================================== */

    <div
      className="
        min-h-screen
        bg-slate-950
        flex
        items-center
        justify-center
      "
    >

      {/* ==========================================
          LOGIN CARD
      ========================================== */}

      <div
        className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-10
          text-center
          max-w-md
          w-full
        "
      >

        {/* ==========================================
            APPLICATION TITLE
        ========================================== */}

        <h1
          className="
            text-4xl
            font-black
            text-white
            mb-4
          "
        >
          J&K Admin
        </h1>

        {/* ==========================================
            LOGIN INSTRUCTIONS
        ========================================== */}

        <p
          className="
            text-gray-400
            mb-8
          "
        >
          Sign in with your Google account.
        </p>

        {/* ==========================================
            GOOGLE LOGIN BUTTON

            Opens Firebase Google
            Authentication popup.
        ========================================== */}

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
            transition
          "
        >
          Sign In With Google
        </button>

      </div>

    </div>

  );
}