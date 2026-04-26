import { useEffect, useState } from "react"; 
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import DNavbar from "./DNavbar";
import "./Stylesheets/AllPatients.css";

export default function DoctorAllPatients() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const doctorId = id || localStorage.getItem("doctorId");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get("/patients");

        const data = res.data;

        if (Array.isArray(data)) {
          setPatients(data);
        } else if (Array.isArray(data?.patients)) {
          setPatients(data.patients);
        } else {
          setPatients([]);
        }
      } catch (err) {
        console.log("Fetch error:", err);
        setPatients([]);
      }
    };

    fetchPatients();
  }, []);

  const handleDelete = async (pid) => {
    const confirmDelete = window.confirm("Delete this patient?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/patients/${pid}`);
      setPatients((prev) => prev.filter((p) => p._id !== pid));
      alert("Patient deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Failed to delete patient");
    }
  };

  return (
    <div>
      <DNavbar />

      <div className="patients-container">
        <h2>All Patients</h2>

        {patients.length === 0 ? (
          <p>No patients found</p>
        ) : (
          <div className="patients-grid">

            {patients.map((patient) => (
              <div className="patient-card" key={patient._id}>

                {/* PHOTO */}
                {patient.photo && (
                  <img
                    src={patient.photo}
                    alt="Patient"
                    className="patient-photo"
                  />
                )}

                {/* HEADER */}
                <div className="patient-header">
                  <h3>{patient.fullName}</h3>

                  <span
                    className="delete-icon"
                    onClick={() => handleDelete(patient._id)}
                  >
                    🗑️
                  </span>
                </div>

                {/* INFO */}
                <p>{patient.email || "No email"}</p>
                <p>{patient.contact || patient.phone || "No contact"}</p>

                {/* 🔥 BUTTONS WRAPPED (ONLY CHANGE) */}
                <div className="card-actions">

                  <button
                    className="dashboard-btn"
                    onClick={() =>
                      navigate(`/doctor/${doctorId}/patient/${patient._id}/dashboard`)
                    }
                  >
                    📊 Dashboard
                  </button>

                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate(`/doctor/${doctorId}/patient/${patient._id}/details`)
                    }
                  >
                    📄 View Details
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}