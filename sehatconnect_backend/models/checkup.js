import mongoose from "mongoose";

const checkupSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    healthWorkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthWorker",
      required: true,
    },

    healthWorkerName: String,

    age: Number,

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    heartRate: Number,

    respiratoryRate: Number,

    temperature: Number,

    spo2: Number,

    systolic: Number,

    diastolic: Number,

    weight: Number,

    height: Number,

    derivedHRV: Number,

    derivedPulsePressure: Number,

    derivedBMI: Number,

    derivedMAP: Number,

    riskCategory: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    otherSymptoms: String,

    remarks: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Checkup", checkupSchema);