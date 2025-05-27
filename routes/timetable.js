// routes/timetableRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllTimetables,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} = require("../controllers/timetableController");

router.get("/", getAllTimetables);
router.post("/", createTimetable);
router.put("/:id", updateTimetable);
router.delete("/:id", deleteTimetable);

module.exports = router;
