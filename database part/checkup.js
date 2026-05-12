// models/Checkup.js
const mongoose = require("mongoose");

const CheckupSchema = new mongoose.Schema(
  {

    visitId: { type: String, required: true, unique: true },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    dateOfVisit: { type: Date, required: true },

    /* ================= BASIC VITALS ================= */

    heightCm: Number,
    weightKg: Number,
    bmi: Number,

    bpSystolic: Number,
    bpDiastolic: Number,

    heartRate: Number,
    respiratoryRate: Number,
    temperatureC: Number,

    spo2: Number,

    /* ================= BLOOD TESTS ================= */

    bloodSugarFasting: Number,
    bloodSugarRandom: Number,
    cholesterolLevel: Number,
    hemoglobin: Number,
    plateletCount: Number,

    /* ================= SYMPTOMS ================= */

    symptomsReported: String,
    painLevel: Number, // 0–10 scale
    fatigueLevel: Number, // 0–10 scale

    /* ================= DIAGNOSIS ================= */

    diagnosis: String,
    diagnosisCode: String, // ICD-style optional

    riskCategory: {
      type: String,
      enum: ["normal", "medium", "high", "critical"],
      default: "normal",
    },

    /* ================= PRESCRIPTION ================= */

    prescriptions: [
      {
        medicine: String,
        dosage: String,
        frequency: String,
        duration: String,
        notes: String,
      },
    ],

    labTestsRecommended: [String],
    followUpDate: Date,

    /* ================= DERIVED METRICS ================= */

    derivedMAP: Number, // Mean Arterial Pressure
    derivedHRV: Number, // Heart Rate Variability
    derivedPulsePressure: Number,

    /* ================= NOTES ================= */

    remarks: String,
    doctorNotes: String,

    /* ================= SYSTEM TRACKING ================= */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    editedAt: Date,

    editHistory: [
      {
        editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        editedAt: Date,
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Checkup", CheckupSchema);
