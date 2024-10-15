import express from "express";
import sendMessage, {
  getAllMessage,
} from "../controllers/messageController.js";
import { isAdminAuthenticated } from "../middlewares/Auth.js";
const router = express.Router();

router.post("/send", sendMessage);
router.get("/getAllMessage", isAdminAuthenticated, getAllMessage);

export default router;
