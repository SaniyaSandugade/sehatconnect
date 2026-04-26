import mongoose from "mongoose";

const healthWorkerSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    photo: String,
  },
  { timestamps: true }
);

export default mongoose.model("HealthWorker", healthWorkerSchema);