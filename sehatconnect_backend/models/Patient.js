import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  password: String,

  // DETAILS
  dob: String,
  gender: String,
  address: String,
  contact: String,
  maritalStatus: String,
  occupation: String,
  education: String,
  pastConditions: String,
  pastSurgeries: String,
  longTermMeds: String,
  allergies: String,
  familyHistory: String,
  lifestyle: String,
  smoking: String,
  alcohol: String,
  diet: String,
  photo: String,
  doctorId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Doctor"
},
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);