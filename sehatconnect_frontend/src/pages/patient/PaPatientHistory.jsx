import React, { useEffect, useState } from "react";
import API from "../../services/api";
import PaNavbar from "./PaNavbar";
import "./Stylesheets/PaPatientHistory.css";

export default function PaPatientHistory() {
  const patientId = localStorage.getItem("userId");
  const [checkups, setCheckups] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!patientId) return;
        const res = await API.get(`/checkups/${patientId}`);
        setCheckups(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
        setCheckups([]);
      }
    };

    fetchHistory();
  }, [patientId]);

  const getStatus = (type, value) => {
    if (type === "bp") return value > 130 ? "high" : "normal";
    if (type === "hr") return value > 100 ? "high" : "normal";
    if (type === "spo2") return value < 95 ? "low" : "normal";
    return "normal";
  };

  return (
    <div>
      <PaNavbar />

      <div className="history-container">

        {/* HEADER */}
        <div className="history-header">
          <h2>📊 Health Timeline</h2>
          <p>Track your vitals and monitor your progress over time</p>
        </div>

        {checkups.length === 0 ? (
          <p className="no-data">No history available</p>
        ) : (
          <div className="history-grid">
            {checkups.map((c) => {
              const bpStatus = getStatus("bp", c.systolic);
              const hrStatus = getStatus("hr", c.heartRate);
              const spo2Status = getStatus("spo2", c.spo2);

              return (
                <div className="history-card" key={c._id}>

                  {/* DATE BADGE */}
                  <div className="card-date">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>

                  {/* VITALS */}
                  <div className="vitals">

                    <div className={`vital ${bpStatus}`}>
                      <span>🩸 BP</span>
                      <b>{c.systolic}/{c.diastolic}</b>
                    </div>

                    <div className={`vital ${hrStatus}`}>
                      <span>❤️ Heart Rate</span>
                      <b>{c.heartRate} bpm</b>
                    </div>

                    <div className={`vital ${spo2Status}`}>
                      <span>🫁 SpO2</span>
                      <b>{c.spo2}%</b>
                    </div>

                    <div className="vital normal">
                      <span>⚖ BMI</span>
                      <b>{c.bmi || "--"}</b>
                    </div>

                    <div className="vital normal">
                      <span>🌡 Temp</span>
                      <b>{c.temperature ?? "--"}°F</b>
                    </div>

                  </div>

                  {/* REMARKS */}
                  <div className="remarks">
                    💬 {c.remarks || "No remarks"}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}