import React, { useState, useEffect } from "react";
import Navbar from "../../components/PNavbar";
import API from "../../services/api";
import "./StyleSheets/Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // ✅ Fetch Admin Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/admin/profile");
        setProfile(res.data);
      } catch (err) {
        console.error(
          "Profile fetch error:",
          err.response?.data || err.message
        );
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return <h2 style={{ textAlign: "center" }}>Loading profile...</h2>;
  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!profile) return null;

  // ✅ Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setProfile((prev) => ({ ...prev, profilePic: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (passwords.new && passwords.new !== passwords.confirm) {
      alert("❌ New password and confirm password do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone || "");

      if (imageFile) formData.append("profilePic", imageFile);
      if (passwords.new) formData.append("password", passwords.new);

      const res = await API.put("/admin/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);
      setPasswords({ current: "", new: "", confirm: "" });
      setImageFile(null);

      alert("✅ Profile updated successfully");
    } catch (err) {
      console.error(
        "Profile update error:",
        err.response?.data || err.message
      );
      alert("❌ Profile update failed");
    }
  };

  return (
    <div className="profile-container">
      <Navbar />
      <div className="content">
        <h2>Admin Profile</h2>

        <div className="profile-card">
          {/* Profile Picture */}
          <div className="profile-img-section">
            <img
              src={profile.profilePic || "/default-avatar.png"}
              alt="Profile"
              className="profile-img"
            />
            <label className="file-label">
              Upload Profile Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" value={profile.email || ""} readOnly />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input value="Admin" readOnly />
            </div>

            {/* Password Change */}
            <h4>Change Password</h4>

            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="current"
                value={passwords.current}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="new"
                value={passwords.new}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirm"
                value={passwords.confirm}
                onChange={handlePasswordChange}
              />
            </div>

            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
