import { useEffect, useState, useRef } from "react";
import { ClipboardCheck, CheckCircle, Clock, Play, Upload, Calendar, FileText, Loader2, ArrowLeft, ExternalLink } from "lucide-react";
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

export default function InspectionsView({ inspectedAsset, onClearAsset }: InspectionsViewProps) {
  // General checklist items (shown when no asset is selected for active inspection)
  const [generalChecklist, setGeneralChecklist] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Active Inspection Workspace state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentAgent, setCurrentAgent] = useState<string>("");
  const [pipelineState, setPipelineState] = useState<InspectionRunState>({
    image_analysis: { status: "Waiting", reasoning: "Waiting for check", confidence: 0, output: null },
    defect_detection: { status: "Waiting", reasoning: "Waiting for scan", confidence: 0, output: null },
    severity_assessment: { status: "Waiting", reasoning: "Waiting for grading", confidence: 0, output: null },
    recommendation: { status: "Waiting", reasoning: "Waiting for recommendation", confidence: 0, output: null },
    report: { status: "Waiting", reasoning: "Waiting for final compilation", confidence: 0, output: null }
  });

  const [finalReport, setFinalReport] = useState<any | null>(null);
  const hasTriggeredRef = useRef(false);

  // Load inspections checklist
  const fetchInspections = async () => {
    try {
      setLoadingList(true);
      const res = await fetch("http://localhost:5001/api/inspections");
      const data = await res.json();
      setGeneralChecklist(data);
    } catch (err) {
      console.error("Error fetching inspections list:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (!inspectedAsset) {
      fetchInspections();
    }
  }, [inspectedAsset]);

  // Trigger automated workflow if asset has GDrive folder link
  useEffect(() => {
    if (inspectedAsset && inspectedAsset.gDriveLink && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      runAutomatedInspection([]);
    }
  }, [inspectedAsset]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("http://localhost:5001/api/uploads", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.urls) {
        setUploadedImages(prev => [...prev, ...data.urls]);
        setLogs(prev => [...prev, `Uploaded ${files.length} raw drone images manually.`]);
      }
    } catch (err) {
      console.error("Error uploading images:", err);
      setLogs(prev => [...prev, "Error uploading images manually."]);
    } finally {
      setUploading(false);
    }
  };

  const runAutomatedInspection = async (manualUrls: string[]) => {
    if (!inspectedAsset) return;
    setIsRunning(true);
    setFinalReport(null);
    setLogs(["Supervisor: Initializing Agentic AI Orchestrator..."]);

    // Reset pipeline state
    setPipelineState({
      image_analysis: { status: "Waiting", reasoning: "Waiting for check", confidence: 0, output: null },
      defect_detection: { status: "Waiting", reasoning: "Waiting for scan", confidence: 0, output: null },
      severity_assessment: { status: "Waiting", reasoning: "Waiting for grading", confidence: 0, output: null },
      recommendation: { status: "Waiting", reasoning: "Waiting for recommendation", confidence: 0, output: null },
      report: { status: "Waiting", reasoning: "Waiting for final compilation", confidence: 0, output: null }
    });

    try {
      const res = await fetch("http://localhost:5001/api/inspections/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: inspectedAsset.id,
          images: manualUrls.length > 0 ? manualUrls : uploadedImages
        })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value);
        const lines = buffer.split("\n");
        // Keep the last partial line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const update = JSON.parse(line.trim());
            if (update.event === "init") {
              setLogs(prev => [...prev, "Supervisor: Graph loaded. Starting specialized agents..."]);
            } else if (update.event === "node_complete") {
              const node = update.node;
              const state = update.state;
              if (state.next_agent) {
                setCurrentAgent(state.next_agent.replace("_node", ""));
              }

              // Append logs if any
              if (state.logs && state.logs.length > 0) {
                const latestLog = state.logs[state.logs.length - 1];
                setLogs(prev => {
                  if (prev.includes(latestLog)) return prev;
                  return [...prev, latestLog];
                });
              }

              // Map node names to UI pipeline states
              if (node === "image_analysis_node" && state.image_analysis) {
                setPipelineState(prev => ({
                  ...prev,
                  image_analysis: {
                    status: "Completed",
                    reasoning: state.agent_states.image_analysis.reasoning,
                    confidence: state.agent_states.image_analysis.confidence,
                    output: state.image_analysis
                  }
                }));
              } else if (node === "defect_detection_node" && state.defect_detection) {
                setPipelineState(prev => ({
                  ...prev,
                  defect_detection: {
                    status: "Completed",
                    reasoning: state.agent_states.defect_detection.reasoning,
                    confidence: state.agent_states.defect_detection.confidence,
                    output: state.defect_detection
                  }
                }));
              } else if (node === "severity_assessment_node" && state.severity_assessment) {
                setPipelineState(prev => ({
                  ...prev,
                  severity_assessment: {
                    status: "Completed",
                    reasoning: state.agent_states.severity_assessment.reasoning,
                    confidence: state.agent_states.severity_assessment.confidence,
                    output: state.severity_assessment
                  }
                }));
              } else if (node === "recommendation_node" && state.recommendation) {
                setPipelineState(prev => ({
                  ...prev,
                  recommendation: {
                    status: "Completed",
                    reasoning: state.agent_states.recommendation.reasoning,
                    confidence: state.agent_states.recommendation.confidence,
                    output: state.recommendation
                  }
                }));
              } else if (node === "report_node" && state.report) {
                setPipelineState(prev => ({
                  ...prev,
                  report: {
                    status: "Completed",
                    reasoning: state.agent_states.report.reasoning,
                    confidence: state.agent_states.report.confidence,
                    output: state.report
                  }
                }));
              }
            } else if (update.event === "complete") {
              const finalState = update.state;
              setLogs(prev => [...prev, "Supervisor: Workflow successfully finished! Saving results..."]);
              
              // Automatically save results to Node backend
              await saveInspectionResult(finalState);
            } else if (update.event === "error") {
              setLogs(prev => [...prev, `Error: ${update.message}`]);
              setIsRunning(false);
            }
          } catch (e) {
            console.error("Failed to parse event stream chunk:", e);
          }
        }
      }
    } catch (err: any) {
      setLogs(prev => [...prev, `Pipeline Failed: ${err.message}`]);
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
          reportMarkdown,
          severity,
          nextInspectionDate
        })
      });

      if (res.ok) {
        setFinalReport({
          reportMarkdown,
          severity,
          nextInspectionDate,
          calendarReminderDetails: finalState.recommendation?.calendar_reminder_details || ""
        });
      }
    } catch (err) {
      console.error("Error saving inspection results:", err);
    } finally {
      setIsRunning(false);
    }
  };

  // Helper to construct calendar template URL
  const getGoogleCalendarUrl = (report: any) => {
    if (!inspectedAsset || !report) return "#";
    const title = `Drone Infrastructure Inspection - ${inspectedAsset.name}`;
    const dateStr = (report.nextInspectionDate || "2026-10-31").replace(/-/g, "");
    const dates = `${dateStr}T090000/${dateStr}T100000`;
    const details = `Auto-generated follow-up reminder.\n\nRecommended actions:\n${report.calendarReminderDetails || "Perform routine drone capture scan"}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dates}&details=${encodeURIComponent(details)}&sf=true&output=xml`;
  };

  // --- RENDER VIEW 1: ACTIVE INSPECTION WORKSPACE ---
  if (inspectedAsset) {
    const reportObj = finalReport;

    return (
      <div className="space-y-6 text-left pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClearAsset}
              className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white transition-all"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white">Inspection Workspace</h2>
              <p className="text-xs text-gray-500 mt-1">
                Asset: <span className="text-white font-semibold">{inspectedAsset.name}</span> • {inspectedAsset.location}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {inspectedAsset.gDriveLink && (
              <a
                href={inspectedAsset.gDriveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-xs font-bold rounded-xl transition-all"
              >
                <span>GDrive Folder</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={() => runAutomatedInspection([])}
              disabled={isRunning || uploading}
              className={`flex items-center space-x-1.5 px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl transition-all ${
                isRunning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isRunning ? "Running Inspection..." : "Start AI Inspection"}</span>
            </button>
          </div>
        </div>

        {/* Upload & Workspace Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Inspection Board (Col span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Manual Upload Section */}
            <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Manual Asset Images Upload</h3>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center hover:border-white/20 transition-all relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isRunning || uploading}
                />
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs text-white font-medium">Click or drag images to upload</span>
                <span className="text-[10px] text-gray-500 mt-1">Supports JPEG, PNG up to 10MB</span>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Uploaded {uploadedImages.length} Files</span>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="w-16 h-16 border border-white/10 rounded-lg overflow-hidden relative bg-neutral-900">
                        <img src={img} alt="Drone inspect thumbnail" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Pipeline Visualizer */}
            <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6">AI Agent Pipeline Status</h3>
              
              <div className="space-y-4">
                {[
                  { id: "image_analysis", name: "Image Analysis Agent", desc: "Extracts EXIF data & validates drone sensor quality metrics." },
                  { id: "defect_detection", name: "Defect Detection Agent", desc: "Performs multimodal vision crack/spalling scans." },
                  { id: "severity_assessment", name: "Severity Assessment Agent", desc: "Evaluates risk factors and grades anomalies." },
                  { id: "recommendation", name: "Recommendation Agent", desc: "Calculates action steps and next inspection date." },
                  { id: "report", name: "Report Agent", desc: "Compiles final structured summary & markdown document." }
                ].map((agent) => {
                  const state = pipelineState[agent.id as keyof InspectionRunState];
                  const isRunningNode = isRunning && state.status === "Waiting" && currentAgent === agent.id;
                  
                  return (
                    <div key={agent.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-white/10 transition-all">
                      <div className="space-y-1 text-left flex-grow">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{agent.name}</span>
                          <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold ${
                            state.status === "Completed" ? "bg-emerald-500/10 text-emerald-400" :
                            state.status === "Running" || isRunningNode ? "bg-blue-500/10 text-blue-400 animate-pulse" :
                            state.status === "Failed" ? "bg-red-500/10 text-red-400" : "bg-neutral-500/10 text-gray-500"
                          }`}>
                            {state.status === "Waiting" && isRunningNode ? "Running" : state.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed">{agent.desc}</p>
                        
                        {state.reasoning && (
                          <div className="text-[10px] text-gray-300 mt-2 bg-black/40 p-2 rounded font-mono">
                            <span className="text-gray-500">Reasoning:</span> {state.reasoning}
                          </div>
                        )}

                        {state.output && (
                          <div className="mt-2 text-[9px] bg-neutral-900 border border-white/5 p-2 rounded-lg max-h-32 overflow-y-auto font-mono text-gray-400">
                            <span className="text-white font-bold block mb-1">Agent Output JSON:</span>
                            {JSON.stringify(state.output, null, 2)}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row md:flex-col items-center justify-between md:items-end gap-2 text-right">
                        {state.confidence > 0 && (
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase block font-bold">Confidence</span>
                            <span className="text-xs font-bold font-mono text-white">{state.confidence}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generated Report Output */}
            {reportObj && (
              <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-white" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Inspection Report</h3>
                  </div>
                  <div className="flex items-center space-x-3 text-[10px]">
                    <span className="px-2 py-0.5 rounded font-bold uppercase bg-red-500/10 text-red-400">
                      Severity: {reportObj.severity}
                    </span>
                    <span className="text-gray-400">
                      Next: {reportObj.nextInspectionDate}
                    </span>
                  </div>
                </div>

                <div className="prose prose-invert prose-xs max-w-none max-h-96 overflow-y-auto font-mono text-xs text-gray-300 bg-neutral-900 border border-white/5 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                  {reportObj.reportMarkdown}
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-400">
                      Next inspection recommended on: <strong className="text-white font-mono">{reportObj.nextInspectionDate}</strong>
                    </span>
                  </div>

                  <a
                    href={getGoogleCalendarUrl(reportObj)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold rounded-xl transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 fill-current" />
                    <span>Google Calendar Reminder</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Logs & Viewer (Col span 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Logs */}
            <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Orchestrator Terminal</h3>
              <div className="bg-black/60 border border-white/5 rounded-xl p-4 h-64 overflow-y-auto font-mono text-[9px] text-emerald-400 space-y-1.5 leading-normal">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="text-gray-600 mr-2 flex-shrink-0">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
                {isRunning && (
                  <div className="flex items-center space-x-1 animate-pulse">
                    <span className="text-gray-600 mr-2">&gt;</span>
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>Processing next node...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Viewer Preview */}
            <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Spatial Map Preview</h3>
              <div className="rounded-xl overflow-hidden border border-white/5 h-64 bg-neutral-900 flex items-center justify-center relative">
                <InteractiveViewer inspectedAsset={inspectedAsset} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER VIEW 2: ALL COMPLETED/ACTIVE INSPECTION CHECKLIST LIST ---
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-white">Inspections</h2>
        <p className="text-xs text-gray-500 mt-1">Review concrete quality assurance, thermal analysis checks, and volumetric anomalies.</p>
      </div>

      <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Checklist</h3>
          <span className="text-[10px] text-gray-400 font-semibold font-mono">{generalChecklist.length} Total inspections</span>
        </div>
        <div className="divide-y divide-white/5">
          {loadingList ? (
            <div className="p-8 text-center text-xs text-gray-500 animate-pulse">Loading checklist...</div>
          ) : generalChecklist.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">No inspections executed yet. Go to Assets and click Inspect.</div>
          ) : (
            generalChecklist.map((item, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3.5">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-white">
                    <ClipboardCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">AI Analysis: {item.assetName}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Completed: {item.date} • Next Due: {item.nextInspectionDate || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-[10px]">
                  {item.severity && item.severity !== "None" && (
                    <span className={`inline-flex px-2 py-0.5 rounded font-bold uppercase ${
                      item.severity === "High" ? "bg-red-500/10 text-red-400" : "bg-neutral-500/10 text-gray-300"
                    }`}>
                      {item.severity} Severity
                    </span>
                  )}
                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full font-bold ${
                    item.status === "Passed" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {item.status === "Passed" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span>{item.status}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
