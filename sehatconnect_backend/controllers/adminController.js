import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

/* ======================
   ADMIN LOGIN
====================== */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({
  email: email.trim().toLowerCase(),
});

    if (!admin)
      return res.status(401).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        profilePic: admin.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   GET PROFILE
====================== */
export const getAdminProfile = async (req, res) => {
  try {
    res.status(200).json(req.admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ======================
   UPDATE PROFILE
====================== */
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const { name, email, healthcareCenter, location, phone } = req.body;

    let updateData = {
      name,
      email,
      healthcareCenter,
      location,
      phone,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "sehatconnect/admins",
      });

      updateData.profilePic = result.secure_url;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      updateData,
      { new: true }
    ).select("-password");

    res.json(updatedAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Profile update failed" });
  }
};
