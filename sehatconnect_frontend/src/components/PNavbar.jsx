import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./PNavbar.css";

const PNavbar = ({ profile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); 

  console.log("NAVBAR PROFILE:", profile);

  const handleLogoClick = () => {
    navigate(`/admin/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
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

          <h2 className="navbar-logo" onClick={handleLogoClick}>
            SehatConnect
          </h2>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Search Healthworkers" />
          <button className="crossBtn">✕</button>
        </div>

        <div className="navbar-right">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/admin/${id}/profile`)}
          >
            {profile?.name || "Profile"}
          </span>

          <span
            style={{ cursor: "pointer", marginLeft: "15px" }}
            onClick={handleLogout}
          >
            Logout
          </span>
        </div>
      </nav>

     
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
      />
    </>
  );
};

export default PNavbar;
