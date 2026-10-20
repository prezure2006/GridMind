export default function HomePage({ onLaunchSimulator, stats, connected }) {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-16 text-slate-100">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="text-center relative py-12 px-6 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Background glow orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-medium shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Next-Gen Smart City Infrastructure
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Optimize Urban Energy in{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Real Time
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            <strong className="text-white">GRIDMIND</strong> continuously balances energy distribution across city wards using <strong>Dijkstra’s shortest path algorithm</strong> and streams live telemetry via <strong>Socket.io</strong> to eliminate power waste and prevent blackouts.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onLaunchSimulator}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>⚡</span> Launch Live Grid Simulator
            </button>
            <a
              href="#architecture"
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition duration-200 flex items-center gap-2"
            >
              <span>🔍</span> Explore Architecture
            </a>
          </div>

          {/* Mini Live Ticker */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">CONNECTED WARDS</div>
              <div className="text-2xl font-bold font-mono text-cyan-400">30 Nodes</div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">OPTIMIZATION ALGO</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">Dijkstra</div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">STREAM LATENCY</div>
              <div className="text-2xl font-bold font-mono text-cyan-400">&lt; 50ms</div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">SOCKET STATUS</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                {connected ? "LIVE" : "SYNC"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Problem vs Solution Section ───────────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Why GridMind Matters
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Transforming Fragile Power Grids into Intelligent Systems
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problem Card */}
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/50 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800 flex items-center justify-center text-xl">
                ⚠️
              </div>
              <div>
                <h4 className="font-bold text-rose-200 text-lg">The Problem</h4>
                <p className="text-xs text-rose-400 font-mono">Traditional Municipal Grids</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold mt-0.5">✕</span>
                <span><strong>Zero real-time visibility:</strong> Municipalities cannot monitor live ward-by-ward consumption spikes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold mt-0.5">✕</span>
                <span><strong>Unbalanced distribution:</strong> Solar surplus in one neighborhood is wasted while industrial wards face brownouts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold mt-0.5">✕</span>
                <span><strong>Unannounced blackout cascades:</strong> No dynamic rerouting when a transformer or node fails.</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/50 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-xl">
                ⚡
              </div>
              <div>
                <h4 className="font-bold text-emerald-200 text-lg">The GRIDMIND Solution</h4>
                <p className="text-xs text-emerald-400 font-mono">Autonomous Real-Time Balancing</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong>Real-time ward telemetry:</strong> Socket.io broadcasts consumption updates to all connected operators every 5s.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong>Dijkstra shortest-path routing:</strong> Automates lowest-resistance energy flow from surplus nodes to deficit areas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span><strong>Self-healing crisis response:</strong> Simulates substation outages and recalculates alternative power paths in &lt;100ms.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Core Features ─────────────────────────────────────────────────── */}
      <section id="architecture" className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            System Capabilities
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Built for Hackathons, Smart Cities, and High-Scale Interviews
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition duration-300 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-2xl">
              📍
            </div>
            <h4 className="text-lg font-bold text-white">30-Ward Mesh Topology</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive high-performance 2D Canvas rendering nodes across city zones with animated energy vectors and load indicators.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition duration-300 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-2xl">
              🧠
            </div>
            <h4 className="text-lg font-bold text-white">Dijkstra Shortest Path</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Graph algorithm evaluates Euclidean distance weights between surplus generation units (&lt;40% load) and deficit consumers (&gt;70% load).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition duration-300 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-2xl">
              🔄
            </div>
            <h4 className="text-lg font-bold text-white">Socket.io Multi-User Sync</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full duplex WebSocket event streaming ensures all operators, control rooms, and judges view synchronized live telemetry simultaneously.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition duration-300 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-2xl">
              🚨
            </div>
            <h4 className="text-lg font-bold text-white">Outage Crisis Simulator</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulates real-world transformer failure by disabling random nodes and instantly rerouting active flows around damaged substations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition duration-300 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center text-2xl">
              📊
            </div>
            <h4 className="text-lg font-bold text-white">Health & Waste Telemetry</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes continuous grid health score, waste rate percentage, average load, and identifies top overloaded hotspots.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition duration-300 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-800 flex items-center justify-center text-2xl">
              🗄️
            </div>
            <h4 className="text-lg font-bold text-white">MongoDB Persistence</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Saves periodic grid snapshots and historical state for audit logging, reporting, and ward database CRUD management.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Node Types Breakdown ──────────────────────────────────────────── */}
      <section className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Energy Node Classifications</h3>
            <p className="text-xs text-slate-400">Urban infrastructure elements modeled within the grid engine</p>
          </div>
          <button
            onClick={onLaunchSimulator}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition"
          >
            View Live on Map ➔
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400">SOLAR FARM</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-sm font-semibold text-white">80–200 kW Capacity</div>
            <p className="text-[11px] text-slate-400">Primary energy source with surplus generation (10–40% base load).</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-amber-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">BATTERY STORAGE</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            </div>
            <div className="text-sm font-semibold text-white">100–300 kW Capacity</div>
            <p className="text-[11px] text-slate-400">Buffer storage charging during off-peak and discharging under stress.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-blue-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-400">COMMERCIAL WARD</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            </div>
            <div className="text-sm font-semibold text-white">50–150 kW Capacity</div>
            <p className="text-[11px] text-slate-400">High-demand consumer zone (60–95% load) requiring regular power supply.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400">EV CHARGER HUB</span>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            </div>
            <div className="text-sm font-semibold text-white">20–80 kW Capacity</div>
            <p className="text-[11px] text-slate-400">Dynamic fast-charging station subject to rapid load fluctuations.</p>
          </div>
        </div>
      </section>

      {/* ─── Footer / Pitch ────────────────────────────────────────────────── */}
      <footer className="text-center py-8 border-t border-slate-800 text-xs text-slate-500 space-y-2">
        <div className="font-bold text-slate-300 font-display text-sm tracking-wider">
          GRID<span className="text-cyan-400">MIND</span> — Real-Time Urban Energy Grid Optimizer
        </div>
        <p>Built with Node.js, Express, Socket.io, React 19, Vite, and Tailwind CSS.</p>
      </footer>
    </div>
  );
}
