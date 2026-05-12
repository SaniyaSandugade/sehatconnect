import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import "./Stylesheets/PaSidebar.css";

const PatientSidebar = ({ isOpen, onClose }) => {
  const [patient, setPatient] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // =========================
  // FETCH PATIENT
  // =========================
  const loadProfile = useCallback(async () => {
    try {
      if (!id) return;

      const res = await API.get(`/patients/profile/${id}`);
      setPatient(res?.data?.patient);

    } catch (err) {
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // =========================
  // NAV
  // =========================
  const goTo = (path) => {
    if (id) navigate(`/patient/${id}${path}`);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>

      {/* CLOSE */}
      <button className="close-btn" onClick={onClose}>✕</button>

      {/* HEADER */}
      <div className="sidebar-header">

        <img
          src={
            patient?.photo ||
            `https://ui-avatars.com/api/?name=${patient?.fullName || "Patient"}`
          }
          alt="patient"
          className="sidebar-avatar"
        />

        <h3>{patient?.fullName || "Patient"}</h3>
        <p>{patient?.email || ""}</p>

      </div>

      {/* MENU */}
      <ul className="sidebar-menu">

        <li onClick={() => goTo("/")}>🏠 Home</li>
        <li onClick={() => goTo("/dashboard")}>📊 Dashboard</li>
        <li onClick={() => goTo("/history")}>📁 Medical History</li>
        <li onClick={() => goTo("/healthcamps")}>🏥 Health Camps</li>
        <li onClick={() => goTo("/profile")}>👤 Profile</li>

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

export default PatientSidebar;