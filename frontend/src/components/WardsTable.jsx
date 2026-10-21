import { useState, useMemo } from "react";

export default function WardsTable({
  nodes = [],
  selectedNode = null,
  onSelectNode = () => {},
  onViewOnMap = () => {},
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchSearch =
        (node.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        `ward-${node.id + 1}`.includes(searchQuery.toLowerCase()) ||
        (node.type || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === "all" || node.type === filterType;
      return matchSearch && matchType;
    });
  }, [nodes, searchQuery, filterType]);

  return (
    <div className="w-full max-w-5xl bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-white">
            🏢 Ward Substation Directory
          </h2>
          <p className="text-xs text-slate-400">
            Real-time monitoring across all urban city wards
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
            <option value="grid">Main Grid</option>
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
                onClick={() => onSelectNode(node)}
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
                        : node.type === "building" || node.type === "grid"
                        ? "bg-blue-950 text-blue-400 border border-blue-800"
                        : "bg-purple-950 text-purple-400 border border-purple-800"
                    }`}
                  >
                    {node.type}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono">{node.capacity || 100} kW</td>
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
                              : node.load < 50
                              ? "#10b981"
                              : "#38bdf8",
                        }}
                      />
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        node.load > 80
                          ? "text-rose-400"
                          : node.load < 50
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
                  ) : node.load < 50 ? (
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
                      onSelectNode(node);
                      onViewOnMap(node);
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
  );
}
