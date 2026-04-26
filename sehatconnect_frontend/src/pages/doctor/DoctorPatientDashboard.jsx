import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DNavbar from "./DNavbar";
import API from "../../services/api";
import "./Stylesheets/PatientDashboard.css";

export default function DoctorPatientDashboard() {
  const { pid, id } = useParams();
  const navigate = useNavigate();

  const doctorId = id || localStorage.getItem("doctorId");

  const [patient, setPatient] = useState(null);
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientRes = await API.get(`/patients/${pid}`);
        const checkupRes = await API.get(`/checkups/${pid}`);

        setPatient(patientRes.data || null);

        const sorted = Array.isArray(checkupRes.data)
          ? checkupRes.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          : [];

        setCheckups(sorted);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pid]);

  if (loading) return <p className="loading">Loading...</p>;

  const latest = checkups[0];

  const getRiskLevel = (c) => {
    if (!c) return "unknown";
    if (c.systolic > 140 || c.heartRate > 110 || c.spo2 < 92) return "high";
    if (c.systolic > 130 || c.heartRate > 100 || c.spo2 < 95) return "medium";
    return "normal";
  };

  const risk = getRiskLevel(latest);

  return (
    <div>
      <DNavbar />

      <div className="dashboard">

        {/* HEADER */}
        <div className="patient-header">
          <div>
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>

            <h2>{patient?.fullName}</h2>
            <p>{patient?.email} • {patient?.phone}</p>
            <p className="location">📍 {patient?.address}</p>
          </div>

          <div className="actions">
            <button
              className="action-btn green"
              onClick={() =>
                navigate(`/doctor/${doctorId}/patient/${pid}/checkup`)
              }
            >
              + Add Checkup
            </button>

            <button
              className="action-btn teal"
              onClick={() =>
                navigate(`/doctor/${doctorId}/patient/${pid}/history`)
              }
            >
              📊 History
            </button>
          </div>
        </div>

        {/* RISK BAR */}
        <div className={`risk-bar ${risk}`}>
          {risk === "high" && "🔴 High Risk – Immediate action needed"}
          {risk === "medium" && "🟡 Moderate Risk – Monitor closely"}
          {risk === "normal" && "🟢 Stable – Vitals normal"}
        </div>

        {/* VITALS */}
        <div className="vitals-grid">
          <Card title="Temperature" value={latest?.temperature} unit="°F" type="red"/>
          <Card title="BP" systolic={latest?.systolic} diastolic={latest?.diastolic} type="blue"/>
          <Card title="SpO2" value={latest?.spo2} unit="%" type="green"/>
          <Card title="Heart Rate" value={latest?.heartRate} unit="bpm" type="purple"/>
          <Card title="BMI" value={latest?.bmi} type="yellow"/>
          <Card title="Weight" value={latest?.weight} unit="kg" type="darkgreen"/>
        </div>

        {/* REMARKS */}
        <div className="remarks-box">
          <h3>📝 Remarks</h3>
          <p>{latest?.remarks || "No remarks available"}</p>
        </div>
      </div>
    </div>
  );
}

/* CARD */
const Card = ({ title, value, unit, systolic, diastolic, type }) => {

  return (
    <div className={`vital-card ${type}`}>
      <p>{title}</p>

      <h1>
        {title === "BP"
          ? (systolic && diastolic ? `${systolic}/${diastolic}` : "--")
          : (value ? `${value} ${unit || ""}` : "--")}
      </h1>

      <span>
        {title === "SpO2" && value < 95 ? "Low" : "Normal"}
      </span>
    </div>
  );
};