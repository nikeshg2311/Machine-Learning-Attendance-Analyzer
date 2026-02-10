import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {

  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [records, setRecords] = useState([]);

  const saveAttendance = async () => {
    try {
      await axios.post("http://localhost:5000/api/attendance/add", {
        email: "test@gmail.com",
        subject,
        date,
        status
      });

      alert("Attendance Saved");
      fetchAttendance();

    } catch (err) {
      alert("Error Saving Attendance");
    }
  };

  const fetchAttendance = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/attendance/all"
    );
    setRecords(res.data);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Attendance Analyzer</h1>

      <input placeholder="Subject"
        onChange={(e) => setSubject(e.target.value)} />
      <br /><br />

      <input type="date"
        onChange={(e) => setDate(e.target.value)} />
      <br /><br />

      <select onChange={(e) => setStatus(e.target.value)}>
        <option>Present</option>
        <option>Absent</option>
      </select>
      <br /><br />

      <button onClick={saveAttendance}>Save Attendance</button>

      <h2>Attendance Records</h2>

      {records.map((r, index) => (
        <div key={index}>
          {r.subject} - {r.date} - {r.status}
        </div>
      ))}

    </div>
  );
}

export default Dashboard;
