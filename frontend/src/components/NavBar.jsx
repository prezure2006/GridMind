export default function NavBar({
  activeTab = "home",
  setActiveTab = () => {},
  connected = false,
  totalNodes = 30,
  activeRoutes = 0,
  user = null,
  onOpenAuth = () => {},
  onLogout = () => {},
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-yellow-900/60 backdrop-blur-md px-6 flex items-center justify-between text-slate-100 sticky top-0 z-30 shrink-0">
      {/* Brand */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => setActiveTab("home")}
      >
        <div className=" border-5 border-yellow-500">
          <div className="font-extrabold tracking-wider text-base text-white flex items-center gap-1.5">
            GRID MIND
          </div>
          <div className="text-[11px] text-white-400">
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

      {/* User Auth & Status Badges */}
      <div className="flex items-center gap-3">
        {/* Socket live stream status */}
        <div
          className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
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
          {connected ? "Live Socket" : "Offline"}
        </div>

        {/* User Account / Auth Section */}
        {user ? (
          <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700 text-cyan-300 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
              {user.name ? user.name.charAt(0) : "U"}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">
                {user.name}
              </div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                {user.role || "Operator"}
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="ml-1 text-slate-400 hover:text-rose-400 text-xs p-1 rounded hover:bg-slate-800 transition cursor-pointer"
            >
              🚪
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-bold shadow-md shadow-cyan-900/30 transition cursor-pointer active:scale-95"
          >
            <span>🔐</span>
            <span>Operator Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
