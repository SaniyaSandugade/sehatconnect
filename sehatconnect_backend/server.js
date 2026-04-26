import "./config/env.js";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import healthworkerRoutes from "./routes/healthworkerRoutes.js";
import healthCampRoutes from "./routes/healthCampRoutes.js";
import checkupRoutes from "./routes/checkupRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";



const app = express();

// ✅ CONNECT DATABASE
connectDB();

// ✅ CORS CONFIG
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 🔥 IMPORTANT FIX (Increase payload size limit)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/healthworkers", healthworkerRoutes);
app.use("/api/healthcamps", healthCampRoutes);
app.use("/api/checkups", checkupRoutes);
app.use("/api/patients", patientRoutes);

// ✅ ROOT
app.get("/", (req, res) => {
  res.send("SehatConnect Backend Running ✅");
});

// ✅ SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});