import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HNavbar from "./HNavbar";
import "./Stylesheets/AddPatient.css";
import axios from "axios";

export default function AddPatient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  // ✅ MUST be inside component
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNext = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/patients",
        {
          ...form,
          healthworkerId: id,
        }
      );

      const newId = res.data.patient._id;

      alert("Patient added successfully!");

      navigate(`/healthworker/${id}/patient/${newId}/details`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save patient");
    }
  };

  return (
    <div>
      <HNavbar />

      <div className="add-patient-container">
        <h2>Add Patient</h2>

        <form onSubmit={handleNext} className="add-patient-form">

          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
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
          />

          <button type="submit">
            NEXT
          </button>
        </form>
      </div>
    </div>
  );
}