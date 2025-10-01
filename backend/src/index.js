import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ====== Route Imports ======
import authRoutes from "./routes/authRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import userPolicyRoutes from "./routes/userPolicyRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";

dotenv.config();
const app = express();

// ====== Middleware ======
app.use(cors());
app.use(express.json());

// ====== Routes ======
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/policies", policyRoutes);         // policy products
app.use("/api/v1/user", userPolicyRoutes);         // user-owned policies
app.use("/api/v1/claims", claimRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/agents", agentRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin", auditRoutes);             // admin audit logs

// ====== Health Check ======
app.get("/", (req, res) => {
  res.send("🚀 Insurance Management API is running");
});

// ====== Start Server ======
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ DB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  }
};

startServer();
