import React from "react";
import { Route } from "react-router-dom";


import Patient from "../pages/patient/Patient";
import PaPatientDashboard from "../pages/patient/PaPatientDashboard";
import PaPatientDetails from "../pages/patient/PaPatientDetails";
import PaPatientHistory from "../pages/patient/PaPatientHistory";
import PaProfile from "../pages/patient/PaProfile";
import PaHealthCamp from "../pages/patient/PaHealthCamp";

export const PatientRoutes = () => (
  <>
    {/* ✅ MAIN */}
    <Route path="/patient/:id" element={<Patient />} />

    {/* ✅ DASHBOARD */}
    <Route
      path="/patient/:id/dashboard"
      element={<PaPatientDashboard />}
    />

    {/* ✅ DETAILS */}
    <Route
      path="/patient/:id/details"
      element={<PaPatientDetails />}
    />

    {/* ✅ HISTORY */}
    <Route
      path="/patient/:id/history"
      element={<PaPatientHistory />}
    />

    {/* ✅ PROFILE */}
    <Route
      path="/patient/:id/profile"
      element={<PaProfile />}
    />

    {/* ✅ HEALTH CAMPS */}
    <Route
      path="/patient/:id/healthcamps"
      element={<PaHealthCamp />}
    />
  </>
);

