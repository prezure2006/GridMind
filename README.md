# ⚡ GRIDMIND — Real-Time Urban Energy Grid Optimizer

A full-stack MERN application that simulates and optimizes energy distribution across 30 urban grid nodes using Dijkstra's algorithm and Socket.io for live updates.

---

## 🏗️ Architecture

```
gridmind/
├── backend/
│   ├── server.js          # Express + Socket.io server
│   ├── gridEngine.js      # Node generation, Dijkstra, stats
│   └── models/
│       └── GridSnapshot.js # MongoDB snapshot schema
└── frontend/
    └── src/
        ├── App.jsx              # Main app + Socket.io client
        └── components/
            ├── GridCanvas.jsx   # Canvas-based grid renderer
            └── Sidebar.jsx      # Stats dashboard + controls
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 16+
- MongoDB (optional — app runs without it)

### Backend
```bash
cd backend
npm install
node server.js
# → Running on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → Running on http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint      | Description                        |
|--------|---------------|------------------------------------|
| GET    | /api/grid     | Full grid state (nodes + routes)   |
| GET    | /api/stats    | Stats only (efficiency, waste %)   |
| POST   | /api/crisis   | Disable 2 random nodes             |
| POST   | /api/reset    | Re-enable all nodes                |

### Socket.io Events
- **Server → Client**: `grid:update` — emitted every 5 seconds with `{ nodes, routes, stats }`

---

## 🧠 Algorithm

**Dijkstra's Shortest Path** finds optimal energy routes:
1. Every 5 seconds, loads fluctuate ±5%
2. Nodes with `load < 40%` = **surplus** (generating excess energy)
3. Nodes with `load > 70%` = **deficit** (need more power)
4. Dijkstra runs on a graph where edge weights = Euclidean distance
5. Each surplus node routes to its nearest deficit node
6. Up to 15 simultaneous routes are maintained

---

## 🎨 Node Types

| Type       | Color  | Capacity | Base Load |
|------------|--------|----------|-----------|
| Solar      | Green  | 80–200kW | 10–40%    |
| Battery    | Yellow | 100–300kW| 30–70%    |
| Building   | Blue   | 50–150kW | 60–95%    |
| EV Charger | Purple | 20–80kW  | 40–90%    |

---

## ⚡ Crisis Simulation

Click **"Simulate Crisis"** to:
1. Disable 2 random nodes (shown with ✕ and blinking)
2. Routes instantly recalculate around the outage
3. Health score drops, waste hotspots may appear
4. Click **"Reset Grid"** to restore all nodes
