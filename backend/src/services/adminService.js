import User from "../models/User.js";
import UserPolicy from "../models/UserPolicy.js";
import  Claim  from "../models/Claim.js"
import Payment from "../models/Payment.js";

export const getSummary = async() => {
  const userCount = await User.countDocuments({});
  const policyCount = await UserPolicy.countDocuments({});
  const pendingClaims = await Claim.countDocuments({ status: "PENDING" });
  const totalPayments = await Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);

  return {
    userCount,
    policyCount,
    pendingClaims,
    totalPayments: totalPayments.length ? totalPayments[0].total : 0,
  };
}

export default { getSummary };
