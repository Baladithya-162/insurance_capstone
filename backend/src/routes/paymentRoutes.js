import express from "express";
const router = express.Router();
import  * as paymentController from "../controllers/paymentController.js";
import auth from "../middlewares/authMiddleware.js";

// Customer
router.post("/payments", auth("customer"), paymentController.recordPayment);
router.get("/payments/user", auth("customer"), paymentController.getUserPayments);

// Admin
router.get("/payments", auth("admin"), paymentController.getAllPayments);


export default router