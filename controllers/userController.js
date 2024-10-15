import { User } from "../models/userSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

// Patient Registration

export const patientRegister = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !nic ||
    !role
  ) {
    return next(new ErrorHandler("Please fill out all fields.", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User Already Registered", 400));
  }

  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role,
  });

  generateToken(user, "User Registered", 200, res);
});

export const PatientLogin = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return next(new ErrorHandler("Please fill out all required fields.", 400));
  }

  // Find the user by email and include password in the query
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if the password matches
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check for user role if provided
  if (role && role !== user.role) {
    return next(new ErrorHandler("Invalid role", 401));
  }

  // Respond with success message and token
  generateToken(user, "User logged in successfully", 200, res);
});

// Add New Admin
export const addNewAdmin = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, nic, dob, gender } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !nic ||
    !dob ||
    !gender
  ) {
    return next(new ErrorHandler("Please fill out all required fields.", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role} with this email already exists`,
        400
      )
    );
  }
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    nic,
    dob,
    gender,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "Admin added successfully",
    data: admin,
  });
});

// Get All Doctors
export const getAllDoctors = catchAsyncError(async (req, res) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    message: "Doctors fetched successfully",
    data: doctors,
  });
});

// Get User Details
export const getUserDetails = catchAsyncError(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User details fetched successfully",
    data: user,
  });
});

// Logout Admin
export const logoutAdmin = catchAsyncError(async (req, res) => {
  res
    .status(200)
    .cookie("adminToken", "", { expires: new Date(Date.now()),  httpOnly: true,
      secure:true,
      sameSite:"None" })
    .json({
      success: true,
      message: "Admin logged out successfully",
    });
});

// Logout User
export const logoutUser = catchAsyncError(async (req, res) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure:true,
      sameSite:"None"
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

// Add New Doctor
export const addNewDoctor = catchAsyncError(async (req, res, next) => {
  // Check for uploaded files
  if (!req.files || !req.files.docAvatar) {
    return next(new ErrorHandler("Doctor Avatar is Required", 400));
  }

  const { docAvatar } = req.files;
  const allowedFormats = ["image/jpg", "image/jpeg", "image/webp", "image/png"];

  // Debugging: log uploaded file details
  console.log("Uploaded file details:", docAvatar);

  // Check the file format
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("Invalid Doctor Avatar Format", 400));
  }

  // Destructure required fields from request body
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    nic,
    dob,
    gender,
    doctorDepartment,
    role,
  } = req.body;

  // Check for required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please fill out all required fields.", 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("A user with this email already exists", 400));
  }

  // Upload avatar to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown error"
    );
    return next(new ErrorHandler("Cloudinary upload failed", 500));
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new doctor record
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    nic,
    dob,
    gender,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  // Respond with success
  res.status(201).json({
    success: true,
    message: "Doctor Registered successfully",
    data: doctor,
  });
});
