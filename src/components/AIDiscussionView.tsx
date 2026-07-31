import { useEffect, useState } from "react";
import {
  Bot, ScanEye, Eye, Shield, Wrench, FileCheck, Users,
  CheckCircle2, AlertTriangle, Loader2, MessagesSquare,
  Sparkles, ChevronDown, ChevronUp
} from "lucide-react";

interface Inspection {
  id: string;
  assetId: string;
  assetName: string;
  date: string;
  severity: string;
  status: string;
  agentStates: Record<string, { status: string; reasoning: string; confidence: number; output: any }>;
  reportMarkdown: string;
  nextInspectionDate?: string;
}

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  None:             { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  Minor:            { color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/30" },
  "Action Required":{ color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/30" },
  High:             { color: "text-red-400",      bg: "bg-red-500/10",     border: "border-red-500/30" },
};

// Each of the 5 pipeline agents given a "persona" so the replay reads like a
// panel discussion instead of a bare JSON dump.
const PERSONAS = [
  {
    key: "image_analysis",
    name: "Vision Agent",
    role: "Image Quality & Sensor Analysis",
    icon: ScanEye,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    speak: (o: any) =>
      o?.suitability
        ? `Suitability looks ${String(o.suitability).toLowerCase()} — sensor reads as ${o.sensor_type || "unknown"}. ${o.image_quality_metrics || ""}`
        : "No visual findings to report.",
  },
  {
    key: "defect_detection",
    name: "Detection Agent",
    role: "Defect & Anomaly Scanning",
    icon: Eye,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    speak: (o: any) =>
      o?.total_count > 0
        ? `I found ${o.total_count} defect${o.total_count === 1 ? "" : "s"}: ${(o.defects_found || [])
            .map((d: any) => d.type)
            .join(", ")}.`
        : "I didn't find any visible defects in the imagery provided.",
  },
  {
    key: "severity_assessment",
    name: "Risk Agent",
    role: "Severity & Priority Grading",
    icon: Shield,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    speak: (o: any) =>
      o?.overall_severity
        ? `Based on those findings, I'm grading this as ${o.overall_severity} (risk score ${o.risk_score ?? "—"}/100, priority ${o.priority || "—"}).`
        : "Not enough data to assign a risk grade.",
  },
  {
    key: "recommendation",
    name: "Advisory Agent",
    role: "Corrective Actions & Scheduling",
    icon: Wrench,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    speak: (o: any) =>
      o?.recommended_actions?.length
        ? `Here's what I'd recommend: ${o.recommended_actions.join("; ")}. Next inspection due ${o.next_inspection_date || "—"}.`
        : "No specific corrective actions needed at this time.",
  },
  {
    key: "report",
    name: "Reporting Agent",
    role: "Final Report Compilation",
    icon: FileCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    speak: (o: any) => o?.executive_summary || "Report compiled from the panel's findings above.",
  },
];

export default function AIDiscussionView() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedRaw, setExpandedRaw] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5001/api/inspections");
        const data = await res.json();
        setInspections(data);
        if (data.length > 0) setSelectedId(data[0].id);
      } catch {
        /* ignore — empty state handles this */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selected = inspections.find((i) => i.id === selectedId) || null;

  const avgConfidence = (insp: Inspection) => {
    const vals = PERSONAS.map((p) => insp.agentStates?.[p.key]?.confidence).filter(
      (v): v is number => typeof v === "number" && v > 0
    );
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const defectCount = (insp: Inspection) => insp.agentStates?.defect_detection?.output?.total_count || 0;

  // Simple, deterministic "consensus" check computed from the already-saved
  // agent outputs — no extra AI call needed for the replay view.
  const consensusFlags = (insp: Inspection) => {
    const flags: string[] = [];
    const count = defectCount(insp);
    const severity = insp.agentStates?.severity_assessment?.output?.overall_severity;
    if (count > 0 && (severity === "None" || !severity)) {
      flags.push("Defects were found but severity wasn't escalated above None — worth a second look.");
    }
    if (count === 0 && (severity === "High" || severity === "Action Required")) {
      flags.push("Severity was escalated despite no defects being logged — possible inconsistency.");
    }
    const conf = avgConfidence(insp);
    if (conf > 0 && conf < 70) {
      flags.push(`Panel's average confidence was only ${conf}% — treat this run as low-certainty.`);
    }
    return flags;
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessagesSquare className="w-5 h-5 text-purple-400" />
          AI Discussion Panel
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Replay how the 5 inspection agents reasoned through a past run — see where they agreed, where they
          flagged concerns, and how the final call was reached.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-neutral-950 border border-white/10 rounded-2xl">
          <Loader2 className="w-5 h-5 text-gray-500 animate-spin mx-auto mb-2" />
          <span className="text-xs text-gray-500">Loading past inspections...</span>
        </div>
      ) : inspections.length === 0 ? (
        <div className="p-12 text-center bg-neutral-950 border border-white/10 rounded-2xl">
          <Bot className="w-8 h-8 text-gray-700 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No inspections to discuss yet</p>
          <p className="text-xs text-gray-600 mt-1">
            Run an AI inspection from Assets → 👁 View, then come back here to replay the panel's reasoning.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-5">
          {/* ── Inspection picker ── */}
          <div className="lg:col-span-4 bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-3 border-b border-white/5 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-bold text-white">Past Inspections</span>
            </div>
            <div className="max-h-[560px] overflow-y-auto divide-y divide-white/5">
              {inspections.map((insp) => {
                const sc = SEVERITY_CONFIG[insp.severity] || SEVERITY_CONFIG.None;
                const isSel = insp.id === selectedId;
                return (
                  <button
                    key={insp.id}
                    onClick={() => setSelectedId(insp.id)}
                    className={`w-full text-left p-3.5 transition-colors ${
                      isSel ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">{insp.assetName}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border flex-shrink-0 ${sc.bg} ${sc.color} ${sc.border}`}>
                        {insp.severity || "None"}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{insp.date} • {defectCount(insp)} defect(s)</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Discussion thread ── */}
          <div className="lg:col-span-8 space-y-4">
            {!selected ? (
              <div className="p-12 text-center bg-neutral-950 border border-white/10 rounded-2xl">
                <p className="text-xs text-gray-500">Select an inspection to replay the discussion.</p>
              </div>
            ) : (
              <>
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex-shrink-0">
                    <Bot className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="text-xs text-gray-300 leading-relaxed">
                    <span className="font-bold text-white">Supervisor:</span> Convening the panel to review{" "}
                    <span className="font-semibold">{selected.assetName}</span> (inspected {selected.date}). Five
                    agents will weigh in in sequence — Vision, Detection, Risk, Advisory, then Reporting.
                  </div>
                </div>

                {PERSONAS.map((persona) => {
                  const state = selected.agentStates?.[persona.key];
                  if (!state) return null;
                  const Icon = persona.icon;
                  const isExpanded = expandedRaw === persona.key;
                  return (
                    <div key={persona.key} className={`rounded-2xl border ${persona.border} ${persona.bg} p-4`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl bg-black/30 border ${persona.border} flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${persona.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-white">{persona.name}</span>
                            <span className="text-[9px] text-gray-500">{persona.role}</span>
                            {state.status === "Completed" && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            {state.status === "Failed" && <AlertTriangle className="w-3 h-3 text-red-400" />}
                            {state.confidence > 0 && (
                              <span className={`ml-auto text-[10px] font-mono font-bold ${persona.color}`}>
                                {state.confidence}%
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-200 leading-relaxed mt-1.5">
                            {persona.speak(state.output)}
                          </p>
                          <button
                            onClick={() => setExpandedRaw(isExpanded ? null : persona.key)}
                            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 mt-2"
                          >
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {isExpanded ? "Hide reasoning" : "Show full reasoning"}
                          </button>
                          {isExpanded && (
                            <div className="mt-2 bg-black/40 rounded-xl p-3 text-[10px] text-gray-400 leading-relaxed">
                              {state.reasoning}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* ── Panel consensus summary ── */}
                <div className="bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">Panel Consensus</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Final call: <span className="font-bold text-white">{selected.severity || "None"}</span> severity
                    across {defectCount(selected)} defect(s), average panel confidence{" "}
                    <span className="font-bold text-white">{avgConfidence(selected)}%</span>. Next inspection
                    recommended for <span className="font-mono text-white">{selected.nextInspectionDate || "N/A"}</span>.
                  </p>
                  {consensusFlags(selected).length > 0 ? (
                    <div className="mt-3 space-y-1.5">
                      {consensusFlags(selected).map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-yellow-300/90">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-3 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      All agents' findings are internally consistent — no disagreements flagged.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
