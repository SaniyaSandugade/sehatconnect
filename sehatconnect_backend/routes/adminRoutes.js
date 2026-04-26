import express from "express";
import {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/login", adminLogin);

router.get("/profile", authMiddleware, getAdminProfile);

router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePic"),
  updateAdminProfile
);

export default router;
