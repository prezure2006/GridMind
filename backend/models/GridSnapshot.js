const mongoose = require("mongoose");

// Schema for storing periodic grid snapshots in MongoDB
const gridSnapshotSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  nodes: [
    {
      id: Number,
      name: String,
      type: {
        type: String,
        enum: ["solar", "battery", "building", "ev_charger"],
      },
      load: Number, // 0–100 current load percentage
      capacity: Number, // max capacity in kW
      x: Number,
      y: Number,
      disabled: Boolean,
    },
  ],
  routes: [
    {
      from: Number,
      to: Number,
      path: [Number],
      flow: Number, // kW flowing along this route
    },
  ],
  efficiency: Number, // grid efficiency 0–100
  wastePercent: Number,
});

module.exports = mongoose.model("GridSnapshot", gridSnapshotSchema);
