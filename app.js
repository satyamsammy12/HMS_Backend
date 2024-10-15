import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import messageRouter from "./router/messageRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

import userRouter from "./router/userRouter.js";

const app = express();

// Load environment variables
config({ path: "./config/config.env" });

// Middleware setup
app.use(cors({
  origin: 'https://lucent-tiramisu-52d94b.netlify.app',
  credentials: true, // This is important if you are sending cookies or authentication headers
}));
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

dbConnection();
// API routes
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// Connect to the database

// Error handling middleware
app.use(errorMiddleware);

export default app;
