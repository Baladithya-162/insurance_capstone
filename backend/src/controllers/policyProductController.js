import * as  policyService from "../services/policyService.js";

// List all policy products
export const getPolicies = async (req, res) => {
  try {
    const policies = await policyService.listPolicies();
    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single policy product
export const getPolicy = async (req, res) => {
  try {
    const policy = await policyService.getPolicyById(req.params.id);
    if (!policy) return res.status(404).json({ message: "Policy not found" });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Purchase a policy (customer only)
export const purchasePolicy = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id || req.user.userId;
    const userPolicy = await policyService.purchasePolicy(userId, req.params.id, req.body);
    res.status(201).json(userPolicy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const createPolicyController = async (req, res) => {
  try {
    const policyData = req.body;

    // Validate basic input (optional, can add Joi or Yup later)
    if (!policyData.code || !policyData.title) {
      return res.status(400).json({ message: "Code and Title are required" });
    }

    const policy = await policyService.createPolicy(policyData);

    res.status(201).json({
      message: "Policy created successfully",
      policy,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePolicyController = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await policyService.deletePolicy(id);

    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    res.status(200).json({
      message: "Policy deleted successfully",
      deletedPolicy: policy,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
