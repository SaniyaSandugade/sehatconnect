import React, { useEffect, useState } from "react";
import "./StyleSheets/AllHealthworkers.css";
import { Trash2 } from "lucide-react";
import Navbar from "../../components/PNavbar";

const AllHealthworkers = () => {

  const [healthworkers, setHealthworkers] =
    useState([]);

  // FETCH
  useEffect(() => {
    fetchHealthworkers();
  }, []);

  const fetchHealthworkers = async () => {
    try {

      const res = await fetch(
        "http://localhost:5000/api/healthworkers"
      );

      const data = await res.json();

      console.log("Healthworkers:", data);

      setHealthworkers(data);

    } catch (err) {

      console.error(
        "Failed to fetch healthworkers",
        err
      );
    }
  };

  // DELETE
  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Delete this healthworker?"
    );

    if (!confirmed) return;

    try {

      await fetch(
        `http://localhost:5000/api/healthworkers/${id}`,
        {
          method: "DELETE",
        }
      );

      setHealthworkers((prev) =>
        prev.filter((hw) => hw._id !== id)
      );

    } catch (err) {

      console.error("Delete failed", err);
    }
  };

  return (
    <div className="allhealthworkers-container">

      <Navbar />

      <div className="content">

        <h1>Manage Healthworkers</h1>

        <p className="location">
          Location: Primary HealthCare Kolhapur
        </p>

        <div className="healthworker-grid">

          {healthworkers.map((hw) => (

            <div
              className="healthworker-card"
              key={hw._id}
            >

              {/* IMAGE */}
              <img
  src={
    hw.profilePhoto
      ? hw.profilePhoto
      : "https://via.placeholder.com/150"
  }
  alt={hw.fullName}
  className="healthworker-img"
/>

              {/* INFO */}
              <div className="healthworker-info">

                <p>
                  <strong>Name:</strong>{" "}
                  {hw.fullName}
                </p>

                <p>
                  <strong>Role:</strong>{" "}
                  {hw.role || "N/A"}
                </p>

                <p>
                  <strong>City:</strong>{" "}
                  {hw.domicileCity || "N/A"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {hw.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {hw.phone}
                </p>

              </div>

              {/* DELETE */}
              <button
                className="delete-icon-btn"
                onClick={() =>
                  handleDelete(hw._id)
                }
              >
                <Trash2 size={18} />
              </button>

            </div>
          ))}

        </div>

        {healthworkers.length === 0 && (
          <p style={{ textAlign: "center" }}>
            No healthworkers found
          </p>
        )}

      </div>
    </div>
  );
};

export default AllHealthworkers;