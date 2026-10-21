// Sidebar — displays live grid health stats, selected node inspect, and control buttons

const TYPE_COLORS = {
  solar: "text-green-400",
  battery: "text-yellow-400",
  building: "text-blue-400",
  grid: "text-blue-400",
  ev_charger: "text-purple-400",
};

const TYPE_LABELS = {
  solar: "Solar Farm",
  battery: "Battery Storage",
  building: "Commercial / Building",
  grid: "Main Grid Substation",
  ev_charger: "EV Fast Charger",
};

/** Animated health bar */
function HealthBar({ value = 0, color = "#00d4ff" }) {
  return (
    <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
      <div
        className="h-2.5 rounded-full transition-all duration-700"
        style={{
          width: `${value}%`,
          background:
            value > 70
              ? `linear-gradient(90deg, #10b981, #06b6d4)`
              : value > 40
              ? "linear-gradient(90deg, #eab308, #f59e0b)"
              : "linear-gradient(90deg, #ef4444, #dc2626)",
          boxShadow: `0 0 10px ${
            value > 70 ? "#06b6d480" : value > 40 ? "#eab30880" : "#ef444480"
          }`,
        }}
      />
    </div>
  );
}

/** Single stat box */
function StatBox({ label, value, unit = "", sub }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition">
      <div className="text-[10px] text-slate-400 mb-1 font-mono uppercase tracking-wider">
        {label}
      </div>
      <div className="text-xl font-bold text-cyan-400 font-mono">
        {value}
        <span className="text-xs text-slate-400 ml-1">{unit}</span>
      </div>
      {sub && <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function Sidebar({
  stats,
  connected,
  onCrisis,
  onReset,
  crisisActive,
  selectedNode,
  onClearSelectedNode,
}) {
  if (!stats) {
    return (
      <aside className="w-80 h-full flex flex-col items-center justify-center p-6 text-slate-500 bg-slate-950 border-l border-slate-800">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <div className="text-sm font-medium">Connecting to Socket.io Grid...</div>
      </aside>
    );
  }

  const {
    efficiency = 85,
    wastePercent = 15,
    avgLoad = 55,
    activeRoutes = 0,
    topWasteful = [],
    totalNodes = 32,
    overloadedNodes = 0,
  } = stats;

  const healthScore = Math.round(efficiency);

  return (
    <aside className="w-84 h-full flex flex-col bg-slate-950 border-l border-slate-800 overflow-y-auto text-slate-100">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connected
                  ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
              } animate-pulse`}
            />
            <span className="text-xs font-mono font-semibold tracking-wide text-slate-300">
              {connected ? "LIVE SOCKET FEED" : "DISCONNECTED"}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            5s Tick
          </span>
        </div>
        <h2 className="text-lg font-bold tracking-wider text-white">
          GRID<span className="text-cyan-400">MIND</span> CONTROL
        </h2>
        <p className="text-xs text-slate-400">Urban Real-Time Energy Optimizer</p>
      </div>

      {/* Selected Node Details Card (if clicked) */}
      {selectedNode && (
        <div className="p-4 border-b border-cyan-900/50 bg-cyan-950/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold">
              🔍 Ward Inspector
            </span>
            <button
              onClick={onClearSelectedNode}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-white text-sm">
                  {selectedNode.name || `Ward ${selectedNode.id + 1}`}
                </div>
                <div className={`text-xs ${TYPE_COLORS[selectedNode.type] || "text-slate-400"}`}>
                  {TYPE_LABELS[selectedNode.type] || selectedNode.type}
                </div>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded font-mono ${
                  selectedNode.disabled
                    ? "bg-rose-950 text-rose-400 border border-rose-800"
                    : selectedNode.load > 80
                    ? "bg-amber-950 text-amber-400 border border-amber-800"
                    : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                }`}
              >
                {selectedNode.disabled ? "OFFLINE" : `${selectedNode.load}% LOAD`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800">
              <div>
                <span className="text-slate-500">Capacity: </span>
                <span className="font-mono text-slate-200">{selectedNode.capacity} kW</span>
              </div>
              <div>
                <span className="text-slate-500">Current Load: </span>
                <span className="font-mono text-cyan-300">
                  {Math.round(((selectedNode.capacity || 100) * (selectedNode.load || 0)) / 100)} kW
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Health Score */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
            Overall Health
          </span>
          <span
            className={`text-lg font-bold font-mono ${
              healthScore > 70
                ? "text-emerald-400"
                : healthScore > 40
                ? "text-amber-400"
                : "text-rose-400"
            }`}
          >
            {healthScore}%
          </span>
        </div>
        <HealthBar value={healthScore} />
        <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
          {healthScore > 70
            ? "🟢 Grid optimized & balanced"
            : healthScore > 40
            ? "🟡 Stress detected, rerouting"
            : "🔴 Critical failure — intervention required"}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-2 border-b border-slate-800/80">
        <StatBox label="Waste Rate" value={wastePercent} unit="%" sub="overloaded" />
        <StatBox label="Active Routes" value={activeRoutes} sub="Dijkstra flows" />
        <StatBox label="Avg Load" value={avgLoad} unit="%" sub="system wide" />
        <StatBox
          label="Overloaded"
          value={overloadedNodes}
          unit={`/${totalNodes}`}
          sub="nodes"
        />
      </div>

      {/* Top Wasteful Hotspots */}
      <div className="p-4 border-b border-slate-800/80">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <span>⚠️</span> High Load Hotspots
        </h3>
        {topWasteful && topWasteful.length > 0 ? (
          <div className="space-y-1.5">
            {topWasteful.map((node, i) => (
              <div
                key={node.id}
                className="flex items-center justify-between bg-slate-900/70 border border-slate-800 rounded-lg px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">#{i + 1}</span>
                  <div>
                    <div className="font-semibold text-slate-200">
                      {node.name || `Ward ${node.id + 1}`}
                    </div>
                    <div className={`text-[10px] ${TYPE_COLORS[node.type] || "text-slate-400"}`}>
                      {TYPE_LABELS[node.type] || node.type}
                    </div>
                  </div>
                </div>
                <div className="text-rose-400 font-mono font-bold">{node.load}%</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No overloaded hotspots detected</p>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-b border-slate-800/80">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
          Grid Node Types
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            <span className="text-slate-300">Solar (Gen)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
            <span className="text-slate-300">Battery Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
            <span className="text-slate-300">Commercial</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]" />
            <span className="text-slate-300">EV Station</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_6px_#ef4444]" />
            <span className="text-slate-300">Overloaded</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-cyan-400" />
            <span className="text-slate-300">Energy Path</span>
          </div>
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="p-4 space-y-2.5 mt-auto bg-slate-900/60 border-t border-slate-800">
        <button
          onClick={onCrisis}
          disabled={crisisActive}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            crisisActive
              ? "bg-rose-950/60 border border-rose-800/80 text-rose-300 cursor-not-allowed"
              : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 active:scale-95"
          }`}
        >
          <span>⚡</span>
          {crisisActive ? "Crisis Outage Active" : "Simulate Crisis Outage"}
        </button>

        <button
          onClick={onReset}
          className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs tracking-wide uppercase bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>↺</span>
          Reset & Optimize Grid
        </button>

        <div className="text-[11px] text-slate-500 text-center font-mono pt-1">
          Socket.io Auto-Sync active across all connected tabs
        </div>
      </div>
    </aside>
  );
}
