export default function NavBar({
  activeTab = "home",
  setActiveTab = () => {},
  connected = false,
  totalNodes = 30,
  activeRoutes = 0,
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between text-slate-100 sticky top-0 z-30 flex-shrink-0">
      {/* Brand */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => setActiveTab("home")}
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-cyan-900/30">
          ⚡
        </div>
        <div>
          <div className="font-extrabold tracking-wider text-base text-white flex items-center gap-1.5">
            GRID<span className="text-cyan-400">MIND</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              v2.0
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Urban Energy Grid Optimizer
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
        <button
          onClick={() => setActiveTab("home")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
            activeTab === "home"
              ? "bg-cyan-600 text-white shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          🏠 Home
        </button>
        <button
          onClick={() => setActiveTab("grid")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
            activeTab === "grid"
              ? "bg-cyan-600 text-white shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          📍 Live Grid Map
        </button>
        <button
          onClick={() => setActiveTab("wards")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
            activeTab === "wards"
              ? "bg-cyan-600 text-white shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          🏢 Wards Directory
        </button>
        <button
          onClick={() => setActiveTab("routes")}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
            activeTab === "routes"
              ? "bg-cyan-600 text-white shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          🧠 Dijkstra Routes ({activeRoutes})
        </button>
      </nav>

      {/* Status Badges */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
          <span>Nodes: <strong className="text-white">{totalNodes}</strong></span>
          <span className="text-slate-600">|</span>
          <span>Flows: <strong className="text-cyan-400">{activeRoutes}</strong></span>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium border ${
            connected
              ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
              : "bg-rose-950/60 border-rose-800 text-rose-300"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
            }`}
          />
          {connected ? "Live Stream: On" : "Reconnecting..."}
        </div>
      </div>
    </header>
  );
}
