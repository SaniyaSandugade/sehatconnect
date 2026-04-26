import { useEffect, useState } from "react";
import DNavbar from "./DNavbar";
import API from "../../services/api";
import "./Stylesheets/HealthCamp.css";

export default function HealthCamps() {
  const [upcomingCamps, setUpcomingCamps] = useState([]);
  const [pastCamps, setPastCamps] = useState([]);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      const res = await API.get("/healthcamps");
      const camps = res.data;

      const today = new Date();

      const upcoming = camps.filter(
        (c) => new Date(c.date) >= today
      );

      const past = camps.filter(
        (c) => new Date(c.date) < today
      );

      setUpcomingCamps(upcoming);
      setPastCamps(past);

    } catch (err) {
      console.log(err);
      alert("Failed to load health camps");
    }
  };

  return (
    <div>
      <DNavbar />

      <div className="healthcamp-container">

        <h2 className="camp-title">🏥 Health Camps</h2>

        <h3>🟢 Upcoming Camps</h3>
        {upcomingCamps.length === 0 ? (
          <p>No upcoming camps</p>
        ) : (
          upcomingCamps.map((camp) => (
            <div key={camp._id} className="camp-card">
              <h4>{camp.name}</h4>
              <p>{new Date(camp.date).toLocaleDateString()}</p>
              <p>{camp.location}</p>
            </div>
          ))
        )}

        <h3>🔴 Past Camps</h3>
        {pastCamps.length === 0 ? (
          <p>No past camps</p>
        ) : (
          pastCamps.map((camp) => (
            <div key={camp._id} className="camp-card">
              <h4>{camp.name}</h4>
              <p>{new Date(camp.date).toLocaleDateString()}</p>
              <p>{camp.location}</p>
            </div>
          ))
        )}

      </div>
    </div>
  );
}