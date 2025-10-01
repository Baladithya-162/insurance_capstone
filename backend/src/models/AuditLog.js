import mongoose from "mongoose";


const auditlogSchema = new mongoose.Schema({
  action: { type: String, required: true, trim: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  details: {type: Object},
  ip: {type: String, required: true},
  timestamp:{type: Date, require: true}
 
});

const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditlogSchema);

export default AuditLog
