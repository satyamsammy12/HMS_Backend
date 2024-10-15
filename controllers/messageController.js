import { Message } from "../models/messageSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

const sendMessage = catchAsyncError(async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  // Check for missing fields
  if (!firstName || !lastName || !email || !phone || !message) {
    throw new ErrorHandler("Please fill in all fields.", 400);
  }

  // Create and save the new message
  const newMessage = new Message({
    firstName,
    lastName,
    email,
    phone,
    message,
  });

  await newMessage.save();

  // Send a success response
  res.status(200).json({
    success: true,
    message: "Message sent successfully.",
  });
});

export const getAllMessage = catchAsyncError(async (req, res) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    data: messages,
  });
});

export default sendMessage;
