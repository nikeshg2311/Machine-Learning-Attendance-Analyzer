const mongoose = require("mongoose");

const RiskReasonSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    reasonType: String,
    reasonText: String,
    proofImage: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiskReason", RiskReasonSchema);
