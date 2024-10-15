import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
    minlength: [2, "First Name must be greater than 2 characters"],
    maxlength: [10, "First Name must be less than 10 characters"],
    validate: [
      {
        validator: validator.isAlpha,
        message: "First Name should contain only alphabetic characters",
      },
    ],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    minlength: [2, "Last Name must be greater than 2 characters"],
    maxlength: [10, "Last Name must be less than 10 characters"],
    validate: [
      {
        validator: validator.isAlpha,
        message: "Last Name should contain only alphabetic characters",
      },
    ],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email address",
    },
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minlength: [9, "Phone number must be at least 9 characters"],
    maxlength: [15, "Phone number must be at most 15 characters"], // Adjusted max length
    validate: [
      {
        validator: validator.isNumeric,
        message: "Phone number should contain only numeric characters",
      },
    ],
  },
  nic: {
    type: String,
    required: [true, "NIC number is required"],
    minlength: [13, "NIC number must be 13 characters long"],
    maxlength: [13, "NIC number must be 13 characters long"],
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth is required"],
    validate: {
      validator: function (value) {
        return value < Date.now(); // Ensure DOB is not in the future
      },
      message: "Date of Birth cannot be in the future",
    },
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: {
      values: ["Male", "Female", "Other"],
      message: "Gender must be either Male, Female, or Other",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
    minlength: [8, "Password must be at least 8 characters long"],
  },
  role: {
    type: String,
    enum: ["Patient", "Admin", "Doctor"],
  },
  doctorDepartment: {
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT method
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
