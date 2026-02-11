const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// SAVE ATTENDANCE
router.post("/add", async (req, res) => {
  try {
    const record = new Attendance(req.body);
    await record.save();
    res.send("Attendance Saved");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

// GET ATTENDANCE
router.get("/all", async (req, res) => {
  const data = await Attendance.find();
  res.json(data);
});
// AI ADMIN PANEL DATA
router.get("/analytics", async (req, res) => {
  try {
    const data = await Attendance.find();

    const result = {};

    data.forEach(r => {
      if (!result[r.email]) {
        result[r.email] = [];
      }
      result[r.email].push(r);
    });

    const analytics = Object.keys(result).map(email => {

      const total = result[email].length;
      const present = result[email].filter(r => r.status === "Present").length;

      const percent = Math.round((present / total) * 100);

      let risk = "AT RISK 🔴";
      if (percent >= 75) risk = "SAFE 🟢";
      else if (percent >= 60) risk = "WARNING 🟡";

      return {
        email,
        percent,
        risk
      };
    });

    res.json(analytics);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});


module.exports = router;
