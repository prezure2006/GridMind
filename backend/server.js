const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const gridRouter = require("./routes/gridRoutes");
const wardRouter = require("./routes/wardRoutes");
const {
  getGridData,
  triggerCrisis,
  resetGrid,
} = require("./controllers/gridController");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Localhost MongoDB
connectDB();

// Periodic live grid tick every 5 seconds to simulate load fluctuations & broadcast routes
setInterval(() => {
  const updatedGrid = getGridData(true);
  io.emit("grid:update", updatedGrid);
}, 5000);

// Socket.io Events
io.on("connection", (socket) => {
  console.log("⚡ User connected to live stream:", socket.id);

  // Send current grid data immediately on connect
  const gridData = getGridData(false);
  socket.emit("grid:update", gridData);

  socket.on("grid:crisis", () => {
    console.log("🚨 Crisis triggered by client:", socket.id);
    const updatedGrid = triggerCrisis();
    io.emit("grid:update", updatedGrid);
  });

  socket.on("grid:reset", () => {
    console.log("🔄 Grid reset requested by client:", socket.id);
    const updatedGrid = resetGrid();
    io.emit("grid:update", updatedGrid);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/grid", gridRouter);
app.use("/api/wards", wardRouter);

app.get("/", (req, res) => {
  res.json({
    status: "online",
    name: "GRIDMIND Urban Energy Grid Server",
    database: "MongoDB Localhost Connected",
    endpoints: {
      auth: "/api/auth (POST /register, POST /login, GET /me)",
      grid: "/api/grid (GET /, POST /crisis, POST /reset)",
      wards: "/api/wards",
    },
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 GRIDMIND Server running on http://localhost:${PORT}`);
  console.log(`🔐 JWT Auth API active at http://localhost:${PORT}/api/auth`);
});
