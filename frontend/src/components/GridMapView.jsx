import GridCanvas from "./GridCanvas";

export default function GridMapView({
  nodes = [],
  routes = [],
  selectedNode = null,
  onSelectNode = () => {},
  crisisActive = false,
  onReset = () => {},
}) {
  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      {/* Active Alerts Banner if grid has issues */}
      {crisisActive && (
        <div className="w-full mb-4 p-3.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🚨</span>
            <div>
              <div className="font-bold text-sm">
                CRITICAL GRID OUTAGE DETECTED
              </div>
              <div className="text-xs text-rose-300">
                Ward substations are offline. Dijkstra algorithm is dynamically rerouting power flows.
              </div>
            </div>
          </div>
          <button
            onClick={onReset}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold transition cursor-pointer"
          >
            Restore Grid
          </button>
        </div>
      )}

      {/* Grid Canvas Header */}
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
        onSelectNode={onSelectNode}
      />
    </div>
  );
}
