import { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);


  const handleLogin = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

    window.location.href = "/dashboard";

  } catch (err) {
    alert("Invalid Credentials");
  }
};

  if (loggedIn) {
    return <Dashboard />;
  } 


  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Student Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
