import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export default async function authMiddleware(req, res, next) {
  try {
    console.log("Auth middleware triggered");

    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      console.log("No token found");
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    const admin = await Admin.findById(decoded.id);
    console.log("Admin found:", admin);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = admin;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(401).json({ message: "Invalid token" });
  }
}
