import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PaNavbar from "./PaNavbar";
import API from "../../services/api";

import "./Stylesheets/PaPatientDashboard.css";

export default function PaPatientDashboard() {

  const navigate = useNavigate();

  const patientId = localStorage.getItem("userId");

  const [patient, setPatient] = useState(null);
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {

      try {

        if (!patientId) {
          setLoading(false);
          return;
        }

        const patientRes = await API.get(`/patients/${patientId}`);

        const checkupRes = await API.get(`/checkups/${patientId}`);

        setPatient(patientRes.data || null);

        const sorted = Array.isArray(checkupRes.data)
          ? checkupRes.data.sort(
              (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            )
          : [];

        setCheckups(sorted);

      } catch (err) {

        console.log(err);
        setCheckups([]);

      } finally {

        setLoading(false);

      }
    };

    fetchData();

  }, [patientId]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  const latest = checkups.length > 0 ? checkups[0] : null;

  /* ================= RISK ================= */

  const getRiskLevel = (c) => {

    if (!c) return "unknown";

    if (
      c.systolic > 140 ||
      c.heartRate > 110 ||
      c.spo2 < 92 ||
      c.temperature > 38 ||
      c.respiratoryRate > 24
    ) {
      return "high";
    }

    if (
      c.systolic > 130 ||
      c.heartRate > 100 ||
      c.spo2 < 95 ||
      c.temperature > 37.5
    ) {
      return "medium";
    }

    return "normal";
  };

  const risk = getRiskLevel(latest);

  return (
    <div>

      {/* ================= NAVBAR ================= */}

      <PaNavbar />

      <div className="dashboard">

        {/* ================= HEADER ================= */}

        <div className="patient-info">

          <div>

            <button
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            <h2>{patient?.fullName || "Patient"}</h2>

            <p>
              {patient?.email || "--"} • {patient?.phone || "--"}
            </p>

            <p>
              Age: {latest?.age || "--"} •
              Gender: {latest?.gender || "--"}
            </p>

            <p className="location">
              📍 {patient?.address || "Not available"}
            </p>

          </div>

        </div>

        {/* ================= HEALTH STATUS ================= */}

        <div className={`health-status ${risk}`}>

          {risk === "high" &&
            "🔴 High Risk – Immediate action needed"}

          {risk === "medium" &&
            "🟡 Moderate Risk – Monitor closely"}

          {risk === "normal" &&
            "🟢 Stable – Vitals normal"}

          {risk === "unknown" &&
            "⚪ No data"}

        </div>

        {/* ================= VITALS ================= */}

        <div className="vitals-grid">

          <Card
            title="Temperature"
            value={latest?.temperature}
            unit="°C"
          />

          <Card
            title="BP"
            systolic={latest?.systolic}
            diastolic={latest?.diastolic}
          />

          <Card
            title="SpO2"
            value={latest?.spo2}
            unit="%"
          />

          <Card
            title="Heart Rate"
            value={latest?.heartRate}
            unit="bpm"
          />

          <Card
            title="Respiratory Rate"
            value={latest?.respiratoryRate}
            unit="rpm"
          />

          <Card
            title="Weight"
            value={latest?.weight}
            unit="kg"
          />

          <Card
            title="Height"
            value={latest?.height}
            unit="m"
          />

          {/* ================= DERIVED METRICS ================= */}

          <Card
            title="BMI"
            value={latest?.derivedBMI}
          />

          <Card
            title="MAP"
            value={latest?.derivedMAP}
          />

          <Card
            title="HRV"
            value={latest?.derivedHRV}
            unit="ms"
          />

          <Card
            title="Pulse Pressure"
            value={latest?.derivedPulsePressure}
            unit="mmHg"
          />

        </div>

        {/* ================= DETAILS ================= */}

        <div className="patient-details-grid">

          {/* PERSONAL */}

          <div className="detail-card">

            <h4>👤 Personal Information</h4>

            <p>
              <strong>Age:</strong> {latest?.age || "--"}
            </p>

            <p>
              <strong>Gender:</strong> {latest?.gender || "--"}
            </p>

            <p>
              <strong>Phone:</strong> {patient?.phone || "--"}
            </p>

            <p>
              <strong>Email:</strong> {patient?.email || "--"}
            </p>

            <p>
              <strong>Address:</strong> {patient?.address || "--"}
            </p>

          </div>

          {/* BODY */}

          <div className="detail-card">

            <h4>📏 Body Measurements</h4>

            <p>
              <strong>Height:</strong> {latest?.height || "--"} m
            </p>

            <p>
              <strong>Weight:</strong> {latest?.weight || "--"} kg
            </p>

            <p>
              <strong>BMI:</strong> {latest?.derivedBMI || "--"}
            </p>

            <p>
              <strong>Respiratory Rate:</strong>{" "}
              {latest?.respiratoryRate || "--"} rpm
            </p>

          </div>

          {/* HEALTH */}

          <div className="detail-card">

            <h4>⚠ Health Summary</h4>

            <p>
              <strong>Risk Category:</strong>{" "}
              {latest?.riskCategory || risk || "--"}
            </p>

            <p>
              <strong>Symptoms:</strong>{" "}
              {latest?.symptoms || "No symptoms reported"}
            </p>

            <p>
              <strong>Pulse Pressure:</strong>{" "}
              {latest?.derivedPulsePressure || "--"}
            </p>

            <p>
              <strong>MAP:</strong>{" "}
              {latest?.derivedMAP || "--"}
            </p>

            <p>
              <strong>HRV:</strong>{" "}
              {latest?.derivedHRV || "--"}
            </p>

            <p>
              <strong>Timestamp:</strong>{" "}

              {latest?.createdAt
                ? new Date(latest.createdAt).toLocaleString()
                : "--"}

            </p>

          </div>

        </div>

        {/* ================= REMARKS ================= */}

        <div className="recommendation-box">

          <h3>📝 Remarks</h3>

          <p>
            {latest?.remarks || "No remarks available"}
          </p>

        </div>

      </div>

    </div>
  );
}

/* ================= CARD COMPONENT ================= */

const Card = ({
  title,
  value,
  unit,
  systolic,
  diastolic
}) => {

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

    if (title === "Temperature") {

      if (!value) return "normal";

      if (value > 38) return "high";

      if (value < 35) return "low";

      return "normal";
    }

    if (title === "Respiratory Rate") {

      if (!value) return "normal";

      if (value > 24) return "high";

      if (value < 12) return "low";

      return "normal";
    }

    if (title === "Weight") {

      if (!value) return "normal";

      if (value > 120) return "high";

      if (value < 40) return "low";

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

      if (value < 30) return "low";

      return "normal";
    }

    if (title === "HRV") {

      if (!value) return "normal";

      if (value < 20) return "high";

      if (value > 100) return "low";

      return "normal";
    }

    return "normal";
  };

  const status = getStatus();

  return (

    <div className={`vital-card ${status}`}>

      <div className="card-header">
        {title}
      </div>

      <h1>

        {title === "BP"
          ? systolic !== undefined &&
            diastolic !== undefined
            ? `${systolic}/${diastolic}`
            : "--"
          : value !== undefined &&
            value !== null &&
            value !== ""
          ? `${value}${unit ? ` ${unit}` : ""}`
          : "--"}

      </h1>

      <span className={`status ${status}`}>

        {status === "high"
          ? "High"
          : status === "low"
          ? "Low"
          : "Normal"}

      </span>

    </div>
  );
};