  const express = require("express");
  const router = express.Router();
  const Attendance = require("../models/Attendance");
  const RiskReason = require("../models/RiskReason");

  // GET ALL ATTENDANCE (with optional email query)
  router.get("/", async (req, res) => {
    try {
      const { email } = req.query;
      const query = email ? { email } : {};
      console.log(`📋 Fetching attendance for: ${email || "All Students"}`);

      const data = await Attendance.find(query).sort({ date: -1 });
      console.log(`📊 Found ${data.length} records`);
      res.json(data);
    } catch (err) {
      console.error("❌ Error fetching attendance:", err.message);
      res.status(500).send("Error");
    }
  });

  // SAVE ATTENDANCE (Root POST)
  router.post("/", async (req, res) => {
    try {
      console.log("📝 Adding attendance for:", req.body.email);
      const record = new Attendance(req.body);
      await record.save();
      console.log("✅ Attendance saved for:", req.body.email);
      res.status(201).send("Attendance Saved");
    } catch (err) {
      console.error("❌ Error saving attendance:", err.message);
      res.status(500).send("Error");
    }
  });

  // UPDATE ATTENDANCE
  router.put("/:id", async (req, res) => {
    try {
      console.log(`🔄 Updating record: ${req.params.id}`);
      const updated = await Attendance.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) {
        console.warn(`⚠️ Record not found: ${req.params.id}`);
        return res.status(404).send("Record not found");
      }
      console.log("✅ Attendance updated");
      res.json(updated);
    } catch (err) {
      console.error("❌ Error updating attendance:", err.message);
      res.status(500).send("Error");
    }
  });

  // DELETE ATTENDANCE
  router.delete("/:id", async (req, res) => {
    try {
      console.log(`🗑️ Deleting record: ${req.params.id}`);
      const deleted = await Attendance.findByIdAndDelete(req.params.id);
      if (!deleted) {
        console.warn(`⚠️ Record already gone: ${req.params.id}`);
        return res.status(404).send("Record not found");
      }
      console.log("✅ Attendance deleted");
      res.send("Deleted successfully");
    } catch (err) {
      console.error("❌ Error deleting attendance:", err.message);
      res.status(500).send("Error");
    }
  });


  // AI ADMIN PANEL DATA
  router.get("/analytics", async (req, res) => {
    try {
      console.log("📈 Generating analytics...");
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

      console.log(`✅ Analytics complete for ${analytics.length} students`);
      res.json(analytics);

    } catch (err) {
      console.error("❌ Analytics error:", err.message);
      res.status(500).send("Error");
    }
  });

  router.get("/student/:email", async (req, res) => {
    try {
      console.log(`🧑‍🎓 Fetching data for student: ${req.params.email}`);
      const data = await Attendance.find({
        email: req.params.email
      });
      console.log(`📊 Found ${data.length} records for ${req.params.email}`);
      res.json(data);
    } catch (err) {
      console.error("❌ Error fetching student data:", err.message);
      res.status(500).send("Error");
    }
  });


  // --- Specific routes kept for legacy compatibility if needed ---

  // SAVE ATTENDANCE (Legacy)
  router.post("/add", async (req, res) => {
    try {
      console.log("📝 Adding attendance (Legacy) for:", req.body.email);
      const record = new Attendance(req.body);
      await record.save();
      console.log("✅ Attendance saved (Legacy)");
      res.send("Attendance Saved");
    } catch (err) {
      console.error("❌ Error (Legacy):", err.message);
      res.status(500).send("Error");
    }
  });

  // GET ALL ATTENDANCE (Legacy)
  router.get("/all", async (req, res) => {
    try {
      console.log("📋 Fetching all attendance records (Legacy)...");
      const data = await Attendance.find();
      console.log(`📊 Found ${data.length} records`);
      res.json(data);
    } catch (err) {
      console.error("❌ Error (Legacy):", err.message);
      res.status(500).send("Error");
    }
  });


const axios = require("axios");

router.get("/ml/:email", async (req,res)=>{

  try {
    const email = req.params.email;
    console.log(`🤖 ML Request for: ${email}`);

    // ⭐ LAST 30 DAYS DATE
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // ⭐ FILTER ONLY RECENT RECORDS
    const data = await Attendance.find({
      email: email,
      date: { $gte: last30Days }
    });

    const total = data.length;
    const present = data.filter(d=>d.status==="Present").length;
    console.log(`📊 Recent stats for ${email}: Total=${total}, Present=${present}`);

    // CALL PYTHON ML SERVER
    const mlUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
    console.log(`🔗 Calling ML server at: ${mlUrl}...`);
    const ml = await axios.get(
      `${mlUrl}/predict?total=${total}&present=${present}`
    );

    console.log("✅ ML prediction received!");
    res.send(ml.data);

  } catch(err){
    console.error("❌ ML Request error:", err.message);
    res.status(500).send("ML Error");
  }
});

router.post("/risk-reason", async (req, res) => {
  try {
    const { name, email, reasonType, reasonText, proofImage } = req.body;
    console.log(`📂 Saving risk reason for: ${email}`);

    if (!email || !reasonType || !reasonText) {
      return res.status(400).send("Missing required fields");
    }

    const needsProof = reasonType === "OD" || reasonType === "Medical Leave";
    if (needsProof && !proofImage) {
      return res.status(400).send("Proof image is required");
    }

    const record = new RiskReason({
      name: name || email.split("@")[0],
      email,
      reasonType,
      reasonText,
      proofImage: proofImage || ""
    });

    await record.save();
    console.log("✅ Risk reason saved!");
    res.send("Risk reason saved");
  } catch (err) {
    console.error("❌ Error saving risk reason:", err.message);
    res.status(500).send("Error");
  }
});

router.get("/risk-reason/all", async (req, res) => {
  try {
    console.log("📋 Fetching all risk reasons...");
    const data = await RiskReason.find().sort({ createdAt: -1 });
    console.log(`📂 Found ${data.length} reasons`);
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching risk reasons:", err.message);
    res.status(500).send("Error");
  }
});

  module.exports = router;
