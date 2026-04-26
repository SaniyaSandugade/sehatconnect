import HealthCamp from "../models/HealthCamp.js";

// GET all health camps
export const getAllHealthCamps = async (req, res) => {
  try {
    const camps = await HealthCamp.find().sort({ date: 1 }); // upcoming first
    res.status(200).json(camps);
  } catch (err) {
    console.error("GET HEALTH CAMPS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// CREATE new health camp
export const createHealthCamp = async (req, res) => {
  try {
    const { name, date, time, location, description } = req.body;
    if (!name || !date || !time || !location || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCamp = await HealthCamp.create({ name, date, time, location, description });
    res.status(201).json(newCamp);
  } catch (err) {
    console.error("CREATE HEALTH CAMP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE health camp
export const updateHealthCamp = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCamp = await HealthCamp.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedCamp);
  } catch (err) {
    console.error("UPDATE HEALTH CAMP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE health camp
export const deleteHealthCamp = async (req, res) => {
  try {
    const { id } = req.params;
    await HealthCamp.findByIdAndDelete(id);
    res.status(200).json({ message: "Health camp deleted successfully" });
  } catch (err) {
    console.error("DELETE HEALTH CAMP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
