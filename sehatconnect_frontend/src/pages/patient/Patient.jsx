import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Stylesheets/Patient.css";
import heroImg from "../../assets/images/hero.png";
import PaNavbar from "./PaNavbar";
import PaSidebar from "./PaSidebar";

const Patient = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [patientData, setPatientData] = useState({
    fullName: "",
    gender: "",
    email: "",
  });

  // ✅ Helper function for title
  const getTitle = (gender) => {
    if (!gender) return "";

    const g = gender.toLowerCase();

    if (g === "male" || g === "m") return "Mr.";
    if (g === "female" || g === "f") return "Ms.";

    return ""; // optional: "Mx."
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patientData") || "{}");
    const patient = stored.patient || stored;

    setPatientData({
      fullName: patient?.fullName || "Patient",
      gender: patient?.gender || "",
      email: patient?.email || "",
    });

    // 🔍 Debug (remove later)
    console.log("Gender value:", patient?.gender);
  }, []);

  return (
    <div className="healthworker-dashboard">

      <PaNavbar userEmail={patientData.email} role="patient" />

      <div className="healthworker-body">
        <PaSidebar />

        <div className="healthworker-main">
          <div className="healthworker-content">

            <div className="healthworker-left">

              <h1 className="welcome-text">
                Welcome {getTitle(patientData.gender)} {patientData.fullName}
              </h1>

              <p>
                Connecting Patients, Health Workers, and Doctors Seamlessly
              </p>

              <div className="healthworker-buttons">

                <button
                  className="btn-primary"
                  onClick={() => navigate(`/patient/${id}/dashboard`)}
                >
                  Dashboard
                </button>

                <button
                  className="btn-primary"
                  onClick={() => navigate(`/patient/${id}/healthcamps`)}
                >
                  Healthcamps
                </button>

              </div>

            </div>

            <div className="healthworker-right">
              <img src={heroImg} alt="Patient illustration" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;