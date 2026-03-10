import { useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("email", user.email);
      localStorage.setItem("name", user.name);

      if (user.role === "admin") {
        window.location.href = "/admin";
      } else if (user.role === "teacher") {
        window.location.href = "/teacher";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Invalid credentials";
      alert(message);
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

        <button className="loginBtn" onClick={handleLogin}>
          Login
        </button>
        <Link className="registerBtn" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
