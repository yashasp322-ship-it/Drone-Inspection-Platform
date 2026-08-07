import React, { useState, useRef } from "react";
import { MoveHorizontal, ScanSearch } from "lucide-react";

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
    <section className="py-24 bg-brand-dark/50 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-white text-xs font-semibold uppercase tracking-wider">
              <ScanSearch className="w-3.5 h-3.5" />
              <span>Raw Footage vs. AI Detection</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              See What the AI Sees
            </h2>

            <p className="text-gray-300 text-base leading-relaxed">
              Slide the comparison bar to reveal what the defect detection agent found in the same frame — cracks, corrosion, and structural anomalies annotated directly on the drone image, each backed by a confidence score.
            </p>

            <div className="bg-brand-navy/60 border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Detection Pipeline</span>
                <span className="text-white font-semibold">Image Analysis → Defect Detection</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Output Format</span>
                <span className="text-white font-semibold">Bounding markers + Markdown report</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Slider Box */}
          <div className="lg:col-span-7">
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10 select-none cursor-ew-resize bg-brand-navy"
            >
              {/* Underneath/As-Built Image (Real construction) */}
              <div
                className="absolute inset-0 bg-cover bg-center grayscale"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=80")',
                }}
              />
              <div className="absolute top-4 left-4 bg-brand-dark/80 px-3 py-1 rounded text-xs font-bold text-white border border-white/10 z-20">
                Raw Drone Frame
              </div>

              {/* Overlapping Slide-out AI Annotation Mockup */}
              <div
                className="absolute inset-y-0 left-0 right-0 overflow-hidden transition-all duration-75"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                {/* Visual rendering of AI defect overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center brightness-110 contrast-125 grayscale"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=80")',
                    filter: "grayscale(100%) invert(0.85) brightness(1.2)",
                  }}
                />

                {/* Defect detection grid overlay */}
                <div className="absolute inset-0 bg-white/5 pointer-events-none border border-white/10 grid grid-cols-8 grid-rows-8 opacity-40" />

                <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded text-xs font-bold z-20">
                  AI Defect Overlay
                </div>
              </div>

              {/* Center Slider Bar handle */}
              <div
                className="absolute inset-y-0 w-0.5 bg-white z-30 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white hover:bg-neutral-200 text-black rounded-full shadow-2xl flex items-center justify-center cursor-ew-resize border border-white transition-colors">
                  <MoveHorizontal className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              Drag your finger or hover cursor across the map window to slider-compare.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
