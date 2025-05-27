// // backend/controllers/facultyController.js
// const Faculty = require("../models/faculty");
// const Student = require("../models/Student");
// const Subject = require("../models/Subject");
// const Attendance = require("../models/Attendance");
// const SalaryRecord = require("../models/SalaryRecord");
// const Counter = require("../models/Counter");
// const bcrypt = require("bcryptjs");
// const emailvalidator = require("email-validator");

// // Helper function to generate employeeId
// const generateEmployeeId = async (type) => {
//   const prefix = "NC";
//   const departmentCode = type === "non-teaching" ? "NT" : "AT";
//   const counterId = type === "non-teaching" ? "nonTeaching" : "teaching";

//   const counter = await Counter.findOneAndUpdate(
//     { id: counterId },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );

//   const number = (1000 + counter.seq).toString().padStart(4, "0");
//   return `${prefix}${departmentCode}${number}`;
// };

// // Helper function to generate password from DOB
// const generatePasswordFromDOB = (dateOfBirth) => {
//   // Remove all non-alphanumeric characters (e.g., -, /, .)
//   return dateOfBirth.replace(/[^a-zA-Z0-9]/g, "");
// };

// // Helper function to validate phone number
// const isValidPhoneNumber = (phone) => {
//   return /^\d{10}$/.test(phone);
// };

// // Helper function to validate Aadhaar number
// const isValidAadhaar = (aadhaar) => {
//   return /^\d{12}$/.test(aadhaar);
// };

// // Helper function to validate PAN number
// const isValidPanNumber = (pan) => {
//   return /^[A-Z]{5}\d{4}[A-Z]$/.test(pan);
// };

// const facultyRegister = async (req, res) => {
//   try {
//     if (!req.body) {
//       return res.status(400).json({
//         success: false,
//         message: "Request body is missing",
//       });
//     }

//     const formData = { ...req.body };

//     // Parse arrays if strings
//     if (
//       formData.subjectsTaught &&
//       typeof formData.subjectsTaught === "string"
//     ) {
//       try {
//         formData.subjectsTaught = JSON.parse(formData.subjectsTaught);
//       } catch (e) {
//         console.warn("Error parsing subjectsTaught:", e.message);
//         formData.subjectsTaught = [];
//       }
//     }
//     if (
//       formData.technicalSkills &&
//       typeof formData.technicalSkills === "string"
//     ) {
//       formData.technicalSkills = formData.technicalSkills
//         .split(",")
//         .map((skill) => skill.trim())
//         .filter((skill) => skill !== "");
//     }

//     // Handle file uploads
//     if (req.files) {
//       if (req.files.imageUpload) {
//         formData.imageUpload = req.files.imageUpload[0].path;
//       }
//       if (req.files.signatureUpload) {
//         formData.signatureUpload = req.files.signatureUpload[0].path;
//       }
//     }

