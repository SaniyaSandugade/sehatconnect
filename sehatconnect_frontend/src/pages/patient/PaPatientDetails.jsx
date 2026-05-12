import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";  
import PaNavbar from "./PaNavbar";
import "./Stylesheets/PaAddPatient.css";

export default function PaPatientDetails({ isEditMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [details, setDetails] = useState({
    id: "",
    fullName: "",
    age: "",
    gender: "",
    address: "",
    contact: "",
    maritalStatus: "",
    occupation: "",
    education: "",
    addedBy: "",
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


  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.2, 
        maxWidthOrHeight: 400,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);

      setDetails({ ...details, photo: base64 });
    } catch (error) {
      console.error("Image compression failed:", error);
      alert("Failed to compress image. Try again.");
    }
  };

  useEffect(() => {
    const patients = JSON.parse(localStorage.getItem("registeredPatients")) || [];

    if (isEditMode) {
      const found = patients.find((p) => p.id.toString() === id);
      if (found) setDetails(found);
    } else {
      const savedBasic = localStorage.getItem("patientBasic");
      if (savedBasic) {
        const basic = JSON.parse(savedBasic);
        setDetails((prev) => ({
          ...prev,
          fullName: basic.fullName,
          contact: basic.phone,
        }));
      } else {
        alert("Please fill basic details first!");
        navigate("/healthworker/addpatient");
      }
    }
  }, [isEditMode, id, navigate]);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    let patients = JSON.parse(localStorage.getItem("registeredPatients")) || [];

    if (isEditMode) {
      patients = patients.map((p) =>
        p.id.toString() === id ? { ...p, ...details } : p
      );
    } else {
      const newId = Date.now().toString();
      patients.push({ ...details, id: newId });
      localStorage.removeItem("patientBasic");
    }

    localStorage.setItem("registeredPatients", JSON.stringify(patients));
    alert("Patient details saved successfully!");
    navigate("/healthworker/allpatients");
  };

  const handleBack = () => {
    navigate(
      isEditMode
        ? `/healthworker/patient/${id}/dashboard`
        : "/healthworker/addpatient"
    );
  };

  return (
    <div>
      <PaNavbar />
      <div className="add-patient-container">
        <div className="header-row">
          <button onClick={handleBack} className="back-btn">
            ← Back
          </button>
          <h2>{isEditMode ? "Edit Patient Details" : "Enter Personal Details"}</h2>
        </div>

        <form className="add-patient-form" onSubmit={handleSave}>
          <label>Patient Photo:</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoUpload}
          />
          {details.photo && (
            <img
              src={details.photo}
              alt="Patient"
              className="preview-photo"
            />
          )}

          <label>Full Name:</label>
          <input name="fullName" value={details.fullName} onChange={handleChange} />

          <label>Date Of Birth:</label>
          <input name="age" type="date" value={details.age} onChange={handleChange} />

          <label>Gender:</label>
          <select name="gender" value={details.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>

          <label>Address:</label>
          <input name="address" value={details.address} onChange={handleChange} />

          <label>Contact:</label>
          <input name="contact" value={details.contact} onChange={handleChange} />

          <label>Marital Status:</label>
          <select
            name="maritalStatus"
            value={details.maritalStatus}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Married">Married</option>
            <option value="Unmarried">Unmarried</option>
            <option value="Widow">Widow</option>
            <option value="Divorced">Divorced</option>
            <option value="Others">Others</option>
          </select>

          <label>Occupation:</label>
          <input name="occupation" value={details.occupation} onChange={handleChange} />

          <label>Education:</label>
          <input name="education" value={details.education} onChange={handleChange} />

          <label>Past Medical Conditions:</label>
          <input name="pastConditions" value={details.pastConditions} onChange={handleChange} />

          <label>Past Surgeries / Treatments:</label>
          <input name="pastSurgeries" value={details.pastSurgeries} onChange={handleChange} />

          <label>Long-Term Medications:</label>
          <input name="longTermMeds" value={details.longTermMeds} onChange={handleChange} />

          <label>Allergies:</label>
          <input name="allergies" value={details.allergies} onChange={handleChange} />

          <label>Family History:</label>
          <input name="familyHistory" value={details.familyHistory} onChange={handleChange} />

          <label>Lifestyle Basics:</label>
          <input name="lifestyle" value={details.lifestyle} onChange={handleChange} />

          <label>Smoking:</label>
          <select name="smoking" value={details.smoking} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Never">Never</option>
            <option value="Former">Former</option>
            <option value="Current">Current</option>
          </select>

          <label>Alcohol:</label>
          <select name="alcohol" value={details.alcohol} onChange={handleChange}>
            <option value="">Select</option>
            <option value="No">No</option>
            <option value="Occasional">Occasional</option>
            <option value="Frequent">Frequent</option>
          </select>

          <label>Diet Type:</label>
          <select name="diet" value={details.diet} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
            <option value="Mixed">Mixed</option>
          </select>

          <button type="submit" className="next-btn">
            {isEditMode ? "Save Changes" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
