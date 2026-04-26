import React, { useEffect, useState } from "react";
import "./StyleSheets/AllHealthworkers.css";
import { Trash2 } from "lucide-react";
import Navbar from "../../components/PNavbar";

const AllHealthworkers = () => {
  const [healthworkers, setHealthworkers] = useState([]);

  // ✅ Fetch all healthworkers from backend
  useEffect(() => {
    fetchHealthworkers();
  }, []);

  const fetchHealthworkers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/healthworkers");
      const data = await res.json();
      setHealthworkers(data);
      console.log("Healthworkers from API:", data);
    } catch (err) {
      console.error("Failed to fetch healthworkers", err);
    }
  };

  // ✅ Delete healthworker
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this healthworker?"
    );
    if (!confirmed) return;

    try {
      await fetch(`http://localhost:5000/api/healthworkers/${id}`, {
        method: "DELETE",
      });
      setHealthworkers((prev) => prev.filter((hw) => hw._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="allhealthworkers-container">
      <Navbar />
      <div className="content">
        <h1>Manage Healthworkers</h1>
        <p className="location">Location: Primary HealthCare Kolhapur</p>

        <div className="healthworker-grid">
          {healthworkers.map((hw) => (
            <div className="healthworker-card" key={hw._id}>
              <img
                src={hw.profilePhoto || "https://i.pravatar.cc/150"}
                alt={hw.fullName}
                className="healthworker-img"
              />

              <div className="healthworker-info">
                <p><strong>Name:</strong> {hw.fullName}</p>
                <p><strong>Role:</strong> {hw.role}</p>
                <p><strong>City:</strong> {hw.domicileCity}</p>
                <p><strong>Email:</strong> {hw.email}</p>
                <p><strong>Phone:</strong> {hw.phone}</p>
              </div>

              <button
                className="delete-icon-btn"
                onClick={() => handleDelete(hw._id)}
                title="Delete Healthworker"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {healthworkers.length === 0 && (
          <p style={{ textAlign: "center" }}>No healthworkers found</p>
        )}
      </div>
    </div>
  );
};

export default AllHealthworkers;
