import { useEffect, useState } from "react";
import { FileText, Download, BarChart3, Eye, X } from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  size: string;
  content?: string;
}

export default function ReportsView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const defaultReports: Report[] = [
    { id: "def-1", title: "Monthly Construction Progress Summary", type: "PDF Document", date: "May 2026", size: "14.2 MB" },
    { id: "def-2", title: "Solar Array Cell Heat Anomalies Log", type: "Excel Sheet", date: "May 2026", size: "2.1 MB" },
    { id: "def-3", title: "Stockpile Inventory Volumetric Audit", type: "CSV Spreadsheet", date: "April 2026", size: "450 KB" },
    { id: "def-4", title: "QA Blueprint Drift Compare Map", type: "High-Res PDF", date: "April 2026", size: "38.5 MB" }
  ];

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/reports");
      if (res.ok) {
        const data = await res.json();
        // Merge fetched reports with defaults
        setReports([...data, ...defaultReports]);
      } else {
        setReports(defaultReports);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReports(defaultReports);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownload = (report: Report) => {
    if (report.content) {
      // Allow downloading of text content as file
      const element = document.createElement("a");
      const file = new Blob([report.content], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `${report.title.replace(/\s+/g, "_")}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      alert(`Downloading mock asset file: ${report.title}`);
    }
  };

  return (
    <div className="space-y-6 text-left relative">
      <div>
        <h2 className="text-xl font-bold text-white">Reports</h2>
        <p className="text-xs text-gray-500 mt-1">Export flight summaries, inspection logs, thermal maps, and volumetric audits.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Detection Accuracy</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Our neural classification engines averaged 98.4% accuracy across concrete cracks, solar hot spots, and topographic surveys this period.
          </p>
          <div className="h-2 w-full bg-neutral-900 border border-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: "98.4%" }} />
          </div>
        </div>

        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Total Reports Exported</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            A total of {reports.length} analytical reports were compiled and delivered to project stakeholders.
          </p>
          <div className="text-xl font-extrabold text-white font-mono">{reports.length} / 50 limit</div>
        </div>
      </div>

      <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Document Library</h3>
          {loading && <span className="text-[10px] text-gray-500 animate-pulse">Loading library...</span>}
        </div>
        <div className="divide-y divide-white/5">
          {reports.map((item) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center space-x-3.5">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{item.type} • {item.date}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-[10px]">
                <span className="font-bold text-white font-mono">{item.size}</span>
                
                {item.content && (
                  <button
                    onClick={() => setSelectedReport(item)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 border border-white/10 text-white hover:bg-neutral-800 font-bold rounded-lg transition-all"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Report</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleDownload(item)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-white text-black hover:bg-neutral-200 font-bold rounded-lg transition-all"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-left">
          <div className="w-full max-w-2xl bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 pr-8">{selectedReport.title}</h3>
            <p className="text-[10px] text-gray-500 mb-4">{selectedReport.type} • Created {selectedReport.date}</p>
            
            <div className="flex-grow overflow-y-auto bg-neutral-900 border border-white/5 rounded-xl p-4 font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
              {selectedReport.content}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 border border-white/10 text-white rounded-xl text-xs hover:bg-white/5 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedReport)}
                className="px-4 py-2 bg-white text-black font-bold rounded-xl text-xs hover:bg-neutral-200 transition-all"
              >
                Download Markdown (.md)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
