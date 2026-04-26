import express from "express";
import upload from "../middleware/upload.js";
import {
  registerDoctor,
  doctorLogin,
  getDoctorProfile,
  updateDoctorProfile
} from "../controllers/doctorController.js";

import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

const router = express.Router();


// ======================
// Register Doctor
// ======================
router.post("/register", upload.single("photo"), registerDoctor);


// ======================
// Doctor Login
// ======================
router.post(
  "/login",
  (req, res, next) => {
    console.log("DOCTOR LOGIN ROUTE HIT");
    next();
  },
  doctorLogin
);


// ======================
// Get All Doctors
// ======================
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ======================
// Doctor Count
// ======================
router.get("/count", async (req, res) => {
  try {
    const count = await Doctor.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ======================
// Get Single Doctor Profile ⭐
// ======================
router.get("/profile/:id", getDoctorProfile);


// ======================
// Update Doctor Profile ⭐
// ======================
router.put("/profile/:id", upload.single("photo"), updateDoctorProfile);


// ======================
// Delete Doctor
// ======================
router.delete("/:id", async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ======================
// Get patients by doctor ⭐ NEW ROUTE
// ======================
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const patients = await Patient.find({
      doctorId: req.params.doctorId
    });

    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;