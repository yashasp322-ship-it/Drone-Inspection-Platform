import { useEffect, useMemo, useState } from "react";
import { UserPlus, Shield, Trash2, Edit2, X, Folder, ClipboardCheck } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Asset {
  id: string;
  assignedTo?: string | null;
}

interface Inspection {
  id: string;
  assetId: string;
}

const ROLES = [
  "Administrator",
  "Quality Analyst",
  "Drone Pilot (FAA Part 107)",
  "BIM Engineer",
  "Viewer"
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamView() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [status, setStatus] = useState("Active");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [teamRes, assetsRes, inspectionsRes] = await Promise.all([
        fetch("http://localhost:5001/team"),
        fetch("http://localhost:5001/assets"),
        fetch("http://localhost:5001/api/inspections")
      ]);
      setMembers(await teamRes.json());
      setAssets(await assetsRes.json());
      setInspections(await inspectionsRes.json());
    } catch (err) {
      console.error("Error fetching team data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const assetsByMember = useMemo(() => {
    const map = new Map<string, Asset[]>();
    assets.forEach((a) => {
      if (!a.assignedTo) return;
      map.set(a.assignedTo, [...(map.get(a.assignedTo) || []), a]);
    });
    return map;
  }, [assets]);

  const inspectionsByAsset = useMemo(() => {
    const map = new Map<string, number>();
    inspections.forEach((i) => {
      map.set(i.assetId, (map.get(i.assetId) || 0) + 1);
    });
    return map;
  }, [inspections]);

  const statsFor = (memberId: string) => {
    const memberAssets = assetsByMember.get(memberId) || [];
    const inspectionCount = memberAssets.reduce(
      (sum, a) => sum + (inspectionsByAsset.get(a.id) || 0),
      0
    );
    return { assetCount: memberAssets.length, inspectionCount };
  };

  const handleOpenAddModal = () => {
    setCurrentMember(null);
    setName("");
    setEmail("");
    setRole(ROLES[0]);
    setStatus("Active");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: TeamMember) => {
    setCurrentMember(member);
    setName(member.name);
    setEmail(member.email);
    setRole(member.role);
    setStatus(member.status);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    try {
      await fetch(`http://localhost:5001/team/${id}`, { method: "DELETE" });
      fetchAll();
    } catch (err) {
      console.error("Error removing team member:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, email, role, status };
    try {
      if (currentMember?.id) {
        await fetch(`http://localhost:5001/team/${currentMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch("http://localhost:5001/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchAll();
    } catch (err) {
      console.error("Error saving team member:", err);
    }
  };

  return (
    <div className="space-y-6 text-left relative">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white">Team Members</h2>
          <p className="text-xs text-gray-500 mt-1">Manage project pilots, quality analysts, engineers, and organization permission levels.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-1.5 px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Member</span>
        </button>
      </div>

      <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Workspace Members</h3>
          <span className="text-[10px] text-gray-400 font-semibold font-mono">
            {loading ? "Loading..." : `${members.length} Users`}
          </span>
        </div>
        {members.length === 0 && !loading ? (
          <div className="p-8 text-center text-xs text-gray-500">No team members yet. Click Invite Member to add one.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {members.map((m) => {
              const stats = statsFor(m.id);
              return (
                <div key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                      {initialsOf(m.name)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{m.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 text-[10px]">
                    <span className="flex items-center space-x-1.5 text-gray-400 font-semibold">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{m.role}</span>
                    </span>
                    <span className="flex items-center space-x-1.5 text-gray-400 font-mono" title="Assets assigned">
                      <Folder className="w-3.5 h-3.5" />
                      <span>{stats.assetCount}</span>
                    </span>
                    <span className="flex items-center space-x-1.5 text-gray-400 font-mono" title="Inspections on assigned assets">
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>{stats.inspectionCount}</span>
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded font-bold uppercase ${
                      m.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/10 text-gray-400"
                    }`}>
                      {m.status}
                    </span>
                    <button
                      onClick={() => handleOpenEditModal(m)}
                      title="Edit Member"
                      className="p-2 bg-white/5 rounded-lg border border-white/10 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      title="Remove Member"
                      className="p-2 bg-red-950/20 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
              {currentMember ? "Edit Team Member" : "Invite Team Member"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya.s@company.com"
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="Active">Active</option>
                  <option value="Invited">Invited</option>
                  <option value="Suspended">Suspended</option>
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
                  {currentMember ? "Save Changes" : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
