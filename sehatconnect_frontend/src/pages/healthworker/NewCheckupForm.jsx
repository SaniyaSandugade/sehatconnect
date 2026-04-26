import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HNavbar from "./HNavbar";
import API from "../../services/api";
import "./Stylesheets/NewCheckupForm.css";

export default function NewCheckupForm() {
  const { id, pid } = useParams(); // 👈 IMPORTANT FIX
  const navigate = useNavigate();

  const [form, setForm] = useState({
    healthWorkerName: "",
    temperature: "",
    systolic: "",
    diastolic: "",
    heartRate: "",
    respiratoryRate: "",
    spo2: "",
    bloodSugar: "",
    weight: "",
    height: "",
    remarks: "",
    otherSymptoms: "",
  });

  // 👤 GET LOGGED IN USER NAME (SAFE)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));

    if (storedUser?.fullName) {
      setForm((prev) => ({
        ...prev,
        healthWorkerName: storedUser.fullName,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📊 BMI CALCULATION
  const calculateBMI = () => {
    const weight = Number(form.weight);
    const height = Number(form.height);

    if (weight && height) {
      return (weight / ((height / 100) ** 2)).toFixed(1);
    }
    return "";
  };

  // 🚀 SUBMIT TO BACKEND (NO LOCAL STORAGE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        bmi: calculateBMI(),
      };

      await API.post(
        `/checkups/${id}/${pid}`,
        payload
      );

      alert("Checkup saved successfully!");

      navigate(-1);

    } catch (err) {
      console.log(err);
      alert("Failed to save checkup");
    }
  };

  return (
    <div>
      <HNavbar />

      <div className="add-patient-container">

        <h2>Monthly Health Checkup</h2>

        <form onSubmit={handleSubmit} className="add-patient-form">

          <input
            name="healthWorkerName"
            value={form.healthWorkerName}
            onChange={handleChange}
            placeholder="Health Worker Name"
          />

          <input
            name="temperature"
            type="number"
            placeholder="Temperature"
            onChange={handleChange}
            required
          />

          <input
            name="systolic"
            type="number"
            placeholder="Systolic BP"
            onChange={handleChange}
            required
          />

          <input
            name="diastolic"
            type="number"
            placeholder="Diastolic BP"
            onChange={handleChange}
            required
          />

          <input
            name="heartRate"
            type="number"
            placeholder="Heart Rate"
            onChange={handleChange}
            required
          />

          <input
            name="spo2"
            type="number"
            placeholder="SpO2"
            onChange={handleChange}
            required
          />

          <input
            name="weight"
            type="number"
            placeholder="Weight"
            onChange={handleChange}
            required
          />

          <input
            name="height"
            type="number"
            placeholder="Height"
            onChange={handleChange}
            required
          />

          <p>
            BMI: <strong>{calculateBMI()}</strong>
          </p>

          <textarea
            name="otherSymptoms"
            placeholder="Symptoms"
            onChange={handleChange}
          />

          <textarea
            name="remarks"
            placeholder="Remarks"
            onChange={handleChange}
          />

          <button type="submit">💾 Save Checkup</button>

        </form>
      </div>
    </div>
  );
}