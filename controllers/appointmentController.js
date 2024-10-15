import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointmentDate,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  // Check for missing fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointmentDate ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please fill in all fields.", 400));
  }

  // Check for doctor existence
  const doctor = await User.findOne({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found in the system.", 404));
  }

  // Assuming there's a unique constraint and we handle it with just one query.
  const doctorId = doctor._id;
  const patientId = req.user._id;

  // Create the appointment
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointmentDate, // Ensure this matches the schema definition
    department,
    doctor: {
      firstName: doctor_firstName, // Ensure these field names are correct
      lastName: doctor_lastName,
    },
    doctor_id: doctorId, // Assuming this field exists in your schema
    patient_id: patientId, // Assuming this field exists in your schema
    hasVisited,
    address,
  });

  res.status(201).json({
    success: true,
    message: "Appointment created successfully",
    data: appointment,
  });
});

export const getAllAppointments = catchAsyncError(async (req, res) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    data: appointments,
  });
});
export const updateAppointmentStatus = catchAsyncError(
  async (req, res, next) => {
    const appointmentId = req.params.id;

    // Update the appointment status
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the updated fields against the schema
      }
    );

    // Check if the appointment was found and updated
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found.", 404));
    }

    // Send the response back
    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: appointment,
    });
  }
);

export const deleteAppointment = catchAsyncError(async (req, res, next) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found.", 404));
  }
  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully",
  });
});
