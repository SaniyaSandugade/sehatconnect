import express from "express";
import multer from "multer";
import HealthWorker from "../models/Healthworker.js";

const router = express.Router();

/* =========================
   MULTER
========================= */

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

/* =========================
   REGISTER
========================= */

router.post(
  "/register",
  upload.single("photo"),
  async (req, res) => {
    try {

      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      // CHECK EMAIL
      const existing =
        await HealthWorker.findOne({
          email: req.body.email.toLowerCase(),
        });

      if (existing) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      // IMAGE
      let profilePhoto = "";

      if (req.file) {
        profilePhoto =
          `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      }

      // CREATE
      const newHW = new HealthWorker({
        fullName: req.body.fullName,

        email: req.body.email.toLowerCase(),

        password: req.body.password,

        phone: req.body.phone,

        role: req.body.role,

        domicileCity:
          req.body.domicileCity,

        profilePhoto,
      });

      await newHW.save();

      res.status(201).json({
        message:
          "Healthworker added successfully",
        newHW,
      });

    } catch (err) {

      console.log(
        "REGISTER ERROR:",
        err
      );

      res.status(500).json({
        message: err.message,
      });
    }
  }
);

/* =========================
   GET ALL
========================= */

router.get("/", async (req, res) => {
  try {

    const data =
      await HealthWorker.find();

    res.json(data);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
});

/* =========================
   DELETE
========================= */

router.delete("/:id", async (req, res) => {
  try {

    await HealthWorker.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Deleted successfully",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;