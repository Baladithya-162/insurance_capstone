import express from "express";
import { getSummary } from "../controllers/adminController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin: summary KPIs
router.get("/summary", auth("admin"), getSummary);

export default router;
