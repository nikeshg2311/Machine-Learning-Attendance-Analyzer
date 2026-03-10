import { useState, useEffect } from "react";
import api from "./api";
import "./Dashboard.css";

function Dashboard() {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [records, setRecords] = useState([]);
  const [attendancePercent, setAttendancePercent] = useState(0);
  const [riskStatus, setRiskStatus] = useState("");
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [riskReasonType, setRiskReasonType] = useState("OD");
  const [otherReason, setOtherReason] = useState("");
  const [proofImage, setProofImage] = useState("");
  const [reasonSubmitted, setReasonSubmitted] = useState(false);
  const role = localStorage.getItem("role");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  const saveAttendance = async () => {
    try {
      await api.post("/attendance", {
        name: studentName,
        email: studentEmail,
        subject,
        date,
        status
      });

      alert("Attendance saved");
      fetchAttendance();
    } catch (err) {
      alert(err?.response?.data?.message || "Error saving attendance");
    }
  };

  const updateAttendance = async (record) => {
    const nextStatus = record.status === "Present" ? "Absent" : "Present";
    try {
      await api.put(`/attendance/${record._id}`, {
        name: record.name,
        email: record.email,
        subject: record.subject,
        date: new Date(record.date).toISOString(),
        status: nextStatus
      });
      fetchAttendance();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  const deleteAttendance = async (id) => {
    try {
      await api.delete(`/attendance/${id}`);
      fetchAttendance();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const getRiskColor = () => {
    if (riskStatus.includes("AT RISK")) return "#ef4444";
    if (riskStatus.includes("WARNING")) return "#facc15";
    if (riskStatus.includes("SAFE")) return "#22c55e";
    if (attendancePercent >= 75) return "#22c55e";
    if (attendancePercent >= 60) return "#facc15";
    return "#ef4444";
  };

  const fetchAttendance = async () => {
    const loggedEmail = localStorage.getItem("email");
    const url =
      role === "student" ? `/attendance?email=${loggedEmail}` : "/attendance";
    const res = await api.get(url);

    setRecords(res.data);

    if (role === "student") {
      const total = res.data.length;
      const present = res.data.filter((d) => d.status === "Present").length;
      const actualPercent = total ? Math.round((present / total) * 100) : 0;
      setAttendancePercent(actualPercent);

      const ml = await api.get(`/attendance/ml/${loggedEmail}`);
      const probability = ml.data.probability;
      const isMlRisk = ml.data.risk === 1 || probability >= 0.5;
      const sortedByDateDesc = [...res.data].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const latestDateValue = sortedByDateDesc.length
        ? new Date(sortedByDateDesc[0].date).toDateString()
        : null;
      const latestDayRecords = latestDateValue
        ? sortedByDateDesc.filter(
            (r) => new Date(r.date).toDateString() === latestDateValue
          )
        : [];
      const latestDayAbsences = latestDayRecords.filter(
        (r) => r.status === "Absent"
      ).length;
      const allLatestDayAbsent =
        latestDayRecords.length > 0 &&
        latestDayAbsences === latestDayRecords.length;

      if (allLatestDayAbsent) {
        setRiskStatus("AT RISK");
        return;
      }

      if (latestDayAbsences > 0) {
        setRiskStatus("WARNING");
        return;
      }

      if (actualPercent >= 75) {
        setRiskStatus("SAFE");
      } else if (actualPercent >= 60) {
        setRiskStatus(isMlRisk ? "WARNING" : "SAFE");
      } else {
        setRiskStatus(isMlRisk ? "AT RISK" : "WARNING");
      }
    }
  };

  const submitRiskReason = async () => {
    try {
      const loggedName = localStorage.getItem("name") || "Student";
      const loggedEmail = localStorage.getItem("email");
      const finalReason =
        riskReasonType === "Others" ? otherReason.trim() : riskReasonType;
      const needsProof = riskReasonType === "OD" || riskReasonType === "Medical Leave";

      if (!finalReason) {
        alert("Please enter reason");
        return;
      }

      if (needsProof && !proofImage) {
        alert("Please upload proof image");
        return;
      }

      await api.post("/attendance/risk-reason", {
        name: loggedName,
        email: loggedEmail,
        reasonType: riskReasonType,
        reasonText: finalReason,
        proofImage
      });

      setReasonSubmitted(true);
      setProofImage("");
      setOtherReason("");
      alert("Reason submitted");
    } catch (err) {
      const message = err?.response?.data?.message || "Error submitting reason";
      alert(message);
    }
  };

  const onProofFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImage(reader.result || "");
      setReasonSubmitted(false);
    };
    reader.readAsDataURL(file);
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

          <input placeholder="Subject" onChange={(e) => setSubject(e.target.value)} />

          <input type="date" onChange={(e) => setDate(e.target.value)} />

          <select onChange={(e) => setStatus(e.target.value)}>
            <option>Present</option>
            <option>Absent</option>
          </select>

          <button onClick={saveAttendance}>Save Attendance</button>
        </div>
      )}

      {role === "student" && (
        <div className="aiCard" style={{ borderColor: getRiskColor() }}>
          <h2>AI Analytics</h2>
          <div className="aiBadge">AI Prediction Active</div>

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

      {role === "student" && riskStatus.includes("AT RISK") && (
        <div className="riskReasonBox">
          <h3>Reason for the risk?</h3>
          <select
            value={riskReasonType}
            onChange={(e) => {
              setRiskReasonType(e.target.value);
              setReasonSubmitted(false);
              setProofImage("");
            }}
          >
            <option>OD</option>
            <option>Medical Leave</option>
            <option>Others</option>
          </select>

          {riskReasonType === "Others" && (
            <input
              placeholder="Enter reason"
              value={otherReason}
              onChange={(e) => {
                setOtherReason(e.target.value);
                setReasonSubmitted(false);
              }}
            />
          )}

          {(riskReasonType === "OD" || riskReasonType === "Medical Leave") && (
            <div className="proofUpload">
              <p>
                {riskReasonType === "OD"
                  ? "Upload OD proof (image)"
                  : "Upload medical certificate (image)"}
              </p>
              <input type="file" accept="image/*" onChange={onProofFileChange} />
            </div>
          )}

          <button onClick={submitRiskReason}>Submit</button>
          {reasonSubmitted && <p>Submitted successfully.</p>}
        </div>
      )}

      <div className="records">
        <h2>Attendance Records</h2>

        {records.map((r) => (
          <div key={r._id} className="recordItem">
            {r.name} | {r.email} | {r.subject} |{" "}
            {new Date(r.date).toLocaleDateString()} | {r.status}
            {role !== "student" && (
              <>
                {" | "}
                <button onClick={() => updateAttendance(r)}>Toggle Status</button>
                {" "}
                <button onClick={() => deleteAttendance(r._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
