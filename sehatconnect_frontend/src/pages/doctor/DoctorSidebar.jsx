import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Stylesheets/DoctorSidebar.css";
import defaultAvatar from "../../assets/images/healthworker.jpg";

const DoctorSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    profilePic: "",
  });

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("doctorProfile"));

    if (storedProfile) {
      setProfile(storedProfile);
    }

    const handleStorageChange = () => {
      const updatedProfile = JSON.parse(localStorage.getItem("doctorProfile"));
      if (updatedProfile) setProfile(updatedProfile);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("doctorProfile");
    localStorage.removeItem("doctorId");
    navigate("/login");
  };

  // ✅ Get doctorId safely
  const doctorId = profile.id || localStorage.getItem("doctorId");

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <img
          src={profile.profilePic || defaultAvatar}
          alt="Doctor Avatar"
          className="sidebar-avatar"
        />

        <p className="sidebar-name">{profile.name || "Doctor"}</p>

        <p className="sidebar-email">{profile.email}</p>

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <ul className="sidebar-menu">
        <li onClick={() => navigate(`/doctor/${doctorId}`)}>
          🏠 Home
        </li>

        <li onClick={() => navigate(`/doctor/${doctorId}/addpatient`)}>
          ➕ Add Patient
        </li>

        <li onClick={() => navigate(`/doctor/${doctorId}/allpatients`)}>
          👥 All Patients
        </li>

        <li onClick={() => navigate(`/doctor/${doctorId}/healthcamps`)}>
          🏥 Health Camps
        </li>

        <li onClick={() => navigate(`/doctor/${doctorId}/profile`)}>
          👤 Profile
        </li>

        <li onClick={handleLogout}>
          🚪 Logout
        </li>
      </ul>
    </div>
  );
};

export default DoctorSidebar;