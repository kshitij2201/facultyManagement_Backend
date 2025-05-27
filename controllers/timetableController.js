// controllers/timetableController.js
const Timetable = require("../models/timetable");

const getAllTimetables = async (req, res) => {
  try {
    const { department } = req.query;
    let filter = {};
    if (department) {
      // collegeInfo.department is the field in your schema
      filter["collegeInfo.department"] = { $regex: department, $options: "i" };
    }
    const timetables = await Timetable.find(filter);
    res.status(200).json(timetables);
  } catch (error) {
    console.error("Error fetching timetables:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const createTimetable = async (req, res) => {
  try {
    const { collegeInfo, subjects, timetableData, mathTeachers, timeSlots } =
      req.body;

    if (
      !collegeInfo ||
      !subjects ||
      !timetableData ||
      !mathTeachers ||
      !timeSlots
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const timetable = new Timetable({
      collegeInfo,
      subjects,
      timetableData,
      mathTeachers,
      timeSlots,
    });
    await timetable.save();

    res.status(201).json({
      message: "Timetable saved successfully",
      timetable,
    });
  } catch (error) {
    console.error("Error saving timetable:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const { collegeInfo, subjects, timetableData, mathTeachers, timeSlots } =
      req.body;

    if (
      !collegeInfo ||
      !subjects ||
      !timetableData ||
      !mathTeachers ||
      !timeSlots
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedTimetable = await Timetable.findByIdAndUpdate(
      id,
      { collegeInfo, subjects, timetableData, mathTeachers, timeSlots },
      { new: true } // Return the updated document
    );

    if (!updatedTimetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    res.status(200).json({
      message: "Timetable updated successfully",
      timetable: updatedTimetable,
    });
  } catch (error) {
    console.error("Error updating timetable:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTimetable = await Timetable.findByIdAndDelete(id);

    if (!deletedTimetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    res.status(200).json({
      message: "Timetable deleted successfully",
      timetable: deletedTimetable,
    });
  } catch (error) {
    console.error("Error deleting timetable:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllTimetables,
  createTimetable,
  updateTimetable,
  deleteTimetable,
};
