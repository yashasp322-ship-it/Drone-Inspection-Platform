import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Folder,
  MessagesSquare,
  ClipboardCheck,
  FileText,
  Users,
  LogOut,
  Menu,
  X
} from "lucide-react";
import DashboardHome from "./DashboardHome";
import AIDiscussionView from "./AIDiscussionView";
import AssetsView from "./AssetsView";
import InspectionsView from "./InspectionsView";
import ReportsView from "./ReportsView";
import TeamView from "./TeamView";

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

interface DashboardShellProps {
  userEmail: string;
  onSignOut: () => void;
}

type TabType = "dashboard" | "assets" | "discussion" | "inspections" | "reports" | "team";

export default function DashboardShell({ userEmail, onSignOut }: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [inspectedAsset, setInspectedAsset] = useState<Asset | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
    { id: "assets" as TabType, label: "Assets", icon: Folder },
    { id: "discussion" as TabType, label: "AI Discussion", icon: MessagesSquare },
    { id: "inspections" as TabType, label: "Inspections", icon: ClipboardCheck },
    { id: "reports" as TabType, label: "Reports", icon: FileText },
    { id: "team" as TabType, label: "Team", icon: Users }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardHome onViewAllProjects={() => setActiveTab("assets")} />
        );
      case "discussion":
        return <AIDiscussionView />;
      case "assets":
        return (
          <AssetsView
            onInspectAsset={(asset) => {
              setInspectedAsset(asset);
              setActiveTab("inspections");
            }}
          />
        );
      case "inspections":
        return (
          <InspectionsView
            inspectedAsset={inspectedAsset}
            onClearAsset={() => setInspectedAsset(null)}
          />
        );
      case "reports":
        return <ReportsView />;
      case "team":
        return <TeamView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-white/10 w-full z-30">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-black">
            D
          </div>
          <span className="font-extrabold text-lg tracking-wider">
            DRONE<span className="text-gray-400">DEPLOY</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Left Navigation Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-neutral-950 border-r border-white/10 flex flex-col justify-between p-6 transform transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Logo */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-black">
              D
            </div>
            <span className="font-extrabold text-xl tracking-wider">
              DRONE<span className="text-gray-400">DEPLOY</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id !== "inspections") setInspectedAsset(null);
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative ${
                    isActive
                      ? "text-black bg-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with Sign Out */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center space-x-3 px-3">
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {(userEmail || "A").charAt(0).toUpperCase()}
            </div>
            <div className="text-left overflow-hidden">
              <div className="text-xs font-bold text-white truncate">
                {userEmail ? userEmail.split("@")[0] : "Administrator"}
              </div>
              <div className="text-[10px] text-gray-500 truncate">{userEmail || "admin@gmail.com"}</div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 bg-black">
        {/* Content body */}
        <div className="flex-grow p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </main>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </div>
  );
}
