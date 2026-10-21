import { useState } from "react";

export default function AuthPage({
  user,
  onAuthSuccess,
  onLogout,
  backendUrl = "http://localhost:3001",
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("operator");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already logged in, show their active session card
  if (user) {
    return (
      <div className="w-full max-w-xl mx-auto my-8 p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl text-slate-100 space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-cyan-600 to-emerald-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-cyan-900/30">
              {user.name ? user.name.charAt(0).toUpperCase() : "O"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-xs text-slate-400 font-mono">{user.email}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
            {user.role || "Operator"}
          </span>
        </div>

        <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">Authentication Protocol:</span>
            <span className="font-mono text-cyan-400 font-semibold">
              JWT (HS256)
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">Database Storage:</span>
            <span className="font-mono text-emerald-400 font-semibold">
              MongoDB (127.0.0.1:27017)
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">Password Security:</span>
            <span className="font-mono text-emerald-400 font-semibold">
              Bcrypt Hashed (Salt 10)
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">Token Storage:</span>
            <span className="font-mono text-cyan-300">
              localStorage.getItem('gridmind_token')
            </span>
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-800 text-rose-300 hover:text-white font-semibold text-xs tracking-wider uppercase transition cursor-pointer"
          >
            Sign Out of Operator Session
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin
      ? { email, password }
      : { name, email, password, role };

    try {
      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Store in localStorage
      localStorage.setItem("gridmind_token", data.token);
      localStorage.setItem("gridmind_user", JSON.stringify(data.user));

      setSuccessMsg(
        isLogin ? "Signed in successfully!" : "Account created successfully!",
      );
      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token);
      }
    } catch (err) {
      setError(
        err.message || "Failed to communicate with authentication server",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl text-slate-100">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-tr from-cyan-600 to-emerald-500 text-2xl font-bold shadow-lg shadow-cyan-900/30 mb-3">
          🔐
        </div>
        <h2 className="text-2xl font-bold text-white tracking-wide">
          {isLogin ? "Grid Operator Sign In" : "Register Operator Account"}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          JWT Token • Bcrypt Hash • Connected to Localhost MongoDB
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 mb-5 bg-slate-900 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true);
            setError("");
            setSuccessMsg("");
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
            setSuccessMsg("");
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

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <span>✓</span>
          <span>{successMsg}</span>
        </div>
      )}

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
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
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
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
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
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
          {!isLogin && (
            <span className="text-[10px] text-slate-500 mt-1 block">
              Bcrypt hashed before saving to MongoDB (min 6 characters)
            </span>
          )}
        </div>

        {!isLogin && (
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Operator Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
            >
              <option value="operator">
                Grid Operator (Monitor & Crisis Control)
              </option>
              <option value="admin">Grid Administrator (Full Access)</option>
              <option value="viewer">Telemetry Viewer (Read Only)</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-900/30 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : isLogin ? (
            "Sign In to Grid"
          ) : (
            "Create & Store in MongoDB"
          )}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-slate-900 text-center text-[11px] text-slate-500 font-mono">
        JWT saved to <code className="text-cyan-400">localStorage</code>
      </div>
    </div>
  );
}
