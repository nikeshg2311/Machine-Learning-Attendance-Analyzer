const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.post("/register", async (req, res) => {
  try {
    console.log(req.body);  

    const user = new User(req.body);
    await user.save();

    res.send("Registered Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Registration Failed");
  }
});


router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password
  });

  if (!user) {
    return res.status(400).send("Invalid Credentials");
  }

  res.json(user);
});

module.exports = router;
