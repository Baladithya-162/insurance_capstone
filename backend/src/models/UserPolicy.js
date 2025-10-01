import mongoose from "mongoose";


const userpolicySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  policyProductId: { type: mongoose.Schema.Types.ObjectId, ref: "PolicyProduct", required: true},
  startDate: {type: Date, required: true},
  endDate: {type: Date, required: true},
  premiumPaid: {type: Number, required: true},
  status: {type:String,  enum: ["ACTIVE", "CANCELLED", "EXPIRED"],  },
  assignedAgentId: { type: mongoose.Schema.Types.ObjectId, ref: "AssignedAgent"},
  nominee: {type: Object, default: { name: "", relation:""}, required: true},
  createdAt: { type: Date, default: Date.now },
});

 const UserPolicy = mongoose.model("UserPolicy", userpolicySchema);
 export default UserPolicy ;
