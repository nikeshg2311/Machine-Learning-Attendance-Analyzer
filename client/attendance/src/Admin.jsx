import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {

  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/attendance/analytics"
    );
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ textAlign:"center", marginTop:"50px" }}>
      <h1>AI Admin Panel</h1>

      {data.map((s, i) => (
        <div key={i}>
          {s.email} | {s.percent}% | {s.risk}
        </div>
      ))}
    </div>
  );
}

export default Admin;
