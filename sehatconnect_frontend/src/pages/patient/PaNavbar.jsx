import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./PaSidebar";
import "./Stylesheets/PaNavbar.css";

const PaNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ FIXED KEY
  const patientId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">

        <div className="navbar-left">
          <button
            className="menu-icon"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h2
            className="navbar-logo"
            onClick={() => navigate(`/patient/${patientId}`)}
          >
            SehatConnect
          </h2>
        </div>

        <div className="navbar-right">

          {/* FIXED: button instead of <a> */}
          <button
            className="nav-link"
            onClick={() => navigate(`/patient/${patientId}/profile`)}
          >
            Profile
          </button>

          <button
            className="nav-link"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      </nav>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default PaNavbar;