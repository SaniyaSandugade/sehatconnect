import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DNavbar from "./DNavbar";
import API from "../../services/api";
import "./Stylesheets/NewCheckupForm.css";

export default function DNewCheckupForm() {

  const { id, pid } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    doctorName: "",
    age: "",
    gender: "",

    heartRate: "",
    respiratoryRate: "",
    temperature: "",
    spo2: "",

    systolic: "",
    diastolic: "",

    weight: "",
    height: "",

    symptoms: "",
    remarks: "",
  });

  // =========================
  // AUTO FILL DOCTOR NAME
  // =========================

  useEffect(() => {

    const storedDoctor =
      JSON.parse(
        localStorage.getItem("doctorData")
      );

    if (storedDoctor?.doctor?.fullName) {

      setForm((prev) => ({
        ...prev,
        doctorName:
          storedDoctor.doctor.fullName,
      }));
    }

  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // BMI
  // =========================

  const calculateBMI = () => {

    const weight =
      Number(form.weight);

    const height =
      Number(form.height);

    if (weight && height) {

      return (
        weight / ((height / 100) ** 2)
      ).toFixed(1);
    }

    return "";
  };

  // =========================
  // HRV
  // =========================

  const calculateHRV = () => {

    const hr =
      Number(form.heartRate);

    if (!hr) return "";

    return (
      60 / hr
    ).toFixed(2);
  };

  // =========================
  // PULSE PRESSURE
  // =========================

  const calculatePulsePressure = () => {

    const sys =
      Number(form.systolic);

    const dia =
      Number(form.diastolic);

    if (!sys || !dia) return "";

    return sys - dia;
  };

  // =========================
  // MAP
  // =========================

  const calculateMAP = () => {

    const sys =
      Number(form.systolic);

    const dia =
      Number(form.diastolic);

    if (!sys || !dia) return "";

    return (
      (sys + 2 * dia) / 3
    ).toFixed(1);
  };

  // =========================
  // RISK CATEGORY
  // =========================

  const getRiskCategory = () => {

    const bmi =
      Number(calculateBMI());

    const spo2 =
      Number(form.spo2);

    const sys =
      Number(form.systolic);

    if (
      bmi > 30 ||
      spo2 < 92 ||
      sys > 160
    ) {
      return "High";
    }

    if (
      bmi > 25 ||
      spo2 < 95
    ) {
      return "Moderate";
    }

    return "Low";
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const payload = {
        ...form,

        bmi: calculateBMI(),

        hrv: calculateHRV(),

        pulsePressure:
          calculatePulsePressure(),

        map: calculateMAP(),

        riskCategory:
          getRiskCategory(),

        doctorId: id,
      };

      await API.post(
        `/checkups/${id}/${pid}`,
        payload
      );

      alert(
        "Checkup saved successfully!"
      );

      navigate(-1);

    } catch (err) {

      console.log(err);

      alert(
        "Failed to save checkup"
      );
    }
  };

  return (
    <div>

      <DNavbar />

      <div className="add-patient-container">

        <h2>
          Doctor Health Checkup
        </h2>

        <form
          onSubmit={handleSubmit}
          className="add-patient-form"
        >

          {/* ROW 1 */}

          <input
            name="doctorName"
            value={form.doctorName}
            onChange={handleChange}
            placeholder="Doctor Name"
          />

          <input
            name="age"
            type="number"
            placeholder="Age"
            onChange={handleChange}
            required
          />

          {/* ROW 2 */}

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>

          </select>

          <input
            name="heartRate"
            type="number"
            placeholder="Heart Rate"
            onChange={handleChange}
            required
          />

          {/* ROW 3 */}

          <input
            name="respiratoryRate"
            type="number"
            placeholder="Respiratory Rate"
            onChange={handleChange}
          />

          <input
            name="temperature"
            type="number"
            placeholder="Body Temperature"
            onChange={handleChange}
            required
          />

          {/* ROW 4 */}

          <input
            name="spo2"
            type="number"
            placeholder="Oxygen Saturation"
            onChange={handleChange}
            required
          />

          <input
            name="systolic"
            type="number"
            placeholder="Systolic Blood Pressure"
            onChange={handleChange}
            required
          />

          {/* ROW 5 */}

          <input
            name="diastolic"
            type="number"
            placeholder="Diastolic Blood Pressure"
            onChange={handleChange}
            required
          />

          <input
            name="weight"
            type="number"
            placeholder="Weight (kg)"
            onChange={handleChange}
            required
          />

          {/* ROW 6 */}

          <input
            name="height"
            type="number"
            placeholder="Height (cm)"
            onChange={handleChange}
            required
          />

          {/* RESULTS */}

          <p>
            BMI:
            <strong>
              {" "}
              {calculateBMI()}
            </strong>
          </p>

          <p>
            HRV:
            <strong>
              {" "}
              {calculateHRV()}
            </strong>
          </p>

          <p>
            Pulse Pressure:
            <strong>
              {" "}
              {calculatePulsePressure()}
            </strong>
          </p>

          <p>
            MAP:
            <strong>
              {" "}
              {calculateMAP()}
            </strong>
          </p>

          <p>
            Risk Category:
            <strong>
              {" "}
              {getRiskCategory()}
            </strong>
          </p>

          {/* TEXTAREA */}

          <textarea
            name="symptoms"
            placeholder="Symptoms"
            onChange={handleChange}
          />

          <textarea
            name="remarks"
            placeholder="Remarks"
            onChange={handleChange}
          />

          <button type="submit">
            💾 Save Checkup
          </button>

        </form>
      </div>
    </div>
  );
}