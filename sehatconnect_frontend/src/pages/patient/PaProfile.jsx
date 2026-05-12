import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import "./Stylesheets/PaProfile.css";

const PaProfile = () => {
  const { id } = useParams();

  let stored = null;
  try {
    stored = JSON.parse(localStorage.getItem("patientData"));
  } catch (e) {
    stored = null;
  }

  const patientId = id || stored?.patient?._id;

  const [patient, setPatient] = useState(null);
  const [editData, setEditData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchPatient = useCallback(async () => {
    try {
      const res = await API.get(`/patients/profile/${patientId}`);
      setPatient(res.data.patient);
      setEditData(res.data.patient);
    } catch (err) {
      alert("Failed to load profile ❌");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // ================= EFFECT =================
  useEffect(() => {
    if (patientId) fetchPatient();
    else setLoading(false);
  }, [patientId, fetchPatient]);

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      const res = await API.put(`/patients/profile/${patientId}`, editData);

      setPatient(res.data.patient);
      setEditMode(false);

      localStorage.setItem(
        "patientData",
        JSON.stringify({ patient: res.data.patient })
      );

      alert("Profile Updated ✅");
    } catch (err) {
      console.error(err);
      alert("Update Failed ❌");
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete(`/patients/profile/${patientId}`);
      localStorage.clear();
      alert("Profile Deleted ❌");
      window.location.href = "/login";
    } catch {
      alert("Delete Failed ❌");
    }
  };

  // ================= LOADING =================
  if (loading) return <h2 className="center-text">Loading...</h2>;
  if (!patient) return <h2 className="center-text">No Data Found</h2>;

  return (
    <div className="patient-dashboard">
      <div className="profile-wrapper">
        <div className="profile-card">

          {/* HEADER */}
          <div className="profile-top">
            <img
              src={
                patient.photo ||
                `https://ui-avatars.com/api/?name=${patient.fullName}`
              }
              alt="Patient"
              className="profile-image"
            />
            <div>
              <h2>{patient.fullName}</h2>
              <p className="role">Patient</p>
            </div>
          </div>

          {/* FORM SECTION */}
          <div className="form-section">
            <h2 className="section-title">Personal Info</h2>

            {[
              ["Email", "email"],
              ["Full Name", "fullName"],
              ["Dob", "dob"],
              ["Gender", "gender"],
              ["Contact", "contact"],
              ["Address", "address"],
              ["Marital Status", "maritalStatus"],
              ["Occupation", "occupation"],
              ["Education", "education"],
              ["Past Conditions", "pastConditions"],
              ["Allergies", "allergies"],
            ].map(([label, key]) => (
              <div className="form-row" key={key}>
                <label>{label}</label>

                {key === "email" ? (
                  <span>{patient.email || "N/A"}</span>
                ) : editMode ? (
                  <input
                    value={editData[key] || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        [key]: e.target.value,
                      })
                    }
                  />
                ) : (
                  <span>{patient[key] || "N/A"}</span>
                )}
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="profile-actions">
            {editMode ? (
              <>
                <button className="btn-save" onClick={handleUpdate}>
                  Save
                </button>

                <button
                  className="btn-cancel"
                  onClick={() => {
                    setEditData(patient);
                    setEditMode(false);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-edit"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>

                <button
                  className="btn-delete"
                  onClick={handleDelete}
                >
                  Delete Profile
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaProfile;
