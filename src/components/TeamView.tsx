import { UserPlus, Shield } from "lucide-react";

export default function TeamView() {
  const members = [
    { name: "John Doe", email: "admin@gmail.com", role: "Administrator", status: "Active", initials: "JD" },
    { name: "Sarah Jenkins", email: "sarah.j@company.com", role: "Quality Analyst", status: "Active", initials: "SJ" },
    { name: "Alex Carter", email: "alex.c@company.com", role: "Drone Pilot (FAA Part 107)", status: "Active", initials: "AC" },
    { name: "Elena Rostova", email: "elena.r@company.com", role: "BIM Engineer", status: "Active", initials: "ER" }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white">Team Members</h2>
          <p className="text-xs text-gray-500 mt-1">Manage project pilots, quality analysts, engineers, and organization permission levels.</p>
        </div>
        <button className="flex items-center space-x-1.5 px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Member</span>
        </button>
      </div>

      <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Workspace Members</h3>
          <span className="text-[10px] text-gray-400 font-semibold font-mono">{members.length} Users</span>
        </div>
        <div className="divide-y divide-white/5">
          {members.map((m, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                  {m.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{m.name}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{m.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-[10px]">
                <span className="flex items-center space-x-1.5 text-gray-400 font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{m.role}</span>
                </span>
                <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase">
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
