const mongoose = require("mongoose");

const hodSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
    unique: true, // Ensures one HOD per department
  },
  appointedAt: {
    type: Date,
    default: Date.now,
  },
});

const HOD = mongoose.model("HOD", hodSchema);
module.exports = { HOD, hodSchema };