import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./DoctorSidebar";
import "./Stylesheets/DNavbar.css";

const DNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const doctorId = localStorage.getItem("doctorId");

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="menu-icon" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>

          <h2 className="navbar-logo" onClick={() => navigate(`/doctor/${doctorId}`)}>
            SehatConnect
          </h2>
        </div>

        <div className="navbar-right">
  <a onClick={() => navigate("/login")}>Logout</a>
</div>
      </nav>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default DNavbar;