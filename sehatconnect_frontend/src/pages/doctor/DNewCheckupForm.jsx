import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DNavbar from "./DNavbar";
import API from "../../services/api";
import "./Stylesheets/NewCheckupForm.css";

export default function DNewCheckupForm() {
  const { id, pid } = useParams(); // doctorId & patientId
  const navigate = useNavigate();

  const [form, setForm] = useState({
    doctorName: "",
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

  // 👤 AUTO FILL DOCTOR NAME
  useEffect(() => {
    const storedDoctor = JSON.parse(localStorage.getItem("doctorData"));

    if (storedDoctor?.doctor?.fullName) {
      setForm((prev) => ({
        ...prev,
        doctorName: storedDoctor.doctor.fullName,
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

  // 🚀 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        bmi: calculateBMI(),
        doctorId: id, // ✅ VERY IMPORTANT
      };

      await API.post(`/checkups/${id}/${pid}`, payload);

      alert("Checkup saved successfully!");

      navigate(-1);

    } catch (err) {
      console.log(err);
      alert("Failed to save checkup");
    }
  };

  return (
    <div>
      <DNavbar />

      <div className="add-patient-container">

        <h2>Doctor Health Checkup</h2>

        <form onSubmit={handleSubmit} className="add-patient-form">

          <input
            name="doctorName"
            value={form.doctorName}
            onChange={handleChange}
            placeholder="Doctor Name"
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
