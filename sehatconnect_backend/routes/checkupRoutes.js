import express from "express";
import {
  addCheckup,
  getCheckups,
} from "../controllers/checkupController.js";

const router = express.Router();

// ➕ ADD CHECKUP
router.post("/:healthWorkerId/:patientId", addCheckup);

// 📊 GET CHECKUPS
router.get("/:patientId", getCheckups);

export default router;