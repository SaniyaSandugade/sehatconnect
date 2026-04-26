import Checkup from "../models/Checkup.js";

// ➕ ADD CHECKUP
export const addCheckup = async (req, res) => {
  try {
    const { healthWorkerId, patientId } = req.params;
    const { doctorId } = req.body;

    // ✅ SAFE NUMBER CONVERSION FUNCTION
    const toNumber = (val) => (val === "" || val === undefined ? undefined : Number(val));

    const newCheckup = new Checkup({
      patientId,

      // ✅ FORCE CORRECT TYPES
      temperature: toNumber(req.body.temperature),
      systolic: toNumber(req.body.systolic),
      diastolic: toNumber(req.body.diastolic),
      heartRate: toNumber(req.body.heartRate),
      respiratoryRate: toNumber(req.body.respiratoryRate),
      spo2: toNumber(req.body.spo2),
      bloodSugar: toNumber(req.body.bloodSugar),
      weight: toNumber(req.body.weight),
      height: toNumber(req.body.height),
      bmi: toNumber(req.body.bmi),

      remarks: req.body.remarks,
      otherSymptoms: req.body.otherSymptoms,
    });

    // ✅ ROLE HANDLING
    if (doctorId) {
      newCheckup.doctorId = doctorId;
    } else if (healthWorkerId) {
      newCheckup.healthWorkerId = healthWorkerId;
    }

    await newCheckup.save();

    res.json({
      message: "Checkup added successfully",
      checkup: newCheckup,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding checkup" });
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
