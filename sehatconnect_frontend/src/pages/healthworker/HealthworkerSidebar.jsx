import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../../services/api";

import "./Stylesheets/HealthworkerSidebar.css";

const HealthworkerSidebar = ({
  isOpen,
  onClose,
}) => {

  const [profile, setProfile] =
    useState(null);

  const navigate = useNavigate();

  const { id } = useParams();

  // =========================
  // LOAD PROFILE
  // =========================

  const loadProfile = useCallback(
    async () => {

      try {

        if (!id) return;

        const res = await API.get(
          `/healthworkers/${id}`
        );

        // ✅ FIXED
        setProfile(res.data);

      } catch (err) {

        console.log(
          "Sidebar Error:",
          err
        );

      }

    },
    [id]
  );

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {

    loadProfile();

    window.addEventListener(
      "storage",
      loadProfile
    );

    return () => {

      window.removeEventListener(
        "storage",
        loadProfile
      );

    };

  }, [loadProfile]);

  return (
    <div
      className={`sidebar ${
        isOpen ? "open" : ""
      }`}
    >

      {/* =========================
          HEADER
      ========================= */}

      <div className="sidebar-header">

        <img
          src={
            profile?.profilePhoto ||
            `https://ui-avatars.com/api/?name=${
              profile?.fullName ||
              "Health Worker"
            }`
          }
          alt="healthworker"
          className="sidebar-avatar"
        />

        <p className="sidebar-name">
          {profile?.fullName ||
            "Health Worker"}
        </p>

        <p className="sidebar-email">
          {profile?.email || ""}
        </p>

        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>

      </div>

      {/* =========================
          MENU
      ========================= */}

      <ul className="sidebar-menu">

        <li
          onClick={() =>
            navigate(
              `/healthworker/${id}`
            )
          }
        >
          🏠 Home
        </li>

        <li
          onClick={() =>
            navigate(
              `/healthworker/${id}/addpatient`
            )
          }
        >
          ➕ Add Patient
        </li>

        <li
          onClick={() =>
            navigate(
              `/healthworker/${id}/allpatients`
            )
          }
        >
          👥 All Patients
        </li>

        <li
          onClick={() =>
            navigate(
              `/healthworker/${id}/healthcamps`
            )
          }
        >
          🏥 Health Camps
        </li>

        <li
          onClick={() =>
            navigate(
              `/healthworker/${id}/profile`
            )
          }
        >
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