import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.css";


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
          if (user.role === "admin") {
        window.location.href = "/admin";
      }
      else if (user.role === "teacher") {
        window.location.href = "/teacher";
      }
      else {
        window.location.href = "/dashboard";
      }

  } catch (err) {
    alert("Invalid Credentials");
  }
};




  return (
    <div className="loginPage">
      <div className="loginCard">
        <h2>Student Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="loginBtn" onClick={handleLogin}>Login</button>
        <Link className="registerBtn" to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Login;
