import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import DNavbar from "./DNavbar";
import "./Stylesheets/AddPatient.css";

export default function DAddPatient() {
  const { id } = useParams(); // doctorId
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNext = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/patients", {
        ...form,
        doctorId: id, // ✅ IMPORTANT (doctor instead of healthworker)
      });

      const newId = res.data.patient._id;

      alert("Patient added successfully!");

      navigate(`/doctor/${id}/patient/${newId}/details`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save patient");
    }
  };

  return (
    <div>
      <DNavbar />

      <div className="add-patient-container">
        <h2>Add Patient</h2>

        <form onSubmit={handleNext} className="add-patient-form">

          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />

          <button type="submit">NEXT</button>
        </form>
      </div>
    </div>
  );
}