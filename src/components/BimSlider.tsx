import React, { useState, useRef } from "react";
import { MoveHorizontal, ScanSearch, ShieldAlert, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import sliderImage from "../assets/slider_infrastructure.png";

export default function BimSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#120D20] via-[#1B1432] to-[#140F23] text-[#E2DEFA] border-t border-[#8B5CF6]/15 relative overflow-hidden">
      {/* Background Soft Periwinkle Ambient Glow */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#C4BDF3]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">

          {/* Left Text (Concise & Punchy Description) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 text-left space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#C4BDF3]/15 border border-[#C4BDF3]/25 text-[#C4BDF3] text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <ScanSearch className="w-3.5 h-3.5" />
              <span>Raw Footage vs. AI Detection</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              See What the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4BDF3] via-[#E2DEFA] to-[#9A8DE6]">AI Sees</span>
            </h2>

            {/* Reduced, Punchy Description */}
            <p className="text-[#D4CEF6] text-sm sm:text-base leading-relaxed">
              Drag the slider to reveal live YOLO defect detection — structural cracks, blade erosion, and corrosion flagged with 90%+ confidence.
            </p>

            <div className="bg-[radial-gradient(circle_at_100%_100%,#B8AFEE_0%,#C5BEF0_45%,#FAF8FF_100%)] border border-[#8B5CF6]/35 rounded-xl p-4 space-y-2.5 shadow-md backdrop-blur-xl text-[#1A1032]">
              <div className="flex justify-between text-xs">
                <span className="text-[#6D28D9] font-extrabold">AI Model</span>
                <span className="text-[#1E1235] font-bold">YOLOv8 Structural Vision</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6D28D9] font-extrabold">Annotation Output</span>
                <span className="text-[#1E1235] font-bold">Bounding Markers + Report</span>
              </div>
            </div>
          </motion.div>

          {/* Right Interactive Slider Box with Real AI Infrastructure & Defect Markers */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-[#C4BDF3]/25 select-none cursor-ew-resize bg-[#140F23]"
            >
              {/* Raw Infrastructure Image (Underneath) */}
              <div className="absolute inset-0 bg-black">
                <img
                  src={sliderImage}
                  alt="Raw Infrastructure Frame"
                  className="w-full h-full object-cover brightness-90 contrast-105"
                />
                <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded text-xs font-mono font-bold text-white border border-white/20 z-20">
                  RAW DRONE FRAME
                </div>
              </div>

              {/* Overlapping AI Detection Layer */}
              <div
                className="absolute inset-y-0 left-0 right-0 overflow-hidden transition-all duration-75"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                {/* AI Image Layer */}
                <div className="absolute inset-0 bg-black">
                  <img
                    src={sliderImage}
                    alt="AI Detection Overlay"
                    className="w-full h-full object-cover brightness-105 contrast-125"
                  />
                  {/* Grid Overlay */}
                  <div className="absolute inset-0 bg-[#8B5CF6]/15 pointer-events-none border border-[#8B5CF6]/20 grid grid-cols-8 grid-rows-8 opacity-30" />

                  {/* DEFECT MARK 1: Blade Crack Bounding Box */}
                  <div className="absolute top-[28%] left-[44%] w-[32%] h-[26%] border-2 border-red-500 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.6)] bg-red-500/10 p-1.5 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <span className="px-1.5 py-0.5 bg-red-600 text-white font-mono text-[10px] font-black rounded uppercase flex items-center space-x-1">
                        <ShieldAlert className="w-2.5 h-2.5" />
                        <span>MICRO-CRACK</span>
                      </span>
                      <span className="px-1.5 py-0.5 bg-black/80 text-[#C4BDF3] font-mono text-[9px] font-bold rounded">
                        93%
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-red-200 bg-black/70 px-1 py-0.5 rounded self-end">
                      BLADE #2
                    </span>
                  </div>

                  {/* DEFECT MARK 2: Nacelle Erosion Mark */}
                  <div className="absolute top-[52%] left-[22%] w-[24%] h-[22%] border-2 border-amber-400 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.5)] bg-amber-500/10 p-1.5 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <span className="px-1.5 py-0.5 bg-amber-500 text-black font-mono text-[9px] font-black rounded uppercase">
                        EROSION
                      </span>
                      <span className="px-1.5 py-0.5 bg-black/80 text-amber-300 font-mono text-[9px] font-bold rounded">
                        89%
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white px-3 py-1 rounded text-xs font-mono font-bold z-20 shadow-md flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>AI DEFECT OVERLAY</span>
                  </div>
                </div>
              </div>

              {/* Center Handle */}
              <div
                className="absolute inset-y-0 w-0.5 bg-[#C4BDF3] z-30 pointer-events-none shadow-[0_0_15px_#C4BDF3]"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full shadow-2xl flex items-center justify-center cursor-ew-resize border border-white transition-colors">
                  <MoveHorizontal className="w-5 h-5" />
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-[#C4BDF3]/70 mt-3">
              Drag slider handle left or right to compare raw frame vs. AI defect markers.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
