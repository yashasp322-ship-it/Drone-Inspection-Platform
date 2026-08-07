import { Landmark, Zap, Sun, Route, ArrowRight } from "lucide-react";

export default function Solutions() {
  const industries = [
    {
      name: "Bridges",
      icon: Landmark,
      color: "from-neutral-200 to-neutral-400",
      desc: "Detect concrete cracks, spalling, delamination, and corrosion on piers, girders, and decks before they require closures.",
      stats: "Severity-ranked defects per span",
    },
    {
      name: "Wind Turbines",
      icon: Zap,
      color: "from-neutral-300 to-neutral-500",
      desc: "Flag blade erosion, lightning strike damage, and coating failures from routine drone passes without grounding the turbine.",
      stats: "Confidence-scored blade reports",
    },
    {
      name: "Solar Farms",
      icon: Sun,
      color: "from-neutral-400 to-neutral-600",
      desc: "Surface hot spots, cracked cells, and wiring faults across large panel arrays in minutes instead of manual walkdowns.",
      stats: "Panel-level severity triage",
    },
    {
      name: "Roads",
      icon: Route,
      color: "from-neutral-500 to-neutral-700",
      desc: "Identify potholes, surface cracking, and shoulder erosion across road segments to prioritize maintenance spend.",
      stats: "Network-scale defect tracking",
    },
  ];

  return (
    <section className="py-24 bg-brand-dark relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Area */}
        <div className="max-w-3xl text-left space-y-4 mb-16">
          <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest">Tailored Solutions</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for the Infrastructure You Inspect
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Every asset type has different failure modes. Our AI pipeline adapts its detection logic to bridges, wind turbines, solar farms, and roads.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <div
                key={idx}
                className="bg-brand-navy/30 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
              >
                {/* Background glow hover */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${ind.color} opacity-0 group-hover:opacity-10 filter blur-xl transition-opacity duration-300 pointer-events-none`} />

                <div className="space-y-6">
                  {/* Icon circle */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${ind.color} flex items-center justify-center text-brand-dark`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">
                      {ind.name}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {ind.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 mt-8 flex flex-col justify-between space-y-4">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-brand-yellow">
                    {ind.stats}
                  </div>
                  <a
                    href="#"
                    className="inline-flex items-center space-x-2 text-xs font-bold text-white hover:text-brand-cyan transition-colors"
                  >
                    <span>Read case study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
