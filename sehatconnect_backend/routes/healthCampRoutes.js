import express from "express";
import HealthCamp from "../models/HealthCamp.js";

const router = express.Router();

// GET ALL HEALTH CAMPS
router.get("/", async (req, res) => {
  try {
    const camps = await HealthCamp.find();
    res.json(camps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;