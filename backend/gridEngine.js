// ─── Grid Engine ─────────────────────────────────────────────────────────────
// Handles node creation, load simulation, and Dijkstra-based route finding

const NODE_TYPES = ["solar", "battery", "building", "ev_charger"];

// Type-specific capacity ranges (kW)
const CAPACITY_RANGES = {
  solar: [80, 200],
  battery: [100, 300],
  building: [50, 150],
  ev_charger: [20, 80],
};

// Type-specific base load ranges (% of capacity)
const BASE_LOAD = {
  solar: [10, 40], // solar usually has excess (low load = generating)
  battery: [30, 70],
  building: [60, 95], // buildings consume heavily
  ev_charger: [40, 90],
};

const WARD_NAMES = [
  "North Ward", "Civic Center", "Harbor District", "Tech Park", "Uptown",
  "West End", "Solar Field A", "Battery Hub 1", "Downtown Hub", "Metro Station",
  "East Side", "Industrial Zone", "Greenway", "Substation 4", "Marina Bay",
  "South Ridge", "Solar Field B", "Battery Hub 2", "Financial District", "EV Station Central",
  "Old Quarter", "Midtown", "Innovation Campus", "Riverfront", "Heights District",
  "University Quarter", "Warehouse District", "Battery Hub 3", "Residential Zone", "Transit Hub"
];

/** Generate 30 grid nodes laid out in a responsive 6x5 grid pattern */
function generateNodes() {
  const nodes = [];
  const types = [];

  // Ensure a mix: ~6 solar, ~6 battery, ~10 building, ~8 ev_charger
  for (let i = 0; i < 6; i++) types.push("solar");
  for (let i = 0; i < 6; i++) types.push("battery");
  for (let i = 0; i < 10; i++) types.push("building");
  for (let i = 0; i < 8; i++) types.push("ev_charger");

  // Shuffle types array
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }

  for (let i = 0; i < 30; i++) {
    const type = types[i];
    const [capMin, capMax] = CAPACITY_RANGES[type];
    const [loadMin, loadMax] = BASE_LOAD[type];
    const capacity = capMin + Math.random() * (capMax - capMin);
    const load = loadMin + Math.random() * (loadMax - loadMin);

    // Spread nodes across a 6 cols × 5 rows grid with slight jitter
    const col = i % 6;
    const row = Math.floor(i / 6);

    nodes.push({
      id: i,
      name: WARD_NAMES[i] || `Ward-${i + 1}`,
      type,
      load: Math.round(load),
      capacity: Math.round(capacity),
      x: 70 + col * 135 + (Math.random() - 0.5) * 30,
      y: 60 + row * 110 + (Math.random() - 0.5) * 20,
      disabled: false,
    });
  }

  return nodes;
}

/** Slightly randomize each node's load each tick to simulate real-time fluctuation */
function updateLoads(nodes) {
  return nodes.map((node) => {
    if (node.disabled) return node;

    const delta = (Math.random() - 0.5) * 8; // ±4% swing
    const newLoad = Math.min(100, Math.max(5, node.load + delta));

    return { ...node, load: Math.round(newLoad) };
  });
}

/** Build adjacency list — each node connects to its 5 nearest neighbours */
function buildGraph(nodes) {
  const graph = {};

  nodes.forEach((a) => {
    graph[a.id] = [];
    const dists = nodes
      .filter((b) => b.id !== a.id)
      .map((b) => ({
        id: b.id,
        dist: Math.hypot(a.x - b.x, a.y - b.y),
      }))
      .sort((x, y) => x.dist - y.dist)
      .slice(0, 5); // connect to 5 nearest

    dists.forEach(({ id, dist }) => {
      graph[a.id].push({ to: id, weight: dist });
    });
  });

  return graph;
}

/** Dijkstra shortest path — returns path array or null if unreachable */
function dijkstra(graph, startId, endId) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  const queue = [];

  Object.keys(graph).forEach((id) => {
    dist[id] = Infinity;
  });
  dist[startId] = 0;
  queue.push({ id: startId, d: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.d - b.d);
    const { id: current } = queue.shift();

    if (visited.has(current)) continue;
    visited.add(current);

    if (current == endId) break;

    for (const { to, weight } of graph[current] || []) {
      if (visited.has(to)) continue;
      const newDist = dist[current] + weight;
      if (newDist < dist[to]) {
        dist[to] = newDist;
        prev[to] = current;
        queue.push({ id: to, d: newDist });
      }
    }
  }

  if (dist[endId] === Infinity) return null;
  const path = [];
  let cur = String(endId);
  while (cur !== undefined) {
    path.unshift(Number(cur));
    cur = prev[cur];
  }
  return path;
}

/** Find surplus nodes (load < 40) and deficit nodes (load > 70), route energy between them */
function calculateRoutes(nodes) {
  const activeNodes = nodes.filter((n) => !n.disabled);
  const graph = buildGraph(activeNodes);

  const surplus = activeNodes.filter((n) => n.load < 40); // generating excess
  const deficit = activeNodes.filter((n) => n.load > 70); // need power

  const routes = [];

  surplus.forEach((src) => {
    deficit.forEach((dst) => {
      const path = dijkstra(graph, src.id, dst.id);
      if (path && path.length > 1) {
        const flow = Math.round(((40 - src.load) * src.capacity) / 100); // kW available
        routes.push({ from: src.id, to: dst.id, path, flow });
      }
    });
  });

  // Deduplicate — keep only shortest route per deficit node
  const seen = new Set();
  return routes
    .filter((r) => {
      if (seen.has(r.to)) return false;
      seen.add(r.to);
      return true;
    })
    .slice(0, 15); // cap at 15 routes
}

/** Calculate grid health stats */
function calculateStats(nodes, routes) {
  const active = nodes.filter((n) => !n.disabled);
  if (!active.length) {
    return {
      efficiency: 0,
      wastePercent: 100,
      avgLoad: 0,
      activeRoutes: 0,
      topWasteful: [],
      totalNodes: nodes.length,
      overloadedNodes: 0,
    };
  }

  const avgLoad = active.reduce((s, n) => s + n.load, 0) / active.length;
  const overloaded = active.filter((n) => n.load > 80).length;
  const wastePercent = Math.round((overloaded / active.length) * 100);
  const efficiency = Math.round(100 - wastePercent * 0.6 - (100 - avgLoad) * 0.1);

  const topWasteful = [...active]
    .filter((n) => n.load > 70)
    .sort((a, b) => b.load - a.load)
    .slice(0, 3)
    .map((n) => ({ id: n.id, name: n.name, type: n.type, load: n.load }));

  return {
    efficiency: Math.max(0, Math.min(100, efficiency)),
    wastePercent,
    avgLoad: Math.round(avgLoad),
    activeRoutes: routes.length,
    topWasteful,
    totalNodes: active.length,
    overloadedNodes: overloaded,
  };
}

module.exports = {
  generateNodes,
  updateLoads,
  calculateRoutes,
  calculateStats,
};
