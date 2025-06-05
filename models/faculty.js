const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  ccAssignments: [
    {
      academicYear: { type: String, required: true },
      semester: { type: String, required: true },
      section: { type: String, required: true },
      department: { type: String, required: true },
      assignedAt: { type: Date, default: Date.now },
    },
  ],
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    enum: ["Mr", "Ms", "Mrs", "Dr", "Prof"],
    default: "Mr", // Optional with default
  },
  firstName: {
    type: String,
    default: "", // Optional
  },
  middleName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "", // Optional
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Invalid email format"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Other", // Optional with default
  },
  designation: {
    type: String,
    default: "", // Optional
  },
  mobile: {
    type: String,
    match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    default: "0000000000", // Optional with default
  },
  dateOfBirth: {
    type: Date,
    default: null, // Optional
  },
  dateOfJoining: {
    type: Date,
    default: null, // Optional
  },
  department: {
    type: String,
    required: true,
    enum: [
      "Computer Science",
      "Information Technology",
      "Electronics",
      "Mechanical",
      "Civil",
      "Electrical",
      "Data Science",
      "Account Section",
    ],
  },
  address: {
    type: String,
    default: "", // Optional
  },
  aadhaar: {
    type: String,
    match: [/^\d{12}$/, "Aadhaar number must be 12 digits"],
    default: "000000000000", // Optional with default
  },
  employmentType: {
    type: String,
    enum: ["Permanent", "Contract", "Visiting", "Part-time"],
    default: "Contract", // Optional with default
  },
  status: {
    type: String,
    default: "Active",
    enum: ["Active", "Inactive"],
  },
  type: {
    type: String,
    required: true,
    enum: ["teaching", "non-teaching", "HOD", "principal", "cc"],
    default: "teaching",
  },
  role: {
    // Added role field
    type: String,
    enum: [null, "hod", "principal"],
    default: null,
  },
  teachingExperience: {
    type: Number,
    default: 0, // Optional
  },
  subjectsTaught: {
    type: [String],
    default: [],
  },
  technicalSkills: {
    type: [String],
    default: [],
  },
  fathersName: {
    type: String,
    default: "", // Optional
  },
  rfidNo: {
    type: String,
    default: "",
  },
  sevarthNo: {
    type: String,
    default: "",
  },
  personalEmail: {
    type: String,
    default: "",
    match: [/\S+@\S+\.\S+/, "Invalid personal email format"],
  },
  communicationEmail: {
    type: String,
    default: "",
    match: [/\S+@\S+\.\S+/, "Invalid communication email format"],
  },
  spouseName: {
    type: String,
    default: "",
  },
  dateOfIncrement: {
    type: Date,
  },
  dateOfRetirement: {
    type: Date,
    default: null, // Optional
  },
  relievingDate: {
    type: Date,
  },
  payRevisedDate: {
    type: Date,
  },
  transportAllowance: {
    type: String,
    default: "NO",
    enum: ["YES", "NO"],
  },
  handicap: {
    type: String,
    default: "NO",
    enum: ["YES", "NO"],
  },
  seniorCitizen: {
    type: String,
    default: "NO",
    enum: ["YES", "NO"],
  },
  hra: {
    type: String,
    default: "NO",
    enum: ["YES", "NO"],
  },
  quarter: {
    type: String,
    default: "NO",
    enum: ["YES", "NO"],
  },
  bankName: {
    type: String,
    default: "", // Optional
  },
  panNumber: {
    type: String,
    match: [/^[A-Z]{5}\d{4}[A-Z]{1}$/, "Invalid PAN number format"],
    default: "", // Optional
  },
  motherTongue: {
    type: String,
    enum: [
      "Marathi",
      "Hindi",
      "English",
      "Tamil",
      "Telugu",
      "Kannada",
      "Malayalam",
      "Gujarati",
      "Bengali",
      "Punjabi",
      "Other",
    ],
    default: "Other", // Optional with default
  },
  designationNature: {
    type: String,
    enum: ["Permanent", "Temporary", "Contract", "Visiting"],
    default: "Contract", // Optional with default
  },
  pf: {
    type: String,
    default: "", // Optional
  },
  pfNumber: {
    type: String,
    default: "",
  },
  npsNumber: {
    type: String,
    default: "",
  },
  bankBranchName: {
    type: String,
    default: "", // Optional
  },
  uanNumber: {
    type: String,
    default: "",
  },
  ifscCode: {
    type: String,
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"],
    default: "", // Optional
  },
  esicNumber: {
    type: String,
    default: "",
  },
  pfApplicable: {
    type: String,
    enum: ["Yes", "No"],
    default: "No", // Optional with default
  },
  imageUpload: {
    type: String,
    default: "",
  },
  signatureUpload: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("Faculty", facultySchema);
