import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true, // Trim whitespace
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address.",
    },
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: validator.isMobilePhone, // Use appropriate locale if needed
      message: "Please provide a valid phone number.",
    },
  },
  nic: {
    type: String,
    required: true,
    trim: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"], // Add specific options if necessary
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  doctor: {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"], // Add specific options if necessary
    default: "Pending",
  },
});

// Export the model
export const Appointment = mongoose.model("Appointment", appointmentSchema);
