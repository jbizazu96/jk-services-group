export default function JKServicesLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/855289/855289-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Creating Memorable Events & Reliable Technology Solutions
          </h1>

          <p className="text-lg md:text-2xl text-gray-200 mb-8">
            Wedding Services • DJ • Photography • Networking • IT Consulting
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl transition">
              Book Consultation
            </button>

            <button className="border border-white hover:bg-white hover:text-black px-8 py-4 rounded-2xl text-lg transition">
              Explore Services
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
              alt="Team"
              className="rounded-3xl shadow-2xl"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-6 text-yellow-400">
              About Us
            </h2>

            <p className="text-gray-300 text-lg leading-8 mb-6">
              We provide premium event services and professional networking
              solutions for churches, businesses, weddings, and communities.
              From unforgettable celebrations to reliable technology
              installations, we bring excellence, creativity, and professionalism
              to every project.
            </p>

            <p className="text-gray-400 leading-7">
              Our mission is simple: help families, churches, and organizations
              create memorable experiences while delivering dependable technical
              solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-yellow-400">
              Our Services
            </h2>
            <p className="text-gray-400 text-lg">
              Professional services tailored for your events and technology needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'MC & Event Hosting',
                image:
                  'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
              },
              {
                title: 'DJ Music Services',
                image:
                  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop',
              },
              {
                title: 'Photography & Videography',
                image:
                  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
              },
              {
                title: 'Networking Installation',
                image:
                  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
              },
              {
                title: 'Wi‑Fi Solutions',
                image:
                  'https://images.unsplash.com/photo-1520869562399-e772f042f422?q=80&w=1200&auto=format&fit=crop',
              },
              {
                title: 'IT Consulting',
                image:
                  'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition duration-300"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-60 w-full object-cover"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3">
                    {service.title}
                  </h3>

                  <p className="text-gray-400 leading-7">
                    High quality professional services designed to create impact,
                    reliability, and memorable experiences.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center bg-black rounded-3xl p-12 border border-yellow-500/20 shadow-2xl">
          <h2 className="text-5xl font-bold mb-6 text-yellow-400">
            Book a Consultation
          </h2>

          <p className="text-gray-300 text-lg mb-8 leading-8">
            Schedule a personalized consultation for your event planning,
            networking installation, or IT support needs.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-zinc-900 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4">
                Standard Consultation
              </h3>

              <p className="text-5xl font-bold text-yellow-400 mb-4">$25</p>

              <p className="text-gray-400 mb-6">
                30-minute consultation session.
              </p>

              <button className="w-full bg-yellow-500 text-black py-4 rounded-xl font-semibold hover:bg-yellow-400 transition">
                Book Now
              </button>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-8 border border-yellow-500">
              <h3 className="text-2xl font-semibold mb-4">
                Premium Consultation
              </h3>

              <p className="text-5xl font-bold text-yellow-400 mb-4">$50</p>

              <p className="text-gray-400 mb-6">
                1-hour detailed strategy session.
              </p>

              <button className="w-full bg-yellow-500 text-black py-4 rounded-xl font-semibold hover:bg-yellow-400 transition">
                Book Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-yellow-400 mb-4">
              Recent Projects
            </h2>
            <p className="text-gray-400 text-lg">
              Moments and installations we've proudly delivered.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
            ].map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Gallery"
                className="rounded-2xl h-72 w-full object-cover hover:scale-105 transition duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 py-12 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-3xl font-bold text-yellow-400">
              JK Services Group
            </h3>
            <p className="text-gray-400 mt-2">
              Events • Media • Networking • Consulting
            </p>
          </div>

          <div className="flex gap-4">
            <button className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition">
              Contact Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}


