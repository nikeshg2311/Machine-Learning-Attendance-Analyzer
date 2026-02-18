import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {

  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [records, setRecords] = useState([]);
  const [attendancePercent, setAttendancePercent] = useState(0);
  const [riskStatus, setRiskStatus] = useState("");
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const role = localStorage.getItem("role");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");




  const saveAttendance = async () => {
    try {
      await axios.post("http://localhost:5000/api/attendance/add", {
          name: studentName,
          email: studentEmail,
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
  const getRiskColor = () => {
      if (attendancePercent >= 75) return "#22c55e"; 
      if (attendancePercent >= 60) return "#facc15"; 
      return "#ef4444"; 
};

  const calculateAI = (data) => {

      if (!data.length) return;

      const total = data.length;
      const present = data.filter(r => r.status === "Present").length;

      const percent = Math.round((present / total) * 100);

      setAttendancePercent(percent);

      if (percent >= 75) {
        setRiskStatus("SAFE 🟢");
      } else if (percent >= 60) {
        setRiskStatus("WARNING 🟡");
      } else {
        setRiskStatus("AT RISK 🔴");
      }
    };


  const fetchAttendance = async () => {
    const role = localStorage.getItem("role");
const loggedEmail = localStorage.getItem("email");

const url =
  role === "student"
    ? `http://localhost:5000/api/attendance/student/${loggedEmail}`
    : "http://localhost:5000/api/attendance/all";

const res = await axios.get(url);

    setRecords(res.data);
    if (role === "student") {

    const ml = await axios.get(
      `http://localhost:5000/api/attendance/ml/${loggedEmail}`
    );

    const probability = ml.data.probability;

    const percent = Math.round(probability * 100);

    setAttendancePercent(percent);

    if (probability > 0.7) {
      setRiskStatus("AT RISK 🔴");
    } else if (probability > 0.4) {
      setRiskStatus("WARNING 🟡");
    } else {
      setRiskStatus("SAFE 🟢");
    }
  }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);
  useEffect(() => {
  let start = 0;

  const interval = setInterval(() => {
    start += 1;

    if (start >= attendancePercent) {
      clearInterval(interval);
    }

    setAnimatedPercent(start);
  }, 10);

  return () => clearInterval(interval);
}, [attendancePercent]);


  return (
  <div className={`container ${role === "student" ? "studentUI" : "teacherUI"}`}>

    <h1 className="title">AI Attendance Analyzer</h1>

    {role !== "student" && (
  <div className="formBox">
    <input
        placeholder="Student Name"
        onChange={(e) => setStudentName(e.target.value)}
      />

      <input
        placeholder="Student Email"
        onChange={(e) => setStudentEmail(e.target.value)}
      />


    <input
      placeholder="Subject"
      onChange={(e) => setSubject(e.target.value)}
    />

    <input
      type="date"
      onChange={(e) => setDate(e.target.value)}
    />

    <select onChange={(e) => setStatus(e.target.value)}>
      <option>Present</option>
      <option>Absent</option>
    </select>

    <button onClick={saveAttendance}>Save Attendance</button>

  </div>
)}
    {role === "student" && (
  <div
    className="aiCard"
    style={{ borderColor: getRiskColor() }}
  >

    <h2>AI Analytics</h2>
    <div className="aiBadge">🤖 AI Prediction Active</div>

    <div className="progressBar">
      <div
        className="progressFill"
        style={{
          width: `${animatedPercent}%`,
          background: getRiskColor()
        }}
      ></div>
    </div>

    <h3>{animatedPercent}% Attendance</h3>
    <h3 className="risk">{riskStatus}</h3>

  </div>
)}


    <div className="records">
      <h2>Attendance Records</h2>

      {records.map((r, index) => (
        <div key={index} className="recordItem">
          {r.name} | {r.email} | {r.subject} | {r.date} | {r.status}
        </div>
      ))}
    </div>

  </div>
  );

}

export default Dashboard;
