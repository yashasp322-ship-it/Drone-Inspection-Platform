import { Folder, Plane, ClipboardCheck, AlertTriangle, Play, MapPin } from "lucide-react";

interface DashboardHomeProps {
  onViewAllProjects: () => void;
  onViewAllFlights: () => void;
}

export default function DashboardHome({ onViewAllProjects, onViewAllFlights }: DashboardHomeProps) {
  const metrics = [
    { label: "Projects", value: "24", trend: "+12%", color: "text-emerald-400", icon: Folder },
    { label: "Assets", value: "36", trend: "+8%", color: "text-emerald-400", icon: Folder },
    { label: "Flights", value: "58", trend: "+15%", color: "text-emerald-400", icon: Plane },
    { label: "Inspections", value: "142", trend: "+20%", color: "text-emerald-400", icon: ClipboardCheck },
    { label: "Issues Detected", value: "27", trend: "-5%", color: "text-red-400", icon: AlertTriangle }
  ];

  const recentProjects = [
    { title: "Bridge Inspection - Mumbai", time: "Updated 2 hrs ago", status: "Active", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=150&q=80" },
    { title: "Solar Farm Survey - Rajasthan", time: "Updated 1 day ago", status: "Active", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=150&q=80" },
    { title: "Wind Turbine Inspection - Gujarat", time: "Updated 2 days ago", status: "Active", img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=150&q=80" },
    { title: "Industrial Plant - Delhi", time: "Updated 3 days ago", status: "Draft", img: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=150&q=80" }
  ];

  const recentFlights = [
    { id: "Flight #58", time: "May 26, 2024 - 10:30 AM", status: "Completed", color: "text-emerald-400 bg-emerald-500/10" },
    { id: "Flight #57", time: "May 25, 2024 - 02:15 PM", status: "Completed", color: "text-emerald-400 bg-emerald-500/10" },
    { id: "Flight #56", time: "May 24, 2024 - 11:00 AM", status: "Completed", color: "text-emerald-400 bg-emerald-500/10" },
    { id: "Flight #55", time: "May 23, 2024 - 09:45 AM", status: "Processing", color: "text-blue-400 bg-blue-500/10" }
  ];

  const issueTypes = [
    { name: "Crack", count: 12, max: 12 },
    { name: "Corrosion", count: 8, max: 12 },
    { name: "Spalling", count: 5, max: 12 },
    { name: "Leakage", count: 2, max: 12 }
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Subtitle Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <p className="text-xs text-gray-500 mt-1">Welcome back, John!</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-neutral-950 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{m.label}</span>
                <div className="p-1.5 bg-white/5 rounded-lg text-white border border-white/10">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-white font-mono">{m.value}</span>
                <span className={`text-xs font-bold ${m.color}`}>{m.trend}</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block">vs last month</span>
            </div>
          );
        })}
      </div>

      {/* Middle Row */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Recent Projects Card */}
        <div className="lg:col-span-4 bg-neutral-950 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Projects</h3>
            <button onClick={onViewAllProjects} className="text-xs text-gray-400 hover:text-white transition-colors">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentProjects.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3 min-w-0">
                  <img src={p.img} alt="" className="w-10 h-10 rounded-lg object-cover grayscale" />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{p.time}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  p.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/10 text-gray-400"
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Overview Card */}
        <div 
          onClick={onViewAllFlights}
          className="lg:col-span-4 bg-neutral-950 border border-white/10 rounded-2xl p-5 flex flex-col justify-between cursor-pointer hover:border-white/30 transition-all group"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Map Overview</h3>
            <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors">Track Live Mission →</span>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
            {/* Mock satellite image */}
            <div
              className="absolute inset-0 bg-cover bg-center grayscale filter contrast-125"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80")' }}
            />
            {/* Markers */}
            <div className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10">
              <span className="absolute w-5 h-5 rounded-full bg-white/40 animate-ping" />
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="absolute top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10">
              <span className="absolute w-5 h-5 rounded-full bg-white/40 animate-ping" />
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="absolute top-[35%] left-[70%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10">
              <span className="absolute w-5 h-5 rounded-full bg-white/40 animate-ping" />
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Recent Flights Card */}
        <div className="lg:col-span-4 bg-neutral-950 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Flights</h3>
            <button onClick={onViewAllFlights} className="text-xs text-gray-400 hover:text-white transition-colors">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentFlights.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{f.id}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{f.time}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${f.color}`}>
                  {f.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Donut Chart (Inspection Summary) */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Inspection Summary</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* SVG Donut */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#222" strokeWidth="3" />
                {/* 55% No issues (White) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="55 45" strokeDashoffset="100" />
                {/* 30% Minor issues (Gray 400) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#999" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="45" />
                {/* 13% Major issues (Gray 600) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#555" strokeWidth="3" strokeDasharray="13 87" strokeDashoffset="15" />
                {/* 2% Critical issues (Red 500) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="2 98" strokeDashoffset="2" />
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-extrabold text-white">142</span>
                <span className="text-[8px] text-gray-500 block">Total</span>
              </div>
            </div>
            {/* Legend */}
            <div className="text-xs space-y-2 flex-grow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                  <span className="text-gray-400">No Issues</span>
                </div>
                <span className="font-bold text-white font-mono">78 (55%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
                  <span className="text-gray-400">Minor Issues</span>
                </div>
                <span className="font-bold text-white font-mono">42 (30%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                  <span className="text-gray-400">Major Issues</span>
                </div>
                <span className="font-bold text-white font-mono">18 (13%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-red-400">Critical Issues</span>
                </div>
                <span className="font-bold text-white font-mono">4 (2%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart (Issues by Type) */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Issues by Type</h3>
          <div className="space-y-4">
            {issueTypes.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{item.name}</span>
                  <span className="text-white font-bold font-mono">{item.count}</span>
                </div>
                <div className="h-2 w-full bg-neutral-900 border border-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${(item.count / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart (AI Confidence) */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">AI Model Confidence (Avg.)</h3>
          <div className="relative h-28 w-full mt-4">
            {/* SVG Line Graph */}
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Fill Area */}
              <path
                d="M0,35 Q15,33 30,28 T60,20 T80,18 T100,12 L100,40 L0,40 Z"
                fill="url(#chartGradient)"
              />
              {/* Stroke Line */}
              <path
                d="M0,35 Q15,33 30,28 T60,20 T80,18 T100,12"
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <span className="text-[8px] text-gray-500 font-mono">100%</span>
              <span className="text-[8px] text-gray-500 font-mono">50%</span>
              <span className="text-[8px] text-gray-500 font-mono">0%</span>
            </div>
          </div>
          <div className="flex justify-between text-[8px] text-gray-500 mt-2 font-mono">
            <span>May 20</span>
            <span>May 22</span>
            <span>May 24</span>
            <span>May 26</span>
          </div>
        </div>
      </div>
    </div>
  );
}
