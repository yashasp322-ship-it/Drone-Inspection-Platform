import { motion } from "framer-motion";
import { Play, Sparkles, ArrowRight, Activity, ShieldAlert, Cpu } from "lucide-react";
import heroImage from "../assets/hero_infrastructure.png";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#140F23] via-[#1C1635] to-[#120D20]">
      {/* Background Soft Periwinkle / Lavender Ambient Glows (#C4BDF3 / rgb(196, 189, 243)) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(196,189,243,0.20),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(139,92,246,0.18),transparent_50%)] pointer-events-none" />

      {/* Floating Animated Lavender Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-10 w-[550px] h-[550px] bg-[#C4BDF3]/25 rounded-full blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#A78BFA]/20 rounded-full blur-[130px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Content */}
        <div className="lg:col-span-6 text-left space-y-8">
          {/* Badge: AI–POWERED DRONE INSPECTION (Continuous Floating Up-and-Down Animation) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: [0, -18, 0],
            }}
            transition={{
              opacity: { duration: 0.6 },
              y: {
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#C4BDF3]/15 border border-[#C4BDF3]/30 text-[#C4BDF3] text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(196,189,243,0.2)] backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C4BDF3]" />
            <span>AI–POWERED DRONE INSPECTION</span>
          </motion.div>

          {/* Clean Headline & Sub-headline Stack */}
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-xl"
            >
              Inspect Infrastructure <br />
              With AI
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#C4BDF3] via-[#E2DEFA] to-[#9A8DE6]"
            >
              Detect Defects Before Failure.
            </motion.div>
          </div>

          {/* Workflow Steps Pill: Upload -> Detect -> Assess -> Recommend -> Report */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-white/5 border border-[#C4BDF3]/20 backdrop-blur-lg text-xs font-semibold text-[#D4CEF6]"
          >
            <span className="px-2.5 py-1 rounded-lg bg-[#C4BDF3]/20 text-[#E2DEFA] font-mono">Upload</span>
            <span className="text-[#C4BDF3]/60">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#C4BDF3]/20 text-[#E2DEFA] font-mono">Detect</span>
            <span className="text-[#C4BDF3]/60">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#C4BDF3]/20 text-[#E2DEFA] font-mono">Assess</span>
            <span className="text-[#C4BDF3]/60">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#C4BDF3]/20 text-[#E2DEFA] font-mono">Recommend</span>
            <span className="text-[#C4BDF3]/60">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#C4BDF3]/30 text-white font-mono font-bold">Report</span>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-2"
          >
            <a
              href="#pricing"
              className="px-8 py-4 bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C4BDF3] text-white font-bold rounded-xl text-center shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(196,189,243,0.4)] flex items-center justify-center space-x-2"
            >
              <span>Start Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => {
                const viewer = document.getElementById("demo-viewer");
                viewer?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center justify-center space-x-3 px-8 py-4 bg-[#C4BDF3]/10 hover:bg-[#C4BDF3]/20 text-[#E2DEFA] font-bold rounded-xl border border-[#C4BDF3]/25 hover:border-[#C4BDF3]/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
            >
              <Play className="w-4 h-4 fill-[#C4BDF3] text-[#C4BDF3]" />
              <span>Explore Pipeline</span>
            </button>
          </motion.div>

          {/* Metrics Bar at bottom of hero: 5 AI AGENTS | 4 ASSET TYPES | YOLO CV | AI REPORTS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-8 border-t border-[#C4BDF3]/15 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <div className="p-3 rounded-xl bg-white/5 border border-[#C4BDF3]/10 text-center">
              <div className="text-lg sm:text-xl font-extrabold text-white">5 AI AGENTS</div>
              <div className="text-[10px] text-[#C4BDF3]/80 mt-0.5 uppercase tracking-wider font-semibold">LangGraph Pipeline</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-[#C4BDF3]/10 text-center">
              <div className="text-lg sm:text-xl font-extrabold text-white">4 ASSET TYPES</div>
              <div className="text-[10px] text-[#C4BDF3]/80 mt-0.5 uppercase tracking-wider font-semibold">Bridges • Turbines • Solar • Roads</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-[#C4BDF3]/10 text-center">
              <div className="text-lg sm:text-xl font-extrabold text-white">YOLO CV</div>
              <div className="text-[10px] text-[#C4BDF3]/80 mt-0.5 uppercase tracking-wider font-semibold">Defect Vision Models</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-[#C4BDF3]/10 text-center">
              <div className="text-lg sm:text-xl font-extrabold text-white">AI REPORTS</div>
              <div className="text-[10px] text-[#C4BDF3]/80 mt-0.5 uppercase tracking-wider font-semibold">Automated Markdown</div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Real Infrastructure Drone Image Card (Continuous Floating Up-and-Down Animation) */}
        <div className="lg:col-span-6 relative mt-6 lg:mt-0">
          <div className="absolute inset-0 bg-[#C4BDF3]/30 blur-[120px] rounded-full pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -24, 0],
            }}
            whileHover={{
              scale: 1.02,
              rotateX: 2,
              rotateY: -2,
            }}
            transition={{
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 },
              y: {
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="relative bg-[#1A142D] border border-[#C4BDF3]/25 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-2.5 backdrop-blur-xl"
          >
            {/* Top Window Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#C4BDF3]/15 mb-2">
              <div className="flex space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="w-3 h-3 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[11px] font-mono text-[#C4BDF3] flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>DRONE IMAGE • YOLO DEFECT DETECTION</span>
              </div>
            </div>

            {/* Infrastructure Image Container */}
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] group border border-[#C4BDF3]/20 bg-black">
              {/* Real Infrastructure Drone Inspection Image */}
              <img
                src={heroImage}
                alt="Infrastructure Drone Inspection"
                className="w-full h-full object-cover brightness-95 contrast-105 transition-all duration-500 group-hover:scale-105"
              />

              {/* Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#140F23]/80 via-transparent to-transparent pointer-events-none" />

              {/* Scanning Ray Beam */}
              <motion.div
                animate={{ y: ["0%", "100%", "0%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C4BDF3] to-transparent shadow-[0_0_15px_#C4BDF3] pointer-events-none"
              />

              {/* DEFECT MARK 1: Bounding Box over Crack on Concrete Pier */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-[42%] left-[32%] w-[38%] h-[30%] border-2 border-red-500 rounded-lg shadow-[0_0_25px_rgba(239,68,68,0.55)] bg-red-500/10 pointer-events-auto flex flex-col justify-between p-2"
              >
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-red-400" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-red-400" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-400" />

                {/* Tag Banner */}
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-red-600 text-white font-mono text-[11px] font-black tracking-wider rounded uppercase shadow-md flex items-center space-x-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>CRACK</span>
                  </span>
                  <span className="px-2 py-0.5 bg-black/80 text-[#C4BDF3] font-mono text-[10px] font-bold rounded border border-[#C4BDF3]/30">
                    YOLO 94%
                  </span>
                </div>

                <div className="text-[10px] font-mono text-red-200 font-semibold bg-black/60 px-1.5 py-0.5 rounded w-max self-end mt-auto">
                  Severity: HIGH
                </div>
              </motion.div>

              {/* DEFECT MARK 2: Corrosion Defect Box on Steel Truss */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute top-[18%] right-[15%] w-[28%] h-[20%] border-2 border-amber-400 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.5)] bg-amber-500/10 pointer-events-auto flex flex-col justify-between p-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="px-1.5 py-0.5 bg-amber-500 text-black font-mono text-[10px] font-black tracking-wider rounded uppercase">
                    CORROSION
                  </span>
                  <span className="px-1.5 py-0.5 bg-black/80 text-amber-300 font-mono text-[9px] font-bold rounded">
                    91%
                  </span>
                </div>
              </motion.div>

              {/* Floating Bottom Card overlay inside viewer */}
              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between p-3 rounded-xl bg-black/80 border border-[#C4BDF3]/30 backdrop-blur-md text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C4BDF3]/20 border border-[#C4BDF3]/40 flex items-center justify-center text-[#C4BDF3]">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[#C4BDF3] uppercase tracking-widest font-bold">
                      INSPECTION STATUS
                    </div>
                    <div className="text-xs font-semibold text-white">
                      2 Defects Detected • Concrete Pier Structure
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center space-x-2 text-[10px] font-mono bg-[#C4BDF3]/20 px-2.5 py-1 rounded-lg text-[#E2DEFA] border border-[#C4BDF3]/30">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>MODEL V4.2</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
