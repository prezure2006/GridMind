import { useEffect, useRef, useState } from "react";

// Node type → fill color mapping
const NODE_COLORS = {
  solar: "#22c55e", // green
  battery: "#eab308", // yellow
  building: "#3b82f6", // blue
  grid: "#38bdf8", // cyan/blue
  ev_charger: "#a855f7", // purple
};

const NODE_GLOW = {
  solar: "rgba(34,197,94,0.4)",
  battery: "rgba(234,179,8,0.4)",
  building: "rgba(59,130,246,0.4)",
  grid: "rgba(56,189,248,0.4)",
  ev_charger: "rgba(168,85,247,0.4)",
};

/** Draw an arrowhead at a point along the route line */
function drawArrow(ctx, x, y, angle, color) {
  const len = 10;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-len, -len * 0.5);
  ctx.lineTo(-len, len * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Main canvas renderer */
export default function GridCanvas({
  nodes = [],
  routes = [],
  width = 900,
  height = 580,
  selectedNode = null,
  onSelectNode = () => {},
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Handle canvas click to select node
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const clicked = nodes.find(
      (n) => Math.hypot((n.x || 0) - clickX, (n.y || 0) - clickY) <= 24
    );
    onSelectNode(clicked || null);
  };

  // Handle mouse move for hover detection
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const hovered = nodes.find(
      (n) => Math.hypot((n.x || 0) - mouseX, (n.y || 0) - mouseY) <= 24
    );
    setHoveredNode(hovered || null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !nodes.length) return;
    const ctx = canvas.getContext("2d");

    const nodeMap = {};
    nodes.forEach((n) => {
      nodeMap[n.id] = n;
    });

    let frame = 0;

    function render() {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // ── Background grid lines ──────────────────────────────────────────────
      ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ── Draw energy flow routes ────────────────────────────────────────────
      routes.forEach((route) => {
        const path = route.path || [route.from, route.to];
        if (path.length < 2) return;

        for (let i = 0; i < path.length - 1; i++) {
          const a = nodeMap[path[i]];
          const b = nodeMap[path[i + 1]];
          if (!a || !b || a.x === undefined || b.x === undefined) continue;

          const dx = b.x - a.x;
          const dy = b.y - a.y;

          // Animated dashed route line
          ctx.save();
          ctx.strokeStyle = "rgba(6, 182, 212, 0.65)";
          ctx.lineWidth = 2.5;
          ctx.setLineDash([8, 6]);
          ctx.lineDashOffset = -((frame * 0.8) % 40);
          ctx.shadowColor = "#06b6d4";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();

          // Flow Direction Arrow
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const angle = Math.atan2(dy, dx);
          drawArrow(ctx, mx, my, angle, "#22d3ee");
        }
      });

      // ── Draw nodes ────────────────────────────────────────────────────────
      nodes.forEach((node) => {
        const { id, type = "building", load = 50, disabled, name } = node;
        const x = node.x ?? 100;
        const y = node.y ?? 100;

        const color = NODE_COLORS[type] || "#94a3b8";
        const glowColor = NODE_GLOW[type] || "rgba(148,163,184,0.3)";
        const isOverloaded = load > 80 && !disabled;
        const isSelected = selectedNode && selectedNode.id === id;
        const isHovered = hoveredNode && hoveredNode.id === id;
        const radius = isSelected ? 22 : isHovered ? 20 : 18;

        ctx.save();

        if (disabled) {
          // Faded disabled node (Outage Simulation)
          ctx.globalAlpha = 0.35 + 0.15 * Math.sin(frame * 0.1);
          ctx.strokeStyle = "#ef4444";
          ctx.fillStyle = "#1e293b";
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Outage cross
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 2.5;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(x - 8, y - 8);
          ctx.lineTo(x + 8, y + 8);
          ctx.moveTo(x + 8, y - 8);
          ctx.lineTo(x - 8, y + 8);
          ctx.stroke();
        } else {
          // Glow effect
          if (isSelected) {
            ctx.shadowColor = "#38bdf8";
            ctx.shadowBlur = 20;
          } else if (isOverloaded) {
            const pulse = 0.5 + 0.5 * Math.sin(frame * 0.15);
            ctx.shadowColor = "#ef4444";
            ctx.shadowBlur = 14 + pulse * 14;
          } else {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = isHovered ? 15 : 8;
          }

          // Node body
          ctx.fillStyle = isOverloaded ? "#450a0a" : "#0f172a";
          ctx.strokeStyle = isSelected
            ? "#38bdf8"
            : isOverloaded
            ? "#ef4444"
            : color;
          ctx.lineWidth = isSelected ? 3.5 : isOverloaded ? 2.5 : 2;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Inner fill circle representing load percentage
          const loadFrac = Math.min(1, Math.max(0.1, (load || 0) / 100));
          ctx.fillStyle = isOverloaded ? "#ef444488" : color + "66";
          ctx.beginPath();
          ctx.arc(x, y, radius * loadFrac * 0.75, 0, Math.PI * 2);
          ctx.fill();

          // Node Icon / Short code
          ctx.fillStyle = isOverloaded ? "#fca5a5" : "#ffffff";
          ctx.font = "bold 9px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowBlur = 0;

          const abbr = {
            solar: "SOL",
            battery: "BAT",
            building: "BLD",
            grid: "GRID",
            ev_charger: "EV",
          };
          ctx.fillText(abbr[type] || "W", x, y);
        }

        // Ward Name & Load % label below node
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.fillStyle = disabled
          ? "#ef4444"
          : load > 80
          ? "#f87171"
          : "#94a3b8";
        ctx.font = isSelected ? "bold 10px sans-serif" : "9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(
          disabled ? "OFFLINE" : `${load}%`,
          x,
          y + radius + 4
        );

        // Subtitle (Ward ID / Short Name)
        ctx.fillStyle = "#64748b";
        ctx.font = "8px sans-serif";
        ctx.fillText(name || `W-${id + 1}`, x, y - radius - 11);

        ctx.restore();
      });

      animRef.current = requestAnimationFrame(render);
    }

    render();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [nodes, routes, width, height, selectedNode, hoveredNode]);

  return (
    <div className="relative rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm overflow-hidden shadow-2xl">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="cursor-pointer max-w-full h-auto"
      />
      {hoveredNode && (
        <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: NODE_COLORS[hoveredNode.type] || "#38bdf8" }}
          />
          <span className="font-semibold">{hoveredNode.name || `Ward ${hoveredNode.id + 1}`}</span>
          <span className="text-slate-400">({hoveredNode.type})</span>
          <span className="font-mono text-cyan-400">{hoveredNode.load}% Load</span>
        </div>
      )}
    </div>
  );
}
