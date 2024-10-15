import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "HOSPITAL_MANAGEMENT",
    })
    .then(() => console.log("MongoDB Connected to db connection"))
    .catch((err) => console.error("MongoDB connection failed: ", err));
};
