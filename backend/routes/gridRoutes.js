const express = require("express");
const router = express.Router();
const {
  getGridData,
  triggerCrisis,
  resetGrid,
} = require("../controllers/gridController.js");

// GET current grid state
router.get("/", (req, res) => {
  const gridData = getGridData();
  res.json(gridData);
}); // ✅ CORRECT
// POST trigger crisis
router.post("/crisis", (req, res) => {
  const gridData = triggerCrisis();
  res.json(gridData);
});

// POST reset grid
router.post("/reset", (req, res) => {
  const gridData = resetGrid();
  res.json(gridData);
});

module.exports = router;
