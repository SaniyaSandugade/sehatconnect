import React, { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import DNavbar from "./DNavbar";
import DoctorSidebar from "./DoctorSidebar";
import "./Stylesheets/DoctorProfile.css";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState({});
  const [editData, setEditData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [photoFile, setPhotoFile] = useState(null);
  const [password, setPassword] = useState("");

  const doctorId = localStorage.getItem("doctorId");

  // ================= FETCH =================
  const fetchDoctor = useCallback(async () => {
    try {
      const res = await API.get(`/doctors/profile/${doctorId}`);
      setDoctor(res.data);
      setEditData(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchDoctor();
  }, [fetchDoctor]);

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      Object.keys(editData).forEach((key) => {
        formData.append(key, editData[key]);
      });

      if (password) {
        formData.append("password", password);
      }

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const res = await API.put(`/doctors/profile/${doctorId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedDoctor = res.data.doctor;

      // ✅ UPDATE LOCAL STORAGE (FOR SIDEBAR)
      localStorage.setItem(
        "doctorProfile",
        JSON.stringify({
          id: updatedDoctor._id,
          name: updatedDoctor.fullName,
          email: updatedDoctor.email,
          profilePic: updatedDoctor.photo,
        })
      );

      // ✅ FORCE SIDEBAR UPDATE
      window.dispatchEvent(new Event("storage"));

      alert("Profile Updated ✅");

      setEditMode(false);
      setPassword("");
      setPhotoFile(null);

      // ✅ UPDATE UI
      setDoctor(updatedDoctor);
      setEditData(updatedDoctor);

    } catch (err) {
      console.error(err);
      alert("Update Failed ❌");
    }
  };

  // ================= CANCEL =================
  const handleCancel = () => {
    setEditData(doctor);
    setEditMode(false);
    setPassword("");
    setPhotoFile(null);
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete(`/doctors/${doctorId}`);
      alert("Profile Deleted ❌");

      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="doctor-dashboard">

      <DNavbar />

      <DoctorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="doctor-body">
        <div className="doctor-main">

          <div className="dp-container">
            <div className="dp-card">

              {/* PROFILE TOP */}
              <div className="dp-top">
                <img
                  src={
                    photoFile
                      ? URL.createObjectURL(photoFile)
                      : doctor.photo
                  }
                  alt="Doctor"
                  className="dp-image"
                />

                {editMode && (
                  <input
                    type="file"
                    onChange={(e) => setPhotoFile(e.target.files[0])}
                  />
                )}

                <h2>{doctor.fullName}</h2>
                <p>{doctor.specialization}</p>
              </div>

              {/* TABLE */}
              <div className="dp-table">
                {[
                  ["Email", "email"],
                  ["Phone", "phone"],
                  ["Gender", "gender"],
                  ["DOB", "dateOfBirth"],
                  ["Qualification", "qualification"],
                  ["Experience", "experience"],
                  ["License", "licenseNumber"],
                  ["Council", "medicalCouncil"]
                ].map(([label, key]) => (
                  <div className="dp-row" key={key}>
                    <span>{label}</span>

                    {editMode ? (
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
                      <span>
                        {key === "dateOfBirth"
                          ? doctor[key]?.split("T")[0]
                          : key === "experience"
                          ? `${doctor[key]} Years`
                          : doctor[key]}
                      </span>
                    )}
                  </div>
                ))}

                {/* PASSWORD */}
                {editMode && (
                  <div className="dp-row">
                    <span>Password</span>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* BUTTONS */}
              <div className="dp-actions">
                {editMode ? (
                  <>
                    <button className="btn-save" onClick={handleUpdate}>
                      Save
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>
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
      </div>
    </div>
  );
};

export default DoctorProfile;
