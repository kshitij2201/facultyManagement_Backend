const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  firstName: { type: String, required: true },
  department: { type: String, required: true },
  leaveType: {
    type: String,
    required: true,
    enum: ["Sick Leave", "Casual Leave", "Earned Leave"],
  },
  type: {
    type: String,
    required: true,
    enum: ["Faculty", "HOD", "Principal", "Staff"],
    default: "Faculty",
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  leaveDays: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      "Pending",
      "HOD Approved",
      "HOD Rejected",
      "Principal Approved",
      "Principal Rejected",
    ],
    default: "Pending",
  },
  hodDecision: {
    employeeId: { type: String },
    decision: { type: String, enum: ["Approved", "Rejected"] },
    comment: { type: String },
    decidedAt: { type: Date },
  },
  principalDecision: {
    employeeId: { type: String },
    decision: { type: String, enum: ["Approved", "Rejected"] },
    comment: { type: String },
    decidedAt: { type: Date },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Leave", leaveSchema);
