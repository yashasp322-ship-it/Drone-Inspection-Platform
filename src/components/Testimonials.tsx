import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote: "This platform has completely transformed how we handle solar site inspections. We ran a 400-panel array through the pipeline in an afternoon and caught three critical hot spots before they became failures.",
      author: "Sarah Jenkins",
      role: "VP of Quality, Renewables Corp",
      logo: "SolarGrid",
      metric: "99.8% Detection Confidence",
    },
    {
      quote: "Before this, our bridge inspection reports took weeks of manual review and write-ups. Now the pipeline flags every crack and generates the Markdown report before the drone even lands.",
      author: "Marcus Vance",
      role: "Senior Project Manager, BuildCore Infrastructure",
      logo: "BuildCore",
      metric: "14x Faster Report Turnaround",
    },
    {
      quote: "The severity assessment agent caught a hairline crack on a turbine blade root that our field team had missed on two prior walkdowns. That one catch avoided a full blade replacement.",
      author: "Elena Rostova",
      role: "Reliability Director, MetroBuild Energy",
      logo: "MetroBuild",
      metric: "$120k+ Cost Avoided",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-brand-navy/10 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Top Trust Icons */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
            Trusted by Industry Leaders
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale transition-all duration-300">
            <span className="text-lg font-black text-white">BUILDCORE</span>
            <span className="text-lg font-black text-white">SOLAR_GRID</span>
            <span className="text-lg font-black text-white">METRO_BUILD</span>
            <span className="text-lg font-black text-white">APEX_MINING</span>
          </div>
        </div>

        {/* Carousel Slider */}
        <div className="bg-brand-dark/80 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative">
          <Quote className="absolute top-8 left-8 w-12 h-12 text-white/10 pointer-events-none" />
          
          <div className="min-h-[220px] flex flex-col justify-between space-y-8">
            <p className="text-xl md:text-2xl text-gray-100 font-medium leading-relaxed italic text-left">
              "{testimonials[activeIndex].quote}"
            </p>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-white/15">
              <div className="text-left">
                <div className="text-white font-bold text-base">{testimonials[activeIndex].author}</div>
                <div className="text-xs text-gray-400 mt-0.5">{testimonials[activeIndex].role}</div>
              </div>

              <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-white text-sm font-extrabold flex items-center space-x-2">
                <Star className="w-4 h-4 fill-white" />
                <span>{testimonials[activeIndex].metric}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute right-8 bottom-12 flex space-x-2">
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
