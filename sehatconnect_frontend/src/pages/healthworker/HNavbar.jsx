import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HealthworkerSidebar from "./HealthworkerSidebar";
import "./Stylesheets/HNavbar.css";

const HNavbar = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const stored = JSON.parse(localStorage.getItem("hwData"));

  const hwId = stored?.healthworker?._id;

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
            onClick={() => navigate(`/healthworker/${hwId}`)}
          >
            SehatConnect
          </h2>

        </div>

        <div className="navbar-right">

          <button
            className="nav-link"
            onClick={() =>
              navigate(`/healthworker/${hwId}/profile`)
            }
          >
            Profile
          </button>

          <button
            className="nav-link"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </button>

        </div>

      </nav>

      <HealthworkerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default HNavbar;