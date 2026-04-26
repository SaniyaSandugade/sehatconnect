import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true,
    trim: true,
    set: (value) => {
      const name = value
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return name.startsWith("Dr.") ? name : `Dr. ${name}`;
    }
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  phone: {
    type: String,
    required: true,
    match: [/^[789]\d{9}$/, "Invalid Indian phone number"]
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },

  dateOfBirth: {
    type: Date,
    required: true
  },

  photo: {
    type: String,
    default: ""
  },

  specialization: {
    type: String,
    required: true,
    set: v =>
      v
        .toLowerCase()
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
  },

  qualification: {
    type: [String],
    required: true
  },

  experience: {
    type: Number,
    min: [0, "Experience cannot be negative"]
  },

  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },

  medicalCouncil: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  isVerified: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if password not changed
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Doctor", doctorSchema);
