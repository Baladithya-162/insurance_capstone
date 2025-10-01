import adminService from "../services/adminService.js";

export const getSummary = async (req, res) => {
  try {
    const summary = await adminService.getSummary();
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
