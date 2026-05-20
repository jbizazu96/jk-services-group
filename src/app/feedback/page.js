"use client";

import { db } from "@/lib/firebase";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import React, { useState } from "react";
import {
  Star,
  Send,
  MessageSquare,
  User,
  Briefcase,
} from "lucide-react";

export default function FeedbackPage() {

    const [rating, setRating] = useState(5);
    const [name, setName] = useState("");
    const [service, setService] = useState(""); 
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
      
          await addDoc(collection(db, "feedbacks"), {
            name,
            service,
            feedback,
            rating,
            createdAt: new Date(),
          });
      
          alert("Feedback submitted successfully!");
      
          setName("");
          setService("");
          setFeedback("");
      
        } catch (error) {
      
          console.error(error);
      
          alert("Something went wrong.");
      
        }
      };

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#050505]
        via-[#0f172a]
        to-[#111827]
        text-white
        relative
        overflow-hidden
      "
    >

      {/* BACKGROUND GLOWS */}
      <div className="
        absolute
        top-0
        left-0
        w-[500px]
        h-[500px]
        bg-yellow-500/10
        blur-[120px]
        rounded-full
      "></div>

      <div className="
        absolute
        bottom-0
        right-0
        w-[500px]
        h-[500px]
        bg-blue-500/10
        blur-[120px]
        rounded-full
      "></div>

      {/* CONTAINER */}
      <div className="
        relative
        z-10
        max-w-4xl
        mx-auto
        px-6
        py-24
      ">

        {/* HEADER */}
        <div className="text-center">

          {/* BADGE */}
          <div className="
            inline-flex
            items-center
            gap-2
            bg-white/5
            border
            border-white/10
            rounded-full
            px-5
            py-2
            mb-8
            backdrop-blur-md
          ">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>

            <span className="
              text-yellow-300
              text-sm
              uppercase
              tracking-wide
              font-semibold
            ">
              Client Feedback
            </span>
          </div>

          {/* TITLE */}
          <h1 className="
            text-5xl
            md:text-7xl
            font-black
            leading-tight
          ">
            Share Your
            <span className="text-yellow-400"> Experience</span>
          </h1>

          {/* DESCRIPTION */}
          <p className="
            mt-8
            text-xl
            text-gray-300
            leading-relaxed
            max-w-3xl
            mx-auto
          ">
            Your feedback helps us grow and continue
            delivering premium experiences to every client.
          </p>

        </div>

        {/* FORM CARD */}
        <div className="
          mt-20
          bg-white/5
          border
          border-white/10
          backdrop-blur-xl
          rounded-[40px]
          p-8
          md:p-12
          shadow-[0_20px_80px_rgba(0,0,0,0.35)]
        ">

            <form
            onSubmit={handleSubmit}
            className="space-y-8"
            >

            {/* NAME */}
            <div>

              <label className="
                flex
                items-center
                gap-2
                text-lg
                font-semibold
                mb-3
              ">
                <User className="w-5 h-5 text-yellow-400" />

                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="
                  w-full
                  bg-black/40
                  border
                  border-white/10
                  rounded-2xl
                  px-6
                  py-5
                  text-white
                  placeholder:text-gray-500
                  focus:outline-none
                  focus:border-yellow-500
                  transition
                "
              />

            </div>

            {/* SERVICE */}
            <div>

              <label className="
                flex
                items-center
                gap-2
                text-lg
                font-semibold
                mb-3
              ">
                <Briefcase className="w-5 h-5 text-yellow-400" />

                Service Used
              </label>

              <select
              value={service}
              onChange={(e) => setService(e.target.value)}
                className="
                  w-full
                  bg-black/40
                  border
                  border-white/10
                  rounded-2xl
                  px-6
                  py-5
                  text-white
                  focus:outline-none
                  focus:border-yellow-500
                  transition
                "
              >
                <option className="bg-black">
                  Select a service
                </option>

                <option className="bg-black">
                  MC Services
                </option>

                <option className="bg-black">
                  Event Planning
                </option>

                <option className="bg-black">
                  DJ Music
                </option>

                <option className="bg-black">
                  Photography & Videography
                </option>

                <option className="bg-black">
                  Network Installation
                </option>

                <option className="bg-black">
                  IT Support
                </option>

              </select>

            </div>

            {/* STAR RATING */}
            <div>

              <label className="
                flex
                items-center
                gap-2
                text-lg
                font-semibold
                mb-5
              ">
                <Star className="w-5 h-5 text-yellow-400" />

                Your Rating
              </label>

              <div className="flex gap-3">

                {[1, 2, 3, 4, 5].map((star) => (

                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition hover:scale-110"
                  >

                    <Star
                      className={`
                        w-10
                        h-10
                        ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-500"
                        }
                      `}
                    />

                  </button>

                ))}

              </div>

            </div>

            {/* FEEDBACK */}
            <div>

              <label className="
                flex
                items-center
                gap-2
                text-lg
                font-semibold
                mb-3
              ">
                <MessageSquare className="w-5 h-5 text-yellow-400" />

                Your Feedback
              </label>

              <textarea
                rows={6}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience..."
                className="
                  w-full
                  bg-black/40
                  border
                  border-white/10
                  rounded-2xl
                  px-6
                  py-5
                  text-white
                  placeholder:text-gray-500
                  focus:outline-none
                  focus:border-yellow-500
                  transition
                  resize-none
                "
              ></textarea>

            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="
                w-full
                bg-yellow-500
                hover:bg-yellow-400
                text-black
                py-5
                rounded-2xl
                font-black
                text-xl
                transition
                shadow-2xl
                flex
                items-center
                justify-center
                gap-3
              "
            >

              Submit Feedback

              <Send className="w-5 h-5" />

            </button>

          </form>

        </div>

      </div>

    </main>
  );
}