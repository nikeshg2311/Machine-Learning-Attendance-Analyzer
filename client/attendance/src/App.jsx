import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function App() {

  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>

      {showLogin ? <Login /> : <Register />}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => setShowLogin(!showLogin)}>
          {showLogin ? "Go to Register" : "Go to Login"}
        </button>
      </div>

    </div>
  );
}

export default App;
