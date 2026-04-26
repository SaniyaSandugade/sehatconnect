import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HNavbar from "./HNavbar";
import "./Stylesheets/AddPatient.css";
import { v4 as uuidv4 } from "uuid";

export default function AddPatient() {
  const { id } = useParams(); // ✅ HEALTHWORKER ID FIX
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();

    const newId = uuidv4();

    const basicInfo = {
      ...form,
      id: newId,
      healthworkerId: id,
    };

    localStorage.setItem("patientBasic", JSON.stringify(basicInfo));

    alert("Patient added successfully!");

    // ✅ FIXED ROUTE (includes healthworker id)
    navigate(`/healthworker/${id}/patient/${newId}/details`);
  };

  return (
    <div>
      <HNavbar />

      <div className="add-patient-container">
        <h2>Add Patient</h2>
        <p className="location">Location: Primary HealthCare Kolhapur</p>

        <form className="add-patient-form" onSubmit={handleNext}>
          <label>Full Name :</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <label>Email Id :</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Phone no :</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label>Password :</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="next-btn">
            NEXT
          </button>
        </form>
      </div>
    </div>
  );
}