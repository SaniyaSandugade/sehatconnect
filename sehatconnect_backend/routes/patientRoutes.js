import express from "express";

import {
  createPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  updatePatient,
  patientLogin,
} from "../controllers/patientController.js";

const router = express.Router();

/* =========================
   LOGIN
========================= */
router.post("/login", patientLogin);

/* =========================
   CREATE
========================= */
router.post("/", createPatient);

/* =========================
   GET ALL
========================= */
router.get("/", getAllPatients);

/* =========================
   PROFILE ROUTES
========================= */

// ✅ GET PROFILE
router.get("/profile/:id", getPatientById);

// ✅ UPDATE PROFILE
router.put("/profile/:id", updatePatient);

// ✅ DELETE PROFILE
router.delete("/profile/:id", deletePatient);

/* =========================
   NORMAL ROUTES
========================= */

router.get("/:id", getPatientById);

router.put("/:id", updatePatient);

router.delete("/:id", deletePatient);

export default router;