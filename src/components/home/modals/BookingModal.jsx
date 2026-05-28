"use client";

/* ==========================================
   FRAMER MOTION
========================================== */

import {
  motion,
  AnimatePresence,
} from "framer-motion";

/* ==========================================
   CALENDLY
========================================== */

import {
  PopupButton,
} from "react-calendly";

/* ==========================================
   COMPONENT
========================================== */

export default function BookingModal({

  bookingModal,
  setBookingModal,
  selectedService,

}) {

  return (

    <AnimatePresence>

      {bookingModal && (

        <motion.div

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          exit={{
            opacity: 0,
          }}

          className="
            fixed
            inset-0
            z-[100]
            bg-black/80
            backdrop-blur-md
            flex
            items-center
            justify-center
            px-6
          "
        >

          {/* MODAL CARD */}

          <motion.div

            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}

            className="
              bg-zinc-950
              border
              border-white/10
              rounded-[32px]
              p-10
              max-w-lg
              w-full
              relative
              shadow-2xl
            "
          >

            {/* CLOSE BUTTON */}

            <button

              onClick={() =>
                setBookingModal(false)
              }

              className="
                absolute
                top-5
                right-5
                text-white
                hover:text-yellow-400
                text-2xl
              "
            >

              ✕

            </button>

            {/* TITLE */}

            <h2 className="
              text-4xl
              font-black
              mb-4
              text-center
              text-white
            ">

              Choose Your Consultation

            </h2>

            <p className="
              text-gray-400
              text-center
              mb-10
            ">

              Select your preferred consultation duration.

            </p>

            {/* OPTIONS */}

            <div className="
              flex
              flex-col
              gap-5
            ">

              {/* FREE */}

              <PopupButton

                url={`https://calendly.com/josuebizazu60/new-meeting-1?a1=${encodeURIComponent(selectedService)}`}

                rootElement={
                  typeof window !== "undefined"
                    ? document.body
                    : undefined
                }

                text="15 Minutes - Free Consultation"

                className="
                  bg-blue-500
                  hover:bg-blue-400
                  text-black
                  py-5
                  rounded-2xl
                  font-bold
                  text-lg
                  transition
                  w-full
                "
              />

              {/* 30 MIN */}

              <PopupButton

                url={`https://calendly.com/josuebizazu60/30min?a1=${encodeURIComponent(selectedService)}`}

                rootElement={
                  typeof window !== "undefined"
                    ? document.body
                    : undefined
                }

                text="30 Minutes - $25"

                className="
                  bg-yellow-500
                  hover:bg-yellow-400
                  text-black
                  py-5
                  rounded-2xl
                  font-bold
                  text-lg
                  transition
                  w-full
                "
              />

              {/* 1 HOUR */}

              <PopupButton

                url={`https://calendly.com/josuebizazu60/new-meeting?a1=${encodeURIComponent(selectedService)}`}

                rootElement={
                  typeof window !== "undefined"
                    ? document.body
                    : undefined
                }

                text="1 Hour - $50"

                className="
                  border
                  border-white/20
                  hover:bg-white
                  hover:text-black
                  text-white
                  py-5
                  rounded-2xl
                  font-bold
                  text-lg
                  transition
                  w-full
                "
              />

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );
}