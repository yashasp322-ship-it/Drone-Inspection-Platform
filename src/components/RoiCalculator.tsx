import { useState } from "react";
import { Calculator, ArrowRight, Clock, ShieldCheck } from "lucide-react";

type IndustryType = "construction" | "energy" | "agriculture";

export default function RoiCalculator() {
  const [industry, setIndustry] = useState<IndustryType>("construction");
  const [projectCount, setProjectCount] = useState<number>(3);
  const [siteSize, setSiteSize] = useState<number>(50); // acres or sites

  // Calculations config
  const industryStats = {
    construction: {
      label: "Construction Projects",
      sizeLabel: "Average Project Area (Acres)",
      hoursMultiplier: 12,
      costMultiplier: 850,
      accuracyImprovement: "98.5%",
    },
    energy: {
      label: "Solar / Turbine Sites",
      sizeLabel: "Number of MW Capacities",
      hoursMultiplier: 24,
      costMultiplier: 1200,
      accuracyImprovement: "99.2%",
    },
    agriculture: {
      label: "Farming Fields",
      sizeLabel: "Cultivated Land Size (Acres)",
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
    <section className="py-24 bg-brand-navy/20 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left panel: Info */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-white text-xs font-semibold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              <span>ROI Estimator Tool</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Calculate Your Efficiency Returns
            </h2>

            <p className="text-gray-300 text-base leading-relaxed">
              Drones and reality capture do not just collect nice images — they generate direct bottom-line benefits. Use our calculator to approximate the hours and operational overhead you can eliminate.
            </p>

            {/* Feature lists */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-white/10 rounded-lg text-white mt-1">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Reduce Inspection Overhead</h4>
                  <p className="text-xs text-gray-400">Scan 100+ acres in under 20 minutes instead of days on foot.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-white/10 rounded-lg text-white mt-1">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Minimize Insurance Risks</h4>
                  <p className="text-xs text-gray-400">Map hazardous rooftops and steep cliff faces autonomously.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Live Calculator Widget */}
          <div className="lg:col-span-7 bg-brand-dark/95 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            <div className="absolute top-0 right-12 transform -translate-y-1/2 bg-white text-black font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Live Estimator
            </div>

            <div className="space-y-6">
              {/* Industry Toggles */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Select Industry Area
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(industryStats) as IndustryType[]).map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className={`py-3 px-2 rounded-lg border text-xs font-bold transition-all ${
                        industry === ind
                          ? "bg-white/20 border-white text-white"
                          : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {industryStats[ind].label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 1: Project count */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  <span>Active Project Sites</span>
                  <span className="text-white font-mono">{projectCount} sites</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={projectCount}
                  onChange={(e) => setProjectCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-brand-navy rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>

              {/* Slider 2: Size */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  <span>{currentConfig.sizeLabel}</span>
                  <span className="text-white font-mono">{siteSize} units</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="300"
                  value={siteSize}
                  onChange={(e) => setSiteSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-brand-navy rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>

              <hr className="border-white/10" />

              {/* Metrics Output */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="bg-brand-navy/60 border border-white/5 rounded-xl p-4 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Hours Saved / Mo</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block font-mono">
                    {totalHoursSaved}h
                  </span>
                </div>
                
                <div className="bg-brand-navy/60 border border-white/5 rounded-xl p-4 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Est. Savings / Yr</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block font-mono">
                    ${totalMoneySaved.toLocaleString()}
                  </span>
                </div>

                <div className="bg-brand-navy/60 border border-white/5 rounded-xl p-4 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">QA Accuracy</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block font-mono">
                    {currentConfig.accuracyImprovement}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="#"
                  className="w-full py-4 bg-white hover:bg-gray-200 text-black font-extrabold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-white/5 text-sm"
                >
                  <span>Request Full Enterprise Assessment Report</span>
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
