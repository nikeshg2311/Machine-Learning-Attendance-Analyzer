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

  router.get("/student/:email", async (req, res) => {
    const data = await Attendance.find({
      email: req.params.email
    });

    res.json(data);
  });

const axios = require("axios");

router.get("/ml/:email", async (req,res)=>{

   const Attendance = require("../models/Attendance");

   const data = await Attendance.find({email:req.params.email});

   const total = data.length;
   const present = data.filter(d=>d.status==="Present").length;

   // ⭐ CALL PYTHON ML API
   const ml = await axios.get(
     `http://localhost:8000/predict?total=${total}&present=${present}`
   );

   res.send(ml.data);
});

  module.exports = router;
