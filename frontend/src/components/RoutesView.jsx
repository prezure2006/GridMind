export default function RoutesView({ routes = [], nodes = [] }) {
  return (
    <div className="w-full max-w-5xl bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="mb-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>🧠</span> Active Dijkstra Optimized Energy Routes
        </h2>
        <p className="text-xs text-slate-400">
          Dynamic routing transfers energy from surplus generators (&lt;50% load) to deficit areas (&gt;70% load) along minimum-distance paths.
        </p>
      </div>

      {routes.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          No energy rerouting required at this moment (all nodes balanced).
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

                  <div className="text-cyan-400 font-bold text-base">➔</div>

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
                        <span className="text-cyan-300">W-{nodeId + 1}</span>
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
  );
}
