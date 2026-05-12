import React, { useEffect, useState } from "react";
import API from "../../services/api";
import PaSidebar from "./PaSidebar";
import PaNavbar from "./PaNavbar";
import "./Stylesheets/Patient.css";

const PaHealthCamp = () => {
  const [camps, setCamps] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      const res = await API.get("/healthcamps");
      setCamps(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="layout">

      {/* 🔵 Navbar */}
      <PaNavbar />

      <div className="container">

        {/* 🟢 Sidebar */}
        <PaSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* 🟡 Main Content */}
        <div className={`main ${sidebarOpen ? "shift" : ""}`}>

          {/* Top bar */}
          <div className="topbar">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h2>Health Camps</h2>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Camp Name</th>
                  <th>Location</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {camps.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No camps available
                    </td>
                  </tr>
                ) : (
                  camps.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.location}</td>
                      <td>{c.date?.split("T")[0]}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaHealthCamp;