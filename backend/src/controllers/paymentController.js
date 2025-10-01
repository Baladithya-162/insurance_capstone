import * as paymentService from "../services/paymentService.js";

// Customer: record a payment
export const recordPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    // const ip = req.ip || req.connection?.remoteAddress;
    const payment = await paymentService.recordPayment(userId, req.body);

    res.status(201).json({
      message: "Payment recorded successfully",
      payment
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Customer: list own payments
export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id;
    const payments = await paymentService.listUserPayments(userId);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: list all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.listAllPayments();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
