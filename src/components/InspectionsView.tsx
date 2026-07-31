import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft, ExternalLink, Play, Upload, Calendar, FileText,
  Loader2, CheckCircle2, Clock3, XCircle, Zap, Eye, Shield,
  BarChart3, Wrench, FileCheck, ChevronRight, AlertTriangle,
  Activity, Cpu, Layers, ScanEye, Brain, ClipboardList
} from "lucide-react";
import InteractiveViewer from "./InteractiveViewer";

interface Asset {
  id: string;
  name: string;
  infrastructureType: string;
  location: string;
  thumbnail: string;
  inspectionPageId: string;
  gDriveLink?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface InspectionsViewProps {
  inspectedAsset?: Asset | null;
  onClearAsset?: () => void;
}

interface AgentState {
  status: "Waiting" | "Running" | "Completed" | "Failed";
  reasoning: string;
  confidence: number;
  output: any;
}

interface InspectionRunState {
  image_analysis: AgentState;
  defect_detection: AgentState;
  severity_assessment: AgentState;
  recommendation: AgentState;
  report: AgentState;
}

const AGENTS = [
  {
    id: "image_analysis",
    name: "Image Analysis",
    short: "Analyzing imagery quality, GSD & sensor metadata",
    icon: ScanEye,
    color: "blue",
  },
  {
    id: "defect_detection",
    name: "Defect Detection",
    short: "Scanning for cracks, spalling, corrosion & anomalies",
    icon: Eye,
    color: "purple",
  },
  {
    id: "severity_assessment",
    name: "Severity Assessment",
    short: "Grading structural risk & priority classification",
    icon: Shield,
    color: "orange",
  },
  {
    id: "recommendation",
    name: "Recommendation",
    short: "Generating corrective actions & inspection schedule",
    icon: Wrench,
    color: "yellow",
  },
  {
    id: "report",
    name: "Report Compilation",
    short: "Compiling final structured inspection report",
    icon: FileCheck,
    color: "emerald",
  },
];

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  None:             { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  Minor:            { color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/30",  dot: "bg-yellow-400"  },
  "Action Required":{ color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/30",  dot: "bg-orange-400"  },
  High:             { color: "text-red-400",      bg: "bg-red-500/10",     border: "border-red-500/30",     dot: "bg-red-400"     },
};

const AGENT_COLORS: Record<string, string> = {
  blue:    "from-blue-500/20 border-blue-500/30 text-blue-400",
  purple:  "from-purple-500/20 border-purple-500/30 text-purple-400",
  orange:  "from-orange-500/20 border-orange-500/30 text-orange-400",
  yellow:  "from-yellow-500/20 border-yellow-500/30 text-yellow-400",
  emerald: "from-emerald-500/20 border-emerald-500/30 text-emerald-400",
};

const STATUS_ICON = {
  Waiting:   <Clock3 className="w-3.5 h-3.5 text-gray-500" />,
  Running:   <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />,
  Completed: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
  Failed:    <XCircle className="w-3.5 h-3.5 text-red-400" />,
};

const initPipeline = (): InspectionRunState => ({
  image_analysis:    { status: "Waiting", reasoning: "Waiting for sensor analysis...",      confidence: 0, output: null },
  defect_detection:  { status: "Waiting", reasoning: "Waiting for defect scan...",          confidence: 0, output: null },
  severity_assessment:{ status: "Waiting", reasoning: "Waiting for risk assessment...",     confidence: 0, output: null },
  recommendation:    { status: "Waiting", reasoning: "Waiting for action planning...",      confidence: 0, output: null },
  report:            { status: "Waiting", reasoning: "Waiting for report compilation...",   confidence: 0, output: null },
});

export default function InspectionsView({ inspectedAsset, onClearAsset }: InspectionsViewProps) {
  const [generalChecklist, setGeneralChecklist] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeAgent, setActiveAgent] = useState<string>("");
  const [pipelineState, setPipelineState] = useState<InspectionRunState>(initPipeline());
  const [finalReport, setFinalReport] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"pipeline" | "report" | "defects">("pipeline");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const hasTriggeredRef = useRef(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const completedCount = Object.values(pipelineState).filter(s => s.status === "Completed").length;
  const progressPct = Math.round((completedCount / 5) * 100);

  const fetchInspections = async () => {
    try {
      setLoadingList(true);
      const res = await fetch("http://localhost:5001/api/inspections");
      const data = await res.json();
      setGeneralChecklist(data);
    } catch { } finally { setLoadingList(false); }
  };

  useEffect(() => {
    if (!inspectedAsset) fetchInspections();
  }, [inspectedAsset]);

  useEffect(() => {
    if (inspectedAsset && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      runAutomatedInspection([]);
    }
  }, [inspectedAsset]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("files", files[i]);
    try {
      const res = await fetch("http://localhost:5001/api/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (data.urls) {
        setUploadedImages(prev => [...prev, ...data.urls]);
        setLogs(prev => [...prev, `↑ Uploaded ${files.length} raw drone image(s) manually.`]);
      }
    } catch { setLogs(prev => [...prev, "✕ Error uploading images."]); }
    finally { setUploading(false); }
  };

  const updateAgentRunning = (agentId: string) => {
    setPipelineState(prev => ({
      ...prev,
      [agentId]: { ...prev[agentId as keyof InspectionRunState], status: "Running" }
    }));
    setActiveAgent(agentId);
  };

  const runAutomatedInspection = async (manualUrls: string[]) => {
    if (!inspectedAsset) return;
    setIsRunning(true);
    setFinalReport(null);
    setActiveTab("pipeline");
    setActiveAgent("");
    setPipelineState(initPipeline());
    setLogs(["⚡ Supervisor Agent initialized. Orchestrating AI pipeline..."]);

    try {
      const res = await fetch("http://localhost:5001/api/inspections/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: inspectedAsset.id,
          images: manualUrls.length > 0 ? manualUrls : uploadedImages
        })
      });

      if (!res.ok) throw new Error(await res.text());

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value);
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const update = JSON.parse(line.trim());

            if (update.event === "init") {
              setLogs(prev => [...prev, "🧠 LangGraph compiled. Routing to first agent node..."]);
            } else if (update.event === "node_complete") {
              const { node, state } = update;

              // Push latest log from pipeline
              if (state.logs?.length > 0) {
                const latest = state.logs[state.logs.length - 1];
                setLogs(prev => prev.includes(latest) ? prev : [...prev, `• ${latest}`]);
              }

              // Show next node as running
              if (state.next_agent && state.next_agent !== "FINISH") {
                updateAgentRunning(state.next_agent.replace("_node", ""));
              }

              // Update completed agent state
              const agentKey = node.replace("_node", "") as keyof InspectionRunState;
              if (state.agent_states?.[agentKey] && state[agentKey]) {
                setPipelineState(prev => ({
                  ...prev,
                  [agentKey]: {
                    status: "Completed",
                    reasoning: state.agent_states[agentKey].reasoning,
                    confidence: state.agent_states[agentKey].confidence,
                    output: state[agentKey]
                  }
                }));
              }
            } else if (update.event === "complete") {
              setLogs(prev => [...prev, "✅ All agents completed. Saving report..."]);
              await saveInspectionResult(update.state);
            } else if (update.event === "error") {
              setLogs(prev => [...prev, `✕ Error: ${update.message}`]);
              setIsRunning(false);
            }
          } catch (e) { /* skip bad JSON */ }
        }
      }
    } catch (err: any) {
      setLogs(prev => [...prev, `✕ Pipeline failed: ${err.message}`]);
      setIsRunning(false);
    }
  };

  const saveInspectionResult = async (finalState: any) => {
    if (!inspectedAsset) return;
    const severity = finalState.severity_assessment?.overall_severity || "None";
    const reportMarkdown = finalState.report?.report_markdown || "";
    const nextInspectionDate = finalState.recommendation?.next_inspection_date || "2026-12-31";
    try {
      const res = await fetch("http://localhost:5001/api/inspections/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: inspectedAsset.id,
          agentStates: finalState.agent_states,
          reportMarkdown, severity, nextInspectionDate
        })
      });
      if (res.ok) {
        setFinalReport({ reportMarkdown, severity, nextInspectionDate, calendarReminderDetails: finalState.recommendation?.calendar_reminder_details || "" });
        setActiveTab("report");
        setLogs(prev => [...prev, "🎉 Report saved and available in Reports tab!"]);
      }
    } catch { }
    finally { setIsRunning(false); setActiveAgent(""); }
  };

  const getCalendarUrl = (report: any) => {
    if (!inspectedAsset || !report) return "#";
    const title = `Drone Inspection — ${inspectedAsset.name}`;
    const dateStr = (report.nextInspectionDate || "2026-10-31").replace(/-/g, "");
    const dates = `${dateStr}T090000/${dateStr}T100000`;
    const details = `Auto-generated follow-up.\n\n${report.calendarReminderDetails || "Perform routine drone capture scan"}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(details)}&sf=true&output=xml`;
  };

  // ─────────────────────────────────────────────────────
  // VIEW 1 — ACTIVE INSPECTION WORKSPACE
  // ─────────────────────────────────────────────────────
  if (inspectedAsset) {
    const sev = pipelineState.severity_assessment.output?.overall_severity || "";
    const sevCfg = SEVERITY_CONFIG[sev] || SEVERITY_CONFIG["None"];
    const defects = pipelineState.defect_detection.output?.defects_found || [];
    const totalDefects = pipelineState.defect_detection.output?.total_count || 0;
    const recommendation = pipelineState.recommendation.output || null;
    const imageAnalysis = pipelineState.image_analysis.output || null;

    return (
      <div className="flex flex-col gap-0 text-left pb-16 min-h-screen">

        {/* ── Header Bar ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClearAsset}
              className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{inspectedAsset.name}</h2>
                {isRunning ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block animate-ping" />
                    AI Running
                  </span>
                ) : finalReport ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                    <CheckCircle2 className="w-3 h-3" />
                    Complete
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/10">
                    Ready
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {inspectedAsset.infrastructureType} • {inspectedAsset.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {inspectedAsset.gDriveLink && (
              <a
                href={inspectedAsset.gDriveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-gray-300 hover:bg-white/10 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                GDrive
              </a>
            )}
            <button
              onClick={() => { hasTriggeredRef.current = false; runAutomatedInspection([]); }}
              disabled={isRunning || uploading}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
                isRunning
                  ? "bg-blue-500/10 border border-blue-500/20 text-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white shadow-white/10"
              }`}
            >
              {isRunning
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running AI...</>
                : <><Zap className="w-3.5 h-3.5 fill-current" /> Re-run Inspection</>
              }
            </button>
          </div>
        </div>

        {/* ── Progress Header ── */}
        {(isRunning || finalReport) && (
          <div className="mb-5 bg-neutral-950 border border-white/10 rounded-2xl p-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5" />
            <div className="relative flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">AI Pipeline Progress</span>
              </div>
              <span className="text-xs font-mono font-bold text-white">{progressPct}%</span>
            </div>
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-700 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="relative flex justify-between mt-2">
              {AGENTS.map((a, i) => (
                <div key={a.id} className="flex flex-col items-center gap-1">
                  <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    pipelineState[a.id as keyof InspectionRunState].status === "Completed" ? "bg-emerald-400 shadow-emerald-400/50 shadow-sm" :
                    pipelineState[a.id as keyof InspectionRunState].status === "Running" ? "bg-blue-400 animate-pulse" :
                    "bg-white/10"
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Main Layout Grid ── */}
        <div className="grid lg:grid-cols-12 gap-5">

          {/* ── LEFT COLUMN (8) ── */}
          <div className="lg:col-span-8 space-y-5">

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
              {(["pipeline", "defects", "report"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[11px] font-bold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-white text-black shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab === "pipeline" && <Cpu className="w-3.5 h-3.5" />}
                  {tab === "defects" && <AlertTriangle className="w-3.5 h-3.5" />}
                  {tab === "report" && <FileText className="w-3.5 h-3.5" />}
                  {tab === "pipeline" ? "AI Pipeline" : tab === "defects" ? `Defects${totalDefects > 0 ? ` (${totalDefects})` : ""}` : "Report"}
                </button>
              ))}
            </div>

            {/* ─── PIPELINE TAB ─── */}
            {activeTab === "pipeline" && (
              <div className="space-y-3">
                {AGENTS.map((agent, idx) => {
                  const st = pipelineState[agent.id as keyof InspectionRunState];
                  const isActive = activeAgent === agent.id || st.status === "Running";
                  const colors = AGENT_COLORS[agent.color];
                  const Icon = agent.icon;

                  return (
                    <div
                      key={agent.id}
                      onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                      className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                        isActive
                          ? `bg-gradient-to-r ${colors.split(" ")[0]} border-${agent.color}-500/30 shadow-lg`
                          : st.status === "Completed"
                          ? "bg-white/[0.03] border-white/10 hover:border-white/20"
                          : "bg-white/[0.02] border-white/5 hover:border-white/10"
                      }`}
                    >
                      {/* Animated shine for running */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                      )}

                      <div className="relative p-4 flex items-center gap-4">
                        {/* Step number */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                          st.status === "Completed" ? "bg-emerald-500/10 border-emerald-500/30" :
                          isActive ? "bg-blue-500/20 border-blue-500/40" :
                          "bg-white/5 border-white/10"
                        }`}>
                          {st.status === "Completed"
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            : isActive
                            ? <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                            : <span className="text-[11px] font-bold text-gray-500">{idx + 1}</span>
                          }
                        </div>

                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${
                          isActive ? `bg-gradient-to-br ${colors.split(" ")[0]} bg-opacity-20` : "bg-white/5"
                        }`}>
                          <Icon className={`w-4 h-4 ${isActive || st.status === "Completed" ? colors.split(" ")[2] : "text-gray-500"}`} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${
                              isActive || st.status === "Completed" ? "text-white" : "text-gray-400"
                            }`}>{agent.name}</span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                              st.status === "Completed" ? "bg-emerald-500/10 text-emerald-400" :
                              isActive ? "bg-blue-500/10 text-blue-400 animate-pulse" :
                              "bg-white/5 text-gray-500"
                            }`}>{isActive ? "Running" : st.status}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-0.5 truncate">{agent.short}</p>
                          {st.status !== "Waiting" && (
                            <p className="text-[10px] text-gray-300 mt-1.5 leading-relaxed line-clamp-2">{st.reasoning}</p>
                          )}
                        </div>

                        {/* Right side */}
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          {st.confidence > 0 && (
                            <div className="text-right">
                              <span className="text-[9px] text-gray-500 block font-semibold uppercase">Confidence</span>
                              <span className={`text-sm font-black font-mono ${colors.split(" ")[2]}`}>{st.confidence}%</span>
                            </div>
                          )}
                          {st.status !== "Waiting" && (
                            <ChevronRight className={`w-3.5 h-3.5 text-gray-500 transition-transform ${expandedAgent === agent.id ? "rotate-90" : ""}`} />
                          )}
                        </div>
                      </div>

                      {/* Expanded output */}
                      {expandedAgent === agent.id && st.output && (
                        <div className="border-t border-white/5 mx-4 mb-4 pt-3">
                          <div className="bg-black/40 rounded-xl p-3 font-mono text-[10px] text-gray-300 max-h-48 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                            <span className="text-gray-500 block mb-1">Agent Output JSON</span>
                            {JSON.stringify(st.output, null, 2)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Upload section */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    Manual Image Upload
                  </h3>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-5 flex flex-col items-center justify-center hover:border-white/20 transition-all relative group">
                    <input
                      type="file" multiple accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isRunning || uploading}
                    />
                    {uploading
                      ? <Loader2 className="w-6 h-6 text-gray-400 mb-2 animate-spin" />
                      : <Upload className="w-6 h-6 text-gray-500 mb-2 group-hover:text-gray-300 transition-all" />
                    }
                    <span className="text-xs text-gray-400 font-medium">Click or drag drone images here</span>
                    <span className="text-[10px] text-gray-600 mt-1">JPEG, PNG — max 10MB each</span>
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="w-14 h-14 rounded-lg border border-white/10 overflow-hidden bg-neutral-900">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── DEFECTS TAB ─── */}
            {activeTab === "defects" && (
              <div className="space-y-4">
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Total Defects</span>
                    <span className="text-3xl font-black text-white mt-1 block">{totalDefects}</span>
                    <span className="text-[10px] text-gray-600 mt-0.5 block">Identified anomalies</span>
                  </div>
                  <div className={`border rounded-2xl p-4 ${sev ? `${sevCfg.bg} ${sevCfg.border}` : "bg-white/[0.03] border-white/10"}`}>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Severity</span>
                    <span className={`text-xl font-black mt-1 block ${sev ? sevCfg.color : "text-gray-500"}`}>{sev || "—"}</span>
                    <span className="text-[10px] text-gray-600 mt-0.5 block">Overall risk grade</span>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Risk Score</span>
                    <span className="text-3xl font-black text-white mt-1 block">
                      {pipelineState.severity_assessment.output?.risk_score ?? "—"}
                    </span>
                    <span className="text-[10px] text-gray-600 mt-0.5 block">Out of 100</span>
                  </div>
                </div>

                {/* Defect list */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="p-3 border-b border-white/5 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-xs font-bold text-white">Detected Anomalies</span>
                  </div>
                  {defects.length === 0 ? (
                    <div className="p-8 text-center">
                      {pipelineState.defect_detection.status === "Waiting"
                        ? <p className="text-xs text-gray-500">Run inspection to detect defects</p>
                        : <p className="text-xs text-emerald-400">No structural defects detected ✓</p>
                      }
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {defects.map((d: any, i: number) => (
                        <div key={i} className="p-4 flex items-start gap-3 hover:bg-white/5 transition-colors">
                          <div className="mt-0.5 w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-white block">{d.type}</span>
                            <div className="flex gap-3 mt-1 flex-wrap">
                              <span className="text-[10px] text-gray-400">📍 {d.location}</span>
                              <span className="text-[10px] text-gray-500">📐 {d.estimated_size}</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 flex-shrink-0">
                            {pipelineState.severity_assessment.output?.overall_severity || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recommended actions */}
                {recommendation?.recommended_actions?.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-3 border-b border-white/5 flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-xs font-bold text-white">Recommended Actions</span>
                    </div>
                    <div className="p-4 space-y-2">
                      {recommendation.recommended_actions.map((a: string, i: number) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                          <span className="text-xs text-gray-300 leading-relaxed">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image analysis */}
                {imageAnalysis && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Sensor Type</span>
                      <span className="text-xs font-bold text-white">{imageAnalysis.sensor_type}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Image Suitability</span>
                      <span className="text-xs font-bold text-emerald-400">{imageAnalysis.suitability}</span>
                    </div>
                    <div className="col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Quality Metrics</span>
                      <span className="text-xs text-gray-300">{imageAnalysis.image_quality_metrics}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── REPORT TAB ─── */}
            {activeTab === "report" && (
              <div className="space-y-4">
                {!finalReport ? (
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-12 text-center">
                    <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-400">No report yet</p>
                    <p className="text-xs text-gray-600 mt-1">Run the AI inspection to generate a report</p>
                  </div>
                ) : (
                  <>
                    {/* Report header */}
                    <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                          <FileCheck className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Inspection Report Generated</span>
                          <span className="text-[10px] text-gray-400">{inspectedAsset.name} • {finalReport.nextInspectionDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                          SEVERITY_CONFIG[finalReport.severity]?.bg || "bg-gray-500/10"
                        } ${SEVERITY_CONFIG[finalReport.severity]?.color || "text-gray-400"} ${
                          SEVERITY_CONFIG[finalReport.severity]?.border || "border-gray-500/30"
                        } border uppercase`}>
                          {finalReport.severity} Severity
                        </span>
                      </div>
                    </div>

                    {/* Markdown report */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                      <div className="p-3 border-b border-white/5 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs font-bold text-white">Full Inspection Report</span>
                      </div>
                      <div className="p-5 font-mono text-[11px] text-gray-300 max-h-[500px] overflow-y-auto leading-relaxed whitespace-pre-wrap bg-black/20">
                        {finalReport.reportMarkdown}
                      </div>
                    </div>

                    {/* Calendar CTA */}
                    <div className="bg-gradient-to-r from-purple-500/10 via-transparent to-transparent border border-purple-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <div>
                          <span className="text-xs font-bold text-white block">Next Inspection Reminder</span>
                          <span className="text-[10px] text-gray-400">Recommended on <span className="font-mono text-white">{finalReport.nextInspectionDate}</span></span>
                        </div>
                      </div>
                      <a
                        href={getCalendarUrl(finalReport)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Add to Google Calendar
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN (4) ── */}
          <div className="lg:col-span-4 space-y-4">

            {/* Live Orchestrator Terminal */}
            <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Orchestrator Logs</span>
                </div>
                {isRunning && (
                  <span className="flex items-center gap-1 text-[9px] text-blue-400 font-bold animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                    LIVE
                  </span>
                )}
              </div>
              <div className="bg-black/70 p-3 h-52 overflow-y-auto font-mono text-[10px] text-emerald-400 space-y-1.5 leading-snug">
                {logs.length === 0 && (
                  <span className="text-gray-600">Waiting for inspection to start...</span>
                )}
                {logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-gray-600 flex-shrink-0">›</span>
                    <span className="break-all">{log}</span>
                  </div>
                ))}
                {isRunning && (
                  <div className="flex items-center gap-1.5 text-blue-400 animate-pulse">
                    <span className="text-gray-600">›</span>
                    <Loader2 className="w-2.5 h-2.5 animate-spin flex-shrink-0" />
                    <span>Processing...</span>
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>
            </div>

            {/* Spatial Preview */}
            <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Spatial Preview</span>
              </div>
              <div className="h-52 bg-neutral-900 relative overflow-hidden">
                <InteractiveViewer inspectedAsset={inspectedAsset} />
              </div>
            </div>

            {/* Quick Stats */}
            {finalReport && (
              <div className="bg-neutral-950 border border-white/10 rounded-2xl p-4 space-y-3">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                  Inspection Summary
                </h4>
                <div className="space-y-2.5">
                  {[
                    { label: "Total Defects", value: String(totalDefects), icon: "🔍" },
                    { label: "Severity", value: finalReport.severity, icon: "⚡" },
                    { label: "Priority", value: pipelineState.severity_assessment.output?.priority || "—", icon: "🎯" },
                    { label: "Next Inspection", value: finalReport.nextInspectionDate, icon: "📅" },
                    { label: "AI Confidence", value: `${pipelineState.report.confidence}%`, icon: "🧠" },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1.5">
                        <span>{icon}</span>{label}
                      </span>
                      <span className="text-[10px] font-bold text-white font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agent status mini-grid */}
            <div className="bg-neutral-950 border border-white/10 rounded-2xl p-4">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Agent Status
              </h4>
              <div className="space-y-2">
                {AGENTS.map((a) => {
                  const st = pipelineState[a.id as keyof InspectionRunState];
                  const isAct = activeAgent === a.id || st.status === "Running";
                  return (
                    <div key={a.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          st.status === "Completed" ? "bg-emerald-400" :
                          isAct ? "bg-blue-400 animate-ping" :
                          "bg-white/10"
                        }`} />
                        <span className="text-[10px] text-gray-400">{a.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {st.confidence > 0 && (
                          <span className="text-[9px] font-mono text-gray-500">{st.confidence}%</span>
                        )}
                        {STATUS_ICON[isAct ? "Running" : st.status]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────
  // VIEW 2 — INSPECTION HISTORY LIST
  // ─────────────────────────────────────────────────────
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-white">Inspections</h2>
        <p className="text-xs text-gray-500 mt-1">
          Click the <span className="text-white font-semibold">👁 View</span> button on any asset to trigger the AI inspection pipeline.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Inspections", value: String(generalChecklist.length), icon: ClipboardList, color: "text-blue-400" },
          { label: "Completed", value: String(generalChecklist.filter(i => i.status === "Passed").length), icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Action Required", value: String(generalChecklist.filter(i => i.severity === "High" || i.severity === "Action Required").length), icon: AlertTriangle, color: "text-orange-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-neutral-950 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-[10px] font-bold text-gray-500 uppercase">{label}</span>
            </div>
            <span className="text-2xl font-black text-white">{value}</span>
          </div>
        ))}
      </div>

      <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Inspection History</h3>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">{generalChecklist.length} records</span>
        </div>
        <div className="divide-y divide-white/5">
          {loadingList ? (
            <div className="p-8 text-center">
              <Loader2 className="w-5 h-5 text-gray-500 animate-spin mx-auto mb-2" />
              <span className="text-xs text-gray-500">Loading inspection records...</span>
            </div>
          ) : generalChecklist.length === 0 ? (
            <div className="p-12 text-center">
              <Eye className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">No inspections yet</p>
              <p className="text-xs text-gray-600 mt-1">Go to Assets → click the 👁 button to run your first AI inspection</p>
            </div>
          ) : (
            generalChecklist.map((item, idx) => {
              const sc = SEVERITY_CONFIG[item.severity] || SEVERITY_CONFIG["None"];
              return (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${sc.bg} ${sc.border}`}>
                      <Brain className={`w-4 h-4 ${sc.color}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.assetName}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {item.date} • Next: <span className="text-gray-400 font-mono">{item.nextInspectionDate || "N/A"}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.severity && item.severity !== "None" && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase border ${sc.bg} ${sc.color} ${sc.border}`}>
                        {item.severity}
                      </span>
                    )}
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      item.status === "Passed" ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                    }`}>
                      {item.status === "Passed"
                        ? <CheckCircle2 className="w-3 h-3" />
                        : <AlertTriangle className="w-3 h-3" />
                      }
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