//     // Required fields validation
//     const requiredFields = [
//       "title",
//       "firstName",
//       "lastName",
//       "email",
//       "gender",
//       "designation",
//       "mobile",
//       "dateOfBirth",
//       "dateOfJoining",
//       "department",
//       "address",
//       "aadhaar",
//       "employmentType",
//       "fathersName",
//       "bankName",
//       "panNumber",
//       "motherTongue",
//       "designationNature",
//       "pf",
//       "bankBranchName",
//       "ifscCode",
//       "pfApplicable",
//       "dateOfRetirement",
//       "type",
//     ];
//     const missingFields = requiredFields.filter(
//       (field) => !formData[field] || formData[field].toString().trim() === ""
//     );
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Missing required fields: ${missingFields.join(", ")}`,
//       });
//     }

//     // Additional validations
//     if (!emailvalidator.validate(formData.email)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide a valid email ID",
//       });
//     }
//     if (
//       formData.personalEmail &&
//       !emailvalidator.validate(formData.personalEmail)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide a valid personal email ID",
//       });
//     }
//     if (
//       formData.communicationEmail &&
//       !emailvalidator.validate(formData.communicationEmail)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide a valid communication email ID",
//       });
//     }
//     if (!isValidPhoneNumber(formData.mobile)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide a valid 10-digit mobile number",
//       });
//     }
//     if (!isValidAadhaar(formData.aadhaar)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide a valid 12-digit Aadhaar number",
//       });
//     }
//     if (!isValidPanNumber(formData.panNumber)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide a valid PAN number (e.g., ABCDE1234F)",
//       });
//     }

//     // Check for existing faculty
//     const existingFaculty = await Faculty.findOne({ email: formData.email });
//     if (existingFaculty) {
//       return res.status(400).json({
//         success: false,
//         message: "Account already exists with provided email ID",
//       });
//     }

//     // Validate dates
//     const dob = new Date(formData.dateOfBirth);
//     const doj = new Date(formData.dateOfJoining);
//     const dor = new Date(formData.dateOfRetirement);
//     const today = new Date();
//     if (isNaN(dob) || isNaN(doj) || isNaN(dor)) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Invalid date format for dateOfBirth, dateOfJoining, or dateOfRetirement",
//       });
//     }
//     if (dob >= doj) {
//       return res.status(400).json({
//         success: false,
//         message: "Date of Birth must be before Date of Joining",
//       });
//     }
//     if (doj > today) {
//       return res.status(400).json({
//         success: false,
//         message: "Date of Joining cannot be in the future",
//       });
//     }
//     if (dor <= doj) {
//       return res.status(400).json({
//         success: false,
//         message: "Date of Retirement must be after Date of Joining",
//       });
//     }

//     // Generate employeeId
//     formData.employeeId = await generateEmployeeId(formData.type);

//     // Generate name (consider moving to schema)
//     formData.name = `${formData.title} ${formData.firstName} ${
//       formData.middleName || ""
//     } ${formData.lastName}`.trim();

//     // Set isHOD based on type
//     formData.isHOD = formData.type === "HOD";

//     // Set default values for optional fields
//     formData.status = formData.status || "Active";
//     formData.teachingExperience = Number(formData.teachingExperience) || 0;
//     formData.subjectsTaught = Array.isArray(formData.subjectsTaught)
//       ? formData.subjectsTaught
//       : [];
//     formData.technicalSkills = Array.isArray(formData.technicalSkills)
//       ? formData.technicalSkills
//       : [];
//     formData.researchPublications = Array.isArray(formData.researchPublications)
//       ? formData.researchPublications
//       : [];
//     formData.reportingOfficer = formData.reportingOfficer || "";
//     formData.shiftTiming = formData.shiftTiming || "";
//     formData.classIncharge = formData.classIncharge || "";
//     formData.rfidNo = formData.rfidNo || "";
//     formData.sevarthNo = formData.sevarthNo || "";
//     formData.spouseName = formData.spouseName || "";
//     formData.personalEmail = formData.personalEmail || "";
//     formData.communicationEmail = formData.communicationEmail || "";
//     formData.dateOfIncrement = formData.dateOfIncrement
//       ? new Date(formData.dateOfIncrement)
//       : null;
//     formData.relievingDate = formData.relievingDate
//       ? new Date(formData.relievingDate)
//       : null;
//     formData.payRevisedDate = formData.payRevisedDate
//       ? new Date(formData.payRevisedDate)
//       : null;
//     formData.transportAllowance = formData.transportAllowance || "NO";
//     formData.handicap = formData.handicap || "NO";
//     formData.seniorCitizen = formData.seniorCitizen || "NO";
//     formData.hra = formData.hra || "NO";
//     formData.quarter = formData.quarter || "NO";
//     formData.pfNumber = formData.pfNumber || "";
//     formData.npsNumber = formData.npsNumber || "";
//     formData.uanNumber = formData.uanNumber || "";
//     formData.esicNumber = formData.esicNumber || "";

//     // Generate and hash password from DOB
//     // SECURITY WARNING: Using DOB as a password is insecure as it’s predictable.
//     // Consider requiring a password change on first login (tracked by passwordUpdated).
//     const initialPassword = generatePasswordFromDOB(formData.dateOfBirth);
//     if (initialPassword.length < 8) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Generated password is too short (must be at least 8 characters after removing special characters)",
//       });
//     }
//     formData.password = await bcrypt.hash(initialPassword, 10);

//     // Create new faculty
//     const newFaculty = new Faculty(formData);
//     const result = await newFaculty.save();

//     // Create salary record
//     const salaryData = {
//       employeeId: formData.employeeId,
//       name: formData.name,
//       department: formData.department,
//       designation: formData.designation,
//       type: formData.type,
//       basicSalary: Number(formData.basicSalary) || 0,
//       hra: formData.hra === "YES" ? Number(formData.hraAmount) || 0 : 0,
//       da: Number(formData.da) || 0,
//       bonus: Number(formData.bonus) || 0,
//       overtimePay: Number(formData.overtimePay) || 0,
//       grossSalary: 0, // Calculate based on inputs if needed
//       taxDeduction: Number(formData.taxDeduction) || 0,
//       pfDeduction:
//         formData.pfApplicable === "Yes" ? Number(formData.pfDeduction) || 0 : 0,
//       otherDeductions: Number(formData.otherDeductions) || 0,
//       netSalary: 0, // Calculate based on inputs if needed
//       paymentDate: new Date(),
//       paymentMethod: formData.paymentMethod || "Bank Transfer",
//       bankAccount: `${formData.bankName} ${formData.bankBranchName}`.trim(),
//       workingHours: Number(formData.workingHours) || 0,
//       leaveDeduction: Number(formData.leaveDeduction) || 0,
//       status: "Pending",
//     };
//     const salary = new SalaryRecord(salaryData);
//     await salary.save();

//     return res.status(201).json({
//       success: true,
//       message: `${
//         formData.type === "teaching" ? "Faculty" : "Non-teaching"
//       } staff registered successfully`,
//       data: {
//         faculty: result,
//         initialPassword, // Only include if needed (e.g., for email notification)
//       },
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     if (error.name === "MongoServerError" && error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Duplicate key error: email or employeeId already exists",
//       });
//     }
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const staffLogin = async (req, res) => {
//   const { email, password } = req.body;
//   const errors = { emailError: "", passwordError: "" };

//   try {
//     if (!email || !password) {
//       errors.emailError = !email ? "Email is required" : "";
//       errors.passwordError = !password ? "Password is required" : "";
//       return res.status(400).json({ success: false, errors });
//     }

//     const existingUser = await Faculty.findOne({ email });
//     if (!existingUser) {
//       errors.emailError = "Staff not found.";
//       return res.status(404).json({ success: false, errors });
//     }

//     if (!existingUser.password) {
//       errors.passwordError = "Password not set for this user.";
//       return res.status(400).json({ success: false, errors });
//     }

//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       existingUser.password
//     );
//     if (!isPasswordCorrect) {
//       errors.passwordError = "Incorrect password.";
//       return res.status(401).json({ success: false, errors });
//     }

//     // TODO: Implement JWT or session handling here
//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: existingUser,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const updatePassword = async (req, res) => {
//   try {
//     const { newPassword, confirmPassword, email } = req.body;
//     const errors = { mismatchError: "", strengthError: "" };

//     if (!newPassword || !confirmPassword || !email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email, new password, and confirm password are required",
//       });
//     }

//     if (newPassword !== confirmPassword) {
//       errors.mismatchError =
//         "Your password and confirmation password do not match";
//       return res.status(400).json({ success: false, errors });
//     }

//     // Password strength validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
//     if (!passwordRegex.test(newPassword)) {
//       errors.strengthError =
//         "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number";
//       return res.status(400).json({ success: false, errors });
//     }

//     const faculty = await Faculty.findOne({ email });
//     if (!faculty) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found with the provided email",
//       });
//     }

//     faculty.password = await bcrypt.hash(newPassword, 10);
//     faculty.passwordUpdated = true;
//     await faculty.save();

//     return res.status(200).json({
//       success: true,
//       message: "Password updated successfully",
//       data: { email: faculty.email },
//     });
//   } catch (error) {
//     console.error("Update Password Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const updateFaculty = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const updateData = req.body;

//     const faculty = await Faculty.findOne({ email });
//     if (!faculty) {
//       return res.status(404).json({
//         success: false,
//         message: "Staff not found with the provided email",
//       });
//     }

//     // Validate updated fields
//     if (updateData.email && !emailvalidator.validate(updateData.email)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email format",
//       });
//     }
//     if (updateData.mobile && !isValidPhoneNumber(updateData.mobile)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid mobile number format",
//       });
//     }
//     if (updateData.aadhaar && !isValidAadhaar(updateData.aadhaar)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Aadhaar number format",
//       });
//     }
//     if (updateData.panNumber && !isValidPanNumber(updateData.panNumber)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid PAN number format",
//       });
//     }

//     Object.keys(updateData).forEach((key) => {
//       if (key !== "email" && key !== "password" && key !== "employeeId") {
//         faculty[key] = updateData[key];
//       }
//     });

//     const updatedFaculty = await faculty.save();

//     return res.status(200).json({
//       success: true,
//       message: "Staff information updated successfully",
//       data: updatedFaculty,
//     });
//   } catch (error) {
//     console.error("Update Faculty Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// // const getFaculties = async (req, res) => {
// //   try {
// //     // Add pagination
// //     const page = parseInt(req.query.page) || 1;
// //     const limit = parseInt(req.query.limit) || 10;
// //     const skip = (page - 1) * limit;

// //     const faculties = await Faculty.find().skip(skip).limit(limit).lean();

// //     if (faculties.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "No faculty records found",
// //       });
// //     }

// //     const total = await Faculty.countDocuments();

// //     return res.status(200).json({
// //       success: true,
// //       message: "Faculties retrieved successfully",
// //       data: {
// //         faculties,
// //         pagination: {
// //           page,
// //           limit,
// //           total,
// //           pages: Math.ceil(total / limit),
// //         },
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Get Faculties Error:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Internal server error",
// //       error: error.message,
// //     });
// //   }
// // };
// // ...existing code...
// const getFaculties = async (req, res) => {
//   try {
//     const { department } = req.query;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Build filter
//     const filter = {};
//     if (department) {
//       filter.department = department;
//     }

//     const faculties = await Faculty.find(filter).skip(skip).limit(limit).lean();

//     if (faculties.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No faculty records found",
//       });
//     }

//     const total = await Faculty.countDocuments(filter);

//     return res.status(200).json({
//       success: true,
//       message: "Faculties retrieved successfully",
//       data: {
//         faculties,
//         pagination: {
//           page,
//           limit,
//           total,
//           pages: Math.ceil(total / limit),
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Get Faculties Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };
// // ...existing code...

// const getStudent = async (req, res) => {
//   try {
//     const { department, year, section } = req.body;

//     if (!department || !year || !section) {
//       return res.status(400).json({
//         success: false,
//         message: "Department, year, and section are required",
//       });
//     }

//     const students = await Student.find({ department, year, section }).lean();
//     if (students.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No students found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Students retrieved successfully",
//       data: students,
//     });
//   } catch (error) {
//     console.error("Get Student Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const markAttendance = async (req, res) => {
//   try {
//     const { selectedStudents, subjectName, department, year, section } =
//       req.body;

//     if (!subjectName || !department || !year || !section) {
//       return res.status(400).json({
//         success: false,
//         message: "Subject name, department, year, and section are required",
//       });
//     }

//     const sub = await Subject.findOne({ subjectName });
//     if (!sub) {
//       return res.status(404).json({
//         success: false,
//         message: "Subject not found",
//       });
//     }

//     const allStudents = await Student.find({ department, year, section });
//     if (allStudents.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No students found for the given criteria",
//       });
//     }

//     // Validate selectedStudents
//     const validStudentIds = allStudents.map((s) => s._id.toString());
//     const invalidStudents = selectedStudents.filter(
//       (id) => !validStudentIds.includes(id)
//     );
//     if (invalidStudents.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid student IDs: ${invalidStudents.join(", ")}`,
//       });
//     }

//     // Prepare bulk operations
//     const bulkOps = allStudents.map((student) => ({
//       updateOne: {
//         filter: { student: student._id, subject: sub._id },
//         update: { $inc: { totalLecturesByFaculty: 1 } },
//         upsert: true,
//       },
//     }));

//     for (const studentId of selectedStudents) {
//       bulkOps.push({
//         updateOne: {
//           filter: { student: studentId, subject: sub._id },
//           update: { $inc: { lectureAttended: 1, totalLecturesByFaculty: 1 } },
//           upsert: true,
//         },
//       });
//     }

//     await Attendance.bulkWrite(bulkOps);

//     return res.status(200).json({
//       success: true,
//       message: "Attendance marked successfully",
//     });
//   } catch (error) {
//     console.error("Mark Attendance Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const getLastEmployeeId = async (req, res) => {
//   const { type } = req.query;

//   try {
//     if (!type || !["teaching", "non-teaching"].includes(type)) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid type (teaching or non-teaching) is required",
//       });
//     }

//     const counterId = type === "non-teaching" ? "nonTeaching" : "teaching";
//     const counter = await Counter.findOne({ id: counterId });

//     if (!counter) {
//       return res.status(200).json({
//         success: true,
//         data: { lastEmployeeId: null },
//       });
//     }

//     const prefix = "NC";
//     const departmentCode = type === "non-teaching" ? "NT" : "AT";
//     const number = (1000 + counter.seq).toString().padStart(4, "0");
//     const lastEmployeeId = `${prefix}${departmentCode}${number}`;

//     return res.status(200).json({
//       success: true,
//       data: { lastEmployeeId },
//     });
//   } catch (error) {
//     console.error("Error fetching last ID:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   facultyRegister,
//   staffLogin,
//   updatePassword,
//   updateFaculty,
//   getStudent,
//   markAttendance,
//   getFaculties,
//   getLastEmployeeId,
// };
// backend/controllers/facultyController.js
const Faculty = require("../models/faculty");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Attendance = require("../models/Attendance");
const SalaryRecord = require("../models/SalaryRecord");
const Counter = require("../models/Counter");
const bcrypt = require("bcryptjs");
const emailvalidator = require("email-validator");

// Helper function to generate employeeId
const generateEmployeeId = async (type) => {
  const prefix = "NC";
  const departmentCode = type === "non-teaching" ? "NT" : "AT";
  const counterId = type === "non-teaching" ? "nonTeaching" : "teaching";

  const counter = await Counter.findOneAndUpdate(
    { id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const number = (1000 + counter.seq).toString().padStart(4, "0");
  return `${prefix}${departmentCode}${number}`;
};

// Helper function to generate password from DOB
const generatePasswordFromDOB = (dateOfBirth) => {
  // Remove all non-alphanumeric characters (e.g., -, /, .)
  return dateOfBirth.replace(/[^a-zA-Z0-9]/g, "");
};

// Helper function to validate phone number
const isValidPhoneNumber = (phone) => {
  return /^\d{10}$/.test(phone);
};

// Helper function to validate Aadhaar number
const isValidAadhaar = (aadhaar) => {
  return /^\d{12}$/.test(aadhaar);
};

// Helper function to validate PAN number
const isValidPanNumber = (pan) => {
  return /^[A-Z]{5}\d{4}[A-Z]$/.test(pan);
};

const facultyRegister = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const formData = { ...req.body };

    // Parse arrays if strings
    if (
      formData.subjectsTaught &&
      typeof formData.subjectsTaught === "string"
    ) {
      try {
        formData.subjectsTaught = JSON.parse(formData.subjectsTaught);
      } catch (e) {
        console.warn("Error parsing subjectsTaught:", e.message);
        formData.subjectsTaught = [];
      }
    }
    if (
      formData.technicalSkills &&
      typeof formData.technicalSkills === "string"
    ) {
      formData.technicalSkills = formData.technicalSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.imageUpload) {
        formData.imageUpload = req.files.imageUpload[0].path;
      }
      if (req.files.signatureUpload) {
        formData.signatureUpload = req.files.signatureUpload[0].path;
      }
    }

    // Required fields validation
    const requiredFields = [
      "title",
      "firstName",
      "lastName",
      "email",
      "gender",
      "designation",
      "mobile",
      "dateOfBirth",
      "dateOfJoining",
      "department",
      "address",
      "aadhaar",
      "employmentType",
      "fathersName",
      "bankName",
      "panNumber",
      "motherTongue",
      "designationNature",
      "pf",
      "bankBranchName",
      "ifscCode",
      "pfApplicable",
      "dateOfRetirement",
      "type",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === ""
    );
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Additional validations
    if (!emailvalidator.validate(formData.email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email ID",
      });
    }
    if (
      formData.personalEmail &&
      !emailvalidator.validate(formData.personalEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid personal email ID",
      });
    }
    if (
      formData.communicationEmail &&
      !emailvalidator.validate(formData.communicationEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid communication email ID",
      });
    }
    if (!isValidPhoneNumber(formData.mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit mobile number",
      });
    }
    if (!isValidAadhaar(formData.aadhaar)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 12-digit Aadhaar number",
      });
    }
    if (!isValidPanNumber(formData.panNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid PAN number (e.g., ABCDE1234F)",
      });
    }

    // Check for existing faculty
    const existingFaculty = await Faculty.findOne({ email: formData.email });
    if (existingFaculty) {
      return res.status(400).json({
        success: false,
        message: "Account already exists with provided email ID",
      });
    }

    // Validate dates
    const dob = new Date(formData.dateOfBirth);
    const doj = new Date(formData.dateOfJoining);
    const dor = new Date(formData.dateOfRetirement);
    const today = new Date();
    if (isNaN(dob) || isNaN(doj) || isNaN(dor)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid date format for dateOfBirth, dateOfJoining, or dateOfRetirement",
      });
    }
    if (dob >= doj) {
      return res.status(400).json({
        success: false,
        message: "Date of Birth must be before Date of Joining",
      });
    }
    if (doj > today) {
      return res.status(400).json({
        success: false,
        message: "Date of Joining cannot be in the future",
      });
    }
    if (dor <= doj) {
      return res.status(400).json({
        success: false,
        message: "Date of Retirement must be after Date of Joining",
      });
    }

    // Generate employeeId
    formData.employeeId = await generateEmployeeId(formData.type);

    // Generate name (consider moving to schema)
    formData.name = `${formData.title} ${formData.firstName} ${
      formData.middleName || ""
    } ${formData.lastName}`.trim();

    // Set isHOD based on type
    formData.isHOD = formData.type === "HOD";

    // Set default values for optional fields
    formData.status = formData.status || "Active";
    formData.teachingExperience = Number(formData.teachingExperience) || 0;
    formData.subjectsTaught = Array.isArray(formData.subjectsTaught)
      ? formData.subjectsTaught
      : [];
    formData.technicalSkills = Array.isArray(formData.technicalSkills)
      ? formData.technicalSkills
      : [];
    formData.researchPublications = Array.isArray(formData.researchPublications)
      ? formData.researchPublications
      : [];
    formData.reportingOfficer = formData.reportingOfficer || "";
    formData.shiftTiming = formData.shiftTiming || "";
    formData.classIncharge = formData.classIncharge || "";
    formData.rfidNo = formData.rfidNo || "";
    formData.sevarthNo = formData.sevarthNo || "";
    formData.spouseName = formData.spouseName || "";
    formData.personalEmail = formData.personalEmail || "";
    formData.communicationEmail = formData.communicationEmail || "";
    formData.dateOfIncrement = formData.dateOfIncrement
      ? new Date(formData.dateOfIncrement)
      : null;
    formData.relievingDate = formData.relievingDate
      ? new Date(formData.relievingDate)
      : null;
    formData.payRevisedDate = formData.payRevisedDate
      ? new Date(formData.payRevisedDate)
      : null;
    formData.transportAllowance = formData.transportAllowance || "NO";
    formData.handicap = formData.handicap || "NO";
    formData.seniorCitizen = formData.seniorCitizen || "NO";
    formData.hra = formData.hra || "NO";
    formData.quarter = formData.quarter || "NO";
    formData.pfNumber = formData.pfNumber || "";
    formData.npsNumber = formData.npsNumber || "";
    formData.uanNumber = formData.uanNumber || "";
    formData.esicNumber = formData.esicNumber || "";

    // Generate and hash password from DOB
    // SECURITY WARNING: Using DOB as a password is insecure as it’s predictable.
    // Consider requiring a password change on first login (tracked by passwordUpdated).
    const initialPassword = generatePasswordFromDOB(formData.dateOfBirth);
    if (initialPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Generated password is too short (must be at least 8 characters after removing special characters)",
      });
    }
    formData.password = await bcrypt.hash(initialPassword, 10);

    // Create new faculty
    const newFaculty = new Faculty(formData);
    const result = await newFaculty.save();

    // Create salary record
    const salaryData = {
      employeeId: formData.employeeId,
      name: formData.name,
      department: formData.department,
      designation: formData.designation,
      type: formData.type,
      basicSalary: Number(formData.basicSalary) || 0,
      hra: formData.hra === "YES" ? Number(formData.hraAmount) || 0 : 0,
      da: Number(formData.da) || 0,
      bonus: Number(formData.bonus) || 0,
      overtimePay: Number(formData.overtimePay) || 0,
      grossSalary: 0, // Calculate based on inputs if needed
      taxDeduction: Number(formData.taxDeduction) || 0,
      pfDeduction:
        formData.pfApplicable === "Yes" ? Number(formData.pfDeduction) || 0 : 0,
      otherDeductions: Number(formData.otherDeductions) || 0,
      netSalary: 0, // Calculate based on inputs if needed
      paymentDate: new Date(),
      paymentMethod: formData.paymentMethod || "Bank Transfer",
      bankAccount: `${formData.bankName} ${formData.bankBranchName}`.trim(),
      workingHours: Number(formData.workingHours) || 0,
      leaveDeduction: Number(formData.leaveDeduction) || 0,
      status: "Pending",
    };
    const salary = new SalaryRecord(salaryData);
    await salary.save();

    return res.status(201).json({
      success: true,
      message: `${
        formData.type === "teaching" ? "Faculty" : "Non-teaching"
      } staff registered successfully`,
      data: {
        faculty: result,
        initialPassword, // Only include if needed (e.g., for email notification)
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate key error: email or employeeId already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const staffLogin = async (req, res) => {
  const { email, password } = req.body;
  const errors = { emailError: "", passwordError: "" };

  try {
    if (!email || !password) {
      errors.emailError = !email ? "Email is required" : "";
      errors.passwordError = !password ? "Password is required" : "";
      return res.status(400).json({ success: false, errors });
    }

    const existingUser = await Faculty.findOne({ email });
    if (!existingUser) {
      errors.emailError = "Staff not found.";
      return res.status(404).json({ success: false, errors });
    }

    if (!existingUser.password) {
      errors.passwordError = "Password not set for this user.";
      return res.status(400).json({ success: false, errors });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      errors.passwordError = "Incorrect password.";
      return res.status(401).json({ success: false, errors });
    }

    // TODO: Implement JWT or session handling here
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: existingUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: "", strengthError: "" };

    if (!newPassword || !confirmPassword || !email) {
      return res.status(400).json({
        success: false,
        message: "Email, new password, and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        "Your password and confirmation password do not match";
      return res.status(400).json({ success: false, errors });
    }

    // Password strength validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      errors.strengthError =
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number";
      return res.status(400).json({ success: false, errors });
    }

    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided email",
      });
    }

    faculty.password = await bcrypt.hash(newPassword, 10);
    faculty.passwordUpdated = true;
    await faculty.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: { email: faculty.email },
    });
  } catch (error) {
    console.error("Update Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;

    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Staff not found with the provided email",
      });
    }

    // Validate updated fields
    if (updateData.email && !emailvalidator.validate(updateData.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    if (updateData.mobile && !isValidPhoneNumber(updateData.mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number format",
      });
    }
    if (updateData.aadhaar && !isValidAadhaar(updateData.aadhaar)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhaar number format",
      });
    }
    if (updateData.panNumber && !isValidPanNumber(updateData.panNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid PAN number format",
      });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== "email" && key !== "password" && key !== "employeeId") {
        faculty[key] = updateData[key];
      }
    });

    const updatedFaculty = await faculty.save();

    return res.status(200).json({
      success: true,
      message: "Staff information updated successfully",
      data: updatedFaculty,
    });
  } catch (error) {
    console.error("Update Faculty Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getFaculties = async (req, res) => {
  try {
    const { department } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (department) {
      filter.department = department;
    }

    const faculties = await Faculty.find(filter).skip(skip).limit(limit).lean();

    if (faculties.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No faculty records found",
      });
    }

    const total = await Faculty.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Faculties retrieved successfully",
      data: {
        faculties,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get Faculties Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getStudent = async (req, res) => {
  try {
    const { department, year, section } = req.body;

    if (!department || !year || !section) {
      return res.status(400).json({
        success: false,
        message: "Department, year, and section are required",
      });
    }

    const students = await Student.find({ department, year, section }).lean();
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Students retrieved successfully",
      data: students,
    });
  } catch (error) {
    console.error("Get Student Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { selectedStudents, subjectName, department, year, section } =
      req.body;

    if (!subjectName || !department || !year || !section) {
      return res.status(400).json({
        success: false,
        message: "Subject name, department, year, and section are required",
      });
    }

    const sub = await Subject.findOne({ subjectName });
    if (!sub) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const allStudents = await Student.find({ department, year, section });
    if (allStudents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found for the given criteria",
      });
    }

    // Validate selectedStudents
    const validStudentIds = allStudents.map((s) => s._id.toString());
    const invalidStudents = selectedStudents.filter(
      (id) => !validStudentIds.includes(id)
    );
    if (invalidStudents.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid student IDs: ${invalidStudents.join(", ")}`,
      });
    }

    // Prepare bulk operations
    const bulkOps = allStudents.map((student) => ({
      updateOne: {
        filter: { student: student._id, subject: sub._id },
        update: { $inc: { totalLecturesByFaculty: 1 } },
        upsert: true,
      },
    }));

    for (const studentId of selectedStudents) {
      bulkOps.push({
        updateOne: {
          filter: { student: studentId, subject: sub._id },
          update: { $inc: { lectureAttended: 1, totalLecturesByFaculty: 1 } },
          upsert: true,
        },
      });
    }

    await Attendance.bulkWrite(bulkOps);

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    console.error("Mark Attendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getLastEmployeeId = async (req, res) => {
  const { type } = req.query;

  try {
    if (!type || !["teaching", "non-teaching"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Valid type (teaching or non-teaching) is required",
      });
    }

    const counterId = type === "non-teaching" ? "nonTeaching" : "teaching";
    const counter = await Counter.findOne({ id: counterId });

    if (!counter) {
      return res.status(200).json({
        success: true,
        data: { lastEmployeeId: null },
      });
    }

    const prefix = "NC";
    const departmentCode = type === "non-teaching" ? "NT" : "AT";
    const number = (1000 + counter.seq).toString().padStart(4, "0");
    const lastEmployeeId = `${prefix}${departmentCode}${number}`;

    return res.status(200).json({
      success: true,
      data: { lastEmployeeId },
    });
  } catch (error) {
    console.error("Error fetching last ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const assignCC = async (req, res) => {
  try {
    const { facultyId, academicYear, semester, section, department } = req.body;
    if (!facultyId || !academicYear || !semester || !section || !department) {
      return res.status(400).json({
        success: false,
        message:
          "facultyId, academicYear, semester, section, and department are required",
      });
    }

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res
        .status(404)
        .json({ success: false, message: "Faculty not found" });
    }

    // Check if another faculty is already assigned as CC for this year/semester/section
    const existingCC = await Faculty.findOne({
      department,
      ccAssignments: {
        $elemMatch: { academicYear, semester, section },
      },
      _id: { $ne: facultyId }, // Exclude the current faculty
    });

    if (existingCC) {
      return res.status(400).json({
        success: false,
        message: `Another faculty (${existingCC.name}) is already assigned as CC for ${academicYear}, Semester ${semester}, Section ${section}`,
      });
    }
    await Faculty.updateMany(
      {
        department,
        ccAssignments: { $elemMatch: { academicYear, semester, section } },
      },
      { $pull: { ccAssignments: { academicYear, semester, section } } }
    );

    // Remove any existing CC assignment for this faculty for the same year/semester/section
    faculty.ccAssignments = (faculty.ccAssignments || []).filter(
      (cc) =>
        !(
          cc.academicYear === academicYear &&
          cc.semester === semester &&
          cc.section === section
        )
    );

    // Add new CC assignment
    faculty.ccAssignments.push({
      academicYear,
      semester,
      section,
      department,
      assignedAt: new Date(),
    });

    await faculty.save();

    res.status(200).json({
      success: true,
      message: `${faculty.name} assigned as Course Coordinator for ${academicYear}, Semester ${semester}, Section ${section}`,
      data: {
        facultyId: faculty._id,
        name: faculty.name,
        academicYear,
        semester,
        section,
        department,
      },
    });
  } catch (error) {
    console.error("Assign CC Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all CC assignments for a department
const getCCAssignments = async (req, res) => {
  try {
    const { department } = req.query;
    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    const faculties = await Faculty.find({
      department,
      ccAssignments: { $exists: true, $ne: [] },
    })
      .select("name ccAssignments department")
      .lean();

    const assignments = [];
    faculties.forEach((faculty) => {
      (faculty.ccAssignments || []).forEach((cc) => {
        assignments.push({
          facultyId: faculty._id,
          name: faculty.name,
          department: faculty.department,
          academicYear: cc.academicYear,
          semester: cc.semester,
          section: cc.section,
          assignedAt: cc.assignedAt,
        });
      });
    });

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error("Get CC Assignments Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  facultyRegister,
  staffLogin,
  updatePassword,
  updateFaculty,
  assignCC,
  getCCAssignments,
  getStudent,
  markAttendance,
  getFaculties,
  getLastEmployeeId,
};
