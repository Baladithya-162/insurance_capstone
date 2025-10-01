
import  express from "express";
const router = express.Router();
import * as policyProductController  from "../controllers/policyProductController.js";
import  auth from "../middlewares/authMiddleware.js";

// Public: browse available policy products
router.get("/policies", policyProductController.getPolicies);
router.get("/policies/:id", policyProductController.getPolicy);
router.post("/policies/create",policyProductController.createPolicyController);
router.delete("/policies/:id/delete",policyProductController.deletePolicyController)

// Customer: purchase a policy product
router.post("/policies/:id/purchase", auth("customer"), policyProductController.purchasePolicy);


export default router