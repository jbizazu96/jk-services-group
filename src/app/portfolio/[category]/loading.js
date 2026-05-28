/* ==========================================
   PORTFOLIO LOADING PAGE
========================================== */

export default function Loading() {

  return (

    <div
      className="
        min-h-screen
        bg-white
      "
    >

      {/* =====================================
          HERO SKELETON
      ===================================== */}

      <div
        className="
          relative
          h-[360px]
          md:h-[420px]

          animate-pulse

          bg-zinc-300
        "
      ></div>

      {/* =====================================
          CONTENT AREA
      ===================================== */}

      <div
        className="
          max-w-6xl
          mx-auto
          px-6
          py-20
        "
      >

        {/* FILTER BUTTONS */}

        <div
          className="
            flex
            gap-4
            mb-12
          "
        >

          {[1, 2, 3].map(
            (item) => (

              <div
                key={item}
                className="
                  h-12
                  w-28
                  rounded-full

                  bg-zinc-200

                  animate-pulse
                "
              ></div>

            )
          )}

        </div>

        {/* GRID SKELETON */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-8
          "
        >

          {Array.from({
            length: 6,
          }).map(
            (_, index) => (

              <div
                key={index}
                className="
                  rounded-[28px]
                  overflow-hidden

                  bg-zinc-100

                  shadow-lg
                "
              >

                <div
                  className="
                    h-[420px]

                    bg-zinc-300

                    animate-pulse
                  "
                ></div>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );
}