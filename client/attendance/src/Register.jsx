import { useState } from "react";
import axios from "axios";

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
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Register</h2>

      <input placeholder="Name"
        onChange={(e) => setName(e.target.value)} />
      <br /><br />

      <input placeholder="Email"
        onChange={(e) => setEmail(e.target.value)} />
      <br /><br />

      <input type="password" placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} />
      <br /><br />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>

      <br /><br />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
