import PolicyProduct from "../models/PolicyProduct.js";
import UserPolicy  from "../models/UserPolicy.js";

export const  listPolicies = async() =>{
  return PolicyProduct.find({});
}

export const  getPolicyById = async (policyId) => {
  return PolicyProduct.findById(policyId);
}

export const  purchasePolicy = async(userId, policyId, {termMonths, nominee })=> {
  const policyProduct = await PolicyProduct.findById(policyId);
  if (!policyProduct) throw new Error("Policy not found");

  const startDate = Date.now()
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + (termMonths || policyProduct.termMonths));

  const userPolicy = new UserPolicy({
    userId,
    policyProductId: policyProduct._id,
    startDate,
    endDate,
    premiumPaid: policyProduct.premium,
    status: "ACTIVE",
    nominee
  });

  await userPolicy.save();
  return userPolicy;
}

export const getUserPolicies= async (userId) => {
  return UserPolicy.find({ userId }).populate("policyProductId");
}

export const cancelUserPolicy = async (userId, policyId) => {
  const userPolicy = await UserPolicy.findOne({ _id: policyId, userId });
  if (!userPolicy) throw new Error("Policy not found");

  userPolicy.status = "CANCELLED";
  await userPolicy.save();
  return userPolicy;
}

export const createPolicy = async (policyData) => {
  try {
    const policy = new PolicyProduct(policyData);
    await policy.save();
    return policy;
  } catch (error) {
    throw new Error(error.message || "Error creating policy");
  }
};

export const deletePolicy = async (id) => {
  try {
    const policy = await PolicyProduct.findByIdAndDelete(id);
    return policy; // null if not found
  } catch (error) {
    throw new Error(error.message || "Error deleting policy");
  }
};

export default {
  listPolicies,
  getPolicyById,
  purchasePolicy,
  getUserPolicies,
  cancelUserPolicy,
  createPolicy,
  deletePolicy,
};
