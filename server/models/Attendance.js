const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  name: String,      // ⭐ ADD THIS
  email: String,
  subject: String,
  date: Date,
  status: String
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
