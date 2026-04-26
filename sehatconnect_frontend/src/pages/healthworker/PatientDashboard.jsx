import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HNavbar from "./HNavbar";
import API from "../../services/api";
import "./Stylesheets/PatientDashboard.css";

export default function PatientDashboard() {
  const { pid, id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [checkups, setCheckups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientRes = await API.get(`/patients/${pid}`);
        const checkupRes = await API.get(`/checkups/${pid}`);

        setPatient(patientRes.data);
        setCheckups(Array.isArray(checkupRes.data) ? checkupRes.data : []);
      } catch (err) {
        console.log(err);
        setCheckups([]);
      }
    };

    fetchData();
  }, [pid]);

  const latest = checkups.length > 0 ? checkups[0] : null;

  const getRiskLevel = (c) => {
    if (!c) return "UNKNOWN";

    if (
      c.systolic >= 140 ||
      c.diastolic >= 90 ||
      c.spo2 < 92 ||
      c.heartRate > 110
    ) return "HIGH";

    if (
      c.systolic >= 130 ||
      c.diastolic >= 85 ||
      c.spo2 < 95 ||
      c.heartRate > 100
    ) return "MEDIUM";

    return "NORMAL";
  };

  const risk = getRiskLevel(latest);

  return (
    <div>
      <HNavbar />

      <div className="dashboard-container">

        {/* HEADER */}
        <div className="patient-header">

          <div>
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>

            <h2>{patient?.fullName || "Patient"}</h2>
            <p>{patient?.email}</p>
          </div>

          {/* ACTION BUTTONS */}
          <div>
            <button
              className="action-btn green"
              onClick={() =>
                navigate(`/healthworker/${id}/patient/${pid}/checkup`)
              }
            >
              ➕ Add New Checkup
            </button>

            <button
              className="action-btn teal"
              onClick={() =>
                navigate(`/healthworker/${id}/patient/${pid}/history`)
              }
            >
              📊 History
            </button>
          </div>

        </div>

        {/* LATEST CHECKUP */}
        <div className="latest-box">

          <h3>Latest Checkup</h3>

          {latest ? (
            <>
              <p>Heart Rate: {latest.heartRate}</p>
              <p>BP: {latest.systolic}/{latest.diastolic}</p>
              <p>SpO2: {latest.spo2}</p>
              <p>BMI: {latest.bmi}</p>
              <p>Remarks: {latest.remarks}</p>

              <div className={`risk-badge ${risk.toLowerCase()}`}>
                {risk === "HIGH" && "🔴 High Risk"}
                {risk === "MEDIUM" && "🟡 Medium Risk"}
                {risk === "NORMAL" && "🟢 Normal"}
                {risk === "UNKNOWN" && "⚪ Unknown"}
              </div>
            </>
          ) : (
            <p>No checkups yet</p>
          )}
        </div>

        {/* HISTORY */}
        <div className="history-box">
          <h3>History</h3>

          {checkups.length > 0 ? (
            checkups.map((c, index) => (
              <div className="history-card" key={index}>
                <p>📅 {new Date(c.date).toLocaleDateString()}</p>
                <p>BP: {c.systolic}/{c.diastolic}</p>
                <p>HR: {c.heartRate}</p>
                <p>SpO2: {c.spo2}</p>
              </div>
            ))
          ) : (
            <p>No history available</p>
          )}
        </div>

      </div>
    </div>
  );
}