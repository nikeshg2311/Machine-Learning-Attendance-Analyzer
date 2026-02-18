import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleRegister = async () => {
  try {
    await axios.post("http://localhost:5000/api/auth/register", {
      name,
      email,
      password,
      role
    });

    alert("Registered Successfully");
    window.location.href = "/login";

  } catch (err) {
    alert("Registration Failed");
  }
};


  return (
    <div className="registerPage">
      <div className="registerCard">
        <h2>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>

        <button className="registerPrimaryBtn" onClick={handleRegister}>Register</button>
        <Link className="loginBackBtn" to="/login">Back to Login</Link>
      </div>
    </div>
  );
}

export default Register;
