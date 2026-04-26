import React, { useEffect, useState } from "react";
import "./StyleSheets/AllDoctor.css";
import { Trash2 } from "lucide-react";
import Navbar from "../../components/PNavbar";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  /* ✅ FETCH ALL DOCTORS */
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/doctors");
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    }
  };

  /* ✅ DELETE DOCTOR */
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?"
    );
    if (!confirmed) return;

    try {
      await fetch(`http://localhost:5000/api/doctors/${id}`, {
        method: "DELETE",
      });

      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="alldoctors-container">
      <Navbar />

      <div className="content">
        <h1>Manage Doctors</h1>
        <p className="location">Primary HealthCare Center</p>

        <div className="doctor-grid">
          {doctors.map((doctor) => (
            <div className="doctor-card" key={doctor._id}>
              <img
                src={doctor.photo || "/default-doctor.png"}
                alt={doctor.fullName}
                className="doctor-img"
              />

              <div className="doctor-info">
                <h3>{doctor.fullName}</h3>
                <p className="spec">{doctor.specialization}</p>
                <p className="exp">
                  Experience: {doctor.experience || 0} yrs
                </p>
                <p className="phone">📞 {doctor.phone}</p>
              </div>

              <button
                className="delete-icon-btn"
                onClick={() => handleDelete(doctor._id)}
                title="Delete Doctor"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {doctors.length === 0 && (
          <p style={{ textAlign: "center" }}>No doctors found</p>
        )}
      </div>
    </div>
  );
};

export default AllDoctors;
