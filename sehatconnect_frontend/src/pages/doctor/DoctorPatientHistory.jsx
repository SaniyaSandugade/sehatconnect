import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import DNavbar from "./DNavbar"; // ✅ CHANGED
import "./Stylesheets/PatientHistory.css";

export default function DoctorPatientHistory() {
  const { pid } = useParams();
  const [checkups, setCheckups] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get(`/checkups/${pid}`);
        setCheckups(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
        setCheckups([]);
      }
    };

    fetchHistory();
  }, [pid]);

  // ✅ SAME STATUS LOGIC
  const getStatus = (type, value) => {
    if (type === "bp") return value > 130 ? "high" : "normal";
    if (type === "hr") return value > 100 ? "high" : "normal";
    if (type === "spo2") return value < 95 ? "low" : "normal";
    return "normal";
  };

  return (
    <div>
      <DNavbar />

      <div className="history-container">

        {/* HEADER */}
        <div className="history-header">
          <h2>📊 Patient Health Timeline</h2>
          <p>View patient vitals and history records</p>
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

                  {/* DATE */}
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
