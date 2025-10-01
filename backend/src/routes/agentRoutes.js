import express from "express";
import { getAgents, createAgent, assignAgent } from "../controllers/agentController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin only
router.get("/", auth("admin"), getAgents);
router.post("/", auth("admin"), createAgent);
router.put("/:id/assign", auth("admin"), assignAgent);

export default router;
