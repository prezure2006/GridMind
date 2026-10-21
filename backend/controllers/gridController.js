const gridDataTemplate = require("../data/gridData.js");

// Initialize state and ensure x, y coordinates are populated for canvas rendering
const initializeNodes = (rawNodes) => {
  return rawNodes.map((n, i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    return {
      ...n,
      x: n.x || 75 + col * 140 + (i % 2 === 0 ? 10 : -10),
      y: n.y || 60 + row * 85 + (i % 3 === 0 ? 8 : -8),
      disabled: n.disabled || false,
    };
  });
};

let currentGridState = {
  nodes: initializeNodes(JSON.parse(JSON.stringify(gridDataTemplate.nodes || []))),
};

// Build graph for Dijkstra shortest path using Euclidean distance
const buildGraph = (nodes) => {
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
      .slice(0, 5); // Connect to 5 nearest neighbors

    dists.forEach(({ id, dist }) => {
      graph[a.id].push({ to: id, weight: dist });
    });
  });
  return graph;
};

// Dijkstra shortest path algorithm
const dijkstra = (graph, startId, endId) => {
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
};

// Calculate optimal energy routing from surplus to deficit nodes
const calculateRoutes = (nodes) => {
  const activeNodes = nodes.filter((n) => !n.disabled);
  if (!activeNodes.length) return [];

  const graph = buildGraph(activeNodes);

  // Surplus nodes (load < 50%) -> Deficit nodes (load > 70%)
  const surplus = activeNodes.filter((n) => n.load < 50);
  const deficit = activeNodes.filter((n) => n.load > 70);

  const routes = [];

  surplus.forEach((src) => {
    deficit.forEach((dst) => {
      const path = dijkstra(graph, src.id, dst.id);
      if (path && path.length > 1) {
        const flow = Math.round(
          Math.max(10, ((50 - src.load) * src.capacity) / 100)
        );
        routes.push({
          from: src.id,
          to: dst.id,
          path,
          flow,
        });
      }
    });
  });

  // Deduplicate: Keep shortest route per deficit node and cap at 15
  const seen = new Set();
  return routes
    .filter((r) => {
      if (seen.has(r.to)) return false;
      seen.add(r.to);
      return true;
    })
    .slice(0, 15);
};

// Simulate real-time minor load fluctuations
const fluctuateLoads = (nodes) => {
  return nodes.map((node) => {
    if (node.disabled) return node;
    const delta = (Math.random() - 0.5) * 6; // ±3% swing
    const newLoad = Math.min(100, Math.max(10, node.load + delta));
    return { ...node, load: Math.round(newLoad) };
  });
};

const getGridData = (simulateFluctuation = false) => {
  if (simulateFluctuation) {
    currentGridState.nodes = fluctuateLoads(currentGridState.nodes);
  }

  const nodes = currentGridState.nodes;
  const routes = calculateRoutes(nodes);

  const activeNodes = nodes.filter((n) => !n.disabled);
  const totalCapacity = nodes.reduce((sum, n) => sum + (n.capacity || 100), 0);
  const totalLoad = nodes.reduce(
    (sum, n) => sum + ((n.load || 0) * (n.capacity || 100)) / 100,
    0
  );
  const avgLoad = activeNodes.length
    ? Math.round(
        activeNodes.reduce((sum, n) => sum + n.load, 0) / activeNodes.length
      )
    : 0;

  const overloaded = activeNodes.filter((n) => n.load > 80).length;
  const wastePercent = activeNodes.length
    ? Math.round((overloaded / activeNodes.length) * 100)
    : 0;
  const efficiency = Math.max(
    0,
    Math.min(100, Math.round(100 - wastePercent * 0.6 - (100 - avgLoad) * 0.1))
  );

  const topWasteful = [...activeNodes]
    .filter((n) => n.load > 70)
    .sort((a, b) => b.load - a.load)
    .slice(0, 3)
    .map((n) => ({
      id: n.id,
      name: n.name,
      type: n.type,
      load: n.load,
    }));

  return {
    nodes,
    routes,
    stats: {
      efficiency,
      wastePercent,
      avgLoad,
      activeRoutes: routes.length,
      topWasteful,
      totalNodes: nodes.length,
      overloadedNodes: overloaded,
      offlineCount: nodes.filter((n) => n.disabled).length,
      totalCapacity,
      totalLoad: Math.round(totalLoad),
    },
    timestamp: new Date().toISOString(),
  };
};

const triggerCrisis = () => {
  // Re-enable previously disabled nodes first
  currentGridState.nodes = currentGridState.nodes.map((n) => ({
    ...n,
    disabled: false,
  }));

  const randomIds = [];
  while (randomIds.length < 2) {
    const id = Math.floor(Math.random() * currentGridState.nodes.length);
    if (!randomIds.includes(id)) randomIds.push(id);
  }

  randomIds.forEach((id) => {
    currentGridState.nodes[id].disabled = true;
    currentGridState.nodes[id].load = 0;
  });

  return getGridData(false);
};

const resetGrid = () => {
  currentGridState.nodes = initializeNodes(
    JSON.parse(JSON.stringify(gridDataTemplate.nodes || []))
  );
  return getGridData(false);
};

module.exports = {
  getGridData,
  triggerCrisis,
  resetGrid,
};
