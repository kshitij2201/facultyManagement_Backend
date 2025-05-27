const Faculty = require("../models/faculty");
const FacultyHistory = require("../models/FacultyHistory");

// Get HOD history
exports.getHodHistory = async (req, res) => {
  try {
    const hodHistory = await FacultyHistory.find({ role: "hod" }).lean();
    const groupedHistory = hodHistory.reduce((acc, entry) => {
      const dept = entry.department;
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push({
        facultyId: entry.facultyId,
        name: entry.name,
        startDate: entry.startDate.toISOString().split("T")[0],
        endDate: entry.endDate
          ? entry.endDate.toISOString().split("T")[0]
          : null,
        reason: entry.reason,
        notes: entry.notes,
      });
      return acc;
    }, {});
    res.status(200).json({ data: groupedHistory });
  } catch (error) {
    console.error("Error fetching HOD history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Principal history
exports.getPrincipalHistory = async (req, res) => {
  try {
    const principalHistory = await FacultyHistory.find({
      role: "principal",
    }).lean();
    const formattedHistory = principalHistory.map((entry) => ({
      facultyId: entry.facultyId,
      name: entry.name,
      startDate: entry.startDate.toISOString().split("T")[0],
      endDate: entry.endDate ? entry.endDate.toISOString().split("T")[0] : null,
      reason: entry.reason,
      notes: entry.notes,
    }));
    res.status(200).json({ data: formattedHistory });
  } catch (error) {
    console.error("Error fetching Principal history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign HOD
exports.assignHod = async (req, res) => {
  const { facultyId, department, reason, notes, createdDate } = req.body;

  if (!facultyId || !department || !reason || !createdDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const faculty = await Faculty.findOne({ _id: facultyId, department });
    if (!faculty) {
      return res.status(404).json({
        message:
          "Faculty not found or does not belong to the specified department",
      });
    }

    // Find and update the current HOD (if any) for the department
    const currentHod = await Faculty.findOne({ department, role: "hod" });
    if (currentHod) {
      currentHod.role = null;
      await currentHod.save();
      // Update FacultyHistory for the previous HOD
      await FacultyHistory.updateOne(
        {
          facultyId: currentHod.employeeId,
          role: "hod",
          department,
          endDate: { $exists: false },
        },
        {
          endDate: new Date(createdDate),
          reason: `Replaced by ${faculty.name}`,
        }
      );
    }

    // Assign new HOD
    faculty.role = "hod";
    await faculty.save();

    // Create new FacultyHistory entry
    const historyEntry = new FacultyHistory({
      facultyId: faculty.employeeId,
      name: faculty.name,
      role: "hod",
      department,
      startDate: new Date(createdDate),
      reason,
      notes,
    });
    await historyEntry.save();

    res.status(200).json({ message: "HOD assigned successfully", faculty });
  } catch (error) {
    console.error("Error assigning HOD:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign Principal
exports.assignPrincipal = async (req, res) => {
  const { facultyId, reason, notes, createdDate } = req.body;

  if (!facultyId || !reason || !createdDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Find and update the current Principal (if any)
    const currentPrincipal = await Faculty.findOne({ role: "principal" });
    if (currentPrincipal) {
      currentPrincipal.role = null;
      await currentPrincipal.save();
      // Update FacultyHistory for the previous Principal
      await FacultyHistory.updateOne(
        {
          facultyId: currentPrincipal.employeeId,
          role: "principal",
          endDate: { $exists: false },
        },
        {
          endDate: new Date(createdDate),
          reason: `Replaced by ${faculty.name}`,
        }
      );
    }

    // Assign new Principal
    faculty.role = "principal";
    await faculty.save();

    // Create new FacultyHistory entry
    const historyEntry = new FacultyHistory({
      facultyId: faculty.employeeId,
      name: faculty.name,
      role: "principal",
      startDate: new Date(createdDate),
      reason,
      notes,
    });
    await historyEntry.save();

    res
      .status(200)
      .json({ message: "Principal assigned successfully", faculty });
  } catch (error) {
    console.error("Error assigning Principal:", error);
    res.status(500).json({ message: "Server error" });
  }
};
