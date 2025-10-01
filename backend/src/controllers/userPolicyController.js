import  policyService from "../services/policyService.js";

// Get all policies owned by current user
export const getUserPolicies = async (req, res) => {
  try {
    const userId = req.user.userId;
    const policies = await policyService.getUserPolicies(userId);
    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel a user’s purchased policy
export const cancelUserPolicy = async (req, res) => {
  try {
    const userId = req.user.userId;
    const policy = await policyService.cancelUserPolicy(userId, req.params.id);
    res.json(policy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
