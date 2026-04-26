import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Stylesheets/HealthworkerSidebar.css";
import defaultAvatar from "../../assets/images/healthworker.jpg";

const HealthworkerSidebar = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ LOAD FROM LOCALSTORAGE (FAST + SAFE)
  const loadProfile = () => {
    const stored = JSON.parse(localStorage.getItem("hwData"));
    if (stored?.healthworker) {
      setProfile(stored.healthworker);
    }
  };

  useEffect(() => {
    loadProfile();

    // 🔥 listen for updates from profile page
    const handleUpdate = () => {
      loadProfile();
    };

    window.addEventListener("profileUpdated", handleUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleUpdate);
    };
  }, []);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>

      {/* HEADER */}
      <div className="sidebar-header">

        <img
          src={profile?.profilePic || defaultAvatar}
          alt="healthworker"
          className="sidebar-avatar"
        />

        <p className="sidebar-name">
          {profile?.fullName || "Health Worker"}
        </p>

        <p className="sidebar-email">
          {profile?.email || ""}
        </p>

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

      </div>

      {/* MENU */}
      <ul className="sidebar-menu">

        <li onClick={() => navigate(`/healthworker/${id}`)}>
          🏠 Home
        </li>

        <li onClick={() => navigate(`/healthworker/${id}/addpatient`)}>
          ➕ Add Patient
        </li>

        <li onClick={() => navigate(`/healthworker/${id}/allpatients`)}>
          👥 All Patients
        </li>

        <li onClick={() => navigate(`/healthworker/${id}/healthcamps`)}>
          🏥 Health Camps
        </li>

        <li onClick={() => navigate(`/healthworker/${id}/profile`)}>
          👤 Profile
        </li>

        <li
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          🚪 Logout
        </li>

      </ul>
    </div>
  );
};

export default HealthworkerSidebar;