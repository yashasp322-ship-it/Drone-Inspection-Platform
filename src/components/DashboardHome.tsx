import { useEffect, useMemo, useState } from "react";
import { Folder, ClipboardCheck, AlertTriangle, MapPin } from "lucide-react";
import MapOverviewModal from "./MapOverviewModal";

interface DashboardHomeProps {
  onViewAllProjects: () => void;
}

interface Asset {
  id: string;
  name: string;
  infrastructureType: string;
  location: string;
  thumbnail: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AgentState {
  status: string;
  confidence: number;
  output?: { defects_found?: { type: string }[] };
}

interface Inspection {
  id: string;
  assetId: string;
  assetName: string;
  date: string;
  severity: string;
  status: string;
  agentStates: Record<string, AgentState>;
}

export default function DashboardHome({ onViewAllProjects }: DashboardHomeProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5001/assets").then((r) => r.json()),
      fetch("http://localhost:5001/api/inspections").then((r) => r.json())
    ])
      .then(([assetsData, inspectionsData]) => {
        setAssets(assetsData);
        setInspections(inspectionsData);
      })
      .catch((err) => console.error("Error loading dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  const defectsPerInspection = useMemo(
    () => inspections.map((i) => i.agentStates?.defect_detection?.output?.defects_found || []),
    [inspections]
  );

  const totalIssuesDetected = useMemo(
    () => defectsPerInspection.reduce((sum, d) => sum + d.length, 0),
    [defectsPerInspection]
  );

  const metrics = [
    { label: "Assets", value: String(assets.length), color: "text-emerald-400", icon: Folder },
    { label: "Inspections", value: String(inspections.length), color: "text-emerald-400", icon: ClipboardCheck },
    { label: "Issues Detected", value: String(totalIssuesDetected), color: "text-red-400", icon: AlertTriangle }
  ];

  const MARKER_LAYOUT = [
    { top: "35%", left: "25%" },
    { top: "55%", left: "45%" },
    { top: "30%", left: "65%" },
    { top: "65%", left: "80%" },
    { top: "70%", left: "15%" }
  ];
  const mapMarkerPositions = MARKER_LAYOUT.slice(0, Math.max(1, Math.min(assets.length, MARKER_LAYOUT.length)));

  const recentAssets = useMemo(
    () =>
      [...assets]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 4),
    [assets]
  );

  // Bucket inspections by defect count into severity tiers for the donut chart
  const severityBuckets = useMemo(() => {
    const buckets = { none: 0, minor: 0, major: 0, critical: 0 };
    defectsPerInspection.forEach((defects) => {
      if (defects.length === 0) buckets.none++;
      else if (defects.length === 1) buckets.minor++;
      else if (defects.length <= 3) buckets.major++;
      else buckets.critical++;
    });
    return buckets;
  }, [defectsPerInspection]);

  const totalInspections = inspections.length;
  const pct = (n: number) => (totalInspections > 0 ? Math.round((n / totalInspections) * 100) : 0);

  const donutSegments = [
    { key: "none", label: "No Issues", count: severityBuckets.none, color: "#fff" },
    { key: "minor", label: "Minor Issues", count: severityBuckets.minor, color: "#999" },
    { key: "major", label: "Major Issues", count: severityBuckets.major, color: "#555" },
    { key: "critical", label: "Critical Issues", count: severityBuckets.critical, color: "#ef4444" }
  ];

  let cumulative = 0;
  const donutArcs = donutSegments.map((seg) => {
    const percent = totalInspections > 0 ? (seg.count / totalInspections) * 100 : 0;
    const arc = { ...seg, percent, offset: 100 - cumulative };
    cumulative += percent;
    return arc;
  });

  // Tally defect types across all inspections for the bar chart
  const issueTypes = useMemo(() => {
    const counts = new Map<string, number>();
    defectsPerInspection.flat().forEach((d) => {
      counts.set(d.type, (counts.get(d.type) || 0) + 1);
    });
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const max = sorted.length > 0 ? sorted[0][1] : 1;
    return sorted.map(([name, count]) => ({ name, count, max }));
  }, [defectsPerInspection]);

  // Average confidence per inspection, oldest to newest, for the line chart
  const confidenceSeries = useMemo(() => {
    const points = inspections
      .map((i) => {
        const states = Object.values(i.agentStates || {});
        const confidences = states.map((s) => s.confidence).filter((c) => typeof c === "number");
        const avg = confidences.length > 0 ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0;
        return { date: i.date, avg };
      })
      .reverse()
      .slice(-6);
    return points;
  }, [inspections]);

  const linePath = useMemo(() => {
    if (confidenceSeries.length === 0) return { line: "", area: "" };
    const stepX = confidenceSeries.length > 1 ? 100 / (confidenceSeries.length - 1) : 0;
    const coords = confidenceSeries.map((p, idx) => {
      const x = idx * stepX;
      const y = 40 - (p.avg / 100) * 38;
      return `${x},${y.toFixed(1)}`;
    });
    const line = `M${coords.join(" L")}`;
    const area = `${line} L100,40 L0,40 Z`;
    return { line, area };
  }, [confidenceSeries]);

  return (
    <div className="space-y-8 text-left">
      {/* Subtitle Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <p className="text-xs text-gray-500 mt-1">
          {loading ? "Loading live data..." : "Live overview of your infrastructure inspections."}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block">live count</span>
            </div>
          );
        })}
      </div>

      {/* Middle Row */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Recent Assets Card */}
        <div
          onClick={onViewAllProjects}
          className="lg:col-span-5 bg-neutral-950 border border-white/10 rounded-2xl p-5 flex flex-col cursor-pointer hover:border-white/30 transition-all group"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Assets</h3>
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">View all →</span>
          </div>
          <div className="space-y-3">
            {recentAssets.length === 0 ? (
              <p className="text-xs text-gray-500">No assets yet.</p>
            ) : (
              recentAssets.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img src={a.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover grayscale" />
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-white truncate">{a.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{a.infrastructureType} • {a.location}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    a.status === "Passed" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map Overview Card */}
        <div
          onClick={() => setIsMapOpen(true)}
          className="lg:col-span-7 bg-neutral-950 border border-white/10 rounded-2xl p-5 flex flex-col justify-between cursor-pointer hover:border-white/30 transition-all group"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Map Overview</h3>
            <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors">Open Map →</span>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
            <div
              className="absolute inset-0 bg-cover bg-center grayscale filter contrast-125"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80")' }}
            />
            <div className="absolute inset-0 bg-black/20" />
            {mapMarkerPositions.map((pos, idx) => (
              <div key={idx} className="absolute -translate-x-1/2 -translate-y-full z-10" style={{ top: pos.top, left: pos.left }}>
                <span className="absolute inset-0 -m-1.5 rounded-full bg-red-500/40 animate-ping" />
                <MapPin className="w-5 h-5 text-red-500 fill-red-500 drop-shadow" />
              </div>
            ))}
            <div className="absolute bottom-2 right-2 bg-black/60 text-[9px] text-gray-300 px-2 py-1 rounded-md">
              Click to open live map
            </div>
          </div>
        </div>
      </div>

      {isMapOpen && <MapOverviewModal onClose={() => setIsMapOpen(false)} />}

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
                {donutArcs.map((arc) => (
                  <circle
                    key={arc.key}
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke={arc.color}
                    strokeWidth="3"
                    strokeDasharray={`${arc.percent} ${100 - arc.percent}`}
                    strokeDashoffset={arc.offset}
                  />
                ))}
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-extrabold text-white">{totalInspections}</span>
                <span className="text-[8px] text-gray-500 block">Total</span>
              </div>
            </div>
            {/* Legend */}
            <div className="text-xs space-y-2 flex-grow">
              {donutSegments.map((seg) => (
                <div key={seg.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className={seg.key === "critical" ? "text-red-400" : "text-gray-400"}>{seg.label}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{seg.count} ({pct(seg.count)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart (Issues by Type) */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Issues by Type</h3>
          <div className="space-y-4">
            {issueTypes.length === 0 ? (
              <p className="text-xs text-gray-500">No defects recorded yet.</p>
            ) : (
              issueTypes.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 truncate pr-2">{item.name}</span>
                    <span className="text-white font-bold font-mono">{item.count}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-900 border border-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${(item.count / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Line Chart (AI Confidence) */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">AI Model Confidence (Avg.)</h3>
          <div className="relative h-28 w-full mt-4">
            {confidenceSeries.length === 0 ? (
              <p className="text-xs text-gray-500">No inspections yet.</p>
            ) : (
              <>
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={linePath.area} fill="url(#chartGradient)" />
                  <path d={linePath.line} fill="none" stroke="#fff" strokeWidth="1.5" />
                </svg>
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <span className="text-[8px] text-gray-500 font-mono">100%</span>
                  <span className="text-[8px] text-gray-500 font-mono">50%</span>
                  <span className="text-[8px] text-gray-500 font-mono">0%</span>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-between text-[8px] text-gray-500 mt-2 font-mono">
            {confidenceSeries.map((p, idx) => (
              <span key={idx}>{p.date}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
