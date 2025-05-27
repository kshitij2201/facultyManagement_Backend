const mongoose = require("mongoose");
const timetableSchema = new mongoose.Schema(
  {
    collegeInfo: {
      name: { type: String },
      status: { type: String },
      address: { type: String },
      department: { type: String },
      year: { type: String },
      semester: { type: String },
      section: { type: String }, // Add this if you want to store section

      date: { type: String },
      room: { type: String },
    },
    subjects: [
      {
        code: { type: String },
        name: { type: String },
        faculty: { type: String },
      },
    ],
    timetableData: [
      {
        day: { type: String },
        classes: [
          {
            subject: { type: String },
            type: { type: String },
            faculty: { type: String }, // Add this if you want to store faculty in class

            colSpan: { type: Number },
          },
        ],
      },
    ],
    mathTeachers: [{ type: String }], // <-- Add this line
    timeSlots: [{ type: String }], // <-- Add this line
  },
  { timestamps: true }
);
module.exports = mongoose.model("Timetable", timetableSchema);
