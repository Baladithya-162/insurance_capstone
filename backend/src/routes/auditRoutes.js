import express from "express";
const router = express.Router();
import * as auditController from "../controllers/auditController.js";
import  auth from "../middlewares/authMiddleware.js";

// Admin: fetch all audit logs
router.get("/admin/audit", auth("admin"), auditController.getAuditLogs);


export default  router