import { useState } from "react";
import { useGridSocket } from "./hooks/useGridSocket";
import { useAuth } from "./hooks/useAuth";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import GridMapView from "./components/GridMapView";
import WardsTable from "./components/WardsTable";
import RoutesView from "./components/RoutesView";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import AuthModal from "./components/AuthModal";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedNode, setSelectedNode] = useState(null);

  // Custom Hooks for Real-Time Socket.io & JWT Authentication
  const {
    nodes,
    routes,
    stats,
    connected,
    loading,
    crisisActive,
    triggerCrisis,
    resetGrid,
    backendUrl,
  } = useGridSocket();

  const {
    user,
    login,
    logout,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useAuth();

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <NavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connected={connected}
        totalNodes={nodes.length}
        activeRoutes={routes.length}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={logout}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-5 bg-slate-900/30 flex flex-col items-center">
          {/* High-Tech Loading Space */}
          {loading && nodes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center my-auto space-y-4 py-20">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-xl">
                  ⚡
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="font-mono text-sm font-bold text-white tracking-wider">
                  INITIALIZING GRIDMIND TELEMETRY
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Connecting to Socket.io stream • MongoDB Localhost
                </p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "home" && (
                <HomePage
                  onLaunchSimulator={() => setActiveTab("grid")}
                  stats={stats}
                  connected={connected}
                />
              )}

              {activeTab === "grid" && (
                <GridMapView
                  nodes={nodes}
                  routes={routes}
                  selectedNode={selectedNode}
                  onSelectNode={setSelectedNode}
                  crisisActive={crisisActive}
                  onReset={resetGrid}
                />
              )}

              {activeTab === "wards" && (
                <WardsTable
                  nodes={nodes}
                  selectedNode={selectedNode}
                  onSelectNode={setSelectedNode}
                  onViewOnMap={() => setActiveTab("grid")}
                />
              )}

              {activeTab === "routes" && (
                <RoutesView
                  routes={routes}
                  nodes={nodes}
                />
              )}

              {activeTab === "auth" && (
                <AuthPage
                  user={user}
                  onAuthSuccess={login}
                  onLogout={logout}
                  backendUrl={backendUrl}
                />
              )}
            </>
          )}
        </main>

        {/* Live Sidebar Controls (Visible in Grid Simulator) */}
        {activeTab === "grid" && !loading && (
          <Sidebar
            stats={stats}
            connected={connected}
            onCrisis={triggerCrisis}
            onReset={resetGrid}
            crisisActive={crisisActive}
            selectedNode={selectedNode}
            onClearSelectedNode={() => setSelectedNode(null)}
          />
        )}
      </div>

      {/* Floating JWT Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={login}
        backendUrl={backendUrl}
      />
    </div>
  );
}
