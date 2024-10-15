import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  logoutAdmin,
  logoutUser,
  PatientLogin,
  patientRegister,
} from "../controllers/userController.js"; // Ensure this path is correct
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/Auth.js";

const router = express.Router();

// Route for user registration
router.post("/patient/register", patientRegister);
router.post("/login", PatientLogin);
router.post("/admin/addNew", isAdminAuthenticated, addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/user/logout", isPatientAuthenticated, logoutUser);
router.post("/doctor/addNew", isAdminAuthenticated, addNewDoctor);

export default router;
