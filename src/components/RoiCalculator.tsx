import { useState } from "react";
import { Calculator, ArrowRight, Clock, ShieldCheck } from "lucide-react";

type IndustryType = "bridges" | "energy" | "roads";

export default function RoiCalculator() {
  const [industry, setIndustry] = useState<IndustryType>("bridges");
  const [projectCount, setProjectCount] = useState<number>(3);
  const [siteSize, setSiteSize] = useState<number>(50); // assets or segments

  // Calculations config
  const industryStats = {
    bridges: {
      label: "Bridge Structures",
      sizeLabel: "Number of Spans per Bridge",
      hoursMultiplier: 12,
      costMultiplier: 850,
      accuracyImprovement: "98.5%",
    },
    energy: {
      label: "Solar / Turbine Sites",
      sizeLabel: "Panels / Blades per Site",
      hoursMultiplier: 24,
      costMultiplier: 1200,
      accuracyImprovement: "99.2%",
    },
    roads: {
      label: "Road Segments",
      sizeLabel: "Segment Length (Miles)",
      hoursMultiplier: 4,
      costMultiplier: 320,
      accuracyImprovement: "96.8%",
    },
  };

  const currentConfig = industryStats[industry];

  // Logic: Hours Saved = Count * Size * multiplier
  const totalHoursSaved = Math.round(projectCount * siteSize * currentConfig.hoursMultiplier * 0.15);
  // Cost Saved = Hours Saved * costMultiplier
  const totalMoneySaved = Math.round(totalHoursSaved * currentConfig.costMultiplier * 0.45);

  return (
    <section className="py-24 bg-brand-navy/20 border-y border-[#8B5CF6]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">

          {/* Left panel: Info */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-brand-cyan text-xs font-semibold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              <span>ROI Estimator Tool</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-slate">
              Calculate Your Efficiency Returns
            </h2>

            <p className="text-[#5B4E77] text-base leading-relaxed">
              A five-agent AI pipeline does not just flag defects — it replaces days of manual inspection paperwork. Use our calculator to approximate the hours and overhead you can eliminate.
            </p>

            {/* Feature lists */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-[#8B5CF6]/10 rounded-lg text-brand-cyan mt-1">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-brand-slate font-semibold text-sm">Reduce Inspection Overhead</h4>
                  <p className="text-xs text-[#6B5D89]">Get a defect report in minutes instead of days of manual review.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1 bg-[#8B5CF6]/10 rounded-lg text-brand-cyan mt-1">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-brand-slate font-semibold text-sm">Catch Defects Earlier</h4>
                  <p className="text-xs text-[#6B5D89]">Consistent, severity-ranked findings instead of ad hoc site notes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Live Calculator Widget */}
          <div className="lg:col-span-7 glass-light rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            <div className="absolute top-0 right-12 transform -translate-y-1/2 bg-brand-cyan text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Live Estimator
            </div>

            <div className="space-y-6">
              {/* Industry Toggles */}
              <div>
                <label className="block text-xs font-bold text-[#6B5D89] uppercase tracking-widest mb-3">
                  Select Industry Area
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(industryStats) as IndustryType[]).map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className={`py-3 px-2 rounded-lg border text-xs font-bold transition-all ${
                        industry === ind
                          ? "bg-brand-cyan/20 border-brand-cyan text-brand-cyan"
                          : "bg-white/40 border-[#8B5CF6]/10 text-[#6B5D89] hover:bg-white/70 hover:text-brand-slate"
                      }`}
                    >
                      {industryStats[ind].label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 1: Project count */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#6B5D89] uppercase tracking-widest mb-2">
                  <span>Active Assets</span>
                  <span className="text-brand-slate font-mono">{projectCount} assets</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={projectCount}
                  onChange={(e) => setProjectCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-brand-blue rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                />
              </div>

              {/* Slider 2: Size */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#6B5D89] uppercase tracking-widest mb-2">
                  <span>{currentConfig.sizeLabel}</span>
                  <span className="text-brand-slate font-mono">{siteSize} units</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="300"
                  value={siteSize}
                  onChange={(e) => setSiteSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-brand-blue rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                />
              </div>

              <hr className="border-[#8B5CF6]/15" />

              {/* Metrics Output */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="bg-white/50 border border-[#8B5CF6]/10 rounded-xl p-4 text-center">
                  <span className="text-[10px] font-bold text-[#6B5D89] uppercase tracking-wider block">Hours Saved / Mo</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-brand-slate mt-1 block font-mono">
                    {totalHoursSaved}h
                  </span>
                </div>

                <div className="bg-white/50 border border-[#8B5CF6]/10 rounded-xl p-4 text-center">
                  <span className="text-[10px] font-bold text-[#6B5D89] uppercase tracking-wider block">Est. Savings / Yr</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-brand-slate mt-1 block font-mono">
                    ${totalMoneySaved.toLocaleString()}
                  </span>
                </div>

                <div className="bg-white/50 border border-[#8B5CF6]/10 rounded-xl p-4 text-center">
                  <span className="text-[10px] font-bold text-[#6B5D89] uppercase tracking-wider block">QA Accuracy</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-brand-slate mt-1 block font-mono">
                    {currentConfig.accuracyImprovement}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="#"
                  className="w-full py-4 bg-brand-cyan hover:bg-[#3B0F78] text-white font-extrabold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-brand-cyan/20 text-sm"
                >
                  <span>Request a Full Inspection Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
