
import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  userPolicyId: { type: mongoose.Schema.Types.ObjectId, ref: "UserPolicy", required: true},
  amount: {type: Number, required: true},
  method: {type: String,  enum: ["CARD", "NETBANKING","OFFLINE", "SIMULATED"], },
  reference: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
});
const Payment = mongoose.model("Payment", paymentSchema);
export default Payment
