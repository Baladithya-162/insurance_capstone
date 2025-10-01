import Claim from "../models/Claim.js";
import UserPolicy from "../models/UserPolicy.js";

export const submitClaim = async (
  userId,
  { userPolicyId, incidentDate, description, amountClaimed }
) => {
  // ✅ Enforce ownership
  const userPolicy = await UserPolicy.findOne({ _id: userPolicyId, userId });
  if (!userPolicy) throw new Error("Policy not found or not owned by user");

  const claim = new Claim({
    userId,
    userPolicyId,
    incidentDate,
    description,
    amountClaimed,
    status: "PENDING"
  });

  await claim.save();
  return claim;
};

export const listClaims = async (user) => {
  if (user.role === "admin" || user.role === "agent") {
    return Claim.find({}).populate("userPolicyId userId");
  }
  if (!user._id) throw new Error("Missing user ID");
  return Claim.find({ userId: user._id }).populate("userPolicyId");
};

export const getClaimById = async (user, claimId) => {
  const claim = await Claim.findById(claimId).populate("userPolicyId userId");
  if (!claim) throw new Error("Claim not found");

  if (user.role === "customer") {
    if (!claim.userId) throw new Error("Claim has no user assigned");
    if ( !user.userId) throw new Error("Authenticated user has no _id");
  }

  return claim;
};

export const updateClaimStatus = async (
  agentId,
  claimId,
  { status, decisionNotes }
) => {
  const claim = await Claim.findById(claimId);
  if (!claim) throw new Error("Claim not found");

  claim.status = status;
  claim.decisionNotes = decisionNotes;
  claim.decidedByAgentId = agentId;

  await claim.save();
  return claim;
};

export default {
  submitClaim,
  listClaims,
  getClaimById,
  updateClaimStatus
};
