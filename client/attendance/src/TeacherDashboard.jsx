import { useState, useEffect } from "react";
import api from "./api";
import "./TeacherDashboard.css";

function TeacherDashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [records, setRecords] = useState([]);
  const [riskReasons, setRiskReasons] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setSubject("");
    setDate("");
    setStatus("Present");
    setEditingId(null);
  };

  const saveAttendance = async () => {
    try {
      const payload = { name, email, subject, date, status };
      if (editingId) {
        await api.put(`/attendance/${editingId}`, payload);
      } else {
        await api.post("/attendance", payload);
      }
      resetForm();
      fetchRecords();
    } catch (err) {
      alert(err?.response?.data?.message || "Save failed");
    }
  };

  const startEdit = (record) => {
    setEditingId(record._id);
    setName(record.name);
    setEmail(record.email);
    setSubject(record.subject);
    setDate(new Date(record.date).toISOString().slice(0, 10));
    setStatus(record.status);
  };

  const deleteAttendance = async (id) => {
    try {
      await api.delete(`/attendance/${id}`);
      fetchRecords();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const fetchRecords = async () => {
    const res = await api.get("/attendance");
    setRecords(res.data);
  };

  const fetchRiskReasons = async () => {
    const res = await api.get("/attendance/risk-reason/all");
    setRiskReasons(res.data);
  };

  useEffect(() => {
    fetchRecords();
    fetchRiskReasons();
  }, []);

  return (
    <div className="teacherContainer">
      <h1>AI Attendance Analyzer</h1>

      <div className="teacherForm">
        <input value={name} placeholder="Student Name" onChange={(e) => setName(e.target.value)} />
        <input value={email} placeholder="Student Email" onChange={(e) => setEmail(e.target.value)} />
        <input value={subject} placeholder="Subject" onChange={(e) => setSubject(e.target.value)} />
        <input value={date} type="date" onChange={(e) => setDate(e.target.value)} />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Present</option>
          <option>Absent</option>
        </select>

        <button onClick={saveAttendance}>
          {editingId ? "Update Attendance" : "Save Attendance"}
        </button>
        {editingId && <button onClick={resetForm}>Cancel Edit</button>}
      </div>

      <h2>Attendance Records</h2>

      {records.map((r) => (
        <div key={r._id} className="recordCard">
          {r.email} | {r.subject} | {new Date(r.date).toLocaleDateString()} | {r.status}
          {" | "}
          <button onClick={() => startEdit(r)}>Edit</button>
          {" "}
          <button onClick={() => deleteAttendance(r._id)}>Delete</button>
        </div>
      ))}

      <h2>Students At Risk</h2>
      {riskReasons.map((r) => (
        <div key={r._id} className="riskCard">
          <p>
            {r.name} | {r.email} | {r.reasonText}
          </p>
          {(r.reasonType === "OD" || r.reasonType === "Medical Leave") && r.proofImage && (
            <img className="riskProofImage" src={r.proofImage} alt="Submitted proof" />
          )}
        </div>
      ))}
    </div>
  );
}

export default TeacherDashboard;
