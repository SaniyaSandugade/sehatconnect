import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import HNavbar from "./HNavbar";
import API from "../../services/api";

import "./Stylesheets/NewCheckupForm.css";

export default function NewCheckupForm() {
  const { id, pid } = useParams();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("userData"));

  const [form, setForm] = useState({
    healthWorkerName: "",
    age: "",
    gender: "",
    heartRate: "",
    respiratoryRate: "",
    temperature: "",
    spo2: "",
    systolic: "",
    diastolic: "",
    weight: "",
    height: "",
    remarks: "",
    otherSymptoms: "",
  });

  useEffect(() => {
    if (storedUser?.fullName) {
      setForm((prev) => ({
        ...prev,
        healthWorkerName: storedUser.fullName,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const calculateBMI = () => {
    const weight = Number(form.weight);
    const height = Number(form.height);

    if (weight && height) {
      return (weight / (height * height)).toFixed(1);
    }

    return "";
  };

  const calculatePulsePressure = () => {
    const sys = Number(form.systolic);
    const dia = Number(form.diastolic);

    if (sys && dia) {
      return sys - dia;
    }

    return "";
  };

  const calculateMAP = () => {
    const sys = Number(form.systolic);
    const dia = Number(form.diastolic);

    if (sys && dia) {
      return ((sys + 2 * dia) / 3).toFixed(1);
    }

    return "";
  };

  const calculateHRV = () => {
    const hr = Number(form.heartRate);

    if (hr) {
      return (60000 / hr).toFixed(1);
    }

    return "";
  };

  const calculateRisk = () => {
    const sys = Number(form.systolic);
    const spo2 = Number(form.spo2);
    const hr = Number(form.heartRate);
    const temp = Number(form.temperature);

    if (
      sys > 140 ||
      spo2 < 92 ||
      hr > 110 ||
      temp > 38
    ) {
      return "High";
    }

    if (
      sys > 130 ||
      spo2 < 95 ||
      hr > 100
    ) {
      return "Medium";
    }

    return "Low";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        patientId: pid,
        healthWorkerId: storedUser._id,
        derivedBMI: calculateBMI(),
        derivedPulsePressure: calculatePulsePressure(),
        derivedMAP: calculateMAP(),
        derivedHRV: calculateHRV(),
        riskCategory: calculateRisk(),
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
      <HNavbar />

      <div className="add-patient-container">
        <h2>Monthly Health Checkup</h2>

        <form
          onSubmit={handleSubmit}
          className="add-patient-form"
        >
          <input
            name="healthWorkerName"
            value={form.healthWorkerName}
            onChange={handleChange}
            placeholder="Health Worker Name"
          />

          <input
            name="age"
            type="number"
            placeholder="Age"
            onChange={handleChange}
            required
          />

          <select
            name="gender"
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="heartRate"
            type="number"
            placeholder="Heart Rate"
            onChange={handleChange}
            required
          />

          <input
            name="respiratoryRate"
            type="number"
            placeholder="Respiratory Rate"
            onChange={handleChange}
            required
          />

          <input
            name="temperature"
            type="number"
            placeholder="Body Temperature"
            onChange={handleChange}
            required
          />

          <input
            name="spo2"
            type="number"
            placeholder="Oxygen Saturation"
            onChange={handleChange}
            required
          />

          <input
            name="systolic"
            type="number"
            placeholder="Systolic Blood Pressure"
            onChange={handleChange}
            required
          />

          <input
            name="diastolic"
            type="number"
            placeholder="Diastolic Blood Pressure"
            onChange={handleChange}
            required
          />

          <input
            name="weight"
            type="number"
            placeholder="Weight (kg)"
            onChange={handleChange}
            required
          />

          <input
            name="height"
            type="number"
            step="0.01"
            placeholder="Height (m)"
            onChange={handleChange}
            required
          />

          <p>
            BMI: <strong>{calculateBMI()}</strong>
          </p>

          <p>
            HRV: <strong>{calculateHRV()}</strong>
          </p>

          <p>
            Pulse Pressure:
            <strong>{calculatePulsePressure()}</strong>
          </p>

          <p>
            MAP: <strong>{calculateMAP()}</strong>
          </p>

          <p>
            Risk Category:
            <strong>{calculateRisk()}</strong>
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

          <button type="submit">
            💾 Save Checkup
          </button>
        </form>
      </div>
    </div>
  );
}