const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.post("/register", async (req, res) => {
  try {
    console.log("📝 Registering user:", req.body.email);  

    const user = new User(req.body);
    await user.save();

    console.log("✅ Registration successful for:", req.body.email);
    res.send("Registered Successfully");
  } catch (err) {
    console.error("❌ Registration failed:", err.message);
    res.status(500).send("Registration Failed");
  }
});


router.post("/login", async (req, res) => {
  try {
    console.log("🔑 Login attempt for:", req.body.email);

    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password
    });

    if (!user) {
      console.warn("⚠️ Invalid credentials for:", req.body.email);
      return res.status(400).send("Invalid Credentials");
    }

    console.log("🔓 Login successful for:", req.body.email);
    res.json({
      token: "secret-token-123", // Placeholder token for now
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).send("Login error");
  }
});

module.exports = router;
