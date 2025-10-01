import * as  auditService from "../services/auditService.js";

// Admin: get all audit logs
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await auditService.listAuditLogs(req.user);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
