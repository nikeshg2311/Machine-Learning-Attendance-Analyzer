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

module.exports = router;
