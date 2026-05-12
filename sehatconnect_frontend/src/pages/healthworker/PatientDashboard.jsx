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
  const [loading, setLoading] = useState(true);

  // ML STATES
  const [mlRisk, setMlRisk] = useState(null);
  const [mlConfidence, setMlConfidence] = useState(null);

  useEffect(() => {
    const fetchRisk = async (latest) => {
      if (!latest) return;

      try {
        const res = await API.post("/predict", {
          heartRate: latest.heartRate,
          respiratoryRate: latest.respiratoryRate,
          bpSystolic: latest.systolic,
          bpDiastolic: latest.diastolic,
          spo2: latest.spo2,
          temperatureC: latest.temperature,
          age: latest.age,
          gender: latest.gender,
          weightKg: latest.weight,
          heightCm: latest.height ? latest.height * 100 : 0,
          bmi: latest.derivedBMI,
          derivedHRV: latest.derivedHRV,
          derivedPulsePressure: latest.derivedPulsePressure,
          derivedMAP: latest.derivedMAP
        });

        // ✅ NORMALIZE RESPONSE (IMPORTANT FIX)
        const risk = res.data.riskCategory
          ?.toString()
          .toUpperCase()
          .replace(/\s/g, "_");

        setMlRisk(risk);
        setMlConfidence(res.data.confidence);

      } catch (err) {
        console.log("ML API error:", err);
      }
    };

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

        if (sorted.length > 0) {
          fetchRisk(sorted[0]);
        }

      } catch (err) {
        console.log(err);
        setCheckups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pid]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  const latest = checkups.length > 0 ? checkups[0] : null;

  return (
    <div>
      <HNavbar />

      <div className="dashboard">

        {/* HEADER */}
        <div className="patient-info">
          <div>
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>

            <h2>{patient?.fullName || "Patient"}</h2>

            <p>{patient?.email || "--"} • {patient?.phone || "--"}</p>

            <p>
              Age: {latest?.age || "--"} • Gender: {latest?.gender || "--"}
            </p>

            <p className="location">
              📍 {patient?.address || "Not available"}
            </p>
          </div>

          <div className="actions">
            <button
              className="action-btn green"
              onClick={() =>
                navigate(`/healthworker/${id}/patient/${pid}/checkup`)
              }
            >
              ➕ Add Checkup
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

        {/* AI RISK DISPLAY */}
        <div
          className={`health-status ${
            mlRisk?.includes("HIGH")
              ? "high"
              : mlRisk?.includes("MEDIUM")
              ? "medium"
              : mlRisk?.includes("LOW")
              ? "low"
              : "unknown"
          }`}
        >
          {mlRisk?.includes("HIGH") && "🔴 High Risk – Immediate action needed"}
          {mlRisk?.includes("MEDIUM") && "🟡 Moderate Risk – Monitor closely"}
          {mlRisk?.includes("LOW") && "🟢 Stable – Vitals normal"}
          {!mlRisk && "⚪ No AI prediction available"}
        </div>

        {/* CONFIDENCE */}
        {mlConfidence !== null && (
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            AI Confidence: {mlConfidence}%
          </p>
        )}

        {/* VITALS GRID */}
        <div className="vitals-grid">

          <Card title="Temperature" value={latest?.temperature} unit="°C" />
          <Card title="BP" systolic={latest?.systolic} diastolic={latest?.diastolic} />
          <Card title="SpO2" value={latest?.spo2} unit="%" />
          <Card title="Heart Rate" value={latest?.heartRate} unit="bpm" />
          <Card title="Respiratory Rate" value={latest?.respiratoryRate} unit="rpm" />
          <Card title="Weight" value={latest?.weight} unit="kg" />
          <Card title="Height" value={latest?.height} unit="m" />

          <Card title="BMI" value={latest?.derivedBMI} />
          <Card title="MAP" value={latest?.derivedMAP} />
          <Card title="HRV" value={latest?.derivedHRV} unit="ms" />
          <Card title="Pulse Pressure" value={latest?.derivedPulsePressure} unit="mmHg" />

        </div>

        {/* DETAILS */}
        <div className="patient-details-grid">

          <div className="detail-card">
            <h4>👤 Personal Information</h4>
            <p><strong>Age:</strong> {latest?.age || "--"}</p>
            <p><strong>Gender:</strong> {latest?.gender || "--"}</p>
            <p><strong>Phone:</strong> {patient?.phone || "--"}</p>
            <p><strong>Email:</strong> {patient?.email || "--"}</p>
            <p><strong>Address:</strong> {patient?.address || "--"}</p>
          </div>

          <div className="detail-card">
            <h4>📏 Body Measurements</h4>
            <p><strong>Height:</strong> {latest?.height || "--"} m</p>
            <p><strong>Weight:</strong> {latest?.weight || "--"} kg</p>
            <p><strong>BMI:</strong> {latest?.derivedBMI || "--"}</p>
            <p><strong>Respiratory Rate:</strong> {latest?.respiratoryRate || "--"} rpm</p>
          </div>

          <div className="detail-card">
            <h4>⚠ Health Summary</h4>
            <p><strong>Risk Category:</strong> {mlRisk || "--"}</p>
            <p><strong>Pulse Pressure:</strong> {latest?.derivedPulsePressure || "--"}</p>
            <p><strong>MAP:</strong> {latest?.derivedMAP || "--"}</p>
            <p><strong>HRV:</strong> {latest?.derivedHRV || "--"}</p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {latest?.createdAt
                ? new Date(latest.createdAt).toLocaleString()
                : "--"}
            </p>
          </div>

        </div>

        {/* REMARKS */}
        <div className="recommendation-box">
          <h3>📝 Remarks</h3>
          <p>{latest?.remarks || "No remarks available"}</p>
        </div>

      </div>
    </div>
  );
}

/* ================= CARD COMPONENT ================= */

const Card = ({ title, value, unit, systolic, diastolic }) => {

  const getStatus = () => {

    if (title === "BP") {
      if (!systolic) return "normal";
      if (systolic > 140) return "high";
      if (systolic < 90) return "low";
      return "normal";
    }

    if (title === "Heart Rate") {
      if (!value) return "normal";
      if (value > 100) return "high";
      if (value < 60) return "low";
      return "normal";
    }

    if (title === "SpO2") {
      if (!value) return "normal";
      if (value < 95) return "low";
      return "normal";
    }

    if (title === "BMI") {
      if (!value) return "normal";
      if (value > 30) return "high";
      if (value < 18.5) return "low";
      return "normal";
    }

    if (title === "MAP") {
      if (!value) return "normal";
      if (value > 105) return "high";
      if (value < 70) return "low";
      return "normal";
    }

    if (title === "Pulse Pressure") {
      if (!value) return "normal";
      if (value > 60) return "high";
      return "normal";
    }

    return "normal";
  };

  const status = getStatus();

  return (
    <div className={`vital-card ${status}`}>
      <div className="card-header">{title}</div>

      <h1>
        {title === "BP"
          ? systolic && diastolic
            ? `${systolic}/${diastolic}`
            : "--"
          : value !== undefined && value !== null && value !== ""
          ? `${value}${unit ? ` ${unit}` : ""}`
          : "--"}
      </h1>

      <span className={`status ${status}`}>
        {status === "high" ? "High" : status === "low" ? "Low" : "Normal"}
      </span>
    </div>
  );
};