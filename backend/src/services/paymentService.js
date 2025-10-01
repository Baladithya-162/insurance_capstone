import Payment from "../models/Payment.js";
import  UserPolicy from "../models/UserPolicy.js";
import  * as  logAction  from "../utils/auditLogger.js";

export const recordPayment = async (userId, { policyId, amount, method, reference }) => {
  // policyId refers to the user's purchased policy (_id in UserPolicy)
  const userPolicy = await UserPolicy.findOne({ _id: policyId, userId });
  if (!userPolicy) throw new Error("Policy not found or not owned by user");

  const payment = new Payment({
    userId,
    userPolicyId: userPolicy._id,
    amount,
    method: method || "SIMULATED",
    reference
  });

  await payment.save();

  // update user policy
  userPolicy.premiumPaid = (userPolicy.premiumPaid || 0) + amount;
  if (userPolicy.status !== "CANCELLED") {
    userPolicy.status = "ACTIVE";
  }
  await userPolicy.save();

  
  await logAction.logAction({
    action: "PAYMENT_RECORDED",
    actorId: userId,
    details: { paymentId: payment._id, policyId: policyId, amount, method, reference },
   ip:"vis"
  });

  return payment;
}

export const listUserPayments = async (userId) => {
  return Payment.find({ userId }).populate("userPolicyId");
}

export const listAllPayments = async() => {
  return Payment.find({})
    .populate("userPolicyId")
    .populate("userId", "name email role");
}

export default {
  recordPayment,
  listUserPayments,
  listAllPayments
};
