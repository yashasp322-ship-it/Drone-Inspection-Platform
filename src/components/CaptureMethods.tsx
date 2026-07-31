import { useState } from "react";
import { Plane, ArrowRight, Zap, Target, Smartphone } from "lucide-react";

type MethodType = "aerial" | "ground" | "robot";

export default function CaptureMethods() {
  const [activeMethod, setActiveMethod] = useState<MethodType>("aerial");

  const methods = {
    aerial: {
      title: "Aerial Drone Inspections",
      tagline: "Autonomous surveying with precise RTK accuracy.",
      desc: "Deploy commercial drones to create high-resolution orthomosaics, 3D point clouds, and elevation contours. Perfect for bulk earthworks, roof inspections, and multi-acre crop assessments.",
      icon: Plane,
      features: [
        "Autonomous pathing with offline maps support",
        "Sub-centimeter accuracy using RTK/PPK workflows",
        "Thermal inspection and solar array analytics",
      ],
      img: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
    },
    ground: {
      title: "Ground Walkthroughs",
      tagline: "Capture interior and exterior site progress on foot.",
      desc: "Walk your site with a 360-degree camera or a smartphone to capture high-density panoramic paths. Automatically sync with floorplans to align indoor conditions with project timelines.",
      icon: Smartphone,
      features: [
        "Standard iOS/Android app support",
        "Automated localization onto CAD/BIM floor plans",
        "Side-by-side split comparison of weekly progress",
      ],
      img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    },
    robot: {
      title: "Autonomous Robotics",
      tagline: "Unattended, scheduled reality capture systems.",
      desc: "Integrate with automated ground rovers (like Boston Dynamics Spot) or drone docks to schedule regular, unmanned inspections. Perfect for hazardous sites, mining pits, or secure infrastructure.",
      icon: Target,
      features: [
        "Scheduled, hands-free inspection routines",
        "Hazardous area scanning without human risk",
        "Cloud sync from docked charge stations",
      ],
      img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    },
  };

  const active = methods[activeMethod];
  const IconComponent = active.icon;

  return (
    <section className="py-24 bg-brand-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Panel: Content (Col Span 6) */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                One Platform. Any View.
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Connect your aerial mappings, indoor ground walks, and automated robotic telemetry inside a unified repository.
              </p>
            </div>

            {/* Tab Selectors */}
            <div className="flex border-b border-white/10 pb-2 space-x-6">
              {(Object.keys(methods) as MethodType[]).map((key) => {
                const TabIcon = methods[key].icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveMethod(key)}
                    className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-semibold text-sm transition-all ${
                      activeMethod === key
                        ? "border-white text-white"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span className="capitalize">{key}</span>
                  </button>
                );
              })}
            </div>

            {/* Animated Content Detail */}
            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div>
                <h3 className="text-2xl font-bold text-white">{active.title}</h3>
                <p className="text-gray-400 text-sm font-medium mt-1">{active.tagline}</p>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">{active.desc}</p>
              
              <ul className="grid gap-3">
                {active.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center space-x-3 text-sm text-gray-300">
                    <Zap className="w-4 h-4 text-white flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <a
                  href="#"
                  className="inline-flex items-center space-x-2 text-white font-bold hover:text-gray-300 group text-sm"
                >
                  <span>Learn more about {activeMethod} workflows</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Panel: Image / Mockup (Col Span 6) */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl filter blur-xl pointer-events-none" />
            <div className="relative border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-brand-navy/50 aspect-video">
              <img
                src={active.img}
                alt={active.title}
                className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700 grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
              
              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-brand-dark/90 border border-white/10 p-3 rounded-lg flex items-center space-x-3 backdrop-blur-md">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">COMPATIBLE HARDWARE</div>
                  <div className="text-xs font-semibold text-white">DJI, Skydio, Spot, Insta360</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
