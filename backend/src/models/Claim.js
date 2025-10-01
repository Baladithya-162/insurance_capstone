import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userPolicyId: { type: mongoose.Schema.Types.ObjectId, ref: "UserPolicy", required: true },
  incidentDate: { type: Date, required: true },
  description: { type: String, required: true },
  amountClaimed: { type: Number, required: true },
  status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  decisionNotes: { type: String },
  decidedByAgentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // usually should reference User, not "DecidedByAgent"
  createdAt: { type: Date, default: Date.now },
});

// ✅ Prevent OverwriteModelError
const Claim = mongoose.models.Claim || mongoose.model("Claim", claimSchema);

export default Claim;
