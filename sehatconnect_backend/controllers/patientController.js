import Patient from "../models/Patient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendPatientEmail } from "../utils/sendEmail.js";


// ==========================
// CREATE PATIENT
// ==========================
export const createPatient = async (req, res) => {
  try {

    const {
      fullName,
      email,
      phone,
      password,
      doctorId,
      healthworkerId
    } = req.body;

    // ==========================
    // VALIDATION
    // ==========================
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    // ==========================
    // NORMALIZE EMAIL
    // ==========================
    const normalizedEmail = email.trim().toLowerCase();

    // ==========================
    // CHECK EXISTING
    // ==========================
    const existing = await Patient.findOne({
      email: normalizedEmail
    });

    if (existing) {
      return res.status(400).json({
        message: "Patient already exists with this email"
      });
    }

    // ==========================
    // HASH PASSWORD
    // ==========================
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // ==========================
    // CREATE PATIENT
    // ==========================
    const patient = await Patient.create({
      fullName,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      doctorId,
      healthworkerId
    });

    // ==========================
    // SEND EMAIL
    // ==========================
    try {

      await sendPatientEmail(
        normalizedEmail,
        fullName,
        password
      );

      console.log("✅ Email sent to patient");

    } catch (emailErr) {

      console.error(
        "❌ Email failed:",
        emailErr.message
      );
    }

    // ==========================
    // RESPONSE
    // ==========================
    res.status(201).json({
      message: "Patient created successfully ✅",
      patient
    });

  } catch (err) {

    console.error(
      "CREATE PATIENT ERROR:",
      err
    );

    res.status(500).json({
      message: "Error creating patient"
    });
  }
};


// ==========================
// PATIENT LOGIN
// ==========================
export const patientLogin = async (req, res) => {
  try {

    const { email, password } = req.body;

    // ==========================
    // VALIDATION
    // ==========================
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    // ==========================
    // NORMALIZE EMAIL
    // ==========================
    const normalizedEmail = email.trim().toLowerCase();

    // ==========================
    // FIND PATIENT
    // ==========================
    const patient = await Patient.findOne({
      email: normalizedEmail
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    // ==========================
    // CHECK PASSWORD
    // ==========================
    const isMatch = await bcrypt.compare(
      password,
      patient.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // ==========================
    // GENERATE TOKEN
    // ==========================
    const token = jwt.sign(
      {
        id: patient._id,
        role: "patient"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // ==========================
    // REMOVE PASSWORD
    // ==========================
    const patientData = {
      ...patient._doc
    };

    delete patientData.password;

    // ==========================
    // RESPONSE
    // ==========================
    res.json({
      message: "Patient login successful ✅",
      token,
      patient: patientData
    });

  } catch (err) {

    console.error(
      "PATIENT LOGIN ERROR:",
      err
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ==========================
// GET ALL PATIENTS
// ==========================
export const getAllPatients = async (req, res) => {
  try {

    const patients = await Patient.find();

    res.json(patients);

  } catch (err) {

    console.error("GET ALL ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
};


// ==========================
// GET PATIENT BY ID
// ==========================
export const getPatientById = async (req, res) => {
  try {

    const patient = await Patient.findById(
      req.params.id
    );

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    res.json({
  patient,
});

  } catch (err) {

    console.error(
      "GET BY ID ERROR:",
      err
    );

    res.status(500).json({
      error: err.message
    });
  }
};


// ==========================
// DELETE PATIENT
// ==========================
export const deletePatient = async (req, res) => {
  try {

    const deleted =
      await Patient.findByIdAndDelete(
        req.params.id
      );

    if (!deleted) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    res.json({
      message: "Patient deleted successfully"
    });

  } catch (err) {

    console.error("DELETE ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
};


// ==========================
// UPDATE PATIENT
// ==========================
export const updatePatient = async (req, res) => {
  try {

    const updated =
      await Patient.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    if (!updated) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    res.json({
  patient: updated,
});

  } catch (err) {

    console.error("UPDATE ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
};