const Ward = require("../models/Ward.js");

const getAllWard = async (req, res) => {
  try {
    const wards = await Ward.find();
    res.json(wards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWardById = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);
    if (!ward) {
      return res.status(404).json({
        message: "Cant find the Ward by id",
      });
    }
    res.json(ward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWard = async (req, res) => {
  const { name, location, latitude, longitude, totalEnergy, devices } = req.body;
  try {
    const newWard = new Ward({
      name,
      location,
      latitude,
      longitude,
      totalEnergy: totalEnergy || 0,
      devices: devices || [],
    });
    const savedWard = await newWard.save();
    res.status(201).json(savedWard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWard = async (req, res) => {
  try {
    const ward = await Ward.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!ward) {
      return res.status(404).json({ message: "Ward not found" });
    }
    res.json(ward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteWard = async (req, res) => {
  try {
    const ward = await Ward.findByIdAndDelete(req.params.id);
    if (!ward) {
      return res.status(404).json({ message: "Ward not found" });
    }
    res.json({ message: "Ward deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deleteWard,
  getAllWard,
  getWardById,
  createWard,
  updateWard,
};
