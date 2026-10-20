import { useState, useEffect, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import NavBar from "./components/NavBar";

import HomePage from "./pages/HomePage";

const BACKEND_URL = "http://localhost:3000";

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stats, setStats] = useState(null);
  const [connected, setConnected] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const socketRef = useRef(null);

  // Initialize Socket.io connection
  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("⚡ Connected to GRIDMIND Socket.io server:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Disconnected from GRIDMIND server");
      setConnected(false);
    });

    socket.on("grid:update", (data) => {
      if (data.nodes) setNodes(data.nodes);
      if (data.routes) setRoutes(data.routes);
      if (data.stats) setStats(data.stats);

      // Keep selectedNode in sync if updated
      setSelectedNode((prev) => {
        if (!prev) return null;
        return data.nodes?.find((n) => n.id === prev.id) || prev;
      });
    });

    // Fallback initial fetch
    fetch(`${BACKEND_URL}/api/grid`)
      .then((res) => res.json())
      .then((data) => {
        if (data.nodes) setNodes(data.nodes);
        if (data.routes) setRoutes(data.routes);
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => {
        console.warn("Initial REST fetch warning:", err.message);
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  const crisisActive = useMemo(() => {
    return nodes.some((n) => n.disabled);
  }, [nodes]);

  const handleCrisis = async () => {
    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit("grid:crisis");
      } else {
        const res = await fetch(`${BACKEND_URL}/api/crisis`, {
          method: "POST",
        });
        const data = await res.json();
        if (data.nodes) setNodes(data.nodes);
        if (data.routes) setRoutes(data.routes);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to trigger crisis:", err);
    }
  };

  const handleReset = async () => {
    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit("grid:reset");
      } else {
        const res = await fetch(`${BACKEND_URL}/api/reset`, { method: "POST" });
        const data = await res.json();
        if (data.nodes) setNodes(data.nodes);
        if (data.routes) setRoutes(data.routes);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to reset grid:", err);
    }
  };

  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchSearch =
        (node.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        `ward-${node.id + 1}`.includes(searchQuery.toLowerCase()) ||
        node.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === "all" || node.type === filterType;
      return matchSearch && matchType;
    });
  }, [nodes, searchQuery, filterType]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <NavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connected={connected}
        totalNodes={nodes.length}
        activeRoutes={routes.length}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Central Content View */}
        <main className="flex-1 overflow-y-auto p-5 bg-slate-900/30 flex flex-col items-center">
          {/* Active Alerts Banner if grid has issues */}
          {crisisActive && (
            <div className="w-full max-w-5xl mb-4 p-3.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 flex items-center justify-between shadow-lg animate-pulse">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🚨</span>
                <div>
                  <div className="font-bold text-sm">
                    CRITICAL GRID OUTAGE DETECTED
                  </div>
                  <div className="text-xs text-rose-300">
                    2 ward substations are offline. Dijkstra algorithm is
                    dynamically rerouting power flows.
                  </div>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold transition cursor-pointer"
              >
                Restore Grid
              </button>
            </div>
          )}

          {/* TAB 1: Home / Landing Overview */}
          {activeTab === "home" && (
            <HomePage
              onLaunchSimulator={() => setActiveTab("grid")}
              stats={stats}
              connected={connected}
            />
          )}

          {/* TAB 2: Live Interactive Canvas Grid */}
          {activeTab === "grid" && (
            <div className="w-full max-w-5xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
                    ⚡ Live Urban Energy Network
                  </h2>
                  <span className="text-xs text-slate-500">
                    (Click any ward node to inspect)
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  Real-time Dijkstra shortest path routing active
                </div>
              </div>

              <GridCanvas
                nodes={nodes}
                routes={routes}
                width={920}
                height={580}
                selectedNode={selectedNode}
                onSelectNode={(node) => setSelectedNode(node)}
              />
            </div>
          )}

          {/* TAB 3: Wards Monitoring Table */}
          {activeTab === "wards" && (
            <div className="w-full max-w-5xl bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-white">
                    🏢 Ward Substation Directory
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time monitoring across all 30 urban city wards
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search ward name or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">All Types</option>
                    <option value="solar">Solar Farm</option>
                    <option value="battery">Battery Hub</option>
                    <option value="building">Commercial</option>
                    <option value="ev_charger">EV Station</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Ward ID</th>
                      <th className="py-3 px-4">Ward Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Capacity</th>
                      <th className="py-3 px-4">Current Load</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredNodes.map((node) => (
                      <tr
                        key={node.id}
                        className={`hover:bg-slate-900/50 transition cursor-pointer ${
                          selectedNode?.id === node.id ? "bg-cyan-950/30" : ""
                        }`}
                        onClick={() => setSelectedNode(node)}
                      >
                        <td className="py-3 px-4 font-mono text-cyan-400">
                          #{node.id + 1}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {node.name || `Ward ${node.id + 1}`}
                        </td>
                        <td className="py-3 px-4 uppercase text-[10px] font-mono">
                          <span
                            className={`px-2 py-0.5 rounded ${
                              node.type === "solar"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : node.type === "battery"
                                  ? "bg-amber-950 text-amber-400 border border-amber-800"
                                  : node.type === "building"
                                    ? "bg-blue-950 text-blue-400 border border-blue-800"
                                    : "bg-purple-950 text-purple-400 border border-purple-800"
                            }`}
                          >
                            {node.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {node.capacity} kW
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${node.load}%`,
                                  backgroundColor:
                                    node.load > 80
                                      ? "#ef4444"
                                      : node.load < 40
                                        ? "#10b981"
                                        : "#38bdf8",
                                }}
                              />
                            </div>
                            <span
                              className={`font-mono font-bold ${
                                node.load > 80
                                  ? "text-rose-400"
                                  : node.load < 40
                                    ? "text-emerald-400"
                                    : "text-slate-300"
                              }`}
                            >
                              {node.load}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {node.disabled ? (
                            <span className="text-rose-400 font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                              Offline Outage
                            </span>
                          ) : node.load > 80 ? (
                            <span className="text-amber-400 font-semibold">
                              Deficit / High Load
                            </span>
                          ) : node.load < 40 ? (
                            <span className="text-emerald-400 font-semibold">
                              Surplus Power
                            </span>
                          ) : (
                            <span className="text-slate-400">Normal</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedNode(node);
                              setActiveTab("grid");
                            }}
                            className="px-2 py-1 bg-slate-800 hover:bg-cyan-900 text-cyan-300 rounded text-xs transition cursor-pointer"
                          >
                            View on Map
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Dijkstra Energy Routing Breakdown */}
          {activeTab === "routes" && (
            <div className="w-full max-w-5xl bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🧠</span> Active Dijkstra Optimized Energy Routes
                </h2>
                <p className="text-xs text-slate-400">
                  Dynamic routing transfers energy from surplus generators
                  (&lt;40% load) to deficit areas (&gt;70% load) along
                  minimum-distance paths.
                </p>
              </div>

              {routes.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No energy rerouting required at this moment (all nodes
                  balanced).
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {routes.map((route, idx) => {
                    const fromNode = nodes.find((n) => n.id === route.from);
                    const toNode = nodes.find((n) => n.id === route.to);
                    return (
                      <div
                        key={idx}
                        className="bg-slate-900/70 border border-slate-800 rounded-lg p-3.5 hover:border-cyan-500/50 transition flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-bold text-cyan-400">
                            Route #{idx + 1}
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            Flow: {route.flow} kW
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs mb-2">
                          <div className="flex-1 bg-slate-950 p-2 rounded border border-slate-800">
                            <div className="text-[10px] text-emerald-400 font-mono uppercase">
                              Surplus Source
                            </div>
                            <div className="font-semibold text-white truncate">
                              {fromNode?.name || `Ward ${route.from + 1}`}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Load: {fromNode?.load}% ({fromNode?.type})
                            </div>
                          </div>

                          <div className="text-cyan-400 font-bold text-base">
                            ➔
                          </div>

                          <div className="flex-1 bg-slate-950 p-2 rounded border border-slate-800">
                            <div className="text-[10px] text-rose-400 font-mono uppercase">
                              Deficit Target
                            </div>
                            <div className="font-semibold text-white truncate">
                              {toNode?.name || `Ward ${route.to + 1}`}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Load: {toNode?.load}% ({toNode?.type})
                            </div>
                          </div>
                        </div>

                        {route.path && route.path.length > 0 && (
                          <div className="text-[11px] text-slate-400 font-mono bg-slate-950/60 p-1.5 rounded flex items-center gap-1 overflow-x-auto">
                            <span className="text-slate-500">Path:</span>
                            {route.path.map((nodeId, pIdx) => (
                              <span key={pIdx} className="flex items-center">
                                <span className="text-cyan-300">
                                  W-{nodeId + 1}
                                </span>
                                {pIdx < route.path.length - 1 && (
                                  <span className="text-slate-600 mx-1">→</span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Real-time Right Sidebar (shown when in grid simulator or inspecting) */}
        {activeTab === "grid" && (
          <Sidebar
            stats={stats}
            connected={connected}
            onCrisis={handleCrisis}
            onReset={handleReset}
            crisisActive={crisisActive}
            selectedNode={selectedNode}
            onClearSelectedNode={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
}
