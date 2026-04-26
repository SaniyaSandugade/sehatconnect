import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import HNavbar from "./HNavbar";
import "./Stylesheets/PatientHistory.css";

export default function CheckupHistory() {
  const { pid } = useParams();

  const [checkups, setCheckups] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get(`/checkups/${pid}`);

        // SAFE HANDLING
        setCheckups(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
        setCheckups([]);
      }
    };

    fetchHistory();
  }, [pid]);

  return (
    <div>
      <HNavbar />

      <div className="history-container">
        <h2>📊 Checkup History</h2>

        {checkups.length === 0 ? (
          <p>No history available</p>
        ) : (
          <div className="history-grid">

            {checkups.map((c) => (
              <div className="history-card" key={c._id}>

                <h3>
                  📅 {new Date(c.createdAt).toLocaleDateString()}
                </h3>

                <p>🩺 BP: {c.systolic}/{c.diastolic}</p>
                <p>❤️ Heart Rate: {c.heartRate}</p>
                <p>🫁 SpO2: {c.spo2}</p>
                <p>⚖ BMI: {c.bmi}</p>

                {c.remarks && (
                  <p>📝 {c.remarks}</p>
                )}

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}