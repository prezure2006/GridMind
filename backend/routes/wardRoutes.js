const express = require("express");
const router = express.Router();
const {
  getAllWard,
  getWardById,
  createWard,
  updateWard,
  deleteWard,
} = require("../controllers/wardController.js");
router.get("/", getAllWard);
router.get("/:id", getWardById);
router.post("/", createWard);
router.put("/:id", updateWard);
router.delete("/:id", deleteWard);
module.exports = router;
