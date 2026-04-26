import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Stylesheets/Healthworker.css";
import heroImg from "../../assets/images/hero.png";
import HNavbar from "./HNavbar"; 
import HealthworkerSidebar from "./HealthworkerSidebar";

const Healthworker = () => {
  const navigate = useNavigate(); 

  const [hwData, setHwData] = useState({
    _id: "",
    fullName: "",
    gender: "F",
    email: ""
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userData"));

    if (stored) {
      setHwData({
        _id: stored._id || "",
        fullName: stored.fullName || "",
        gender: stored.gender || "F",
        email: stored.email || "",
      });
    }
  }, []);

  return (
    <div className="healthworker-dashboard">
      
      <HNavbar userEmail={hwData.email} role="healthworker" />

      <div className="healthworker-body">
        <HealthworkerSidebar />

        <div className="healthworker-main">
          <div className="healthworker-content">

            {/* LEFT */}
            <div className="healthworker-left">
              <h1 className="welcome-text">
                Welcome {hwData.gender === "M" ? "Mr." : "Ms."} {hwData.fullName}
              </h1>

              <p className="healthworker-tagline">
                Streamline patient care and health camps in one place.
              </p>

              <div className="healthworker-buttons">

                <button
                  className="btn-primary"
                  onClick={() => navigate(`/healthworker/${hwData._id}/addpatient`)}
                >
                  Add Patient
                </button>

                <button
                  className="btn-primary"
                  onClick={() => navigate(`/healthworker/${hwData._id}/healthcamps`)}
                >
                  Health Camps
                </button>

              </div>
            </div>

            {/* RIGHT */}
            <div className="healthworker-right">
              <img src={heroImg} alt="healthworker illustration" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Healthworker;