import { Landmark, Zap, Sun, Route, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Solutions() {
  const industries = [
    {
      name: "Bridges",
      icon: Landmark,
      color: "from-[#8B5CF6] to-[#6D28D9]",
      desc: "Detect concrete cracks, spalling, and corrosion on piers and girders.",
      stats: "Defects per span",
    },
    {
      name: "Wind Turbines",
      icon: Zap,
      color: "from-[#7C3AED] to-[#5B21B6]",
      desc: "Flag blade erosion, micro-cracks, and lightning strike damage.",
      stats: "Confidence-scored reports",
    },
    {
      name: "Solar Farms",
      icon: Sun,
      color: "from-[#8B5CF6] to-[#6D28D9]",
      desc: "Surface hot spots, cracked cells, and wiring faults in minutes.",
      stats: "Array severity triage",
    },
    {
      name: "Roads",
      icon: Route,
      color: "from-[#6D28D9] to-[#4C1D95]",
      desc: "Identify potholes, pavement cracking, and shoulder erosion.",
      stats: "Network defect tracking",
    },
  ];

  return (
    <section id="solutions" className="py-24 bg-gradient-to-b from-[#140F23] via-[#1B1431] to-[#120D20] text-[#E2DEFA] relative overflow-hidden">
      {/* Background Soft Periwinkle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#C4BDF3]/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title Area (Shortened Header Text) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-left space-y-4 mb-16"
        >
          <span className="text-xs font-bold text-[#C4BDF3] uppercase tracking-widest px-3 py-1 rounded-full bg-[#C4BDF3]/10 border border-[#C4BDF3]/20">
            Tailored Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4BDF3] via-[#E2DEFA] to-[#9A8DE6]">Infrastructure You Inspect</span>
          </h2>
          <p className="text-[#D4CEF6] text-base leading-relaxed">
            Our AI pipeline adapts its defect detection logic specifically for each asset type.
          </p>
        </motion.div>

        {/* Crisp White/Light Lavender Glass Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="bg-[radial-gradient(circle_at_100%_100%,#B8AFEE_0%,#C5BEF0_45%,#FAF8FF_100%)] border border-[#8B5CF6]/35 rounded-2xl p-6 flex flex-col justify-between hover:border-[#5B21B6] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(109,40,217,0.3)] relative overflow-hidden group shadow-lg"
              >
                {/* Background glow hover */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${ind.color} opacity-0 group-hover:opacity-15 filter blur-xl transition-opacity duration-300 pointer-events-none`} />

                <div className="space-y-6">
                  {/* Icon circle */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${ind.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-extrabold text-[#1E1235] group-hover:text-[#6D28D9] transition-colors">
                      {ind.name}
                    </h3>
                    <p className="text-xs text-[#4A3B69] leading-relaxed font-medium">
                      {ind.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#8B5CF6]/15 mt-6 flex flex-col justify-between space-y-3">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#6D28D9]">
                    {ind.stats}
                  </div>
                  <a
                    href="#pricing"
                    className="inline-flex items-center space-x-2 text-xs font-bold text-[#6D28D9] hover:text-[#4C1D95] transition-colors"
                  >
                    <span>Read case study</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6D28D9]" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
