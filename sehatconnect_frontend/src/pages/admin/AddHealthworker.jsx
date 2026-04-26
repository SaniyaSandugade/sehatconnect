import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StyleSheets/AddHealthworker.css";
import Navbar from "../../components/PNavbar";

const AddHealthworker = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    domicileCity: "",
    password: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("role", formData.role);
      data.append("domicileCity", formData.domicileCity);
      data.append("password", formData.password);

      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      await axios.post(
        "http://localhost:5000/api/healthworkers/register",
        data
      );

      alert("✅ Healthworker successfully added!");
      navigate("/admin/dashboard");

    } catch (err) {
      console.error(err);
      alert("❌ Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar />

      <div className="healthworker-page">
        <div className="healthworker-form-card">

          <button
            className="back-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Back
          </button>

          <h2>Add Healthworker</h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data">

            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Sita Patil"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label>Email ID</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. sita@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="10-digit Indian mobile number"
              pattern="[6-9]{1}[0-9]{9}"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="ANM">ANM</option>
              <option value="GNM">GNM</option>
              <option value="ASHA">ASHA</option>
              <option value="MPW">MPW</option>
            </select>

            <label>Domicile City</label>
            <input
              type="text"
              name="domicileCity"
              placeholder="e.g. Kolhapur"
              value={formData.domicileCity}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label>Profile Photo (optional)</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="preview-img"
              />
            )}

            <button type="submit" className="save-btn">
              SAVE
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default AddHealthworker;
