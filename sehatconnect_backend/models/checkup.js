import mongoose from "mongoose";

const checkupSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // ✅ SUPPORT BOTH ROLES
    healthWorkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthWorker",
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },

    // ✅ VITALS
    systolic: Number,
    diastolic: Number,
    heartRate: Number,
    spo2: Number,

    // ✅ EXTRA VITALS
    height: Number,
    weight: Number,
    temperature: Number,

    bmi: Number,
    remarks: String,
    otherSymptoms: String,
  },
  { timestamps: true }
);

export default mongoose.model("Checkup", checkupSchema);
