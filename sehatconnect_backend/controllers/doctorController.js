import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// ==========================
// Doctor Registration
// ==========================
export const registerDoctor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      gender,
      dateOfBirth,
      specialization,
      qualification,
      experience,
      licenseNumber,
      medicalCouncil,
      password
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !dateOfBirth ||
      !specialization ||
      !qualification ||
      !licenseNumber ||
      !medicalCouncil ||
      !password
    ) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingDoctor = await Doctor.findOne({
      $or: [{ email: email.toLowerCase() }, { licenseNumber }]
    });

    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // 📸 Photo Upload
    let photo = "";
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "sehatconnect/doctors" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      photo = uploadResult.secure_url;
    }

    // ✅ FIXED qualification handling
    const doctor = await Doctor.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      gender,
      dateOfBirth,
      specialization,
      qualification: Array.isArray(qualification)
        ? qualification
        : typeof qualification === "string"
        ? [qualification]
        : [],
      experience,
      licenseNumber,
      medicalCouncil,
      password,
      photo
    });

    res.status(201).json({
      message: "Doctor registered successfully ✅",
      doctor
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


// ==========================
// Doctor Login
// ==========================
export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: doctor._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: pwd, ...doctorData } = doctor._doc;

    res.json({
      message: "Doctor login successful ✅",
      token,
      doctor: doctorData
    });

  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


// ==========================
// Get Profile
// ==========================
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");
    res.json(doctor);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


// ==========================
// Update Profile
// ==========================
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // ✅ FIXED structured update
    const {
      fullName,
      email,
      phone,
      gender,
      dateOfBirth,
      specialization,
      qualification,
      experience,
      licenseNumber,
      medicalCouncil,
      password
    } = req.body;

    let updateData = {
      fullName,
      email,
      phone,
      gender,
      dateOfBirth,
      specialization,
      qualification,
      experience,
      licenseNumber,
      medicalCouncil
    };

    // 🔐 Password hash
    if (password && password !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // 📸 Photo Upload
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "sehatconnect/doctors" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      updateData.photo = uploadResult.secure_url;
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      updateData,
      { new: true }
    ).select("-password");

    res.json({
      message: "Doctor profile updated successfully ✅",
      doctor: updatedDoctor
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};