import  express from "express";
const router = express.Router();
import * as userPolicyController from "../controllers/userPolicyController.js";
  import auth from "../middlewares/authMiddleware.js";

// Customer: list their purchased policies
router.get("/user/policies", auth("customer"), userPolicyController.getUserPolicies);
router.put("/policies/:id/cancel",userPolicyController.cancelUserPolicy)


// Customer: cancel a purchased policy
router.put("/user/policies/:id/cancel", auth("customer"), userPolicyController.cancelUserPolicy);

export default router