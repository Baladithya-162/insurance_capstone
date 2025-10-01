import AuditLog from "../models/AuditLog.js";

export async function listAuditLogs(user) {
  if (user.role === "admin" || user.role === "agent") {
    return AuditLog.find({})
      .sort({ timestamp: -1 })
      .populate("actorId", "name email role");
  }

  // customers only see their own actions
  return AuditLog.find({ actorId: user._id })
    .sort({ timestamp: -1 })
    .populate("actorId", "name email role");
}


export async function logAction({ action, actorId, details, ip }) {
  const log = new AuditLog({
    action,
    actorId,
    details,
    ip
  });
  await log.save();
  return log;
}

export default {
  listAuditLogs,
  logAction
};
