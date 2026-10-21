import { useState } from "react";

export default function AuthModal({ isOpen, onClose, onAuthSuccess, backendUrl }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("operator");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin
      ? { email, password }
      : { name, email, password, role };

    try {
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Store JWT token and user info in localStorage
      localStorage.setItem("gridmind_token", data.token);
      localStorage.setItem("gridmind_user", JSON.stringify(data.user));

      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to connect to authentication service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-900 cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-2xl font-bold shadow-lg shadow-cyan-900/30 mb-3">
            🔐
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {isLogin ? "Operator Sign In" : "Register Grid Account"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            JWT Authenticated • Real-Time Grid Access • Local MongoDB
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 mb-5 bg-slate-900/90 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              isLogin
                ? "bg-cyan-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              !isLogin
                ? "bg-cyan-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Operator Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@gridmind.io"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
            {!isLogin && (
              <span className="text-[10px] text-slate-500 mt-1 block">
                Bcrypt hashed (minimum 6 characters)
              </span>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Access Level / Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="operator">Grid Operator (Monitor & Crisis Control)</option>
                <option value="admin">Grid Administrator (Full Access)</option>
                <option value="viewer">Telemetry Viewer (Read Only)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-900/30 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : isLogin ? (
              "Sign In to Grid"
            ) : (
              "Create & Hash Account"
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-900 text-center text-[11px] text-slate-500 font-mono">
          Tokens stored securely in <code className="text-cyan-400">localStorage</code>
        </div>
      </div>
    </div>
  );
}
