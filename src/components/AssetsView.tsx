import { useEffect, useState } from "react";
import { Database, Eye, Trash2, Edit2, Plus, X, FolderOpen } from "lucide-react";

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

interface AssetsViewProps {
  onInspectAsset: (asset: Asset) => void;
}

export default function AssetsView({ onInspectAsset }: AssetsViewProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [currentAsset, setCurrentAsset] = useState<Partial<Asset> | null>(null);
  const [name, setName] = useState("");
  const [infrastructureType, setInfrastructureType] = useState("3D OBJ Model");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Passed");
  const [gDriveLink, setGDriveLink] = useState("");

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/assets");
      const data = await res.json();
      setAssets(data);
    } catch (err) {
      console.error("Error fetching assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleOpenAddModal = () => {
    setCurrentAsset(null);
    setName("");
    setInfrastructureType("3D OBJ Model");
    setLocation("");
    setStatus("Passed");
    setGDriveLink("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (asset: Asset) => {
    setCurrentAsset(asset);
    setName(asset.name);
    setInfrastructureType(asset.infrastructureType);
    setLocation(asset.location);
    setStatus(asset.status);
    setGDriveLink(asset.gDriveLink || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    try {
      await fetch(`http://localhost:5001/assets/${id}`, {
        method: "DELETE",
      });
      fetchAssets();
    } catch (err) {
      console.error("Error deleting asset:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      infrastructureType,
      location,
      status,
      gDriveLink,
      inspectionPageId: currentAsset?.inspectionPageId || `inspect-${Date.now()}`
    };

    try {
      if (currentAsset?.id) {
        // Update
        await fetch(`http://localhost:5001/assets/${currentAsset.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        await fetch("http://localhost:5001/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setIsModalOpen(false);
      fetchAssets();
    } catch (err) {
      console.error("Error saving asset:", err);
    }
  };

  // Compute mock disk space size and totals
  const totalSpace = "5.6 GB";
  const modelCount = assets.filter((a) => a.infrastructureType.includes("Model") || a.infrastructureType.includes("Blueprint") || a.infrastructureType.includes("Cloud")).length;
  const mapCount = assets.filter((a) => a.infrastructureType.includes("Map") || a.infrastructureType.includes("Path") || a.infrastructureType.includes("Raster")).length;

  return (
    <div className="space-y-6 text-left relative">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white">Assets</h2>
          <p className="text-xs text-gray-500 mt-1">Manage 3D scans, elevation models, photogrammetry layers, and source files.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-1 px-4 py-2.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Asset</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Disk Space</span>
          <span className="text-2xl font-extrabold text-white mt-2 block font-mono">{totalSpace}</span>
          <span className="text-[10px] text-gray-500 mt-1 block">Allocated: 10 GB limit</span>
        </div>
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">3D Models & Mesh</span>
          <span className="text-2xl font-extrabold text-white mt-2 block font-mono">{modelCount} files</span>
          <span className="text-[10px] text-gray-500 mt-1 block">OBJ, LAS, IFC formats</span>
        </div>
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Orthophotos & Maps</span>
          <span className="text-2xl font-extrabold text-white mt-2 block font-mono">{mapCount} layers</span>
          <span className="text-[10px] text-gray-500 mt-1 block">GeoTIFF, GeoJSON, Maps</span>
        </div>
      </div>

      {/* Library Table */}
      <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Asset Library</h3>
          {loading && <span className="text-[10px] text-gray-500 animate-pulse">Loading...</span>}
        </div>
        
        {assets.length === 0 && !loading ? (
          <div className="p-8 text-center text-xs text-gray-500">No assets registered. Click Upload Asset to add one.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {assets.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3.5">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-white">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{item.infrastructureType} • {item.location}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-[10px] text-gray-400">
                  <span className={`px-2 py-0.5 rounded font-mono ${
                    item.status === "Passed" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {item.status}
                  </span>
                  
                  {item.gDriveLink ? (
                    <a
                      href={item.gDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open Google Drive Folder"
                      className="p-2 bg-white/5 rounded-lg border border-white/10 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      disabled
                      title="No Google Drive Link"
                      className="p-2 bg-white/5 rounded-lg border border-white/5 text-gray-600 cursor-not-allowed flex items-center justify-center"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onInspectAsset(item)}
                    title="Inspect Asset"
                    className="p-2 bg-white/5 rounded-lg border border-white/10 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    title="Edit Asset"
                    className="p-2 bg-white/5 rounded-lg border border-white/10 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Delete Asset"
                    className="p-2 bg-red-950/20 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-6">
              {currentAsset ? "Edit Infrastructure Asset" : "Upload New Asset"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Asset Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mumbai Tunnel Segment"
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Infrastructure Type</label>
                <select
                  value={infrastructureType}
                  onChange={(e) => setInfrastructureType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="3D OBJ Model">3D OBJ Model</option>
                  <option value="GeoTIFF Map">GeoTIFF Map</option>
                  <option value="IFC Blueprint">IFC Blueprint</option>
                  <option value="LAS Point Cloud">LAS Point Cloud</option>
                  <option value="360 Panorama Path">360 Panorama Path</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mumbai Project Site"
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Google Drive Folder Link</label>
                <input
                  type="url"
                  value={gDriveLink}
                  onChange={(e) => setGDriveLink(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Inspection Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="Passed">Passed</option>
                  <option value="Action Required">Action Required</option>
                </select>
              </div>

              <div className="pt-4 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-white/10 text-white rounded-xl text-xs hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-white text-black font-bold rounded-xl text-xs hover:bg-neutral-200 transition-all"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
