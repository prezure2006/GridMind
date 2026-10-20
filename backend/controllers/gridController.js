const gridDataTemplate = require("../data/gridData.js");

let currentGridState = JSON.parse(JSON.stringify(gridDataTemplate));

// Simple route calculation (mock data for now)
const calculateRoutes = (nodes) => {
  const routes = [];

  const surplus = nodes.filter((n) => !n.disabled && n.load < 40);
  const deficit = nodes.filter((n) => !n.disabled && n.load > 70);

  for (let i = 0; i < Math.min(surplus.length, deficit.length); i++) {
    routes.push({
      from: surplus[i].id,
      to: deficit[i].id,
      flow: Math.random() * 100 + 50,
      path: [surplus[i].id, deficit[i].id],
    });
  }

  return routes;
};

const getGridData = () => {
  const nodes = currentGridState.nodes;
  const routes = calculateRoutes(nodes);

  const totalCapacity = nodes.reduce((sum, n) => sum + n.capacity, 0);
  const totalLoad = nodes.reduce(
    (sum, n) => sum + (n.load * n.capacity) / 100,
    0,
  );
  const avgLoad = Math.round((totalLoad / totalCapacity) * 100);
  const offlineCount = nodes.filter((n) => n.disabled).length;

  return {
    nodes,
    routes,
    stats: {
      totalCapacity,
      totalLoad: Math.round(totalLoad),
      avgLoad,
      offlineCount,
    },
  };
};

const triggerCrisis = () => {
  const randomIds = [];
  while (randomIds.length < 2) {
    const id = Math.floor(Math.random() * currentGridState.nodes.length);
    if (!randomIds.includes(id)) randomIds.push(id);
  }
  randomIds.forEach((id) => {
    currentGridState.nodes[id].disabled = true;
  });
  return getGridData();
};

const resetGrid = () => {
  currentGridState = JSON.parse(JSON.stringify(gridDataTemplate));
  return getGridData();
};

module.exports = { getGridData, triggerCrisis, resetGrid };
