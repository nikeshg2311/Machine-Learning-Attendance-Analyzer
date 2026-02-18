import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import TeacherDashboard from "./TeacherDashboard";
import Admin from "./Admin";

function App() {
  return (
    <Router>
      <Routes>

        {/* ⭐ DEFAULT PAGE */}
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </Router>
  );
}

export default App;
