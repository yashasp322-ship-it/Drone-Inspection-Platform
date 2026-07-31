import { motion } from "framer-motion";
import { Play, Award } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden bg-gradient-to-b from-brand-dark via-brand-navy to-brand-dark">
      {/* Background visual element */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Content */}
        <div className="lg:col-span-7 text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-white text-xs font-semibold uppercase tracking-wider"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Next-Gen Reality Capture Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
          >
            Tighten the Gap Between <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Capture & Confidence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-xl"
          >
            DroneDeploy brings together aerial mapping, ground 360° walkthroughs, and custom CAD comparison into one unified cloud workspace. Document, measure, and share.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <a
              href="#"
              className="px-8 py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-xl text-center shadow-lg hover:shadow-white/5 transition-all text-base"
            >
              Request a Demo
            </a>
            <button
              onClick={() => {
                const viewer = document.getElementById("demo-viewer");
                viewer?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center justify-center space-x-3 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl border border-white/10 transition-all text-base"
            >
              <Play className="w-5 h-5 fill-white text-white" />
              <span>Explore Interactive Demo</span>
            </button>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6"
          >
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">400M+</div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Acres Mapped</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">190+</div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Countries Covered</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">20x</div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Faster Inspections</div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Visual Mockup */}
        <div className="lg:col-span-5 relative mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative bg-brand-navy border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-2"
          >
            <div className="absolute top-3 left-4 flex space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-neutral-700" />
              <span className="w-3 h-3 rounded-full bg-neutral-600" />
              <span className="w-3 h-3 rounded-full bg-neutral-500" />
            </div>
            <div className="bg-brand-dark rounded-xl overflow-hidden border border-white/5 mt-6 aspect-[4/3] flex flex-col justify-between p-6 relative">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 grayscale" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80")' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
              
              <div className="relative z-10 flex justify-between items-start">
                <span className="px-3 py-1 rounded bg-black/60 border border-white/10 text-white font-mono text-xs">
                  DRONE_WAYPOINT_FLIGHT_A2
                </span>
                <span className="px-2.5 py-0.5 rounded bg-white/10 border border-white/20 text-white text-xs font-semibold">
                  LIVE TELEMETRY
                </span>
              </div>

              {/* Floating Cards */}
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="bg-brand-dark/95 border border-white/10 rounded-lg p-3 backdrop-blur-md">
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Battery Status</div>
                  <div className="text-sm font-bold text-white mt-1">87% • 22 min left</div>
                </div>
                <div className="bg-brand-dark/95 border border-white/10 rounded-lg p-3 backdrop-blur-md">
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Captured Pixels</div>
                  <div className="text-sm font-bold text-white mt-1">1.2B Pixels</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
