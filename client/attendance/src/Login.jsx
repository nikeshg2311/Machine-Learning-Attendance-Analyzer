import { useState } from "react";
import axios from "axios";


function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleLogin = async () => {
  try {

    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

    const user = res.data;

    // ⭐ SAVE USER ROLE
    localStorage.setItem("role", user.role);
    localStorage.setItem("email", user.email);

    // ⭐ AUTO REDIRECT BASED ON ROLE
    if (user.role === "admin" || user.role === "teacher") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/dashboard";
    }

  } catch (err) {
    alert("Invalid Credentials");
  }
};




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
