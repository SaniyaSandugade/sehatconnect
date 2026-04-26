import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Sidebar.css";
import defaultAvatar from "../assets/images/admin.jpeg";

const Sidebar = ({ isOpen, onClose, profile }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // 🔎 Debug (remove later)
  useEffect(() => {
    console.log("Sidebar received profile:", profile);
  }, [profile]);

  // ✅ Safe values
  const avatar =
    profile && profile.profilePic
      ? profile.profilePic
      : defaultAvatar;

  const name =
    profile && (profile.name || profile.fullName)
      ? profile.name || profile.fullName
      : "Admin";

  const phone =
    profile && (profile.phone || profile.phoneNumber || profile.mobile)
      ? profile.phone || profile.phoneNumber || profile.mobile
      : "Not Available";

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <img
          key={avatar}   // 🔥 forces re-render when image changes
          src={avatar}
          alt="Admin Avatar"
          className="sidebar-avatar"
        />

        <p className="sidebar-name">{name}</p>
        <p className="sidebar-phone">{phone}</p>

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <ul className="sidebar-menu">
        <li onClick={() => navigate(`/admin/${id}/dashboard`)}>
          Dashboard
        </li>

        <li onClick={() => navigate(`/admin/${id}/alldoctors`)}>
          Manage Doctors
        </li>

        <li onClick={() => navigate(`/admin/${id}/allhealthworkers`)}>
          Manage Healthworkers
        </li>

        <li onClick={() => navigate(`/admin/${id}/addDoctor`)}>
          Add Doctor
        </li>

        <li onClick={() => navigate(`/admin/${id}/addHealthworker`)}>
          Add Healthworker
        </li>

        <li onClick={() => navigate(`/admin/${id}/healthcamps`)}>
          Health Camps
        </li>

        <li onClick={() => navigate(`/admin/${id}/profile`)}>
          Profile
        </li>

        <li
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Log out
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
