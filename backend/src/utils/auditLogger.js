import  AuditLog from "../models/AuditLog.js";
export const  logAction= async({ action, actorId, details, ip })=> {
  try {
    const log = new AuditLog({
      action,
      actorId,
      details,
      ip
    });
    await log.save();
  } catch (err) {
    console.error("Failed to save audit log:", err.message);
  }
}

// export default  logAction ;
