import { useState, useEffect } from "react";
import Navbar from "../../components/PNavbar";
import "./StyleSheets/AdminHealthCamps.css";

export default function AdminHealthCamps() {
  const [camp, setCamp] = useState({ name: "", date: "", time: "", location: "", description: "" });
  const [allCamps, setAllCamps] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAllCamps();
  }, []);

  const fetchAllCamps = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/healthcamps");
      const data = await res.json();
      setAllCamps(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setCamp({ ...camp, [e.target.name]: e.target.value });

  const handleAddCamp = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await fetch(`http://localhost:5000/api/healthcamps/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(camp),
        });
        const updated = await res.json();
        setAllCamps(allCamps.map(c => c._id === editId ? updated : c));
        setEditId(null);
        alert("✅ Camp updated successfully!");
      } else {
        const res = await fetch("http://localhost:5000/api/healthcamps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(camp),
        });
        const newCamp = await res.json();
        setAllCamps([...allCamps, newCamp]);
        alert("✅ Health Camp scheduled successfully!");
      }
      setCamp({ name: "", date: "", time: "", location: "", description: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this camp?")) return;
    try {
      await fetch(`http://localhost:5000/api/healthcamps/${id}`, { method: "DELETE" });
      setAllCamps(allCamps.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (c) => {
    setCamp({ name: c.name, date: c.date.split("T")[0], time: c.time, location: c.location, description: c.description });
    setEditId(c._id);
  };

  const getStatus = (date) => (new Date(date) >= new Date() ? "Upcoming" : "Completed");
  const getStatusColor = (status) => (status === "Upcoming" ? "#27ae60" : "#e74c3c");

  return (
    <div>
      <Navbar />
      <div className="admin-healthcamp-container">
        <h2>📅 {editId ? "Edit Health Camp" : "Schedule New Health Camp"}</h2>

        <form className="healthcamp-form" onSubmit={handleAddCamp}>
          <label>Camp Name:</label>
          <input name="name" value={camp.name} onChange={handleChange} placeholder="Camp Name" required />

          <label>Date:</label>
          <input type="date" name="date" value={camp.date} onChange={handleChange} required />

          <label>Time:</label>
          <input type="time" name="time" value={camp.time} onChange={handleChange} required />

          <label>Location:</label>
          <input name="location" value={camp.location} onChange={handleChange} placeholder="Location" required />

          <label>Description:</label>
          <textarea name="description" value={camp.description} onChange={handleChange} placeholder="Description" required></textarea>

          <button type="submit">{editId ? "💾 Update Camp" : "+ Add Camp"}</button>
        </form>

        <h3>📋 All Scheduled Camps</h3>
        <div className="camp-list">
          {allCamps.length === 0 ? <p>No camps scheduled yet.</p> :
            allCamps.map(c => {
              const status = getStatus(c.date);
              return (
                <div key={c._id} className="camp-card">
                  <div className="camp-card-header">
                    <h4>{c.name}</h4>
                    <span style={{ backgroundColor: getStatusColor(status) }}>{status}</span>
                  </div>
                  <p><strong>Date:</strong> {new Date(c.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {c.time}</p>
                  <p><strong>Location:</strong> {c.location}</p>
                  <p>{c.description}</p>
                  <div className="camp-actions">
                    <button onClick={() => handleEdit(c)}>✏️ Edit</button>
                    <button onClick={() => handleDelete(c._id)}>🗑️ Delete</button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
}
