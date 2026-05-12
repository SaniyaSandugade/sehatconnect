import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";

/* ================= ADMIN ================= */
import Admin from "./pages/admin/Admin";
import AllDoctors from "./pages/admin/AllDoctors";
import AllHealthworkers from "./pages/admin/AllHealthworkers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/admin/Profile";
import AdminHealthCamps from "./pages/admin/AdminHealthCamps";
import AddDoctor from "./pages/admin/AddDoctor";
import AddHW from "./pages/admin/AddHealthworker";

/* ================= HEALTHWORKER ================= */
import Healthworker from "./pages/healthworker/Healthworker";
import AllPatients from "./pages/healthworker/AllPatients";
import AddPatient from "./pages/healthworker/AddPatient";
import PatientDetails from "./pages/healthworker/PatientDetails";
import PatientDashboard from "./pages/healthworker/PatientDashboard";
import NewCheckupForm from "./pages/healthworker/NewCheckupForm";
import PatientHistory from "./pages/healthworker/PatientHistory";
import HWProfile from "./pages/healthworker/HWProfile";
import HealthCamp from "./pages/healthworker/HealthCamp";

/* ================= DOCTOR ================= */
import Doctor from "./pages/doctor/Doctor";
import DAddPatient from "./pages/doctor/DAddPatient";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DNewCheckupForm from "./pages/doctor/DNewCheckupForm";
import DoctorAllPatients from "./pages/doctor/DoctorAllPatients";
import HealthCamps from "./pages/doctor/HealthCamps";

import DoctorPatientDashboard from "./pages/doctor/DoctorPatientDashboard";
import DoctorPatientDetails from "./pages/doctor/DoctorPatientDetails";
import DoctorPatientHistory from "./pages/doctor/DoctorPatientHistory";

/* ================= PATIENT ================= */
import Patient from "./pages/patient/Patient";
import PaPatientDashboard from "./pages/patient/PaPatientDashboard";
import PaPatientDetails from "./pages/patient/PaPatientDetails";
import PaPatientHistory from "./pages/patient/PaPatientHistory";
import PaProfile from "./pages/patient/PaProfile";
import PaHealthCamp from "./pages/patient/PaHealthCamp";

/* ================= PROTECTED ================= */
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/:id/alldoctors"
          element={
            <ProtectedRoute allowedRole="admin">
              <AllDoctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/:id/allhealthworkers"
          element={
            <ProtectedRoute allowedRole="admin">
              <AllHealthworkers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/:id/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/:id/profile"
          element={
            <ProtectedRoute allowedRole="admin">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/:id/healthcamps"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminHealthCamps />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/:id/addDoctor"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddDoctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/:id/addhealthworker"
          element={
            <ProtectedRoute allowedRole="admin">
              <AddHW />
            </ProtectedRoute>
          }
        />

        {/* ================= HEALTHWORKER ================= */}

        <Route
          path="/healthworker/:id"
          element={
            <ProtectedRoute allowedRole="healthworker">
              <Healthworker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/healthworker/:id/addpatient"
          element={
            <ProtectedRoute allowedRole="healthworker">
              <AddPatient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/healthworker/:id/allpatients"
          element={
            <ProtectedRoute allowedRole="healthworker">
              <AllPatients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/healthworker/:id/profile"
          element={
            <ProtectedRoute allowedRole="healthworker">
              <HWProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/healthworker/:id/patient/:pid/details"
          element={
            <ProtectedRoute allowedRole="healthworker">
              <PatientDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/healthworker/:id/patient/:pid/dashboard"
          element={
            <ProtectedRoute allowedRole="healthworker">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/healthworker/:id/patient/:pid/checkup"
          element={
            <ProtectedRoute allowedRole="healthworker">
              <NewCheckupForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/healthworker/:id/patient/:pid/history"
          element={
            <ProtectedRoute allowedRole="healthworker">
              <PatientHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/healthworker/:id/healthcamps"
          element={
            <ProtectedRoute allowedRole="healthworker">
              <HealthCamp />
            </ProtectedRoute>
          }
        />

        {/* ================= DOCTOR ================= */}

        <Route
          path="/doctor/:id"
          element={
            <ProtectedRoute allowedRole="doctor">
              <Doctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/:id/addpatient"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DAddPatient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/:id/profile"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/:id/allpatients"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorAllPatients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/:id/healthcamps"
          element={
            <ProtectedRoute allowedRole="doctor">
              <HealthCamps />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/:id/patient/:pid/dashboard"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorPatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/:id/patient/:pid/details"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorPatientDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/:id/patient/:pid/checkup"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DNewCheckupForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/:id/patient/:pid/history"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorPatientHistory />
            </ProtectedRoute>
          }
        />

        {/* ================= PATIENT ================= */}

        <Route
          path="/patient/:id"
          element={
            <ProtectedRoute allowedRole="patient">
              <Patient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/:id/dashboard"
          element={
            <ProtectedRoute allowedRole="patient">
              <PaPatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/:id/details"
          element={
            <ProtectedRoute allowedRole="patient">
              <PaPatientDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/:id/history"
          element={
            <ProtectedRoute allowedRole="patient">
              <PaPatientHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/:id/profile"
          element={
            <ProtectedRoute allowedRole="patient">
              <PaProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/:id/healthcamps"
          element={
            <ProtectedRoute allowedRole="patient">
              <PaHealthCamp />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
};

export default App;