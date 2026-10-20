const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const connectDB = require("./config/db");
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
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
app.use(express.json());
connectDB();
// Socket.io Events
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  const gridData = getGridData();
  socket.emit("grid:update", gridData);

  socket.on("grid:crisis", () => {
    console.log("🚨 Crisis triggered");
    const updatedGrid = triggerCrisis();
    io.emit("grid:update", updatedGrid);
  });

  socket.on("grid:reset", () => {
    console.log("🔄 Grid reset");
    const updatedGrid = resetGrid();
    io.emit("grid:update", updatedGrid);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Routes
app.use("/api/grid", gridRouter); // ✅ ADD THIS
app.use("/api/wards", wardRouter);

app.get("/", (req, res) => {
  res.send("GRIDMIND Server running!");
});

server.listen(3000, () => {
  console.log("⚡ GRIDMIND Server running on port 3000");
});
