import { HardHat, Sun, Tractor, Factory, ArrowRight } from "lucide-react";

export default function Solutions() {
  const industries = [
    {
      name: "Construction",
      icon: HardHat,
      color: "from-neutral-200 to-neutral-400",
      desc: "Monitor earthworks progress, compare construction states to design plans, and document visual records for claims resolution.",
      stats: "15% average schedule reduction",
    },
    {
      name: "Solar & Renewables",
      icon: Sun,
      color: "from-neutral-300 to-neutral-500",
      desc: "Perform automated thermal scans of solar arrays to detect cells failure. Run inspection passes on wind turbine blades.",
      stats: "99% automated issue detection rate",
    },
    {
      name: "Agriculture",
      icon: Tractor,
      color: "from-neutral-400 to-neutral-600",
      desc: "Calculate vegetation index metrics (NDVI) to inspect nitrogen status, find irrigation leaks, and count plant stand yields.",
      stats: "5% yield boost from early threat detection",
    },
    {
      name: "Mining & Quarries",
      icon: Factory,
      color: "from-neutral-500 to-neutral-700",
      desc: "Reconstruct pit topography. Track volumetric changes in massive raw material stockpiles automatically in minutes.",
      stats: "95% faster stockpile inventory reporting",
    },
  ];

  return (
    <section className="py-24 bg-brand-dark relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Area */}
        <div className="max-w-3xl text-left space-y-4 mb-16">
          <span className="text-xs font-bold text-brand-cyan uppercase tracking-widest">Tailored Solutions</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for the Industries that Shape the World
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Every industry has specific data requirements. DroneDeploy adapts to your team's workflow, delivering domain-specific analytical engines.
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
