import { useState, useEffect } from "react";
import axios from "axios";
import "./TeacherDashboard.css";

function TeacherDashboard() {

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [subject,setSubject]=useState("");
  const [date,setDate]=useState("");
  const [status,setStatus]=useState("Present");
  const [records,setRecords]=useState([]);
  const [riskReasons, setRiskReasons] = useState([]);

  const saveAttendance = async () => {
    await axios.post("http://localhost:5000/api/attendance/add",{
      name,
      email,
      subject,
      date,
      status
    });

    fetchRecords();
  };

  const fetchRecords = async () => {
    const res = await axios.get("http://localhost:5000/api/attendance/all");
    setRecords(res.data);
  };

  const fetchRiskReasons = async () => {
    const res = await axios.get("http://localhost:5000/api/attendance/risk-reason/all");
    setRiskReasons(res.data);
  };

  useEffect(()=>{
    fetchRecords();
    fetchRiskReasons();
  },[]);

  return (
    <div className="teacherContainer">

      <h1>AI Attendance Analyzer</h1>

      <div className="teacherForm">
        <input placeholder="Student Name" onChange={(e)=>setName(e.target.value)}/>
        <input placeholder="Student Email" onChange={(e)=>setEmail(e.target.value)}/>
        <input placeholder="Subject" onChange={(e)=>setSubject(e.target.value)}/>
        <input type="date" onChange={(e)=>setDate(e.target.value)}/>

        <select onChange={(e)=>setStatus(e.target.value)}>
          <option>Present</option>
          <option>Absent</option>
        </select>

        <button onClick={saveAttendance}>Save Attendance</button>
      </div>

      <h2>Attendance Records</h2>

      {records.map((r,i)=>(
        <div key={i} className="recordCard">
          {r.email} | {r.subject} | {r.date} | {r.status}
        </div>
      ))}

      <h2>Students At Risk</h2>
      {riskReasons.map((r, i) => (
        <div key={i} className="riskCard">
          <p>{r.name} | {r.email} | {r.reasonText}</p>
          {(r.reasonType === "OD" || r.reasonType === "Medical Leave") && r.proofImage && (
            <img className="riskProofImage" src={r.proofImage} alt="Submitted proof" />
          )}
        </div>
      ))}

    </div>
  );
}

export default TeacherDashboard;
