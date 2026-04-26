import HealthWorker from "../models/Healthworker.js";
import bcrypt from "bcryptjs";

/* =========================
   HEALTHWORKER LOGIN (FINAL FIX)
========================= */
export const hwLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // normalize email
    email = email.trim().toLowerCase();

    // find user
    const hw = await HealthWorker.findOne({ email });

    if (!hw) {
      return res.status(404).json({
        message: "Healthworker not found",
      });
    }

    // IMPORTANT FIX: handle both hashed & plain passwords safely
    let isMatch = false;

    try {
      isMatch = await bcrypt.compare(password, hw.password);
    } catch (err) {
      // fallback if password is NOT hashed
      isMatch = password === hw.password;
    }

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    return res.status(200).json({
      token: "dummy-token",
      hw: {
        _id: hw._id,
        fullName: hw.fullName,
        email: hw.email,
        phone: hw.phone,
        role: hw.role,
      },
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};