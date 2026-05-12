import React from "react";
import { Route } from "react-router-dom";

import Doctor from "../pages/doctor/Doctor";
import DAddPatient from "../pages/doctor/DAddPatient";
import DoctorAllPatients from "../pages/doctor/DoctorAllPatients";
import DoctorProfile from "../pages/doctor/DoctorProfile";
import DNewCheckupForm from "../pages/doctor/DNewCheckupForm";
import PatientDetails from "../pages/healthworker/PatientDetails";
import PatientDashboard from "../pages/healthworker/PatientDashboard";
import PatientHistory from "../pages/healthworker/PatientHistory";
import HealthCamps from "../pages/doctor/HealthCamps";

export const DoctorRoutes = () => (
  <>
    {/* DASHBOARD */}
    <Route path="/doctor/:id" element={<Doctor />} />

    {/* PATIENTS */}
    <Route
      path="/doctor/:id/addpatient"
      element={<DAddPatient />}
    />

    <Route
      path="/doctor/:id/allpatients"
      element={<DoctorAllPatients />}
    />

    {/* PROFILE */}
    <Route
      path="/doctor/:id/profile"
      element={<DoctorProfile />}
    />

    {/* HEALTH CAMPS */}
    <Route
      path="/doctor/:id/healthcamps"
      element={<HealthCamps />}
    />

    {/* PATIENT DETAILS */}
    <Route
      path="/doctor/:id/patient/:pid/details"
      element={<PatientDetails />}
    />

    {/* PATIENT DASHBOARD */}
    <Route
      path="/doctor/:id/patient/:pid/dashboard"
      element={<PatientDashboard />}
    />

    {/* CHECKUP */}
    <Route
      path="/doctor/:id/patient/:pid/checkup"
      element={<DNewCheckupForm />}
    />

    {/* HISTORY */}
    <Route
      path="/doctor/:id/patient/:pid/history"
      element={<PatientHistory />}
    />
  </>
);