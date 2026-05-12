import Checkup from "../models/Checkup.js";

// ➕ ADD CHECKUP
export const addCheckup = async (req, res) => {
  try {
    const { patientId, healthWorkerId } = req.params;

    const newCheckup = await Checkup.create({
      patientId,
      healthWorkerId,
      ...req.body,
    });

    res.status(201).json(newCheckup);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add checkup" });
  }
};

// 📊 GET PATIENT CHECKUPS
export const getCheckups = async (req, res) => {
  try {
    const { patientId } = req.params;

    const data = await Checkup.find({ patientId }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json([]);
  }
};