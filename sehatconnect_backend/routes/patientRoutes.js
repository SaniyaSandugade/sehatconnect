import express from "express";
import {
  createPatient,
  getAllPatients,
  getPatientById,
  deletePatient,
  updatePatient
} from "../controllers/patientController.js";

const router = express.Router();

// CREATE
router.post("/", createPatient);

// READ
router.get("/", getAllPatients);
router.get("/:id", getPatientById);

// UPDATE
router.put("/:id", updatePatient);

// DELETE
router.delete("/:id", deletePatient);

export default router;