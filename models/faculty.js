// backend/models/Faculty.js
const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  ccAssignments: [
    {
      academicYear: {
        type: String,
        required: true,
      },
      semester: {
        type: String,
        required: true,
      },
      section: {
        type: String,
        required: true,
      },
      department: {
        type: String,
        required: true,
      },
      assignedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    enum: ["Mr", "Ms", "Mrs", "Dr", "Prof"],
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Invalid email format"],
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  designation: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Mobile number must be 10 digits"],
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  dateOfJoining: {
    type: Date,
    required: true,
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
    required: true,
  },
  aadhaar: {
    type: String,
    required: true,
    match: [/^\d{12}$/, "Aadhaar number must be 12 digits"],
  },
  employmentType: {
    type: String,
    required: true,
    enum: ["Permanent", "Contract", "Visiting", "Part-time"],
  },
  status: {
    type: String,
    default: "Active",
    enum: ["Active", "Inactive"],
  },
  type: {
    type: String,
    required: true,
    enum: ["teaching", "non-teaching"],
  },
  teachingExperience: {
    type: Number,
    required: function () {
      return this.type === "teaching";
    },
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
    required: true,
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
    required: true,
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
    required: true,
  },
  panNumber: {
    type: String,
    required: true,
    match: [/^[A-Z]{5}\d{4}[A-Z]{1}$/, "Invalid PAN number format"],
  },
  motherTongue: {
    type: String,
    required: true,
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
  },
  designationNature: {
    type: String,
    required: true,
    enum: ["Permanent", "Temporary", "Contract", "Visiting"],
  },
  pf: {
    type: String,
    required: true,
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
    required: true,
  },
  uanNumber: {
    type: String,
    default: "",
  },
  ifscCode: {
    type: String,
    required: true,
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"],
  },
  esicNumber: {
    type: String,
    default: "",
  },
  pfApplicable: {
    type: String,
    required: true,
    enum: ["Yes", "No"],
  },

  imageUpload: {
    type: String, // Store file path or URL after uploading
    default: "",
  },
  signatureUpload: {
    type: String, // Store file path or URL after uploading
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("Faculty", facultySchema);
