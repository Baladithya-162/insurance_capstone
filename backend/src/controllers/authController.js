import Joi from "joi";
import { register1, login1 } from "../services/authService.js";

// ✅ schema without role input (role is enforced as "customer" in backend)
const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required()
});

export const register = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = req.body;

    // ✅ enforce role = "customer" always
    const response = await register1({
      userData: { name, email, password, role: "customer" }
    });

    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const response = await login1({ email, password });

    res.status(200).json({
      message: "Logged in successfully",
      ...response
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
