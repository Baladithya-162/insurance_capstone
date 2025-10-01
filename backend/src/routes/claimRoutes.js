import  express  from "express";
const router = express.Router();
import * as claimController from "../controllers/claimController.js";
import auth from "../middlewares/authMiddleware.js";

// Customer
router.post("/claims", auth("customer"), claimController.submitClaim);
router.get("/claims", auth(), claimController.listClaims);
router.get("/claims/:id", auth(), claimController.getClaim);

// Agent/Admin
router.put("/claims/:id/status", auth(["agent", "admin"]), claimController.updateClaimStatus);


export default router
