import express from "express";
import upload from "../middleware/upload.js";
import HealthWorker from "../models/Healthworker.js";
import { hwLogin } from "../controllers/healthworkerController.js";

const router = express.Router();

/* LOGIN */
router.post("/login", hwLogin);

/* REGISTER */
router.post("/register", upload.single("photo"), async (req, res) => {
  try {
    const newHW = new HealthWorker(req.body);
    await newHW.save();
    res.status(201).json(newHW);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET ALL */
router.get("/", async (req, res) => {
  try {
    const data = await HealthWorker.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ GET SINGLE PROFILE (IMPORTANT FIX) */
router.get("/:id", async (req, res) => {
  try {
    const user = await HealthWorker.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ UPDATE PROFILE (IMPORTANT FIX) */
router.put("/:id", async (req, res) => {
  try {
    console.log("UPDATE PROFILE:", req.body);

    const updated = await HealthWorker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  try {
    await HealthWorker.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;