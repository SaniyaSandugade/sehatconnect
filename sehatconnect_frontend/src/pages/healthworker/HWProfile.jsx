import React, { useState, useEffect } from "react";
import HNavbar from "./HNavbar";
import HealthworkerSidebar from "./HealthworkerSidebar";
import API from "../../services/api";
import "./Stylesheets/HWProfile.css";

export default function HWProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    _id: "",
    name: "",
    email: "",
    healthcareCenter: "",
    location: "",
    phone: "",
    profilePic: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // ✅ LOAD PROFILE (FIXED SAFE VERSION)
// ONLY showing IMPORTANT fixed parts

// ✅ FETCH PROFILE
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("hwData"));
      const id = stored?.healthworker?._id;

      if (!id) {
        alert("Please login again");
        return;
      }

      const res = await API.get(`/healthworkers/${id}`);
      setProfile(res.data);

      localStorage.setItem(
        "hwData",
        JSON.stringify({ healthworker: res.data })
      );

    } catch (err) {
      console.log("Failed to load profile", err);
    }
  };

  fetchProfile();
}, []);
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // ✅ SAVE PROFILE (FULL FIX)
  const handleSave = async () => {
    try {
      const userId = profile?._id;

      if (!userId) {
        alert("Profile not loaded properly. Please login again.");
        return;
      }

      const res = await API.put(
        `/healthworkers/${userId}`,
        profile
      );

      const updated = res.data;

      setProfile(updated);

      // 🔥 SYNC LOCAL STORAGE
      localStorage.setItem(
        "hwData",
        JSON.stringify({ healthworker: updated })
      );

      // 🔥 SYNC SIDEBAR
      window.dispatchEvent(new Event("profileUpdated"));

      alert("Profile updated successfully!");
      setIsEditing(false);

    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async () => {
    try {
      await API.put("/auth/change-password", passwordData);

      alert("Password updated successfully!");
      setPasswordData({ oldPassword: "", newPassword: "" });

    } catch (err) {
      console.log(err);
      alert("Failed to update password");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div>
      <HNavbar />

      <div className="hw-layout">
        <HealthworkerSidebar />

        <div className="hw-profile-container">
          <div className="hw-profile-card">

            {/* PHOTO */}
            <div className="profile-photo-section">
              {profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt="profile"
                  className="profile-photo"
                />
              ) : (
                <div className="photo-placeholder">📷</div>
              )}

              {isEditing && (
                <input type="file" onChange={handleImageChange} />
              )}
            </div>

            {/* DETAILS */}
            <div className="profile-details">

              {isEditing ? (
                <>
                  <input
                    name="fullName"
                    value={profile.fullName || ""}
                    onChange={handleChange}
                    placeholder="Name"
                  />

                  <input
                    name="email"
                    value={profile.email || ""}
                    onChange={handleChange}
                    placeholder="Email"
                  />

                  <input
                    name="healthcareCenter"
                    value={profile.healthcareCenter || ""}
                    onChange={handleChange}
                    placeholder="Healthcare Center"
                  />

                  <input
                    name="location"
                    value={profile.location || ""}
                    onChange={handleChange}
                    placeholder="Location"
                  />

                  <input
                    name="phone"
                    value={profile.phone || ""}
                    onChange={handleChange}
                    placeholder="Phone"
                  />

                  <button className="save-btn" onClick={handleSave}>
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <h2>{profile.fullName}</h2>
                  <p>{profile.email}</p>
                  <p>{profile.healthcareCenter}</p>
                  <p>{profile.location}</p>
                  <p>{profile.phone}</p>

                  <button
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                </>
              )}
            </div>

            <hr className="divider" />

            {/* PASSWORD */}
            <div className="password-form">
              <h3>Change Password</h3>

              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
              />

              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />

              <button className="change-btn" onClick={handleChangePassword}>
                Update Password
              </button>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}