import { useState } from "react";
import { Layers, MapPin, Eye, Info } from "lucide-react";

type LayerType = "ortho" | "defects" | "thermal" | "severity";

interface InteractiveViewerProps {
  inspectedAsset?: {
    name: string;
    location: string;
    gDriveLink?: string;
  };
}

export default function InteractiveViewer({ inspectedAsset }: InteractiveViewerProps) {
  const [activeLayer, setActiveLayer] = useState<LayerType>("ortho");
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

  const annotations = [
    { id: 1, label: "North Pillar Crack", x: "32%", y: "42%", size: "1.8mm width, 28cm length", severity: "Moderate", type: "defect" },
    { id: 2, label: "Corroded Bracket", x: "65%", y: "55%", size: "Surface rust, 15cm span", severity: "High", type: "defect" },
    { id: 3, label: "Panel Cluster B", x: "48%", y: "78%", status: "No Defects Found", type: "status" },
  ];

  // Colors/styles based on active layer
  const layerConfigs = {
    ortho: {
      title: "Raw Drone Imagery",
      desc: "The unprocessed frame as captured, exactly as it's handed to the AI pipeline's image analysis agent.",
      overlayStyle: "opacity-0",
      blendMode: "mix-blend-normal",
    },
    defects: {
      title: "Defect Detection Overlay",
      desc: "Output of the Defect Detection Agent — cracks, corrosion, and structural anomalies flagged with bounding markers.",
      overlayStyle: "opacity-90 bg-gradient-to-tr from-brand-cyan via-[#8B5CF6] to-white mix-blend-overlay",
      blendMode: "mix-blend-overlay",
    },
    thermal: {
      title: "Thermal Mapping",
      desc: "Infrared heat signature mapping. Useful for spotting hot spots on solar panels or turbine gearboxes.",
      overlayStyle: "opacity-80 bg-gradient-to-r from-brand-cyan via-[#6D28D9] to-white mix-blend-luminosity",
      blendMode: "mix-blend-luminosity",
    },
    severity: {
      title: "Severity Assessment",
      desc: "Output of the Severity Assessment Agent — each detected defect scored and ranked by risk before recommendations are generated.",
      overlayStyle: "opacity-60 bg-[radial-gradient(#4C1D95_1px,transparent_1px)] [background-size:16px_16px] mix-blend-screen",
      blendMode: "mix-blend-screen",
    },
  };

  return (
    <section id="demo-viewer" className="py-20 bg-brand-navy/30 border-y border-[#8B5CF6]/10 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Content */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-slate">
            Watch the AI Pipeline Work
          </h2>
          <p className="text-[#5B4E77] text-lg">
            Step through what each agent sees — raw imagery, detected defects, thermal signatures, and the severity scores behind every recommendation.
          </p>
        </div>

        {/* Outer Dashboard Window Container */}
        <div className="grid lg:grid-cols-12 gap-8 bg-brand-sky/80 border border-[#8B5CF6]/15 rounded-2xl overflow-hidden shadow-2xl">

          {/* Left Controls / Sidebar (Col span 3) */}
          <div className="lg:col-span-3 border-r border-[#8B5CF6]/15 p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-brand-slate font-bold text-lg mb-6 pb-4 border-b border-[#8B5CF6]/15">
                <Layers className="w-5 h-5 text-brand-cyan" />
                <span>Layers & Map Modes</span>
              </div>

              {/* Layer Buttons */}
              <div className="space-y-3">
                {(Object.keys(layerConfigs) as LayerType[]).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveLayer(layer)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 flex items-center justify-between ${
                      activeLayer === layer
                        ? "bg-brand-cyan/20 border-brand-cyan text-brand-slate font-semibold"
                        : "bg-white/40 border-[#8B5CF6]/10 text-[#6B5D89] hover:bg-white/70 hover:text-brand-slate"
                    }`}
                  >
                    <span className="capitalize">{layer === "defects" ? "Defect Detection" : layer === "severity" ? "Severity Assessment" : layer}</span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        activeLayer === layer ? "bg-brand-cyan animate-pulse" : "bg-[#C4B5FD]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Explainer Box */}
            <div className="bg-brand-blue/40 border border-[#8B5CF6]/10 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-brand-cyan mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-brand-slate uppercase tracking-wider">
                    {layerConfigs[activeLayer].title}
                  </div>
                  <p className="text-xs text-[#6B5D89] leading-relaxed">
                    {layerConfigs[activeLayer].desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Screen Display (Col span 9) */}
          <div className="lg:col-span-9 relative bg-brand-sky min-h-[500px] flex flex-col justify-between">
            {/* Top Workspace Header */}
            <div className="bg-brand-sky/95 border-b border-[#8B5CF6]/15 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-brand-cyan" />
                <div>
                  <h4 className="text-sm font-bold text-brand-slate">
                    {inspectedAsset ? inspectedAsset.name : "Cedar Creek Bridge — Span 4"}
                  </h4>
                  <p className="text-[10px] text-[#7A6D97]">
                    {inspectedAsset
                      ? `Location: ${inspectedAsset.location} ${
                          inspectedAsset.gDriveLink ? `• Drive: ${inspectedAsset.gDriveLink}` : ""
                        }`
                      : "Inspected Aug 5, 2026 • 5-agent pipeline"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAnnotations(!showAnnotations)}
                  className={`flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    showAnnotations
                      ? "bg-brand-cyan text-white"
                      : "bg-white/40 border border-[#8B5CF6]/15 text-[#6B5D89] hover:text-brand-slate"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Annotations</span>
                </button>
              </div>
            </div>

            {/* The Visual Arena */}
            <div className="relative flex-grow overflow-hidden select-none">
              {/* Ground Image (Satellite/Drone Orthomosaic Mockup) */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300 grayscale"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80")',
                }}
              />

              {/* Dynamic Layer Filters */}
              <div className={`absolute inset-0 transition-all duration-500 pointer-events-none ${layerConfigs[activeLayer].overlayStyle}`} />
              
              {/* Severity scan grid lines */}
              {activeLayer === "severity" && (
                <div className="absolute inset-0 border border-brand-cyan/20 grid grid-cols-6 grid-rows-6 pointer-events-none animate-pulse">
                  {[...Array(36)].map((_, i) => (
                    <div key={i} className="border-t border-l border-brand-cyan/15 font-mono text-[8px] text-brand-cyan/40 p-1">
                      GRID_{i + 1}
                    </div>
                  ))}
                </div>
              )}

              {/* Pins & Markers */}
              {showAnnotations &&
                annotations.map((pin) => (
                  <div
                    key={pin.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group z-20"
                    style={{ left: pin.x, top: pin.y }}
                    onClick={() => setActiveAnnotation(pin.id === activeAnnotation ? null : pin.id)}
                  >
                    {/* Ring animation */}
                    <span className="absolute inline-flex h-6 w-6 rounded-full bg-brand-cyan/40 animate-ping opacity-75" />
                    
                    {/* Point Pin */}
                    <div className="relative w-4 h-4 bg-brand-cyan border border-white rounded-full shadow-lg group-hover:scale-125 transition-transform flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>

                    {/* Quick hover indicator label */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-brand-cyan/95 border border-[#8B5CF6]/30 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {pin.label}
                    </div>
                  </div>
                ))}
            </div>

            {/* Floating Stats / Measurement Details overlay */}
            {activeAnnotation && showAnnotations && (
              <div className="absolute bottom-6 left-6 right-6 glass-light rounded-xl p-5 shadow-2xl z-30 animate-in slide-in-from-bottom-4 duration-300">
                {annotations.filter((a) => a.id === activeAnnotation).map((ann) => (
                  <div key={ann.id} className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-cyan">
                        Detected Defect
                      </span>
                      <h5 className="text-brand-slate text-base font-extrabold mt-1">{ann.label}</h5>
                    </div>

                    <div className="flex items-center space-x-6">
                      {ann.size && (
                        <div>
                          <div className="text-[10px] text-[#6B5D89]">ESTIMATED SIZE</div>
                          <div className="text-brand-slate font-mono font-bold text-lg">{ann.size}</div>
                        </div>
                      )}
                      {ann.severity && (
                        <div>
                          <div className="text-[10px] text-[#6B5D89]">SEVERITY</div>
                          <div className="text-brand-slate font-mono font-bold text-lg">{ann.severity}</div>
                        </div>
                      )}
                      {ann.status && (
                        <div>
                          <div className="text-[10px] text-[#6B5D89]">STATUS</div>
                          <div className="text-emerald-400 font-bold text-lg">{ann.status}</div>
                        </div>
                      )}
                      <button
                        onClick={() => setActiveAnnotation(null)}
                        className="text-[#6B5D89] hover:text-brand-slate text-xs font-semibold px-3 py-1 bg-white/50 border border-[#8B5CF6]/15 rounded-lg"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
