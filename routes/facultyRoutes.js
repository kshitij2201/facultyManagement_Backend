const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // Add this line
const {
  facultyRegister,
  staffLogin,
  updatePassword,
  updateFaculty,
  getStudent,
  markAttendance,
  getFaculties,
  getLastEmployeeId,
  assignCC,
  getCCAssignments,
} = require("../controllers/facultyController");
const {
  getHodHistory,
  getPrincipalHistory,
  assignHod,
  assignPrincipal,
} = require("../controllers/facultyHistoryController");

// Faculty routes
router.post(
  "/register",
  upload.fields([
    { name: "imageUpload", maxCount: 1 },
    { name: "signatureUpload", maxCount: 1 },
  ]),
  facultyRegister
);
router.post("/login", staffLogin);
router.post("/updatepassword", updatePassword);
router.put("/update/:email", updateFaculty);
router.post("/getstudent", getStudent);
router.post("/markattendance", markAttendance);
router.get("/faculties", getFaculties);
router.get("/last-id", getLastEmployeeId);
router.get("/hod-history", getHodHistory);
router.get("/principal-history", getPrincipalHistory);
router.post("/assign-hod", assignHod);
router.post("/assign-principal", assignPrincipal);
router.post("/assign-cc", assignCC);
router.get("/cc-assignments", getCCAssignments);

module.exports = router;
