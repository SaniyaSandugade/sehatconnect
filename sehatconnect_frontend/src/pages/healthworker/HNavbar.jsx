import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HealthworkerSidebar from "./HealthworkerSidebar";
import "./Stylesheets/HNavbar.css";

const HNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      <nav className="navbar">

        {/* LEFT SIDE */}
        <div className="navbar-left">
          <button
            className="menu-icon"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h2
            className="navbar-logo"
            onClick={() => navigate(`/healthworker/${id}`)}
          >
            SehatConnect
          </h2>
        </div>

        {/* SEARCH */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Patients..."
          />
          <button
            className="crossBtn"
            onClick={() => {
              document.querySelector(".search-bar input").value = "";
            }}
          >
            ✕
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="navbar-right">

          <button
            className="nav-link"
            onClick={() => {
              if (id) {
                navigate(`/healthworker/${id}/profile`);
              } else {
                alert("User ID missing");
              }
            }}
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

      {/* SIDEBAR */}
      <HealthworkerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default HNavbar;