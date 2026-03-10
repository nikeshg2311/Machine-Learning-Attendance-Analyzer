import { useEffect, useState } from "react";
import api from "./api";

function Admin() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await api.get("/attendance/analytics");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>AI Admin Panel</h1>

      {data.map((s) => (
        <div key={s.email}>
          {s.email} | {s.percent}% | {s.risk}
        </div>
      ))}
    </div>
  );
}

export default Admin;
