import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import HNavbar from "./HNavbar";
import API from "../../services/api";
import "./Stylesheets/AddPatient.css";

export default function PatientDetails() {
  const navigate = useNavigate();
  const { pid } = useParams();

  console.log("PID RECEIVED:", pid); // 🔥 DEBUG

  const [details, setDetails] = useState({
    fullName: "",
    dob: "",
    gender: "",
    address: "",
    contact: "",
    maritalStatus: "",
    occupation: "",
    education: "",
    pastConditions: "",
    pastSurgeries: "",
    longTermMeds: "",
    allergies: "",
    familyHistory: "",
    lifestyle: "",
    smoking: "",
    alcohol: "",
    diet: "",
    photo: "",
  });

  /* FETCH */
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await API.get(`/patients/${pid}`);
        const data = res.data;

        setDetails({
          fullName: data.fullName || "",
          dob: data.dob ? data.dob.substring(0, 10) : "",
          gender: data.gender || "",
          address: data.address || "",
          contact: data.contact || "",
          maritalStatus: data.maritalStatus || "",
          occupation: data.occupation || "",
          education: data.education || "",
          pastConditions: data.pastConditions || "",
          pastSurgeries: data.pastSurgeries || "",
          longTermMeds: data.longTermMeds || "",
          allergies: data.allergies || "",
          familyHistory: data.familyHistory || "",
          lifestyle: data.lifestyle || "",
          smoking: data.smoking || "",
          alcohol: data.alcohol || "",
          diet: data.diet || "",
          photo: data.photo || "",
        });

      } catch (error) {
        console.error("FETCH ERROR:", error.response?.data || error.message);
        alert("Failed to load patient details");
      }
    };

    fetchPatient();
  }, [pid]);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const compressed = await imageCompression(file, {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 400,
    });

    const base64 = await imageCompression.getDataUrlFromFile(compressed);
    setDetails({ ...details, photo: base64 });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await API.put(`/patients/${pid}`, details);
      console.log("UPDATE SUCCESS:", res.data);

      alert("Updated successfully");
      navigate(-1);

    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <HNavbar />

      <div className="add-patient-container">

        <div className="header-row">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <h2>Patient Details</h2>
        </div>

        <form className="add-patient-form" onSubmit={handleSave}>

          <div className="form-grid">

            <div className="photo-section">
              <label>Patient Photo</label>
              <input type="file" onChange={handlePhotoUpload} />
              {details.photo && (
                <img src={details.photo} alt="patient" className="preview-photo" />
              )}
            </div>

            <div className="fields-section">

              <label>Full Name</label>
              <input name="fullName" value={details.fullName} onChange={handleChange} />

              <label>Date of Birth</label>
              <input type="date" name="dob" value={details.dob} onChange={handleChange} />

              <label>Gender</label>
              <select name="gender" value={details.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
              </select>

              <label>Address</label>
              <input name="address" value={details.address} onChange={handleChange} />

              <label>Contact</label>
              <input name="contact" value={details.contact} onChange={handleChange} />

              <label>Marital Status</label>
              <select name="maritalStatus" value={details.maritalStatus} onChange={handleChange}>
                <option value="">Select</option>
                <option>Married</option>
                <option>Unmarried</option>
                <option>Widow</option>
                <option>Divorced</option>
              </select>

              <label>Occupation</label>
              <input name="occupation" value={details.occupation} onChange={handleChange} />

              <label>Education</label>
              <input name="education" value={details.education} onChange={handleChange} />

              <label>Past Conditions</label>
              <input name="pastConditions" value={details.pastConditions} onChange={handleChange} />

              <label>Past Surgeries</label>
              <input name="pastSurgeries" value={details.pastSurgeries} onChange={handleChange} />

              <label>Long-Term Medications</label>
              <input name="longTermMeds" value={details.longTermMeds} onChange={handleChange} />

              <label>Allergies</label>
              <input name="allergies" value={details.allergies} onChange={handleChange} />

              <label>Family History</label>
              <input name="familyHistory" value={details.familyHistory} onChange={handleChange} />

              <label>Lifestyle</label>
              <input name="lifestyle" value={details.lifestyle} onChange={handleChange} />

              <label>Smoking</label>
              <select name="smoking" value={details.smoking} onChange={handleChange}>
                <option value="">Select</option>
                <option>Never</option>
                <option>Former</option>
                <option>Current</option>
              </select>

              <label>Alcohol</label>
              <select name="alcohol" value={details.alcohol} onChange={handleChange}>
                <option value="">Select</option>
                <option>No</option>
                <option>Occasional</option>
                <option>Frequent</option>
              </select>

              <label>Diet</label>
              <select name="diet" value={details.diet} onChange={handleChange}>
                <option value="">Select</option>
                <option>Veg</option>
                <option>Non-Veg</option>
                <option>Mixed</option>
              </select>

            </div>
          </div>

          <button className="next-btn">Update Patient</button>

        </form>
      </div>
    </div>
  );
}