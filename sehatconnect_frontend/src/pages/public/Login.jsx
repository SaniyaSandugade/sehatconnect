import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../../services/api";
import "./Login.css";
import logo from "../../assets/images/logo-512.png";

const Login = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!role) {
      alert("Please select your role!");
      return;
    }

    setLoading(true);

    try {
      // ✅ Correct endpoints
      let endpoint = "";

      switch (role) {
        case "admin":
          endpoint = "/admin/login";
          break;

        case "doctor":
          endpoint = "/doctors/login";
          break;

        case "healthworker":
          endpoint = "/healthworkers/login";
          break;

        // ✅ FIXED (was /patient/login)
        case "patient":
          endpoint = "/patients/login";
          break;

        default:
          endpoint = "/auth/login";
      }

      // ✅ API request
      const res = await API.post(endpoint, {
        email,
        password,
      });

      // ✅ Get user object
      let userData = null;

      switch (role) {
        case "admin":
          userData = res.data.admin;
          break;

        case "doctor":
          userData = res.data.doctor;
          break;

        case "healthworker":
          userData = res.data.hw;
          break;

        case "patient":
          userData = res.data.patient;
          break;

        default:
          userData = res.data.user;
      }

      if (!userData) {
        alert("Invalid login response");
        setLoading(false);
        return;
      }

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Save role
      localStorage.setItem("role", role);

      // =========================
      // ADMIN
      // =========================
      if (role === "admin") {
        localStorage.setItem(
          "adminData",
          JSON.stringify({
            admin: userData,
          })
        );

        navigate(`/admin/${userData._id}`);
      }

      // =========================
      // DOCTOR
      // =========================
      else if (role === "doctor") {
        localStorage.setItem("doctorId", userData._id);

        localStorage.setItem(
          "doctorData",
          JSON.stringify({
            doctor: userData,
          })
        );

        localStorage.setItem(
          "doctorProfile",
          JSON.stringify({
            id: userData._id,
            name: userData.fullName,
            email: userData.email,
            profilePic: userData.photo,
          })
        );

        navigate(`/doctor/${userData._id}`);
      }

      // =========================
      // HEALTHWORKER
      // =========================
      else if (role === "healthworker") {
        localStorage.setItem(
          "hwData",
          JSON.stringify({
            healthworker: userData,
          })
        );

        navigate(`/healthworker/${userData._id}`);
      }

      // =========================
      // PATIENT
      // =========================
      else if (role === "patient") {
        localStorage.setItem(
          "patientData",
          JSON.stringify({
            patient: userData,
          })
        );

        localStorage.setItem("patientId", userData._id);

        navigate(`/patient/${userData._id}`);
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Login failed. Please check email/password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div className="login-header">
          <img
            src={logo}
            alt="SehatConnect logo"
            className="login-logo"
          />

          <h1 className="app-title">
            SehatConnect
          </h1>
        </div>

        <h2 className="login-title">
          LOGIN
        </h2>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <label>Email Id :</label>

          <input
            type="email"
            placeholder="Enter your mail ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password :</label>

          <div
            className="password-container"
            style={{ position: "relative" }}
          >

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                paddingRight: "40px",
              }}
            />

            <span
              onClick={() =>
                setShowPassword(!showPassword)
              }
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#555",
              }}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </span>

          </div>

          <label>Select your role :</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">
              -- Select your role --
            </option>

            <option value="patient">
              Patient
            </option>

            <option value="doctor">
              Doctor
            </option>

            <option value="healthworker">
              Healthworker
            </option>

            <option value="admin">
              Admin
            </option>
          </select>

          <p className="forgot-password">
            Forgot your password?
          </p>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;