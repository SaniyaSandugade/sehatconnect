import mongoose from "mongoose";

const healthWorkerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: String,

    role: String,

    domicileCity: String,

    profilePhoto: String,
  },
  { timestamps: true }
);

export default mongoose.model(
  "HealthWorker",
  healthWorkerSchema
);